const express = require('express')
const app = express()
const cors = require('cors');

require('./db/mongoose')


const userRoute = require('./routes/userRoute')


app.use(cors())
app.use(express.json())
app.use(express.urlencoded())
app.use(express.static('uploads'));
app.use(userRoute)

module.exports = app