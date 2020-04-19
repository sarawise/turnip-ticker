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

  const sellingSheet = doc.sheetsByIndex[1]; // this is the selling sheet
  console.log("Sheet title: " + sellingSheet.title);
  console.log("Row count " + sellingSheet.rowCount);

  // const rows = await promisify(sheet.getRows )

}

accessSpreadsheet();