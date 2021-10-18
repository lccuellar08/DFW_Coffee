const express = require('express')
const { search } = require('.')
const router = express.Router()
const City = require('../models/city')
const Coffeeshop = require('../models/coffeeshop')
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
        res.redirect(`cities/${newCity.id}`)
    } catch {
        res.render('cities/new', {
            city: city,
            errorMessage: "Error creating City"
        })
    }
})

// Get City
router.get('/:id', async (req, res) => {
    try {
        const city = await City.findById(req.params.id)
        const coffeeshops = await Coffeeshop.find({City: city.id}).limit(6).populate('City').exec()
        res.render('cities/show', {
            city: city,
            coffeeshopsInCity: coffeeshops
        })
    } catch {
        res.redirect('/')
    }
})

// Edit City
router.get('/:id/edit', async (req, res) => {
    try {
        const updateCity = await City.findById(req.params.id)
        res.render('cities/edit', {city: updateCity})
    }
    catch {
        res.redirect('cities')
    }
})

// Update City
router.put('/:id', async (req, res) => {
    let city
    try {
        city = await City.findById(req.params.id)
        city.Name = req.body.name
        await city.save()
        res.redirect(`/cities/${city.id}`)
    } catch {
        if(city == null) {
            res.redirect('/')
        }
        else {
            res.render('/cities/edit', {
                city: city,
                errorMessage: "Error updating City"
            })
        }
    }
})

// Delete City
router.delete('/:id', async (req, res) => {
    let city
    try {
        city = await City.findById(req.params.id)
        await city.remove()
        res.redirect('/cities')
    } catch {
        if(city == null) {
            res.redirect('/')
        }
        else {
            res.redirect(`/cities/${city.id}`)
        }
    }
})

module.exports = router