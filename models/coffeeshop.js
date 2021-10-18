const { Int32, Double, Long } = require('mongodb')
const mongoose = require('mongoose')

const coffeeshopSchema = new mongoose.Schema({
    Name: {
        type: String,
        required: true
    },
    City: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'City'
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
        btype: Double,
        required: true
    },
    Aesthetic_Score: {
        type: Number,
        btype: Double,
        required: true
    },
    Overall_Score: {
        type: Number,
        btype: Double,
        required: true
    },
    Notes: {
        type: String,
        required: false
    }
})

module.exports = mongoose.model('Coffeeshop', coffeeshopSchema)