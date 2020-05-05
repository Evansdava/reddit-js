const chai = require('chai')
const mocha = require('mocha')
const chaiHttp = require('chai-http')
const server = require('../server')
// const should = chai.should()
const after = mocha.after
const it = mocha.it
const describe = mocha.describe
chai.use(chaiHttp)

// Agent that will keep track of our cookies
const agent = chai.request.agent(server)

const User = require('../models/user')

describe('User', function () {
  it('should not be able to login if they have not registered', function (done) {
    agent.post('/login', { email: 'wrong@wrong.com', password: 'nope' }).end(function (err, res) {
      res.status.should.be.equal(401)
      done()
      if (err) {
        console.log(err)
      }
    })
  })

  // signup
  it('should be able to signup', function (done) {
    User.findOneAndRemove({ username: 'testone' }, function () {
      agent
        .post('/sign-up')
        .send({ username: 'testone', password: 'password' })
        .end(function (err, res) {
          console.log(res.body)
          res.should.have.status(200)
          agent.should.have.cookie('nToken')
          done()
          if (err) {
            console.log(err)
          }
        })
    })
  })

  // login
  it('should be able to login', function (done) {
    agent
      .post('/login')
      .send({ username: 'testone', password: 'password' })
      .end(function (err, res) {
        if (err) {
          console.log(err)
        }
        res.should.have.status(200)
        agent.should.have.cookie('nToken')
        done()
      })
  })

  // logout
  it('should be able to logout', function (done) {
    agent.get('/logout').end(function (err, res) {
      if (err) {
        console.log(err)
      }
      res.should.have.status(200)
      agent.should.not.have.cookie('nToken')
      done()
    })
  })

  after(function () {
    agent.close()
  })
})
