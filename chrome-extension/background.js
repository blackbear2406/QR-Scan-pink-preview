"use strict";

const ALLOWED_ORIGIN = "https://bvdongthap.vncare.vn";

// Dấu chân hồng trên biểu tượng tiện ích Chrome.
function setPinkPawBadge() {
  chrome.action.setBadgeBackgroundColor({ color: "#e879a7" });
  chrome.action.setBadgeText({ text: "🐾" });
  chrome.action.setTitle({ title: "ECG Panther – Quét mã QR" });
}

chrome.runtime.onInstalled.addListener(setPinkPawBadge);
chrome.runtime.onStartup.addListener(setPinkPawBadge);
setPinkPawBadge();

function getOrigin(url) {
  try { return new URL(url || "").origin; } catch (_) { return ""; }
}

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (!message || message.type !== "ECG_PANTHER_OPEN_QR") return;
  const tabId = sender.tab && sender.tab.id;
  if (typeof tabId !== "number" || getOrigin(sender.url) !== ALLOWED_ORIGIN) {
    sendResponse({ ok: false, error: "Trang HIS không hợp lệ." });
    return;
  }

  chrome.scripting.executeScript({
    // Chạy từ top frame để giữ quyền truy cập jQuery/grid bệnh nhân của trang HIS cha.
    // ecg-panther.js sẽ tự dò iframe Kết quả ECG cùng origin.
    target: { tabId, frameIds: [0] },
    files: ["ecg-panther.js"],
    world: "MAIN"
  }).then(() => sendResponse({ ok: true })).catch((error) => {
    sendResponse({ ok: false, error: String(error && error.message || error) });
  });
  return true;
});

// Giữ thao tác bấm biểu tượng extension làm phương án dự phòng.
chrome.action.onClicked.addListener(async (tab) => {
  if (!tab || typeof tab.id !== "number") return;
  if (getOrigin(tab.url) !== ALLOWED_ORIGIN) {
    try {
      await chrome.scripting.executeScript({
        target: { tabId: tab.id },
        func: () => alert("ECG Panther chỉ hoạt động trên hệ thống VNPT-HIS được cấu hình.")
      });
    } catch (_) {}
    return;
  }

  try {
    await chrome.scripting.executeScript({
      target: { tabId: tab.id },
      files: ["ecg-panther.js"],
      world: "MAIN"
    });
  } catch (error) {
    const detail = String(error && error.message || error);
    try {
      await chrome.scripting.executeScript({
        target: { tabId: tab.id },
        args: [detail],
        func: (message) => alert("ECG Panther không thể khởi chạy.\n" + message)
      });
    } catch (_) {}
  }
});
