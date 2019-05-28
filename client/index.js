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
                msg = msg.reverse()
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

                let lineOption = {
                    tooltip: {
                        trigger: 'axis',
                        position: function (pt) {
                            return [pt[0], '10%'];
                        }
                    },
                    title: {
                        left: 'center',
                        text: this.id === 'Lp' ? '噪声数据' : '光照数据',
                    },
                    toolbox: {
                        feature: {
                            dataZoom: {
                                yAxisIndex: 'none'
                            },
                            restore: {},
                            saveAsImage: {}
                        }
                    },
                    xAxis: {
                        type: 'category',
                        boundaryGap: false,
                        data: this.time
                    },
                    yAxis: {
                        type: 'value',
                        boundaryGap: [0, '100%']
                    },
                    dataZoom: [{
                        type: 'inside',
                        start: 0,
                        end: 10
                    }, {
                        start: 0,
                        end: 10,
                        handleIcon: 'M10.7,11.9v-1.3H9.3v1.3c-4.9,0.3-8.8,4.4-8.8,9.4c0,5,3.9,9.1,8.8,9.4v1.3h1.3v-1.3c4.9-0.3,8.8-4.4,8.8-9.4C19.5,16.3,15.6,12.2,10.7,11.9z M13.3,24.4H6.7V23h6.6V24.4z M13.3,19.6H6.7v-1.4h6.6V19.6z',
                        handleSize: '80%',
                        handleStyle: {
                            color: '#fff',
                            shadowBlur: 3,
                            shadowColor: 'rgba(0, 0, 0, 0.6)',
                            shadowOffsetX: 2,
                            shadowOffsetY: 2
                        }
                    }],
                    series: [
                        {
                            name:this.id,
                            type:'line',
                            smooth:true,
                            symbol: 'none',
                            sampling: 'average',
                            itemStyle: {
                                color: 'rgb(255, 70, 131)'
                            },
                            areaStyle: {
                                color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
                                    offset: 0,
                                    color: 'rgb(255, 158, 68)'
                                }, {
                                    offset: 1,
                                    color: 'rgb(255, 70, 131)'
                                }])
                            },
                            data: this.data
                        }
                    ]
                };
                this.chart.setOption(lineOption)

                let barOption = {
                    color: ['#E15457'],
                    tooltip : {
                        trigger: 'axis',
                        axisPointer : {            // 坐标轴指示器，坐标轴触发有效
                            type : 'shadow'        // 默认为直线，可选为：'line' | 'shadow'
                        }
                    },
                    grid: {
                        left: '3%',
                        right: '4%',
                        bottom: '3%',
                        containLabel: true
                    },
                    xAxis : [
                        {
                            type : 'category',
                            data : Object.keys(this.barData),
                            axisTick: {
                                alignWithLabel: true
                            }
                        }
                    ],
                    yAxis : [
                        {
                            type : 'value'
                        }
                    ],
                    series : [
                        {
                            name:this.title,
                            type:'bar',
                            barWidth: '60%',
                            data:Object.values(this.barData)
                        }
                    ]
                };
                
                this.bar.setOption(barOption)
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
    '15~30': 0,
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
                        barData['0.5~1'] += 1
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
    lp.socket.close()
    lum.socket.close()
    var date = $('#date').val();
    $.ajax({
        type: 'get',
        data: 'date=' + date,
        url: '/getHistoryValue',
        success(msg) {
            lum.time = msg.lumTime.map(item => {
                var time = new Date(item.time);
                return time.getHours() + '时' + time.getMinutes() + '分' + time.getSeconds() + '秒'
            });

            for (let key of Object.keys(lum.barData)) {
                lum.barData[key] = 0;
            }
            lum.data = msg.lum.map(item => {
                let luminance = item.lum;
                lumAnalyze(luminance, lum.barData)
                return luminance;
            });
            lum.chart.setOption({
                xAxis: {
                    data: lum.time,
                },
                series: [{
                    name: lum.id,
                    data: lum.data
                }]
            })
            lum.bar.setOption({
                series: {
                    name: 'lum',
                    data: Object.values(lum.barData)
                },
            })


            lp.time = msg.LpTime.map(item => {
                let time = new Date(item.time);
                return time.getHours() + '时' + time.getMinutes() + '分' + time.getSeconds() + '秒'
            });

            for (let key of Object.keys(lp.barData)) {
                lp.barData[key] = 0;
            }

            lp.data = msg.Lp.map(item => {
                var Lp = item.Lp;
                lpAnalyze(Lp, lp.barData)
                return Lp;
            });

            lp.chart.setOption({
                xAxis: {
                    data: lp.time,
                },
                series: [{
                    name: lp.id,
                    data: lp.data
                }]
            })
            lp.bar.setOption({
                series: {
                    name: 'lp',
                    data: Object.values(lp.barData)
                },
            })
        }
    })
})
