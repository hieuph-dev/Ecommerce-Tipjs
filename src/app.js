const compression = require('compression')
const express = require('express')
const {default: helmet} = require('helmet')
const morgan = require('morgan')
const app = express()


// init middlewares
app.use(morgan("dev")) // Là một middleware logging dành cho Express.js, giúp ghi log (nhật ký) các request HTTP đến server.
app.use(helmet()) // Là một middleware bảo mật cho Express.js, giúp bảo vệ ứng dụng web bằng cách thiết lập các HTTP headers an toàn. Nó giúp giảm nguy cơ tấn công như Cross-Site Scripting (XSS), Clickjacking, MIME sniffing, v.v.
// app.use(compression()) //    
// init db

// init routes
app.get('/', (req, res, next) => {
    const strCompress = 'Hello'

    return res.status(200).json({
        message: 'Welcome!',
        metadata: strCompress.repeat(10000)
    })
})

// handling error

module.exports = app