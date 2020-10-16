const axios = require('axios').default

  async function getRandomMessage(){
      const response = await axios.get(`https://uselessfacts.jsph.pl/random.json?language=${process.env.LANGUAGE || "en"}`);
      return `Did you know... ${response.data.text}`;

  }

const randomMessages = [{
    text: getRandomMessage
}
]

module.exports = {
    randomMessages
}