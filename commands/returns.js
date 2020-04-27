const gSheet = require('../lib/gSheet.js')
const bestPrices = require('../commands/best-price.js')

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

module.exports = {
        name: 'returns',
        description: 'Report the potential returns. Only considers turnips bought and sold this week.',
        usage: '!returns',

	async execute(message) {
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
        parts = [`You bought ${inventory} :turnip: for 🔔${formatNumber(baseValue)}`]

        if (!(best_today == null)){
            bestValueToday = inventory*best_today
            parts.push(`Best today at 🔔${formatNumber(best_today)} for 🔔${formatNumber(bestValueToday)} at ${((bestValueToday/baseValue)*100-100).toFixed(2)}% RoI`)
        }
        if (!(best_week !== null)){
            bestValueWeek = inventory*best_week
            parts.push(`Best this week at 🔔${formatNumber(best_week)} for 🔔${formatNumber(bestValueWeek)} at ${((bestValueWeek/baseValue)*100-100).toFixed(2)}% RoI`)
        }
        if (!best_today && !best_week){
            parts.push('No prices to compare to :isgraphs:')
        }

        message.channel.send(parts.join(`\n`));
    }
}