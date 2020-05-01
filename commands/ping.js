module.exports = {
    name: 'ping',
    cooldown: 5,
    description: 'Ping! A quick way to test the bot status',
    execute(message) {
        message.channel.send('Pong.');
    },
};