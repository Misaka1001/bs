let connect = require('./web/ConnectControll')
let sql = require('./dao/sql.js')
let Events = require('events')
let event = new Events()

let client = connect.client
let server = connect.server

server.on('connection', (serve) => {
  serve.setEncoding('utf8')
  serve.on('data', (data) => {
    console.log(data);
    event.emit('change', data);
    sql.socketLp(data);
  })
  serve.on('close', () => {
    console.log('close')
  })
  serve.on('error', () => {
    console.log('error')
  })
})
server.listen(9000);

client.get('/date', function(req, res) {
  let time = new Date()
  let date = [time.getFullYear(),time.getMonth() + 1,time.getDate(),0,time.getHours(),time.getMinutes(),time.getSeconds(),time.getMilliseconds()]
  res.send('success')
})
//与客户端进行websocket连接
client.ws('/socketTest', function(ws, req) {
  ws.on('message', function(data) {
    console.log(data);
  })
  //定义事件，向客户端发送数据
  function change(data) {
    //判断连接状态 防止报错
    if (ws.readyState === 3) {
      return
    } else {
      ws.send(data);
    }
  }
  event.on('change', change)
  ws.on('close', function() {
    event.off('change', change);
    console.log('close')
  })
})
client.ws('/socketLux', function(ws, req) {
  ws.on('message', function(data) {
    console.log(data);
  })
  //定义事件，向客户端发送数据
  function changeLux(data) {
    //判断连接状态 防止报错
    if (ws.readyState === 3) {
      return
    } else {
      ws.send(data);
    }
  }
  event.on('changeLux', changeLux)
  ws.on('close', function() {
    event.off('changeLux', changeLux);
    console.log('close')
  })
})

client.get('/getHistoryValue', function(req, res) {
  sql.getHistoryValue(req, res);
})
//客户端首次连接获取的数据
client.get('/data', function(req, res) {
  sql.getLp(req, res);
})
client.get('/lux', function(req, res) {
  sql.getLux(req, res)
})
//监听端口
client.listen('8082');
