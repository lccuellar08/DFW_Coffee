const express = require('express')
const { search } = require('.')
const router = express.Router()
const City = require('../models/city')
const formatDate = require('../lib/formatDate')

// All Cities Route
router.get('/', async (req, res) => {
    let searchOptions = {}
    if(req.query.name != null && req.query.name != '') {
        searchOptions.Name = new RegExp(req.query.name, 'i')
    }

    try {
        const cities = await City.find(searchOptions)
        res.render('cities/index', {
            cities: cities,
            searchOptions: req.query
        })
    } catch {
        res.redirect('/')
    }
})

// New City Route
router.get('/new', (req, res) => {
    res.render('cities/new', {city: new City()})
})

// Create City Route
router.post('/', async (req, res) => {
    const city = new City({
        Name: req.body.name,
        State: req.body.state
    })

    try {
        const newCity = await city.save()
        //res.redirect(`cities/${newCity.id}`)
        res.redirect('cities')
    } catch {
        res.render('cities/new', {
            city: city,
            errorMessage: "Error creating City"
        })
    }
})

module.exports = router