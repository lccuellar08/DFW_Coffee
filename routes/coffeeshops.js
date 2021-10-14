const express = require('express')
const { search } = require('.')
const router = express.Router()
const Coffeeshop = require('../models/coffeeshop')
const City = require('../models/city')
const formatDate = require('../lib/formatDate')

// All Coffee Shops Route
router.get('/', async (req, res) => {
    let query = Coffeeshop.find()
    if(req.query.name != null && req.query.title != '') {
        query = query.regex('Name', new RegExp(req.query.name, 'i'))
    }
    if(req.query.visitedBefore != null && req.query.visitedBefore != '') {
        query = query.lte('Date', req.query.visitedBefore)
    }
    if(req.query.visitedAfter != null && req.query.visitedAfter != '') {
        query = query.gte('Date', req.query.visitedAfter)
    }
    try {
        const coffeeshops = await query.exec()
        res.render('coffeeshops/index', {
            coffeeshops: coffeeshops,
            searchOptions: req.query
        })
    }
    catch {
        res.redirect('/')
    }
})

// New Coffee Shop RouteRoute
router.get('/new', async (req, res) => {
    renderNewPage(res, new Coffeeshop())
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
        renderNewPage(res, coffeeshop, true)
    }
})

async function renderNewPage(res, coffeeshop, hasError = false) {
    try {
        const cities = await City.find({})
        const params = {
            cities: cities,
            coffeeshop: coffeeshop
        }
        if(hasError)
            params.errorMessage = 'Error Creating City'
        //const coffeeshop = new Coffeeshop()
        res.render('coffeeshops/new', params)
    } catch (e) {
        console.log("Error", e.stack);
        console.log("Error", e.name);
        console.log("Error", e.message);
        res.redirect('/coffeeshops')
    }
}

module.exports = router