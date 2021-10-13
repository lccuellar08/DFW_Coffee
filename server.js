if(process.env.NODE_ENV !== 'production') {
    require('dotenv').config()
}

const express = require('express')
const app = express()
const expressLayouts = require('express-ejs-layouts')
const nconf = require('nconf')
const bodyParser = require('body-parser')

nconf.argv().env().file('keys.json')

const user = nconf.get('mongoUser');
const pass = nconf.get('mongoPass');
const host = nconf.get('mongoHost');
const port = nconf.get('mongoPort');

const indexRouter = require('./routes/index')
const coffeeshopRouter = require('./routes/coffeeshops')

app.set('view engine', 'ejs')
app.set('views', __dirname + '/views')
app.set('layout', 'layouts/layout')
app.use(expressLayouts)
app.use(express.static('public'))
app.use(bodyParser.urlencoded( {limit: '10mb', extended: false} )) 

const mongoose = require('mongoose')

let uri = process.env.DATABASE_URL;

if(process.env.NODE_ENV === 'production') {
    uri = `mongodb+srv://${user}:${pass}@${host}`;
    if (nconf.get('mongoDatabase')) {
        uri = `${uri}/${nconf.get('mongoDatabase')}?retryWrites=true&w=majority`;
    }
}

console.log(uri);

mongoose.connect(uri, {
    useNewUrlParser: true,
    useUnifiedTopology: true
})

const db = mongoose.connection
db.on('error', error => console.error(error))
db.once('open', () => console.log("Connected to Mongoose"))

app.use('/', indexRouter)
app.use('/coffeeshops', coffeeshopRouter)

app.listen(process.env.PORT || 3000)