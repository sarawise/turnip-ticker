const {  GoogleSpreadsheet } = require('google-spreadsheet');
const creds = require('../client_secret.json');

module.exports = {
	name: 'turnip',
	description: 'Fetch a random turnip gif.',

	execute(message) {
		async function accessSpreadsheet() {
			const doc = new GoogleSpreadsheet('1q2AlvVoTMQI5LtvxFeeqM_2x1qwKB60c9Im-wGpSwoY'); // gets sheet using sheet id from url 
			console.log("Spreadsheet accessed")
			const gifSheet = doc.sheetsByIndex[3];
			const rows = await gifSheet.getRows(); // can pass in { limit, offset }
			console.log(rows);
			await doc.useServiceAccountAuth(creds);

			await doc.getInfo(); // loads document properties and worksheets

			message.channel.send(`Server name: ${message.guild.name}\nTotal members: ${message.guild.memberCount}`);
		}
		accessSpreadsheet();
	}
};