class Chart {
    constructor(id, format, ws, title, barData) {
        this.id = id;
        this.time;
        this.data;
        this.format = format;
        this.chart = echarts.init(document.getElementById(id + 'line'));
        this.bar = echarts.init(document.getElementById(id + 'bar'));
        this.title = title;
        this.barData = barData;
        this.socket = new WebSocket(ws);
    };
    //更新数据
    upDate() {
        //创建websocket连接
        const socket = this.socket;
        socket.addEventListener('open', function (event) {
            socket.send('连接到客户端')
        });
        //监听事件
        socket.addEventListener('message', (event) => {
            let newData = JSON.parse(event.data);
            let title = this.title;
            let newTime = new Date(newData.time);
            newTime = newTime.getHours() + '时' + newTime.getMinutes() + '分' + newTime.getSeconds() + 's'
            
            this.time.push(newTime);
            this.data.push(newData[this.id]);
            console.log(this.time)
            console.log(this.data)

            this.chart.setOption({
                xAxis: {
                    data: this.time
                },
                series: [{
                    name: title,
                    data: this.data
                }]
            });
            if (this.id === 'Lp') {
                lpAnalyze(newData[this.id], this.barData)
            } else {
                lumAnalyze(newData[this.id], this.barData)
            }
            this.bar.setOption({
                series: {
                    name: title,
                    data: Object.values(this.barData)
                },
            })
        });
    };
    //初始化数据
    load(url) {
        $.ajax({
            url: url,
            type: 'get',
            success: (msg) => {
                console.log(msg)
                //获取柱状图Y轴数据
                if (this.id === 'Lp') {
                    this.data = msg.map(item => {
                        var data = item[this.id];
                        lpAnalyze(data, this.barData)
                        return data;
                    });
                } else {
                    this.data = msg.map(item => {
                        var data = item[this.id];
                        lumAnalyze(data, this.barData)
                        return data;
                    });
                }
                this.time = msg.map(item => {
                    var time = new Date(item.time);
                    return time.getHours() + '时' + time.getMinutes() + '分' + time.getSeconds() + 's'
                })
                this.chart.setOption({
                    xAxis: {
                        type: "category",
                        boundaryGap: false,
                        data: this.time,
                        axisLabel: { //坐标轴刻度标签的相关设置。
                            interval: 5,
                            rotate: "45",
                        },
                    },
                    yAxis: {
                        boundaryGap: [0, '100%'],
                        type: 'value',
                        axisLabel: {
                            formatter: `{value} (${this.format})`
                        }
                    },
                    tooltip: {
                        show: true,
                        trigger: 'axis'
                    },
                    dataZoom: [{
                        type: 'slider',
                        start: 0,
                        end: 100
                    },
                    {
                        type: 'inside',
                        start: 0,
                        end: 100
                    }
                    ],
                    series: [{
                        name: this.id,
                        type: 'line',
                        smooth: true, //数据光滑过度
                        symbol: 'none', //下一个数据点
                        stack: 'a',
                        areaStyle: {
                            normal: {
                                color: 'red'
                            }
                        },
                        data: this.data
                    }],
                    grid: {
                        bottom: '30%',
                        left: '20%'
                    }
                })

                this.bar.setOption({
                    tooltip: {
                        trigger: 'item'
                    },
                    xAxis: {
                        data: Object.keys(this.barData),
                        axisLabel: {
                            interval: 0,
                            rotate: "60",
                        },
                    },
                    yAxis: {},
                    series: {
                        name: this.title,
                        type: 'bar',
                        data: Object.values(this.barData)
                    },
                    grid: {
                        bottom: '30%',
                        left: '20%'
                    }
                });
                this.upDate();
            }
        })
    }
}


const lpBar = {
    '20~30': 0,
    '30~40': 0,
    '40~50': 0,
    '50~70': 0,
    '70~90': 0,
    '90~120': 0,
}
const lp = new Chart('Lp', 'dB', 'ws://123.206.37.27:80/wsLp', '声音', lpBar);
lp.load('/lp');

