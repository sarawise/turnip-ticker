
const { time_ampm } = require('../lib/gSheet.js')
const tickerInfo = require('../lib/ticker-info.json');
const addSell = require('../lib/addSell.js')
const reaction = require('./reaction.js')

module.exports = {
    name: 'report',
    description: 'Report your turnip prices, following the usage pattern.',
    usage: '<TICKER> <price> <?AM/PM>',
    async execute(message) {
    
        // TODO: accept content matching usage as written above
            // then call google spreadsheet fuction (to be written)
                // don't allow duplicate price reports
                // then react on completion
        tokens = message.content.split(' ')
        console.log(tokens);
        if (tokens.length < 3) return message.channel.send('Missing parameters: <TICKER> <price> <?AM/PM>');
        let [,tickParam, priceParam, ...timeParam] = tokens
        timeParam = timeParam.pop() || time_ampm(new Date())
        if (isNaN(priceParam)) return message.channel.send(`Invalid price: ${priceParam}`);
        let tickerMap = tickerInfo.reduce((m,t) => {m.set(t.tickerName,t); return m}, new Map())
        let usernameMap = tickerInfo.reduce((m,t) => {m.set(t.userName,t); return m}, new Map())
        if (!tickerMap.has(tickParam) && !usernameMap.has(message.author.username))
        {
            message.channel.send(
                `Ticker ${tickParam} not in ${[...tickerMap.keys()]} `+
                `and user ${message.author.username} not in ${[...usernameMap.keys()]}`
            )
            return
        }
        let matching = tickerMap.get(tickParam) || usernameMap.get(message.author.username)
        tickerTokens = {
            userName : matching.userName,
            ticker : matching.tickerName,
            price : priceParam,
            time : timeParam
        }
        console.log("accessing SpreadSheet")
        addSell.execute(tickerTokens);
        message.react("✅");

        price = +tickerTokens.price
        if (price <= 75 || price >= 250){
            reax = await reaction.react(price)
            if (reax != null){
                message.channel.send(reax)
            }
        }
    },
};