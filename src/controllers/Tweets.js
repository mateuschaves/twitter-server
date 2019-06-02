const Tweet = require("../models/Tweet");
const NaturalLanguageUnderstandingV1 = require("ibm-watson/natural-language-understanding/v1.js");

module.exports = {
  async index(_, res) {
    const tweets = await Tweet.find({}).sort("-createdAt");

    return res.json(tweets);
  },

  async store(req, res) {
    let emotion = { score: -1, emotion: "null" };
    const tags = ["sadness", "joy", "fear", "anger"];

    const nlu = new NaturalLanguageUnderstandingV1({
      iam_apikey: process.env.NATURAL_LANGUAGE_UNDERSTANDING_IAM_APIKEY,
      version: "2018-04-05",
      url: process.env.NATURAL_LANGUAGE_UNDERSTANDING_URL
    });
    nlu
      .analyze({
        html: req.body.content,
        features: {
          emotion: {}
        }
      })
      .then(async result => {
        const {
          emotion: {
            document: {
              emotion: { sadness, joy, fear, anger }
            }
          }
        } = result;

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
        return res.json(tweet);
      })
      .catch(async _ => {
        const tweet = await Tweet.create(req.body);
        req.io.emit("tweet", tweet);
        return res.json(tweet);
      });
  }
};
