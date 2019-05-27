require('dotenv').config()
const express = require('express')
const morgan = require('morgan')
const cors = require('cors')
const path = require('path')

const app = express()

app.use(cors())
app.use(express.json())
app.use(morgan('dev'))

app.use(
    "/files",
    express.static(path.resolve(__dirname, "..", "tmp", "uploads"))
);

require('./app/users')(app)
require('./app/auth')(app)

app.listen(3000)