const lumBar = {
    '0~0.5': 0,
    '0.5~1': 0,
    '1~3': 0,
    '3~5': 0,
    '5~10': 0,
    '10~15': 0,
    '20~30': 0,
    '30~50': 0,
    '50~75': 0,
    '75~100': 0,
    '100~150': 0,
    '150~200': 0,
    '200~300': 0,
    '300~500': 0,
    '500~750': 0,
    '750~1000': 0,
    '1000~1500': 0,
    '1500~2000': 0,
    '2000~3000': 0,
    '3000~5000': 0
}
const lum = new Chart('lum', 'lux', 'ws://123.206.37.27:80/wsLum', '亮度', lumBar)
lum.load('/lum');

function lpAnalyze(data, barData) {
    data = parseFloat(data)
    if (data < 50) {
        if (data < 40) {
            if (data < 30) {
                barData['20~30'] += 1
            } else {
                barData['30~40'] += 1
            }
        } else {
            barData['40~50'] += 1
        }
    } else {
        if (data < 90) {
            if (data < 70) {
                barData['50~70'] += 1
            } else {
                barData['70~90'] += 1
            }
        } else {
            barData['90~120'] += 1
        }
    }
}
function lumAnalyze(data, barData) {
    data = parseFloat(data)
    if (data < 100) {
        if (data < 10) {
            if (data < 3) {
                if (data < 1) {
                    if (data < 0.5) {
                        barData['0~0.5'] += 1
                    } else {
                        barData['0.5~0.1'] += 1
                    }
                } else {
                    barData['1~3'] += 1
                }
            } else {
                if (data < 5) {
                    barData['3~5'] += 1
                } else {
                    barData['5~10'] += 1
                }
            }
        } else {
            if (data < 50) {
                if (data < 30) {
                    if (data < 15) {
                        barData['10~15'] += 1
                    } else {
                        barData['15~30'] += 1
                    }
                } else {
                    barData['30~50'] += 1
                }
            } else {
                if (data < 75) {
                    barData['50~75'] += 1
                } else {
                    barData['75~100'] += 1
                }
            }
        }
    } else {
        if (data < 750) {
            if (data < 200) {
                if (data < 150) {
                    barData['100~150'] += 1
                } else {
                    barData['150~200'] += 1
                }
            } else {
                if (data < 500) {
                    if (data < 300) {
                        barData['200~300'] += 1
                    } else {
                        barData['300~500'] += 1
                    }
                } else {
                    barData['500~750'] += 1
                }
            }
        } else {
            if (data < 1500) {
                if (data < 1000) {
                    barData['750~1000'] += 1
                } else {
                    barData['1000~1500'] += 1
                }
            } else {
                if (data < 2000) {
                    barData['1500~2000'] += 1
                } else {
                    if (data < 3000) {
                        barData['2000~3000'] += 1
                    } else {
                        barData['3000~5000'] += 1
                    }
                }
            }
        }
    }
}

$('.search').on('click', function () {
    var date = $('#date').val();
    $.ajax({
        type: 'get',
        data: 'date=' + date,
        url: '/getHistoryValue',
        success(msg) {
            var luxX = msg.luxTime.map(item => {
                var time = new Date(item.time);
                return time.getHours() + '时' + time.getMinutes() + '分' + time.getSeconds() + '秒'
            });
            let barData = lux.barData
            for (let key of Object.keys(lux.barData)) {
                barData[key] = 0;
            }
            var luxY = msg.luminance.map(item => {
                var luminance = item.lum;
                luxClass(luminance, lux.barData)
                return luminance;
            });
            lux.chart.setOption({
                xAxis: {
                    data: luxX,
                    axisLabel: { //坐标轴刻度标签的相关设置。
                        interval: 100,
                        rotate: "45",
                    },
                },
                series: [{
                    name: '亮度',
                    data: luxY
                }]
            })

            lux.bar.setOption({
                series: {
                    name: 'lux',
                    data: Object.values(lux.barData)
                },
            })
            var LpX = msg.LpTime.map(item => {
                var time = new Date(item.time);
                return time.getHours() + '时' + time.getMinutes() + '分' + time.getSeconds() + '秒'
            });
            var LpY = msg.LpDB.map(item => {
                var Lp = item.Lp;
                lpClass(item, lp.barData)
                return Lp;
            });
            lp.chart.setOption({
                xAxis: {
                    data: LpX,
                    axisLabel: { //坐标轴刻度标签的相关设置。
                        interval: 100,
                        rotate: "45",
                    },
                },
                series: [{
                    name: '声音',
                    data: LpY
                }]
            })

        }
    })
})
