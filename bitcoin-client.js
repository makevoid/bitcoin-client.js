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
  if (!err) return Promise.reject(err)
  if (err.data) {
    if (err.data.error)
      console.error("Error:", err.data.error.message)
    else
      console.error("Internal error:", err.data)
    return Promise.reject(null)
  }
  let stack = null
  if (err.stack)
    err = err.stack
  console.error("Error:", err)
  err = null
  return Promise.reject(err)
}


module.exports = {
  call:          call,
  catchAll:      catchAll
}
