const app = require("./src/app"); // Là 1 instance của Express, được sử dụng để khởi động server

const PORT = process.env.PORT || 3056; // process.env giúp ứng dụng có thể chạy trên nhiều môi trường

const server = app.listen( PORT, () => { // Bắt đầu lắng nghe HTTP requests trên cổng PORT.
    console.log(`WSV eCommerce start with port ${PORT}`)
})

// process.on('SIGINT', () => {
//     server.close( () => console.log(`Exit server Express`))
//     // notify.send(ping...)
// })




// --------------------------------------------------------------------------------------------------------------
// -- Tổng kết
// Chức năng chính:

// Khởi động server Express.js và lắng nghe trên cổng PORT.
// Xử lý sự kiện SIGINT (nếu được bật) để đóng server an toàn.
// -- Lợi ích:

// Giúp ứng dụng chạy linh hoạt trên nhiều môi trường khác nhau.
// Đảm bảo server tắt đúng cách, tránh lỗi khi shutdown.