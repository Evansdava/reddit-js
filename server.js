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
// const jwt = require('jsonwebtoken')

app.use(cookieParser()) // Add this after you initialize express.

// Use Body Parser
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: false }))

// Add after body parser initialization!
app.use(expressValidator())

app.engine('handlebars', exphbs({ defaultLayout: 'main' }))
app.set('view engine', 'handlebars')

// app.get('/', (req, res) => res.render('posts-index'))

app.get('/posts/new', (req, res) => res.render('posts-new'))

require('./controllers/posts.js')(app)

require('./controllers/comments.js')(app)

require('./controllers/auth.js')(app)

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})

module.exports = app
