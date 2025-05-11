// Sử dụng SheetJS để tạo file Excel và tải xuống vào thư mục Downloads
const XLSX = require('xlsx');


// Tạo workbook mới
const wb = XLSX.utils.book_new();

// Tạo worksheet cho kế hoạch tổng thể
const planData = [
  ['KẾ HOẠCH TỔ CHỨC SỰ KIỆN KỶ NIỆM 20 NĂM LỚP 12 TOÁN (2002-2005)'],
  [''],
  ['STT', 'Hoạt động', 'Mô tả chi tiết', 'Người phụ trách', 'Ngày bắt đầu', 'Ngày kết thúc', 'Trạng thái', 'Ghi chú'],
  
  // NHÓM CÔNG TÁC KHẢO SÁT VÀ LẬP KẾ HOẠCH
  [1, 'CÔNG TÁC KHẢO SÁT VÀ LẬP KẾ HOẠCH', '', '', '', '', '', ''],
  [1.1, 'Bình chọn ngày tổ chức', 'Tổ chức bình chọn qua website và tổng hợp kết quả', '', '05/05/2025', '15/05/2025', 'Đang thực hiện', 'Đã gia hạn từ 11/05 đến 15/05'],
  [1.2, 'Khảo sát ngân sách', 'Thu thập thông tin về mức ngân sách phù hợp', '', '05/05/2025', '15/05/2025', 'Đang thực hiện', ''],
  [1.3, 'Xác nhận số người tham dự', 'Tổng hợp danh sách từ hệ thống đăng ký', '', '05/05/2025', '15/05/2025', 'Đang thực hiện', ''],
  [1.4, 'Tìm kiếm địa điểm', 'Liên hệ và so sánh các địa điểm phù hợp', '', '10/05/2025', '20/05/2025', 'Chưa bắt đầu', ''],
  [1.5, 'Xác nhận địa điểm', 'Đặt cọc và ký hợp đồng với địa điểm', '', '20/05/2025', '25/05/2025', 'Chưa bắt đầu', ''],
  
  // NHÓM CÔNG TÁC TRUYỀN THÔNG VÀ LIÊN LẠC
  [2, 'CÔNG TÁC TRUYỀN THÔNG VÀ LIÊN LẠC', '', '', '', '', '', ''],
  [2.1, 'Thiết lập trang web', 'Xây dựng trang web thông tin và đăng ký', '', '01/05/2025', '05/05/2025', 'Hoàn thành', ''],
  [2.2, 'Liên hệ cựu học sinh', 'Tìm kiếm và liên lạc với tất cả thành viên lớp', '', '01/05/2025', '15/05/2025', 'Đang thực hiện', ''],
  [2.3, 'Thông báo thời hạn đăng ký', 'Gửi thông báo qua các kênh liên lạc', '', '05/05/2025', '10/05/2025', 'Hoàn thành', ''],
  [2.4, 'Công bố ngày và địa điểm', 'Thông báo chính thức về thời gian và địa điểm', '', '25/05/2025', '30/05/2025', 'Chưa bắt đầu', ''],
  [2.5, 'Chia sẻ lịch trình chi tiết', 'Cập nhật thông tin đầy đủ về chương trình', '', '01/06/2025', '05/06/2025', 'Chưa bắt đầu', ''],
  
  // NHÓM CÔNG TÁC NỘI DUNG VÀ HOẠT ĐỘNG
  [3, 'CÔNG TÁC NỘI DUNG VÀ HOẠT ĐỘNG', '', '', '', '', '', ''],
  [3.1, 'Thu thập hình ảnh', 'Yêu cầu và tổng hợp hình ảnh cho trình chiếu', '', '10/05/2025', '10/06/2025', 'Chưa bắt đầu', ''],
  [3.2, 'Tìm kiếm "siêu nhân"', 'Phân công người phụ trách các hạng mục', '', '05/05/2025', '20/05/2025', 'Đang thực hiện', 'Liên hệ Trung: 0907.996.550'],
  [3.3, 'Thu thập "bảo vật"', 'Sưu tầm kỷ vật từ thời học tập', '', '10/05/2025', '10/06/2025', 'Chưa bắt đầu', ''],
  [3.4, 'Lên chương trình chi tiết', 'Xây dựng kịch bản cho toàn bộ sự kiện', '', '20/05/2025', '10/06/2025', 'Chưa bắt đầu', ''],
  [3.5, 'Chuẩn bị trò chơi, hoạt động', 'Thiết kế các hoạt động giao lưu', '', '20/05/2025', '15/06/2025', 'Chưa bắt đầu', ''],
  
  // NHÓM CÔNG TÁC TÀI CHÍNH
  [4, 'CÔNG TÁC TÀI CHÍNH', '', '', '', '', '', ''],
  [4.1, 'Lập kế hoạch ngân sách', 'Dựa trên kết quả khảo sát và chi phí dự kiến', '', '15/05/2025', '25/05/2025', 'Chưa bắt đầu', ''],
  [4.2, 'Tổ chức quỹ tài trợ', 'Thành lập quỹ hỗ trợ các bạn khó khăn', '', '15/05/2025', '15/06/2025', 'Chưa bắt đầu', ''],
  [4.3, 'Xác định chi phí cuối cùng', 'Tính toán chi phí chính xác cho mỗi người', '', '25/05/2025', '10/06/2025', 'Chưa bắt đầu', ''],
  [4.4, 'Thu phí tham dự', 'Thông báo và thu tiền từ người tham dự', '', '10/06/2025', '20/06/2025', 'Chưa bắt đầu', ''],
  
  // NHÓM CÔNG TÁC HẬU CẦN
  [5, 'CÔNG TÁC HẬU CẦN', '', '', '', '', '', ''],
  [5.1, 'Lên kế hoạch chi tiết chuyến đi', 'Xây dựng lịch trình 2 ngày 1 đêm', '', '25/05/2025', '05/06/2025', 'Chưa bắt đầu', ''],
  [5.2, 'Đặt dịch vụ ăn uống', 'Liên hệ và xác nhận menu, số lượng', '', '25/05/2025', '10/06/2025', 'Chưa bắt đầu', ''],
  [5.3, 'Chuẩn bị phương tiện di chuyển', 'Đặt xe hoặc phương tiện vận chuyển', '', '05/06/2025', '15/06/2025', 'Chưa bắt đầu', ''],
  [5.4, 'Chuẩn bị kỷ niệm chương/quà', 'Thiết kế và đặt sản xuất quà lưu niệm', '', '20/05/2025', '15/06/2025', 'Chưa bắt đầu', ''],
  [5.5, 'Kiểm tra cuối cùng', 'Rà soát tất cả các khâu chuẩn bị', '', '15/06/2025', '20/06/2025', 'Chưa bắt đầu', ''],
];

