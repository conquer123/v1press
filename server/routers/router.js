const express = require('express')
const router = express.Router()

router.get('/', function (req, res) {
  res.render('index/index', { title: 'index', bundle: 'index'})
})

router.get('/test', function (req, res) {
  res.render('test/test', { title: 'test', bundle: 'test'})
})

module.exports = router