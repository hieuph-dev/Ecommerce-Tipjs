Cấu trúc thư mục MVC Project Ecommerce TipJS

1️⃣ Thư mục src/ (Source Code)
Thư mục src chứa toàn bộ mã nguồn của ứng dụng.

1. 📂 auth/
Chứa các tệp liên quan đến xác thực và bảo mật, có thể bao gồm:
authUtils.js: Xử lý JWT, tạo access token, refresh token.
middleware.js: Middleware xác thực người dùng.

2. 📂 configs/
Chứa các tệp cấu hình hệ thống, có thể bao gồm:
config.js: Chứa các biến cấu hình chung.
database.js: Chứa thông tin kết nối cơ sở dữ liệu.

3. 📂 controllers/
Chứa các controller xử lý request từ client.
Mỗi controller tương ứng với một nhóm API, ví dụ:
shopController.js: Xử lý API liên quan đến Shop.
userController.js: Xử lý API liên quan đến User.

4. 📂 db/
Chứa các file liên quan đến database, như:
initMongoDB.js: Kết nối MongoDB.
migration.js: Thực hiện migration dữ liệu.

5. 📂 helpers/
Chứa các hàm trợ giúp để tái sử dụng trong nhiều module khác nhau, ví dụ:
checkConnect.js: Kiểm tra số lượng kết nối đến database.
errorHandler.js: Xử lý lỗi chung cho toàn hệ thống.

6. 📂 models/
Chứa các file mô hình dữ liệu (Schema) của MongoDB, ví dụ:
shopModel.js: Mô tả cấu trúc dữ liệu của Shop.
userModel.js: Mô tả cấu trúc dữ liệu của User.

7. 📂 postman/
Thư mục này có thể chứa các file JSON của Postman dùng để test API.

8. 📂 routes/
Chứa các định tuyến API (routes) của ứng dụng.
Mỗi route điều hướng request đến đúng controller, ví dụ:
shopRoutes.js: Định nghĩa các endpoint liên quan đến Shop.
authRoutes.js: Định nghĩa các endpoint liên quan đến xác thực.

9. 📂 services/
Chứa logic nghiệp vụ (Business Logic) của ứng dụng.
Khác với controller, services chứa các hàm thực hiện xử lý dữ liệu phức tạp.
Ví dụ:
shopService.js: Chứa logic để tạo Shop, cập nhật thông tin Shop.

10. 📂 utils/
Chứa các tiện ích chung, như:
getInfoData.js: Lọc dữ liệu trả về từ object.
hashPassword.js: Hash mật khẩu bằng bcrypt.

2️⃣ Các file ngoài thư mục src/

1. 📜 app.js
File khởi tạo ứng dụng Express.js.
Chứa cấu hình middleware, định tuyến, kết nối database.

2. 📜 server.js
Chạy ứng dụng Express từ app.js, thường có nội dung:
js
Copy
Edit
const app = require("./src/app");
const PORT = process.env.PORT || 3056;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

3. 📜 .env
Chứa các biến môi trường như:
ini
Copy
Edit
PORT=3056
MONGODB_URI=mongodb://localhost:27017/ecommerce
JWT_SECRET=supersecretkey

4. 📜 .gitignore
Chỉ định các file/thư mục không được đưa lên Git, như:
bash
Copy
Edit
node_modules
.env

5. 📜 package.json & package-lock.json
Chứa danh sách dependencies của project.
Giúp cài đặt và quản lý thư viện.


📌 Tổng kết
Cấu trúc này giúp tổ chức code rõ ràng, dễ bảo trì, và mở rộng, với: ✅ MVC (Model-View-Controller) tách biệt.
✅ RESTful API với Routes và Controllers.
✅ Service xử lý logic riêng biệt.
✅ Middleware và tiện ích giúp code gọn gàng.

📌 Ứng dụng phù hợp để phát triển các hệ thống E-commerce, CMS, API backend. 🚀







