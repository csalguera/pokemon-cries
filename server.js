const express = require('express')
const app = express()
portNum = 3000

app.use('/', (req, res) => {
  res.send('Hello World!')
})

app.listen(portNum, () => {
  console.log(`Listening on port ${portNum}.`);
})