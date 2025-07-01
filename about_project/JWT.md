JWT là một chuẩn để tạo Token, gồm 3 phần:
 1. Header: Chứa thông tin về thuật toán
 2. Payload: Chứ dữ liệu được mã hóa, vd thông tin người dùng khi muốn đăng nhập
 3. Signature: Phần chữ ký để xác minh tính toàn vẹn của token.

 ==> Thường được dùng để tạo access token và refresh token bằng chuẩn JWT

 Sử dụng JWT trong dự án: 
- JWT: Chuẩn để tạo token, bao gồm accessToken (2 ngày) và refreshToken (7 ngày).
- Access Token: Dùng để truy cập tài nguyên, xác minh bằng publicKey.
- Refresh Token: Dùng để làm mới accessToken, xác minh bằng privateKey.
- Private Key và Public Key: Trong hệ thống của bạn, là hai chuỗi ngẫu nhiên, dùng như khóa đối xứng.
- Authentication: Xác minh token qua middleware authenticationV2.
- Login: Tạo cặp token và lưu keyStore.
- Logout: Xóa keyStore.
- Refresh Token: Làm mới cặp token và cập nhật keyStore.