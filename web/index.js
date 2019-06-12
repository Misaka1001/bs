let connect = require('./ConnectControll')
let dataService = require('../Service/dataService')
let Events = require('events')
let event = new Events()

let client = connect.client
let socket = connect.socket
//与nodemcu建立socket连接
socket.on('connection', (serve) => {
    serve.setEncoding('utf8')
    console.log('connection')
    let time = null
    serve.on('data', (data) => {
        if(data.length > 10){
            clearTimeout(time)
            time = setTimeout(function(){
                serve.destroy()
            }, 5000)
        }
        data = data.split('/')
        for (let i = 0; i < data.length - 1; i++) {
            console.log('received:' + data[i])
            event.emit('transferData', data[i]);
            dataService.saveData(data[i])
        }
    })
    serve.on('end', () => {
        console.log('end')
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

client.ws('/wsData', function(ws, req){
    ws.on('message', function(data){
        console.log(data)
    })
    function transferData(data) {
        //判断连接状态 防止报错
        if (ws.readyState === 3) {
            return
        } else {
            ws.send(data)
        }
    }
    event.on('transferData', transferData)
    ws.on('close', function () {
        event.off('transferData', transferData);
        console.log('close')
    })
})

client.get('/getHistoryValue', function (req, res) {
    dataService.getHistory(req, res);
})
//客户端首次连接获取的数据
client.get('/data',function (req, res) {
    dataService.getData(res)
})
//监听端口
client.listen('80');
