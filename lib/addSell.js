const Discord = require('discord.js');
const { GoogleSpreadsheet } = require('google-spreadsheet');
const creds = require('../client_secret.json');

async function accessSpreadsheet() {
  const doc = new GoogleSpreadsheet('1q2AlvVoTMQI5LtvxFeeqM_2x1qwKB60c9Im-wGpSwoY'); // gets sheet using sheet id from url 

  await doc.useServiceAccountAuth(creds);

  await doc.getInfo(); // loads document properties and worksheets

  const today = new Date();
  const date = (today.getMonth() + 1) + '/' + today.getDate() + '/' + today.getFullYear();
  console.log(date);
  const sellingSheet = doc.sheetsByIndex[1]; // this is the selling sheet
  // append rows
  const addRow = sellingSheet.addRow({
    userName: 'Test user', //discord.js -> message.author.username should work here
    tickerName: 'TEST', // how do ??
    nookPrice: '100', //user input
    date: date, // needs to record the current date
    time: 'PM' // user input
  });

}

accessSpreadsheet();