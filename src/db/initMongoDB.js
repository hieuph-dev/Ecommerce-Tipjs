'use strict' // strict mode

const mongoose = require('mongoose')
const {db: { host, name, port }} = require('../configs/configMongoDB')
// const connectString = 'mongodb://localhost:27017/Ecommerce_TipJS'
const connectString = `mongodb://${host}:${port}/${name}`

const {countConnect} = require('../helpers/checkConnect')

console.log(`connectString:`, connectString);
class Database {

    constructor() {
        this.connect()
    }

    //Connect
    connect(type = 'mongodb') {
        if(1 === 1) {
            mongoose.set('debug', true)
            mongoose.set('debug', {color: true})
        }

        mongoose.connect(connectString, {
            maxPoolSize: 50
        }).then( _ => {
            console.log(`Connected Mongodb Success PRO`, countConnect());
        })
        .catch(err => console.log(`Error Connect!`));
    }

    static getInstance() {
        if(!Database.instance) {
            Database.instance = new Database()
        }

        return Database.instance
    }
}

const instanceMongoDb = Database.getInstance()
module.exports = instanceMongoDb