// Tạo worksheet cho danh sách tham dự
const attendeeData = [
  ['DANH SÁCH THAM DỰ SỰ KIỆN KỶ NIỆM 20 NĂM'],
  [''],
  ['STT', 'Họ và tên', 'Biệt danh', 'Liên hệ', 'Ngày đăng ký', 'Ngày bình chọn', 'Ngân sách bình chọn', 'Có thể tài trợ', 'Ghi chú'],
  [1, '', '', '', '', '', '', '', ''],
  [2, '', '', '', '', '', '', '', ''],
  [3, '', '', '', '', '', '', '', ''],
];

// Tạo worksheet cho phân công nhiệm vụ
const assignmentData = [
  ['PHÂN CÔNG NHIỆM VỤ BAN TỔ CHỨC'],
  [''],
  ['STT', 'Họ và tên', 'Vai trò', 'Nhiệm vụ chính', 'Nhiệm vụ phụ', 'Liên hệ', 'Ghi chú'],
  [1, 'Trung', 'Trưởng ban tổ chức', 'Điều phối chung', 'Tìm kiếm "siêu nhân"', '0907.996.550', ''],
  [2, '', '', '', '', '', ''],
  [3, '', '', '', '', '', ''],
];

// Tạo worksheet cho ngân sách
const budgetData = [
  ['KẾ HOẠCH NGÂN SÁCH SỰ KIỆN'],
  [''],
  ['STT', 'Hạng mục', 'Mô tả', 'Đơn giá', 'Số lượng', 'Thành tiền', 'Người phụ trách', 'Trạng thái', 'Ghi chú'],
  [1, 'Địa điểm', 'Chi phí thuê địa điểm 2 ngày 1 đêm', '', '', '', '', '', ''],
  [2, 'Ăn uống', 'Chi phí ăn uống cho toàn bộ sự kiện', '', '', '', '', '', ''],
  [3, 'Di chuyển', 'Chi phí thuê xe/phương tiện', '', '', '', '', '', ''],
  [4, 'Kỷ niệm chương', 'Chi phí làm quà lưu niệm', '', '', '', '', '', ''],
  [5, 'Trang trí', 'Chi phí trang trí địa điểm', '', '', '', '', '', ''],
  [6, 'Trò chơi & hoạt động', 'Chi phí tổ chức các hoạt động', '', '', '', '', '', ''],
  [7, 'Khác', 'Chi phí phát sinh', '', '', '', '', '', ''],
  ['', '', '', '', 'TỔNG CỘNG', '0', '', '', ''],
  ['', '', '', '', 'Chi phí/người (dự kiến)', '0', '', '', 'Dựa trên số người tham dự'],
];

