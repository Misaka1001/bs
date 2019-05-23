let express = require('express');
let ws = require('express-ws');
let router = express.Router();
let bodyparser = require('body-parser');
let client = new express();

client.use(express.static('./client'));
client.use(bodyparser.urlencoded({ extended: true }));
client.use(bodyparser.json())
ws(client);

let net = require('net')
let socket = net.createServer()

module.exports = {
    client,
    socket
};
