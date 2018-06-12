const express = require('express')
const rpio = require('rpio')
const app = express()

rpio.open(36, rpio.OUTPUT, rpio.HIGH)


app.get('/', (req, res) => {

})

app.get('/api/blink/')

app.listen(8900, () => console.log('server running at port 8900!'))