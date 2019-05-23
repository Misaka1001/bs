// 1 引入模块
const net = require('net');
const server = net.createServer();
server.on('connection', (person) => {
    person.setEncoding('utf8');
    // 客户socket进程绑定事件
    person.on('data', (data) => {
        console.log(data);

    })
    person.on('close', () => {
        console.log('close')
    })
    person.on('error', () => {
        console.log('error')
    })
})
server.listen(9000);