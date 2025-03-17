'use strict'

const mongoose = require('mongoose')

const connectString = 'mongodb+srv://hieustupid2502:0917958087@ecommercetipjs.tlf4d.mongodb.net/?retryWrites=true&w=majority&appName=EcommerceTipJS'

mongoose.connect(connectString).then( _ => console.log(`Connected Mongodb Success`))
.catch(err => console.log(`Error Connect!`))    

// dev 
if(1 === 1) {
    mongoose.set('debug', true)
    mongoose.set('debug', {color: true})
}

module.exports = mongoose