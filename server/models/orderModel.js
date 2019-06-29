var mongoose = require('mongoose')
var Schema = mongoose.Schema

var orderSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    phone: {
        type: String,
        required: true
    },
    adress: {
        type: String,
        required: true
    },
    paymentType:{
        type: String
    },
    total: {
        type: Number,
        required: true
    },
    created_date: {
        type: Date,
        default: Date.now
    }
})
module.exports = mongoose.model('Order',orderSchema)