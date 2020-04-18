// https://www.youtube.com/watch?v=UGN6EUi4Yio
// OR https://www.youtube.com/watch?v=MiPpQzW_ya0


const GoogleSpreadsheet = require('google-spreadsheet');
const { promisify } = require{ 'util'};

const creds = require('./client_secret.json');

async function accessSpreadsheet() {
    const doc = new GoogleSpreadsheet('sheetid')
}