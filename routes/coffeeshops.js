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
        const coffeeshops = await query.populate('City').exec()
        res.render('coffeeshops/index', {
            coffeeshops: coffeeshops,
            searchOptions: req.query
        })
    }
    catch {
        res.redirect('/')
    }
})

// New Coffee Shop Route
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
        const newCoffeeshop = await coffeeshop.save()
        res.redirect(`coffeeshops/${newCoffeeshop.id}`)
    } catch (err) {
        console.log(err)
        renderNewPage(res, coffeeshop, true)
    }
})

// Show Coffeeshop Route
router.get("/:id", async (req, res) => {
    try {
        const coffeeshop = await Coffeeshop.findById(req.params.id).populate("City").exec()
        res.render("coffeeshops/show", {
            coffeeshop: coffeeshop
        })
    } catch {
        res.redirect("/")
    }
})

// Edit Coffee Shop Route
router.get('/:id/edit', async (req, res) => {
    try {
        const coffeeshop = await Coffeeshop.findById(req.params.id)
        renderEditPage(res, coffeeshop)
    } catch {
        res.redirect('/')
    }
})

// Update Coffee Shop Route
router.put('/:id', async (req, res) => {
    let coffeeshop
    try {
        coffeeshop = await Coffeeshop.findById(req.params.id)

        // Update coffeeshop fields
        coffeeshop.Name = req.body.name,
        coffeeshop.City = req.body.city,
        coffeeshop.Address = req.body.address,
        coffeeshop.Date = formatDate(req.body.date),
        coffeeshop.Coffee_Score = req.body.coffee_score,
        coffeeshop.Aesthetic_Score = req.body.aesthetic_score,
        coffeeshop.Overall_Score = req.body.overall_score,
        coffeeshop.Notes = req.body.notes

        await coffeeshop.save()

        res.redirect(`/coffeeshops/${coffeeshop.id}`)
    } catch (err) {
        console.log(err)
        if(coffeeshop != null) {
            renderEditPage(res, coffeeshop, true)
        } else {
            res.redirect('/')
        }
    }
})

// Delete Coffee Shop
router.delete("/:id", async (req, res) => {
    let coffeeshop
    try {
        coffeeshop = await Coffeeshop.findById(req.params.id)
        await coffeeshop.remove()
        res.redirect("/coffeeshops")
    } catch {
        if(coffeeshop != null) {
            res.render("coffeeshops/show", {
                coffeeshop: coffeeshop,
                errorMessage: "Could not remove book"
            })
        } else {
            res.redirect("/")
        }
    }
})

async function renderNewPage(res, coffeeshop, hasError = false) {
    renderFormPage(res, coffeeshop, "new", hasError)
}

async function renderEditPage(res, coffeeshop, hasError = false) {
    renderFormPage(res, coffeeshop, "edit", hasError)
}

async function renderFormPage(res, coffeeshop, form, hasError = false) {
    try {
        const cities = await City.find({})
        const params = {
            cities: cities,
            coffeeshop: coffeeshop
        }
        if(hasError) {
            if(form == "new")
                params.errorMessage = "Error creating coffeeshop"
            else
                params.errorMessage = "Error editing coffeeshop"
        }
        res.render(`coffeeshops/${form}`, params)
    } catch {
        res.redirect('/coffeeshops')
    }
}

module.exports = router