const express = require('express')
const { search } = require('.')
const router = express.Router()
const Coffeeshop = require('../models/coffeeshop')
const formatDate = require('../lib/formatDate')

// All Coffee Shops Route
router.get('/', async (req, res) => {
    let searchOptions = {}
    if(req.query.name != null && req.query.name != '') {
        searchOptions.Name = new RegExp(req.query.name, 'i')
    }
    console.log(searchOptions)
    try {
        const coffeeshops = await Coffeeshop.find(searchOptions)
        res.render('coffeeshops/index', {
            coffeeshops: coffeeshops,
            searchOptions: req.query
        })
    } catch {
        res.redirect('/')
    }
    
})

// New Coffee Shop RouteRoute
router.get('/new', (req, res) => {
    res.render('coffeeshops/new', {coffeeshop: new Coffeeshop()})
})

// Create Coffee Shop Route
router.post('/', async (req, res) => {
    const coffeeshop = new Coffeeshop({
        Name: req.body.name,
        City: req.body.city,
        Address: req.body.address,
        Date: formatDate(req.body.date),
        Coffee_Score: req.body.coffee_score,
        Aesthetic_Score: req.body.aesthetic_score,
        Overall_Score: req.body.overall_score,
        Notes: req.body.notes
    })

    try {
        const newCoffeshop = await coffeeshop.save()
        //res.redirect(`coffeeshops/${newCoffeeshop.id}`)
        res.redirect('coffeeshops')
    } catch {
        res.render('coffeeshops/new', {
            coffeeshop: coffeeshop,
            errorMessage: "Error creating Coffee Shop"
        })
    }
})

module.exports = router