// Format dữ liệu và tạo các worksheet
const wsPlanning = XLSX.utils.aoa_to_sheet(planData);
const wsAttendees = XLSX.utils.aoa_to_sheet(attendeeData);
const wsAssignments = XLSX.utils.aoa_to_sheet(assignmentData);
const wsBudget = XLSX.utils.aoa_to_sheet(budgetData);

// Thêm các worksheet vào workbook
XLSX.utils.book_append_sheet(wb, wsPlanning, "Kế hoạch tổng thể");
XLSX.utils.book_append_sheet(wb, wsAttendees, "Danh sách tham dự");
XLSX.utils.book_append_sheet(wb, wsAssignments, "Phân công nhiệm vụ");
XLSX.utils.book_append_sheet(wb, wsBudget, "Ngân sách");

// Định dạng chiều rộng cột cho worksheet kế hoạch
wsPlanning['!cols'] = [
  {wch: 6},  // STT
  {wch: 30}, // Hoạt động
  {wch: 40}, // Mô tả chi tiết
  {wch: 20}, // Người phụ trách
  {wch: 15}, // Ngày bắt đầu
  {wch: 15}, // Ngày kết thúc
  {wch: 15}, // Trạng thái
  {wch: 30}  // Ghi chú
];

// Định dạng chiều rộng cột cho các worksheet khác
wsAttendees['!cols'] = [
  {wch: 6},  // STT
  {wch: 20}, // Họ và tên
  {wch: 15}, // Biệt danh
  {wch: 15}, // Liên hệ
  {wch: 15}, // Ngày đăng ký
  {wch: 15}, // Ngày bình chọn
  {wch: 15}, // Ngân sách bình chọn
  {wch: 15}, // Có thể tài trợ
  {wch: 30}  // Ghi chú
];

wsAssignments['!cols'] = [
  {wch: 6},  // STT
  {wch: 20}, // Họ và tên
  {wch: 20}, // Vai trò
  {wch: 25}, // Nhiệm vụ chính
  {wch: 25}, // Nhiệm vụ phụ
  {wch: 15}, // Liên hệ
  {wch: 30}  // Ghi chú
];

wsBudget['!cols'] = [
  {wch: 6},  // STT
  {wch: 20}, // Hạng mục
  {wch: 30}, // Mô tả
  {wch: 15}, // Đơn giá
  {wch: 15}, // Số lượng
  {wch: 15}, // Thành tiền
  {wch: 20}, // Người phụ trách
  {wch: 15}, // Trạng thái
  {wch: 30}  // Ghi chú
];

// Tạo file Excel và tải xuống
const fileName = 'Ke_Hoach_Su_Kien_20_Nam_Lop_Toan.xlsx';
XLSX.writeFile(wb, '/Users/nttrung/Desktop/reunion/Ke_Hoach_Su_Kien_20_Nam_Lop_Toan.xlsx');


console.log('Đã tạo và tải xuống file Excel thành công!');
console.log('Vị trí file: Thư mục Downloads/' + fileName);