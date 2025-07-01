// Khởi tạo Express app, cấu hình middleware, kết nối database, và xử lý lỗi.

require('dotenv').config() // Tải các biến môi trường từ file .env vào process.env.
const compression = require('compression') // Middleware giúp nén phản hồi HTTP để tăng tốc độ tải trang.
const express = require('express') // Framework Node.js giúp tạo ứng dụng web.
const {default: helmet} = require('helmet') // Middleware giúp bảo mật ứng dụng web bằng cách thiết lập HTTP headers.
const morgan = require('morgan') //  Middleware giúp ghi log request HTTP

const app = express()


// init middlewares
app.use(morgan("dev")) // Ghi log các request HTTP (ở chế độ dev).
app.use(helmet()) // Thiết lập các HTTP header bảo mật (ví dụ: chống XSS, clickjacking).
app.use(compression()) // Nén response để tăng tốc độ tải.
app.use(express.json()) // Parse body dạng JSON.
app.use(express.urlencoded({ // Parse body dạng URL-encoded.
    extended: true
}))

// init db
require('./db/initMongoDB') // Gọi file initMongoDB.js để kết nối MongoDB

// const { checkOverload } = require('./helpers/checkConnect')
// checkOverload()

// init routes: Gọi file routes/index.js
app.use('', require('./routes'))

// handling error
    // - Middleware xử lý lỗi 404
app.use((req, res, next) => {
    const error = new Error('Not Found')
    error.status = 404
    next(error)
})
    // - Middleware xử lý lỗi chung
app.use((error, req, res, next) => {
    const statusCode = error.status || 500
    return res.status(statusCode).json({
        status: 'error',
        code: statusCode,
        stack: error.stack,
        message: error.message|| "Internal Server Error",
    })   
})
module.exports = app

// Chức năng chính của đoạn code: Khởi tạo Express app.
// Cấu hình middleware (log, bảo mật, nén, parse request).
// Kết nối MongoDB.
// Định nghĩa routes.
// Xử lý lỗi (có thể cần bổ sung).

// Đây là cấu trúc chuẩn của một ứng dụng Node.js + Express + MongoDB, giúp tối ưu hiệu suất và bảo mật. 🚀