// Cấu hình môi trường (dev hoặc pro) cho kết nối MongoDB.
'use strict'

// level 0

const dev = {
    app: {
        port: process.env.DEV_APP_PORT || 3000
    },
    db: {
        host: process.env.DEV_DB_HOST || 'localhost',
        port: process.env.DEV_DB_PORT || 27017,
        name: process.env.DEV_DB_NAME || 'Ecommerce_TipJS'
    }
}

// level 1

const pro = {
    app: {
        port: process.env.PRO_APP_PORT || 3000
    },
    db: {
        host: process.env.PRO_DB_HOST || 'localhost',
        port: process.env.PRO_DB_PORT || 27017,
        name: process.env.PRO_DB_NAME || 'Ecommerce_TipJS'
    }
}

// => dev có thể sử dụng database cục bộ, còn pro thường kết nối đến database trên cloud.

const config = { dev, pro }
const env = process.env.NODE_ENV || 'dev'

console.log(config[env], env)

module.exports = config[env]