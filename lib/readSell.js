const players = await sellingSheet.getRows();
const prices
players.forEach(row => {
  prices.addRange(row.nookPrice)
});
