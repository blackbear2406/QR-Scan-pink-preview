# ECG Panther – Chrome Extension (Manifest V3)

Bản thử nghiệm độc lập, phát triển trên nhánh `feature/chrome-extension-mv3`. Không thay đổi bookmarklet, Preview main hoặc Production.

## Cấu trúc

- `manifest.json`: khai báo Chrome Extension Manifest V3 và tự nạp content script trên VNPT-HIS.
- `content.js`: tự nhận diện cửa sổ Kết quả ECG trong iframe và chèn nút **Quét mã QR** cạnh nút Upload.
- `background.js`: nhận thao tác bấm nút và chạy mã QR trong đúng iframe; biểu tượng extension vẫn là phương án dự phòng.
- `ecg-panther.js`: mã nghiệp vụ QR/Firebase/HIS được đóng gói trực tiếp trong extension; không tải JavaScript từ GitHub Pages.

## Cài thử trên Chrome

1. Tải repository ở nhánh này về máy hoặc tải ZIP của nhánh.
2. Giải nén ZIP.
3. Mở `chrome://extensions`.
4. Bật **Developer mode**.
5. Chọn **Load unpacked**.
6. Chọn đúng thư mục `chrome-extension` (thư mục chứa `manifest.json`).
7. Mở hoặc tải lại VNPT-HIS. Khi mở cửa sổ Kết quả ECG, nút **Quét mã QR** sẽ tự xuất hiện cạnh nút Upload.
8. Bấm **Quét mã QR** để tạo phiên QR; điện thoại quét mã như quy trình hiện tại.

Khi cập nhật phiên bản, tải ZIP mới, giải nén vào thư mục mới, gỡ phiên bản extension cũ trong `chrome://extensions`, rồi Load unpacked thư mục `chrome-extension` mới.

## Lưu ý an toàn

- Content script chỉ tự chạy trên origin HIS đã cấu hình.
- Ảnh vẫn truyền qua Firebase Realtime Database như quy trình Preview hiện tại.
- Tên/mã bệnh nhân không được gửi lên Firebase; tên chỉ dùng cục bộ để đặt tên file ở HIS.
- Bác sĩ vẫn phải tự kiểm tra hồ sơ và bấm Upload trên HIS.
- Chỉ thử với hồ sơ kiểm thử/ảnh ECG đã khử định danh trước khi cân nhắc dùng thật.
- Chưa phát hành Chrome Web Store và chưa thay thế bookmarklet đang sử dụng.

## Giới hạn hiện tại

Origin HIS được cấu hình là `https://bvdongthap.vncare.vn`. Nếu môi trường HIS thực tế dùng hostname khác, cần xác minh và bổ sung chính xác trước khi cài. Chức năng tự chèn nút chưa được kiểm thử trực tiếp trên máy HIS; cần xác nhận vị trí nút trong cửa sổ Kết quả ECG thực tế.
