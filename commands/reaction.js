const gSheet = require('../lib/gSheet.js')

_fetch_time = null
_ttl = 300 // 5 minute cache
_reax_cache = null

async function get_reactions(){
    // Doing this a bit weird so it will eval to true when _fetch_time is null
    if (Date.now() - _ttl > _fetch_time){
        const reax_sheet = await gSheet.getSheet('reactions')
        _reax_cache = reax_sheet.getRows().then(rows => rows, error => console.log(error))
        _fetch_time = Date.now()
    }
    return _reax_cache
}

async function react(price){
    all_reax = await get_reactions().then(rows => rows, error => console.log(error))
    relevant_reax = all_reax.filter(r => r.min<= price && price <= r.max)
    if (relevant_reax.length == 0){
        return null
    }
    return relevant_reax[Math.floor(Math.random()*relevant_reax.length)].link
}

module.exports = {
    name: 'react',
    cooldown: 3,
    description: 'Send a reaction to a price',
    usage: '<price>',
    react: react,
    async execute(message) {
        [, price] = message.content.split(' ');
        reaction = await react(parseInt(price))
        if (reaction != null){
            message.channel.send(reaction)
        }
    },
};