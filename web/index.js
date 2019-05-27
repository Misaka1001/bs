let connect = require('./ConnectControll')
let dataService = require('../Service/dataService')
let Events = require('events')
let event = new Events()

let client = connect.client
let socket = connect.socket
//与ESP8266建立socket连接
socket.on('connection', (serve) => {
    serve.setEncoding('utf8')
    serve.on('data', (data) => {
        console.log(data);
        data = data.split('/')
        for (let i = 0; i < data.length - 1; i++) {
            event.emit('changeLux', data[i]);
            //   dataService.saveLum(data[i]);
            //   dataService.saveLp(data[i])
            dataService.saveData(data[i])
        }
    })
    serve.on('close', () => {
        console.log('close')
    })
    serve.on('error', () => {
        console.log('error')
    })
})
socket.listen(9000);

//初始化硬件时间
client.get('/date', function (req, res) {
    data = dataService.getTime()
    res.send(data)
})

//与客户端进行websocket连接
client.ws('/socketTest', function (ws, req) {
    ws.on('message', function (data) {
        console.log(data)
    })
    //定义事件，向客户端发送数据
    function change(data) {
        //判断连接状态 防止报错
        if (ws.readyState === 3) {
            return
        } else {
            ws.send(data)
        }
    }
    event.on('change', change)
    ws.on('close', function () {
        event.off('change', change);
        console.log('close')
    })
})
client.ws('/socketLux', function (ws, req) {
    ws.on('message', function (data) {
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
    ws.on('close', function () {
        event.off('changeLux', changeLux);
        console.log('close')
    })
})

client.get('/getHistoryValue', function (req, res) {
    dataService.getHistory(req,res);
})
//客户端首次连接获取的数据
client.get('/data', function (req, res) {
    dataService.getLp(res);
})
client.get('/lux', function (req, res) {
    dataService.getLum(res)
})
//监听端口
client.listen('80');
