const express = require('express')
const app = express()
const port = 3000
const bodyParser = require('body-parser')
const expressValidator = require('express-validator')
require('dotenv').config()

// Set db
require('./data/reddit-db')

// Middleware
const exphbs = require('express-handlebars')
var cookieParser = require('cookie-parser')
const jwt = require('jsonwebtoken')

app.use(cookieParser()) // Add this after you initialize express.

// Use Body Parser
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: false }))

// Add after body parser initialization!
app.use(expressValidator())

var checkAuth = (req, res, next) => {
  console.log('Checking authentication')
  if (typeof req.cookies.nToken === 'undefined' || req.cookies.nToken === null) {
    req.user = null
  } else {
    var token = req.cookies.nToken
    var decodedToken = jwt.decode(token, { complete: true }) || {}
    req.user = decodedToken.payload
  }

  next()
}
app.use(checkAuth)

app.engine('handlebars', exphbs({ defaultLayout: 'main' }))
app.set('view engine', 'handlebars')

// app.get('/', (req, res) => res.render('posts-index'))

app.get('/posts/new', (req, res) => res.render('posts-new', { currentUser: req.user }))

require('./controllers/posts')(app)
require('./controllers/comments.js')(app)
require('./controllers/auth.js')(app)
require('./controllers/replies.js')(app)

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})

module.exports = app
