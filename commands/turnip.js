const gSheet = require('../lib/gSheet.js')


module.exports = {
	name: 'turnip',
	description: 'Fetch a random turnip or AC meme or gif.',


	async execute(message) {

			const memeSheet = await gSheet.getSheet('memes');
			const meme_list = await memeSheet.getRows().then(rows => rows, error => console.log(error))
			const randomMeme = meme_list[Math.floor(Math.random() * meme_list.length)].url

		message.channel.send(randomMeme)
	}
};