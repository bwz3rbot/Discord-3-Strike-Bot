const axios = require('axios').default

  async function getRandomMessage(){
      console.log("Getting a random message...")
      const response = await axios.get(`https://uselessfacts.jsph.pl/random.json?language=${process.env.LANGUAGE}`);
      console.log(response.data.text);
      return `Did you know... ${response.data.text}`;

  }

const randomMessages = [{
    text: getRandomMessage
}
]

module.exports = {
    randomMessages
}