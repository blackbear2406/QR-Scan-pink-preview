"use strict";

const ALLOWED_ORIGIN = "https://bvdongthap.vncare.vn";

chrome.action.onClicked.addListener(async (tab) => {
  if (!tab || typeof tab.id !== "number") return;

  let origin = "";
  try {
    origin = new URL(tab.url || "").origin;
  } catch (_) {}

  if (origin !== ALLOWED_ORIGIN) {
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
    const message = String(error && error.message ? error.message : error);
    try {
      await chrome.scripting.executeScript({
        target: { tabId: tab.id },
        args: [message],
        func: (detail) => alert("ECG Panther không thể khởi chạy.\n" + detail)
      });
    } catch (_) {}
  }
});
