// Quản lý kết nối MongoDB.
'use strict' // strict mode

const mongoose = require('mongoose')
const {db: { host, name, port }} = require('../configs/configMongoDB')
const connectString = `mongodb://${host}:${port}/${name}`

const {countConnect} = require('../helpers/checkConnect')

console.log(`connectString:`, connectString)
class Database {

    constructor() {
        this.connect() // => Khi một đối tượng Database được tạo, nó sẽ tự động gọi phương thức connect().
    }

    //Connect
    connect(type = 'mongodb') {
        if(1 === 1) {
            mongoose.set('debug', true)
            mongoose.set('debug', {color: true})
        }

        mongoose.connect(connectString, { // Kết nối MongoDB với connectString
            maxPoolSize: 50 // Giới hạn tối đa 50 kết nối đồng thời
        }).then( _ => {
            console.log(`Connected Mongodb Success PRO`, countConnect())
        })
        .catch(err => console.log(`Error Connect!`));
    }
    
    // Đảm bảo chỉ có một kết nối duy nhất(Singleton Pattern)
    static getInstance() {
        if(!Database.instance) {
            Database.instance = new Database()
        }

        return Database.instance
    }
    // => Đảm bảo chỉ có một phiên bản Database trong suốt vòng đời ứng dụng  
}

const instanceMongoDb = Database.getInstance()
module.exports = instanceMongoDb