"use strict";

const ALLOWED_ORIGIN = "https://bvdongthap.vncare.vn";

function getOrigin(url) {
  try { return new URL(url || "").origin; } catch (_) { return ""; }
}

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (!message || message.type !== "ECG_PANTHER_OPEN_QR") return;
  const tabId = sender.tab && sender.tab.id;
  const frameId = typeof sender.frameId === "number" ? sender.frameId : 0;
  if (typeof tabId !== "number" || getOrigin(sender.url) !== ALLOWED_ORIGIN) {
    sendResponse({ ok: false, error: "Trang HIS không hợp lệ." });
    return;
  }

  chrome.scripting.executeScript({
    target: { tabId, frameIds: [frameId] },
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
