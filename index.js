require('dotenv').config()
const express = require('express')
const expressLayout = require('express-ejs-layouts')
const methodOverride = require('method-override')
const session = require('express-session')
const cookieParser = require('cookie-parser')
const MongoStore = require('connect-mongo') 

const connectDB = require('./server/config/datab')
//const  isActiveRoute  = require('./server/helpers/routeHelpers')


const app = express()
const PORT = 5000 || process.env.PORT

// Connect to DB
connectDB()
app.use(express.urlencoded({extended: true}))
app.use(express.json())
app.use(cookieParser())
app.use(methodOverride('_method'))
app.use(session({
    //secret: 'Keyboard cat'
    secret: 'Toju',
    resave: false,
    saveUninitialized: true,
    store: MongoStore.create({
        mongoUrl: process.env.MONGODB_URI
    }),
    cookie : {maxAge: new Date (Date.now() + (3600000))}

}))



// Static files
 app.use(express.static('public'))

// Templating Engine
app.use(expressLayout)
app.set('layout', './layouts/main')
app.set('view engine', 'ejs')

//app.locals.isActiveRoute = isActiveRoute

//Any of these can work
//const routes =  require(  './server/routes/main')
//app.use('/', routes)
app.use('/', require('./server/routes/main'))
app.use('/', require('./server/routes/admin.js'))



app.listen(PORT, () => {
    console.log(`App listening on port ${PORT}`)
})