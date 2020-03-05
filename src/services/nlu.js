const NaturalLanguageUnderstandingV1 = require("ibm-watson/natural-language-understanding/v1");
const { IamAuthenticator } = require('ibm-watson/auth');
require("dotenv").config();


console.log(process.env.NATURAL_LANGUAGE_UNDERSTANDING_URL);

module.exports = new NaturalLanguageUnderstandingV1({
    authenticator: new IamAuthenticator({ apikey: process.env.NATURAL_LANGUAGE_UNDERSTANDING_IAM_APIKEY }),
    url: process.env.NATURAL_LANGUAGE_UNDERSTANDING_URL,
    version: '2018-04-05'
});