module.exports = {
    name: 'report',
    description: 'Receive turnip prices from users',
    usage: '<ticker> <price> <am/pm>',
    execute(message) {
        const prefix = "!";
        if (message.content === prefix + "report") { //why do i have to put a bang here??
            console.log(prefix);
            message.react("✅");
        };
    },
};