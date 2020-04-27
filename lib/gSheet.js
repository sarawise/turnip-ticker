const {  GoogleSpreadsheet } = require('google-spreadsheet');
const creds = require('../client_secret.json');

async function getSheet(sheetName){
    console.log("Spreadsheet accessed")
    const doc = new GoogleSpreadsheet('1q2AlvVoTMQI5LtvxFeeqM_2x1qwKB60c9Im-wGpSwoY'); // gets sheet using sheet id from url 

    await doc.useServiceAccountAuth(creds);

    await doc.getInfo(); // loads document properties and worksheets

    return doc.sheetsByIndex.find( sheet => sheet.title == sheetName)
}


module.exports = {
    name: 'best-price',
    description: 'Return the best price from today and this week.',
    getSheet: getSheet,
}