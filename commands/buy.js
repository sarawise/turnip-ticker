const gSheet = require('../lib/gSheet.js')

module.exports = {
        name: 'buy',
        description: 'Record quantity and price of turnips bought. Use negative quantity to sell.',
        usage: '<price> <quantity> <date: optional>',

	async execute(message) {
        const ledgerSheet = await gSheet.getSheet('ledger');
        [price, quantity, date] = message.content.split(' ')
        let today = null
        if (date == null){
            today = new Date()
        }
        else{
            today = new Date(date)
        }
        row = {
            buyer: message.author.username,
            date: today.toLocaleString(),
            price: parseInt(price),
            quantity: parseInt(quantity)
        }
        await ledgerSheet.addRow(row);
        await message.react("✅");
    }
}