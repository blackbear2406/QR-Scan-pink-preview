"use strict";

(() => {
  if (window.__ecgPantherButtonObserver) return;

  const BUTTON_ID = "ecg-panther-scan-qr";
  const STYLE_ID = "ecg-panther-button-style";

  function addButton() {
    const patientTab = document.querySelector("#tabTTBN");
    const fileInput = document.querySelector('#fileUpload, input[type="file"]');
    if (!patientTab || !fileInput || !document.body) return;

    const uploadButton = document.querySelector("#btnUpload");
    const anchor = uploadButton || fileInput;
    const parent = anchor.parentElement;
    if (!parent) return;

    let button = document.getElementById(BUTTON_ID);
    if (button) return;

    if (!document.getElementById(STYLE_ID)) {
      const style = document.createElement("style");
      style.id = STYLE_ID;
      style.textContent = `
        #${BUTTON_ID} {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 6px;
          margin: 0 0 0 8px;
          padding: 6px 12px;
          min-height: 32px;
          border: 1px solid #e9a8c2;
          border-radius: 6px;
          background: #fff2f7;
          color: #9d4268;
          font: 600 13px Arial, sans-serif;
          cursor: pointer;
          vertical-align: middle;
        }
        #${BUTTON_ID}:hover { background: #fce1ec; border-color: #d978a0; }
        #${BUTTON_ID}:disabled { opacity: .65; cursor: wait; }
      `;
      (document.head || document.documentElement).appendChild(style);
    }

    button = document.createElement("button");
    button.id = BUTTON_ID;
    button.type = "button";
    button.textContent = "⌗ Quét mã QR";
    button.title = "Mở mã QR để nhận ảnh ECG từ điện thoại";
    button.addEventListener("click", () => {
      if (button.disabled) return;
      button.disabled = true;
      button.textContent = "Đang mở QR…";
      chrome.runtime.sendMessage({ type: "ECG_PANTHER_OPEN_QR" }, (response) => {
        const runtimeError = chrome.runtime.lastError;
        button.disabled = false;
        button.textContent = "⌗ Quét mã QR";
        if (runtimeError || !response || !response.ok) {
          console.error("ECG Panther:", runtimeError || response);
          alert("ECG Panther chưa mở được mã QR. Em thử tải lại cửa sổ ECG rồi thao tác lại nhé.");
        }
      });
    });

    if (uploadButton && uploadButton.parentElement) {
      uploadButton.insertAdjacentElement("afterend", button);
    } else {
      anchor.insertAdjacentElement("afterend", button);
    }
  }

  function schedule() {
    addButton();
  }

  const observer = new MutationObserver(schedule);
  if (document.documentElement) {
    observer.observe(document.documentElement, { childList: true, subtree: true });
  }
  window.__ecgPantherButtonObserver = observer;
  schedule();
  document.addEventListener("DOMContentLoaded", schedule, { once: true });
})();
