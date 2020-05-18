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
        emojis = message.client.emojis.cache.reduce((d,e)=>(d[e.name]=e,d),{})
        const ledgerSheet = await gSheet.getSheet('ledger');

        let ledger = await ledgerSheet.getRows().then(
            rows => gSheet.filterLedgerRows(rows, message.author.username),
            error => console.log(error)
        )
        let [best_today, best_week] = await bestPrices.getBestPrices()
        baseValue = ledger.reduce( (total, next) => {
            return total + parseInt(next.quantity) * parseInt(next.price)
        }, 0)
        bought = ledger.filter(r => r.quantity > 0)
        boughtValue = bought.reduce((total, next) => {
            return total + (+next.quantity)*(+next.price)
        }, 0)
        boughtInventory = bought.reduce((total, next) => {
            return total + (+next.quantity)
        }, 0)
        soldValue = -ledger.filter(r => r.quantity < 0).reduce((total, next) => {
            return total + (+next.quantity)*(+next.price)
        }, 0)
        inventory = ledger.reduce( (total, next) => {return total + parseInt(next.quantity)}, 0)
        parts = [`You bought ${boughtInventory} ${emojis['turnip']} for 🔔${formatNumber(boughtValue)}`, `You currently have ${inventory} ${emojis['turnip']} `]        

        if (!(best_today == null)){
            bestValueToday = inventory*best_today.price
            parts.push(`Best today at 🔔${formatNumber(best_today.price)} for 🔔${formatNumber(bestValueToday)} at ${(((bestValueToday+soldValue)/boughtValue)*100-100).toFixed(2)}% RoI`)
            parts.push(`Profit for today: 🔔${formatNumber(bestValueToday-baseValue)}`)
        }
        if (!(best_week == null)){
            bestValueWeek = inventory*best_week.price
            parts.push(`Best this week at 🔔${formatNumber(best_week.price)} for 🔔${formatNumber(bestValueWeek)} at ${(((bestValueWeek+soldValue)/boughtValue)*100-100).toFixed(2)}% RoI`)
            parts.push(`Profit for week: 🔔${formatNumber(bestValueWeek-baseValue)}`)
        }
        if (!best_today && !best_week){
            parts.push(`No prices to compare to ${emojis['isgraphs']}`)
        }

        message.channel.send(parts.join(`\n`));
    }
}
