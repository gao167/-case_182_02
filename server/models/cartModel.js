var mongoose = require('mongoose')
var Schema = mongoose.Schema

var CartSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    image: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        required: true
    },
    quantity: {
        type: Number,
        default: 1
    },
    created_date: {
        type: Date,
        default: Date.now
    }
})

module.exports = mongoose.model('Cart',CartSchema)
