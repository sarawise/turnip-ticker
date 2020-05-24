
const gSheet = require('../lib/gSheet.js')
const canvasModule = require('canvas')
const Discord = require('discord.js');
const D3Node = require('d3-node')
const d3 = require('d3')

module.exports = {
    name: 'charts',
    cooldown: 3,
    description: 'Chart this week\'s prices. Optional list of tickers to filter by, and start date',
    usage: '[TICK] <since>',
    async execute(message) {     
        let tickList = []
        let since = undefined
        let [, ...optional] = message.content.split(' ');
        if (optional.length){
            since = optional[optional.length - 1]
            tickList = optional.slice(0, optional.length)
            if (Date.parse(since)){
                since = new Date(since)
                tickList.pop()
            }
            else since = undefined
        }
        const width = 1920
        const height = 1280
        tickSize = 16
        margin = {top: 40, right: 100, bottom: 60, left: 100}
        const d3n = new D3Node({ canvasModule })      // initializes D3 with container element
        let canvas = d3n.createCanvas(width, height) // create SVG w/ 'g' tag and width/height
        let ctxt = canvas.getContext('2d')
        ctxt.fillStyle = "#23272A"
        ctxt.fillRect(0,0,canvas.width,canvas.height)
        ctxt.font = "bold 20px sans-serif";

        const w = canvas.width - margin.left - margin.right
        const h = canvas.height - margin.top - margin.bottom

        const now = new Date();
        const today = new Date(now.toDateString());
        // Bump Sunday to day 7, so it will show historical prices of the week
        const days_since_monday = (today.getDay() || 7) - 1
        let start_of_week = new Date(today-days_since_monday*24*3_600_000)
        since = since || start_of_week
        let prices = await gSheet.getPrices()
        prices = prices.filter(p => p.time >= since)
        if (tickList.length){
            prices = prices.filter(p => tickList.includes(p.ticker))
        }
    
    
        ctxt.translate(margin.left, margin.top)

        // https://bl.ocks.org/mbostock/1550e57e12e73b86ad9e
        var x = d3.scaleTime().range([0, w]),
        y = d3.scaleLinear().range([h, 0]),
        z = d3.scaleOrdinal(d3.schemeCategory10);
        var line = d3.line()
                .curve(d3.curveLinear)
                .x(function(d) { return x(d.time); })
                .y(function(d) { return y(d.price); })
                .context(ctxt);
        var dot = function(d) {
            ctxt.beginPath()
            ctxt.arc(x(d.time), y(d.price), 3, 0, 2 * Math.PI)
            ctxt.fill()

        }
        x.domain(d3.extent(prices, p => p.time))
        y.domain(d3.extent(prices, p => +p.price))

        // Generate x axis
        let xTicks = x.ticks(d3.timeDay)
        let tickFormat = x.tickFormat(xTicks.length,d3.timeFormat("%m/%d"));
        
        ctxt.beginPath()
        xTicks.forEach( t =>{
            ctxt.moveTo(x(t), h)
            ctxt.lineTo(x(t), h + tickSize)
        })
        ctxt.strokeStyle = "white"
        ctxt.stroke()

        ctxt.textAlign = "center"
        ctxt.textBaseline = "top"
        ctxt.fillStyle = "white"
        xTicks.forEach( t => ctxt.fillText(tickFormat(t), x(t), h + tickSize))

        // Generate y axis
        let tickPadding = 3,
            tickCount = 5
        yTicks = y.ticks(tickCount)
        tickFormat = y.tickFormat(tickCount)

        ctxt.beginPath()
        yTicks.forEach( t => {
            ctxt.moveTo(0, y(t))
            ctxt.lineTo(-6, y(t))
        })
        ctxt.strokeStyle = "white"
        ctxt.stroke()

        ctxt.beginPath()
        ctxt.moveTo(-tickSize, 0)
        ctxt.lineTo( 0.5, 0)
        ctxt.lineTo(0.5, h)
        ctxt.lineTo(-tickSize, h)
        ctxt.strokeStyle = "white"
        ctxt.stroke()

        ctxt.textAlign = "right"
        ctxt.textBaseline = "middle"
        ctxt.fillStyle = "white"
        yTicks.forEach( t => {
            if (t !== undefined)
                ctxt.fillText(tickFormat(t), -tickSize - tickPadding, y(t))
        })
        
        ctxt.save();
        // ctxt.rotate(-Math.PI / 2);
        ctxt.textAlign = "right";
        ctxt.textBaseline = "top";
        ctxt.fillText("Nook price", 110, 0);
        ctxt.restore();

        var tickers = prices.reduce((m, p) => {
            if (m[p.ticker] != undefined)
                m[p.ticker].push(p)
            else
                m[p.ticker] = [p]
            return m;
        }, new Map());

        z.domain(tickers.keys())

        for (let tick in tickers){
            // Filter early exit
            if (tickList.length > 0 && !tickList.includes(tick)){
                continue
            }

            // Draw the line
            ctxt.beginPath();
            line(tickers[tick]);
            ctxt.lineWidth = 5;
            ctxt.strokeStyle = z(tick);
            ctxt.stroke();

            // Draw dots
            ctxt.fillStyle = z(tick);
            tickers[tick].forEach((d,) => dot(d))
        
            // Draw the label
            ctxt.textAlign = "right"
            ctxt.textBaseline = "middle"
            let len = tickers[tick].length
            let last = tickers[tick][len-1]
            ctxt.fillText(tick, x(last.time)+tickSize*5, y(last.price))
            ctxt.fill()
        }
        
        attach = new Discord.MessageAttachment(canvas.toBuffer(), 'chart.png');
        message.channel.send(`This week's prices`, attach)
    },
};