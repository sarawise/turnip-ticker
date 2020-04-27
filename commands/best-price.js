const gSheet = require('../lib/gSheet.js')

function ampm_time(am_pm){
    if (am_pm == 'PM'){
        return ' 12:00:00'
    }
    return ' 00:00:00'
}

function parse_rows(rows) {
    return rows.map(row => 
    ({
        'time': new Date(row.date+ ampm_time(row.time)), 
        'price': parseInt(row.nookPrice), 
        'ticker': row.tickerName
    }))
};

function log_error(error) {
    console.log(error)
};

async function getBestPrices() {
    const sellingSheet = await gSheet.getSheet('selling'); // this is the selling sheet

    const now = new Date();
    const today = new Date(now.toDateString());
    const days_since_monday = today.getDay() - 1
    let start_of_week = new Date(today-days_since_monday*24*3_600_000);
    let prices = await sellingSheet.getRows().then(parse_rows, log_error)

    let best_today = (prices.filter(p => p.time.getTime() >= today.getTime())).sort( (a,b) => b.price-a.price)[0]
    let best_week = (prices.filter(p => p.time.getTime() >= start_of_week.getTime())).sort( (a,b) => b.price-a.price)[0]
    return [best_today, best_week]
}

module.exports = {
    name: 'best-price',
    description: 'Return the best price from today and this week.',
    getBestPrices: getBestPrices,
	async execute(message) {
        [best_today, best_week] = await getBestPrices()
        if (best_today === undefined && best_week === undefined){
            message.channel.send("No prices to pick from")
        }
        
        parts = []
        if (best_today !== undefined && best_week !== undefined){
            parts.push(`Best price today:\t${best_today.ticker} @ ${best_today.price}`)
            parts.push(`Best price this week:\t${best_week.ticker} @ ${best_week.price} `)
            message.channel.send(parts.join('\n'));
        };


    }
}