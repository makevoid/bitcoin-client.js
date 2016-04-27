"use strict"

let fs    = require('fs')
let axios = require('axios')

let bitcoinConf = fs.readFileSync(`${process.env.HOME}/.bitcoin/bitcoin.conf`)

let match = bitcoinConf.toString().match(/rpcpassword=(.+)/)
let password = match[1]

let host = "localhost"

let req = axios.create({
  auth: {
    username: 'bitcoin',
    password: password,
  }
})

let call = function(method, params) {

  let url = `http://${host}:8332/`

  let body = {
    jsonrpc: "1.0",
    id: "pbd-book-example",
    method: String(method),
    params: params || []
  }

  return req.post(url, JSON.stringify(body))
}

let catchAll = (err) => {
  if (err.data) {
    console.error("Error:", err.data.error.message)
    return Promise.reject(null)
  }
  if (err) {
    let stack = null
    if (stack)
      stack = err.stack
    console.error("Error:", err, stack)
    err = null
  }
  return Promise.reject(err)
}


module.exports = {
  call:          call,
  catchAll:      catchAll
}