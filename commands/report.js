
const tickerInfo = require('../lib/ticker-info.json');
const addSell = require('../lib/addSell.js')
const reaction = require('./reaction.js')

module.exports = {
    name: 'report',
    description: 'Report your turnip prices, following the usage pattern.',
    usage: '<TICKER> <price> <AM/PM>',
    async execute(message) {
    
        // TODO: accept content matching usage as written above
            // then call google spreadsheet fuction (to be written)
                // don't allow duplicate price reports
                // then react on completion
        tokens = message.content.split(' ')
        console.log(tokens);
        if(tokens.length != 4) return message.channel.send('Error occurred');
        tickerTokens = {
            userName : "",
            ticker : tokens[1],
            price : tokens[2],
            time : tokens[3]
        }

        success = false;
        tickerInfo.forEach(ticker => {
            console.log(ticker.tickerName + ' ' + tickerTokens.ticker)
            if (ticker.tickerName === tickerTokens.ticker && !success) {
                tickerTokens.userName = ticker.userName;
                console.log("accessing SpreadSheet")
                addSell.execute(tickerTokens);
                message.react("✅");
                success = true
                return
            } 
        })
        if(!success) {
            tickerInfo.forEach(user => {
            if (user.userName === message.author.username && !success){
                tickerTokens.userName = message.author.username;
                tickerTokens.ticker = user.tickerName;
                addSell.execute(tickerTokens);
                message.react("✅");
                success = true
                return
            }
        }) 
        }
        if (!success) message.channel.send('Error occurred');
        else {
            reax = await reaction.react(parseInt(tickerTokens.price))
            if (reax != null){
                message.channel.send(reax)
            }
        }
    },
};