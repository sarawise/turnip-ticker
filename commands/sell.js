const gSheet = require('../lib/gSheet.js');
const {
	getBestPrices,
} = require('./best-price.js');

module.exports = {
	name: 'sell',
	description: 'Record a sale of turnips. If no price is given, uses today\'s best price',
	usage: '<purchase price> <quantity>',

	async execute(message) {
		const ledgerSheet = await gSheet.getSheet('ledger');
		[, ...params] = message.content.split(' ');
		if (params.length < 1) {
			return message.channel.send('Missing paramaters! Send `!help sell` to learn more about this command.');
		}
		let price = undefined;
		let date = undefined;
		let quantity = undefined;
		switch (params.length) {
		case 3:
			[price, quantity, date] = params;
			break;
		case 2:
			[price, quantity] = params;
			break;
		case 1:
			[quantity] = params;
			[bestToday] = await getBestPrices();
			price = bestToday.price;
			break;
		}
		if (+quantity < 0) {
			return message.channel.send(`${quantity} < 0, must use positive numbers`);
		}
		let today = null;
		if (date == null) {
			today = new Date();
		}
		else {
			today = new Date(date);
		}


		row = {
			buyer: message.author.username,
			date: (today.getMonth() + 1) + '/' + today.getDate() + '/' + today.getFullYear(),
			price: parseInt(price),
			quantity: -parseInt(quantity),
		};
		await ledgerSheet.addRow(row);
		await message.react('✅');
	},
};