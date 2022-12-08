const express = require('express')
const app = express()

app.use(express.urlencoded({ extended: true }));
app.use(
    express.json({})
)
app.use(
    express.urlencoded({})
)

// Router
app.use('/api/image', require('./routes/image'))

module.exports = app