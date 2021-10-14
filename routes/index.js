const express = require('express')
const router = express.Router()
const Coffeeshop = require('../models/coffeeshop')

router.get('/', async (req, res) => {
    let coffeeshops = []
    try {
        coffeeshops = await Coffeeshop.find().sort({'Date': 'desc'}).limit(10).exec()
    } catch {
        books = []
    }
    res.render('index', {coffeeshops: coffeeshops})
})

module.exports = router