const { GoogleSpreadsheet } = require('google-spreadsheet');
const creds = require('../client_secret.json');

// spreadsheet key is the long id in the sheets URL
const doc = new GoogleSpreadsheet('1q2AlvVoTMQI5LtvxFeeqM_2x1qwKB60c9Im-wGpSwoY');

async function accessSpreadsheet() {
  await doc.useServiceAccountAuth({
    client_email: creds.client_email,
    private_key: creds.private_key,
  });

  await doc.loadInfo(); // loads document properties and worksheets
  console.log(doc.title);

  const sheet = doc.sheetsByIndex[0]; // or use doc.sheetsById[id]
  console.log(sheet.title);
  console.log(sheet.rowCount);

}

accessSpreadsheet();