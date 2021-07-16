const express = require('express')
require('dotenv').config()
const DB = require('./db')
const cors = require('cors')

const app = express()
const port = 4000

DB.connect()


app.use(cors({maxAge: 2592000}))

app.get('/client/:id', async (req, res) => {
    const saleId = req.params.id
    const resultSet = await DB.querySalesByClient(saleId)
    console.log('Queried ' + resultSet.length + ' rows')
    res.status(200).send(resultSet)
})

app.get('/product/:id', async (req, res) => {
    const saleId = req.params.id
    const resultSet = await DB.querySalesByProduct(saleId)
    console.log('Queried ' + resultSet.length + ' rows')
    res.status(200).send(resultSet)
})

app.get('/product', async (req, res) => {
    const resultSet = await DB.queryAllProducts()
    console.log('Queried ' + resultSet.length + ' rows')
    res.status(200).send(resultSet)
})

app.get('/provider/:id', async (req, res) => {
    const saleId = req.params.id
    const resultSet = await DB.querySalesByProvider(saleId)
    console.log('Queried ' + resultSet.length + ' rows')
    res.status(200).send(resultSet)
})

app.get('/sale/:id', async (req, res) => {
    const saleId = req.params.id
    const resultSet = await DB.querySalesDetail(saleId)
    console.log('Queried ' + resultSet.length + ' rows')
    res.status(200).send(resultSet)
})

app.listen(port, () => {
    console.log('Listening on port ' + port)
})

process.on('exit', () => {
    console.log('Shutting down server, disconnecting from DB')
    DB.disconnect()
})