🚀 Flow đăng ký tài khoản
1️⃣ Client gửi request POST /signup với name, email, password.
2️⃣ Controller gọi AccessService.signUp() để xử lý logic.
3️⃣ Kiểm tra email có tồn tại không.
4️⃣ Mã hóa mật khẩu (bcrypt).
5️⃣ Lưu shop mới vào database.
6️⃣ Tạo cặp khóa privateKey - publicKey.
7️⃣ Lưu khóa vào database (KeyStore).
8️⃣ Tạo Access Token và Refresh Token.
9️⃣ Trả về thông tin shop + token cho client.

services -> accessService.js