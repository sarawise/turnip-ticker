const gSheet = require('../lib/gSheet.js')
const bestPrices = require('../commands/best-price.js')

module.exports = {
        name: 'returns',
        description: 'Reports potential returns on turnips bought and sold this week.',
        
        async execute(message) {

// Thanks Tom: https://blog.abelotech.com/posts/number-currency-formatting-javascript/
function formatNumber(num) {
    return num.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,')
}

function filterLedgerRows(rows, username){
    const now = new Date();
    const today = new Date(now.toDateString());
    const days_since_sunday = today.getDay()
    let start_of_week = new Date(today-days_since_sunday*24*3_600_000);

    return rows.filter(row => row.buyer == username && new Date(row.date) >= start_of_week)
}
        const ledgerSheet = await gSheet.getSheet('ledger');

        let ledger = await ledgerSheet.getRows().then(
            rows => filterLedgerRows(rows, message.author.username),
            error => console.log(error)
        )
        let [best_today, best_week] = await bestPrices.getBestPrices()
        baseValue = ledger.reduce( (total, next) => {
            return total + parseInt(next.quantity) * parseInt(next.price)
        }, 0)
        inventory = ledger.reduce( (total, next) => {return total + parseInt(next.quantity)}, 0)
        parts = [`You bought ${inventory} <:turnip:699780899738484797> for 🔔${formatNumber(baseValue)}`]

        if (!(best_today == null)){
            bestValueToday = inventory*best_today.price
            parts.push(`Best today at 🔔${formatNumber(best_today.price)} for 🔔${formatNumber(bestValueToday)} at ${((bestValueToday/baseValue)*100-100).toFixed(2)}% RoI`)
        }
        if (!(best_week !== null)){
            bestValueWeek = inventory*best_week.price
            parts.push(`Best this week at 🔔${formatNumber(best_week.price)} for 🔔${formatNumber(bestValueWeek)} at ${((bestValueWeek/baseValue)*100-100).toFixed(2)}% RoI`)
        }
        if (!best_today && !best_week){
            parts.push('No prices to compare to <:isgraphs:691420747465228309>')
        }

        message.channel.send(parts.join(`\n`));
    }
}