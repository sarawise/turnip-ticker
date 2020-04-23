// const d3 = require('d3')
// const jsdom = require('jsdom')
const {  GoogleSpreadsheet } = require('google-spreadsheet');
const creds = require('../client_secret.json');

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

module.exports = {
	name: 'best-price',
	description: 'Return the best price from today and this week.',
	async execute(message) {
        
        async function getPrices() {
            console.log("Spreadsheet accessed")
            const doc = new GoogleSpreadsheet('1q2AlvVoTMQI5LtvxFeeqM_2x1qwKB60c9Im-wGpSwoY'); // gets sheet using sheet id from url 
        
            await doc.useServiceAccountAuth(creds);
        
            await doc.getInfo(); // loads document properties and worksheets
        
            const sellingSheet = doc.sheetsByIndex[1]; // this is the selling sheet
        
            const now = new Date();
            const today = new Date(now.toDateString());
            const days_since_monday = today.getDay() - 1
            let start_of_week = new Date(today-days_since_monday*24*3_600_000);
            return sellingSheet.getRows().then(parse_rows, log_error)
        }
    
        let prices = await getPrices();

        let now = new Date();    
        let today = new Date(now.toDateString());
        let ms_since_mon = (today.getDay()-1)*24*3600*1000
        let monday = new Date(today.getTime()-ms_since_mon)
        today.setHours(now.getHours() < 12 ? 0 : 12)

        let best_today = (prices.filter(p => p.time.getTime() >= today.getTime())).sort( (a,b) => b.price-a.price)[0]
        let best_week = (prices.filter(p => p.time.getTime() >= monday.getTime())).sort( (a,b) => b.price-a.price)[0]
        
        if (best_today === undefined && best_week === undefined){
            message.channel.send("No prices to pick from")
        }
        
        parts = []
        if (best_today !== undefined){
            parts.push(`Best price today:\t${best_today.ticker} @ ${best_today.price}`)
        }
        if (best_week !== undefined){
            parts.push(`Best price this week:\t${best_week.ticker} @ ${best_week.price}`)
        }
    
        message.channel.send(parts.join('\n'));
    }
}