const Post = require('../models/post')

module.exports = (app) => {
  // CREATE
  app.post('/posts/new', (req, res) => {
    if (req.user) {
      var post = new Post(req.body)

      post.save(function (err, post) {
        if (err) {
          console.log(err)
        }
        return res.redirect('/')
      })
    } else {
      return res.status(401) // UNAUTHORIZED
    }
  })

  // INDEX
  app.get('/', (req, res) => {
    var currentUser = req.user

    Post.find({})
      .then(posts => {
        res.render('posts-index', { posts, currentUser })
      })
      .catch(err => {
        console.log(err.message)
      })
  })

  // GET SINGLE POST
  app.get('/posts/:id', function (req, res) {
    // LOOK UP THE POST
    Post.findById(req.params.id).lean().populate('comments').then((post) => {
      res.render('posts-show', { post, currentUser: req.user })
    }).catch((err) => {
      console.log(err.message)
    })
  })

  // SUBREDDIT
  app.get('/n/:subreddit', function (req, res) {
    Post.find({ subreddit: req.params.subreddit }).lean()
      .then(posts => {
        res.render('posts-index', { posts, currentUser: req.user })
      })
      .catch(err => {
        console.log(err)
      })
  })
}
