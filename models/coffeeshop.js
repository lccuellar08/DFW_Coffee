const { Int32, Double } = require('mongodb')
const mongoose = require('mongoose')

const coffeeshopSchema = new mongoose.Schema({
    Name: {
        type: String,
        required: true
    },
    City: {
        type: String,
        required: true
    },
    Address: {
        type: String,
        required: true
    },
    Date: {
        type: Date,
        required: true
    },
    Coffee_Score: {
        type: Number,
        required: true
    },
    Aesthetic_Score: {
        type: Number,
        required: true
    },
    Overall_Score: {
        type: Number,
        required: true
    },
    Notes: {
        type: String,
        required: false
    }
})

module.exports = mongoose.model('Coffeeshop', coffeeshopSchema)