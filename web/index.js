let connect = require('./ConnectControll')
let dataService = require('../Service/dataService')
let Events = require('events')
let event = new Events()

let client = connect.client
let socket = connect.socket
//与nodemcu建立socket连接
let time = null
socket.on('connection', (serve) => {
    serve.setEncoding('utf8')
    console.log('connection')
    socket.on('close',function(){
        console.log('close')
    })
    time = setTimeout(function(){
        socket.close()
    }, 2000)
    serve.on('data', (data) => {
        clearTimeout(time)
        console.log(data);
        data = data.split('/')
        for (let i = 0; i < data.length - 1; i++) {
            console.log(data[i])
            event.emit('transferLum', data[i]);
            event.emit('transferLp', data[i]);
            dataService.saveData(data[i])
        }
        time = setTimeout(function(){
            socket.close()
        }, 2000)
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
client.ws('/wsLp', function (ws, req) {
    ws.on('message', function (data) {
        console.log(data)
    })
    //定义事件，向客户端发送数据
    function transferLp(data) {
        //判断连接状态 防止报错
        if (ws.readyState === 3) {
            return
        } else {
            ws.send(data)
        }
    }
    event.on('transferLp', transferLp)
    ws.on('close', function () {
        event.off('transferLp', transferLp);
        console.log('close')
    })
})
client.ws('/wsLum', function (ws, req) {
    ws.on('message', function (data) {
        console.log(data);
    })
    //定义事件，向客户端发送数据
    function transferLum(data) {
        //判断连接状态 防止报错
        if (ws.readyState === 3) {
            return
        } else {
            ws.send(data);
        }
    }
    event.on('transferLum', transferLum)
    ws.on('close', function () {
        event.off('transferLum', transferLum);
        console.log('close')
    })
})

client.get('/getHistoryValue', function (req, res) {
    dataService.getHistory(req, res);
})
//客户端首次连接获取的数据
client.get('/lp', function (req, res) {
    dataService.getLp(res);
})
client.get('/lum', function (req, res) {
    dataService.getLum(res)
})
//监听端口
client.listen('80');
