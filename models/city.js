const { Int32, Double } = require('mongodb')
const mongoose = require('mongoose')
const Coffeeshop = require('./coffeeshop')

const citySchema = new mongoose.Schema({
    Name: {
        type: String,
        required: true
    },
    State: {
        type: String,
        required: true
    }
})

citySchema.pre('remove', function(next) {
    Coffeeshop.find({City: this.id}, (err, coffeeshops) => {
        if(err) {
            next(err)
        }
        else if(coffeeshops.length > 0) {
            next(new Error("This city has coffeeshops still"))
        }
        else {
            next()
        }
    })
})

module.exports = mongoose.model('City', citySchema)