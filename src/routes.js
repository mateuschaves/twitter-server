const express = require('express')

const TweetController = require('./controllers/Tweets')
const LikeController = require('./controllers/Likes')

const routes = express.Router()

routes.get('/tweets', TweetController.index)
routes.post('/tweets', TweetController.store)

routes.post('/likes/:id', LikeController.store)

module.exports = routes