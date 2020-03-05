const Tweet = require("../models/Tweet");

const Nlu = require('../services/nlu');

module.exports = {
  async index(_, res) {
    const tweets = await Tweet.find({}).sort("-createdAt");

    return res.json(tweets);
  },

  async store(req, res) {
    let emotion = { score: -1, emotion: "null" };
    const tags = ["sadness", "joy", "fear", "anger"];
    try {
      const response = await Nlu.analyze({
        html: req.body.content,
        features: {
          emotion: {}
        }
      });
      const emotions = response.result.emotion.document.emotion;
      const { sadness, joy, fear, anger } = emotions;
      const scores = [sadness, joy, fear, anger];
      for (let i = 0; i < 4; i++) {
        if (scores[i] > emotion.score) {
          emotion.score = scores[i];
          emotion.emotion = tags[i];
          req.body.emotion = emotion;
        }
      }
      const tweet = await Tweet.create(req.body);
      req.io.emit("tweet", tweet);
      return res.status(200).json(tweet);
    } catch (error) {
      return res.json({
        message: "We can't store your tweet, try again typing inglish"
      })
    }
  }
};
