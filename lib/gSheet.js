const {  GoogleSpreadsheet } = require('google-spreadsheet');
const creds = require('../client_secret.json');
doc = initDoc()

// Stuff the init inside a function to run 1 time
async function initDoc() {
    let _doc = new GoogleSpreadsheet('1q2AlvVoTMQI5LtvxFeeqM_2x1qwKB60c9Im-wGpSwoY'); // gets sheet using sheet id from url 
    await _doc.useServiceAccountAuth(creds);
    await _doc.getInfo(); // loads document properties and worksheets
    return _doc
}


async function getSheet(sheetName){
    console.log(`Spreadsheet ${sheetName} accessed`)
    d = await doc
    return d.sheetsByIndex.find( sheet => sheet.title == sheetName)
}


function log_error(error) {
    console.log(error)
};

function filterLedgerRows(rows, username){
    const now = new Date();
    const today = new Date(now.toDateString());
    const days_since_sunday = today.getDay()
    let start_of_week = new Date(today-days_since_sunday*24*3_600_000);

    return rows.filter(row => row.buyer == username && new Date(row.date + ampm_time(row.time)) >= start_of_week)
}

function ampm_time(am_pm){
    if (am_pm == 'PM'){
        return ' 12:00:00'
    }
    return ' 00:00:00'
}

function time_ampm(time){
    if (time.getHours() >= 12)
        return 'PM'
    return 'AM'
}

function parse_rows(rows) {
    return rows.map(row => 
    ({
        'time': new Date(row.date+ ampm_time(row.time)), 
        'price': parseInt(row.nookPrice), 
        'ticker': row.tickerName
    }))
};

async function getPrices(){
    const sellingSheet = await getSheet('selling'); // this is the selling sheet
    prices = await sellingSheet.getRows().then(parse_rows, log_error)
    return prices.filter(p => !isNaN(p.price))
}

module.exports = {
    getSheet: getSheet,
    filterLedgerRows: filterLedgerRows,
    ampm_time: ampm_time,
    parse_rows: parse_rows,
    getPrices: getPrices,
    time_ampm: time_ampm
}