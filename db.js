const { Pool } = require('pg')

let pool = {}

async function connect () {
  pool = new Pool({
    user: 'postgres',
    host: process.env.DBHOST,
    database: process.env.DATABASE,
    password: process.env.PASSWORD,
    port: 5432
  })
  try {
    const res = await pool.query('SELECT NOW()')
    return res
  } catch (err) {
    console.error(err)
  }
}

async function querySalesByClient (clientId) {
  const text = 'select s.id, c."name" as "clientName", p."name" as "productName", s."amount", s."date", p."price", p2."name" as "provider" from sales s, products p, clients c, providers p2 where s.client_id = $1 and s.client_id = c.id and s.product_id = p.id and p.provider_id = p2.id'
  const values = [ clientId ]
  const res = await pool.query(text, values)
  return res.rows
}

async function querySalesByProvider (providerId) {
  const text = 'select s.id, p2."name" as "providerName", p."name" as "productName", s."amount", s."date", p.price, c."name" as "clientName" from sales s, products p, clients c, providers p2 where p2.id = $1 and s.client_id = c.id and s.product_id = p.id and p.provider_id = p2.id '
  const values = [ providerId ]
  const res = await pool.query(text, values)
  return res.rows
}

async function querySalesByProduct (productId) {
  const text = 'select s.id, p."name" as "productName", p2."name" as "providerName", s."amount", s."date", c."name" as "clientName", p."price" from sales s, products p, clients c, providers p2 where p.id = $1 and s.client_id = c.id and s.product_id = p.id and p.provider_id = p2.id'
  const values = [ productId ]
  const res = await pool.query(text, values)
  return res.rows
}

async function querySalesDetail (saleId) {
  const text = 'select s.id, s."date", s.amount, c."name" as "clientName", c.username, p."name" as "productName", p.price, p.reference from sales s, clients c, products p where s.id = $1 and c.id = s.client_id and p.id = s.product_id '
  const values = [ saleId ]
  const res = await pool.query(text, values)
  return res.rows
}

async function queryAllProducts() {
  const text = 'select p.id, p.name, p.price, p.reference from products p'
  const res = await pool.query(text)
  return res.rows
}

function disconnect () {
  pool.end().then(() => {
    console.log('Pool has ended')
  })
}

module.exports = {
  connect,
  disconnect,
  querySalesByClient,
  querySalesByProvider,
  querySalesByProduct,
  querySalesDetail,
  queryAllProducts
}
