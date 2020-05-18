const gSheet = require('../lib/gSheet.js')

module.exports = {
        name: 'buy',
        description: 'Record quantity and price of turnips bought. !sell to sell.',
        usage: '<purchase price> <quantity>',

	async execute(message) {
        const ledgerSheet = await gSheet.getSheet('ledger');
        [, price, quantity, date] = message.content.split(' ');
        if (quantity == undefined || price == undefined){
            return message.channel.send(`Usage: !buy <purchase price> <quantity>`)
        }
        if (+quantity < 0){
            return message.channel.send(`${quantity} < 0, use !sell to sell 'nips`)
        }
        let today = null
        if (date == null){
            today = new Date()
        }
        else{
            today = new Date(date)
        }

        
        row = {
            buyer: message.author.username,
            date: (today.getMonth() + 1) + '/' + today.getDate() + '/' + today.getFullYear(),
            price: parseInt(price),
            quantity: parseInt(quantity)
        }
        await ledgerSheet.addRow(row);
        await message.react("✅");
    }
}