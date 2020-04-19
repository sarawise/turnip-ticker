module.exports = {
    name: 'report',
    description: 'Receive turnip prices from users',
    usage: '<ticker> <price> <am/pm>',
    execute(message) {
        const prefix = "!";
        if (message.content === prefix + "report") { 
            // TODO: accept content matching usage as written above
                // then call google spreadsheet fuction (to be written)
                    // then react on completion
            console.log("This is not the prefix: " + prefix);
            message.react("✅");
        };
    },
};