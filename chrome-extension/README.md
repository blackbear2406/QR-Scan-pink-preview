# ECG Panther – Chrome Extension (Manifest V3)

Bản thử nghiệm độc lập, phát triển trên nhánh `feature/chrome-extension-mv3`. Không thay đổi bookmarklet, Preview main hoặc Production.

## Cấu trúc

- `manifest.json`: khai báo Chrome Extension Manifest V3.
- `background.js`: khi người dùng bấm biểu tượng tiện ích, chỉ cho phép chạy trên `https://bvdongthap.vncare.vn`.
- `ecg-panther.js`: mã nghiệp vụ QR/Firebase/HIS được đóng gói trực tiếp trong extension; không tải JavaScript từ GitHub Pages.

## Cài thử trên Chrome

1. Tải repository ở nhánh này về máy hoặc tải riêng thư mục `chrome-extension`.
2. Mở `chrome://extensions`.
3. Bật **Developer mode**.
4. Chọn **Load unpacked**.
5. Chọn đúng thư mục `chrome-extension` (thư mục chứa `manifest.json`).
6. Đăng nhập VNPT-HIS, mở màn hình Trả ECG và cửa sổ Kết quả ECG như quy trình hiện tại.
7. Bấm biểu tượng ECG Panther trên thanh công cụ Chrome để mở QR.

## Lưu ý an toàn

- Extension chỉ được kích hoạt trên origin HIS đã cấu hình.
- Ảnh vẫn truyền qua Firebase Realtime Database như quy trình Preview hiện tại.
- Tên/mã bệnh nhân không được gửi lên Firebase; tên chỉ dùng cục bộ để đặt tên file ở HIS.
- Bác sĩ vẫn phải tự kiểm tra hồ sơ và bấm Upload trên HIS.
- Chỉ thử với hồ sơ kiểm thử/ảnh ECG đã khử định danh trước khi cân nhắc dùng thật.
- Chưa phát hành Chrome Web Store và chưa thay thế bookmarklet đang sử dụng.

## Giới hạn hiện tại

Origin HIS được cấu hình là `https://bvdongthap.vncare.vn`. Nếu môi trường HIS thực tế dùng hostname khác, cần xác minh và bổ sung chính xác trước khi cài.
