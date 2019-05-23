class Chart {
    constructor(lineId, pieId, ws, title, propX, propY) {
        this.X;
        this.Y;
        this.propX = propX;
        this.propY = propY;
        this.chart = echarts.init(document.getElementById(lineId));
        this.pie = echarts.init(document.getElementById(pieId));
        this.ws = ws;
        this.title = title;
    };
    upDate() {
        var socket = new WebSocket(this.ws);
        socket.addEventListener('open', function (event) {
            console.log('socket is open')
            socket.send('连接到客户端')
        });
        socket.addEventListener('message', (event) => {
            let data = JSON.parse(event.data);
            let X = this.X;
            let Y = this.Y;
            let title = this.title;
            let time = new Date(data[this.propX]);
            time = time.getHours() + '时' + time.getMinutes() + '分' + time.getSeconds() + 's'
            X.push(time);
            X.shift();
            Y.push(data[this.propY]);
            Y.shift();
            this.chart.setOption({
                // title: {
                //     text: title + data[this.propY]
                // },
                xAxis: {
                    data: X
                },
                series: [{
                    name: title,
                    data: Y
                }]
            });
        });
    };
    load(url) {
        $.ajax({
            url: url,
            type: 'get',
            success: (msg) => {
                var lower = 0;
                var normal = 0;
                var large = 0;
                msg = msg.reverse();

                let name = {}
                if (this.propY === 'Lp') {
                    name = {
                        lower : '0~45分贝',
                        normal : '45~50分贝',
                        large : '50分贝以上'
                    }
                    this.Y = msg.map(item => {
                        var temp = item[this.propY];
                        if (temp < 45) {
                            lower++;
                        } else if (temp >= 45 && temp < 50) {
                            normal++;
                        } else {
                            large++;
                        }
                        return temp;
                    });
                } else {
                    name = {
                        lower : '0~120lux',
                        normal : '120~130lux',
                        large :　'130lux+'
                    }
                    this.Y = msg.map(item => {
                        var temp = item[this.propY];
                        if (temp < 120) {
                            lower++;
                        } else if (temp >= 120 && temp < 130) {
                            normal++;
                        } else {
                            large++;
                        }
                        return temp;
                    });
                }
                console.log(lower,normal,large)
                this.X = msg.map(item => {
                    var time = new Date(item[this.propX]);
                    return time.getHours() + '时' + time.getMinutes() + '分' + time.getSeconds() + 's'

                })
                this.chart.setOption({
                    // title: {
                    //     text: this.title
                    // },
                    xAxis: {
                        type: "category",
                        boundaryGap: false,
                        data: this.X,
                        axisLabel: {//坐标轴刻度标签的相关设置。
                            interval: 5,
                            rotate: "45",
                        },
                    },
                    yAxis: {
                        boundaryGap: [0, '100%'],
                        type: 'value'
                    },
                    tooltip: {
                        show: true,
                        //坐标轴触发，主要用于柱状图，折线图等
                        trigger: 'axis'
                    },
                    dataZoom: [
                        {
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
                        name: this.propY,
                        type: 'line',
                        smooth: true, //数据光滑过度
                        symbol: 'none', //下一个数据点
                        stack: 'a',
                        areaStyle: {
                            normal: {
                                color: 'red'
                            }
                        },
                        data: this.Y
                    }],
                    grid: {
                        bottom: '30%',
                        left: '20%'
                    }
                })

                this.pie.setOption({
                    series: {
                        type: 'pie',
                        data: [
                            { name: name.lower, value: lower },
                            { name: name.normal, value: normal },
                            { name: name.large, value: large }
                        ]
                    },
                    tooltip : {
                        trigger: 'item'

                    }
                });
                console.log(this.X, this.Y)
                this.upDate();
            }
        })
    }
}
var lp = new Chart('db', 'dbpie', 'ws://localhost:8082/socketTest', '声音', 'time', 'Lp');
lp.load('/data');

var lux = new Chart('lux', 'luxpie', 'ws://localhost:8082/socketLux', '亮度', 'time', 'luminance')
lux.load('/lux');

$('.search').on('click', function () {
    var date = $('#date').val();
    $.ajax({
        type: 'get',
        data: 'date=' + date,
        url: '/getHistoryValue',
        success(msg) {
            var lower = 0;
            var normal = 0;
            var large = 0;
            var luxX = msg.luxTime.map(item => {
                var time = new Date(item.time);
                return time.getHours() + '时' + time.getMinutes() + '分' + time.getSeconds() + '秒'
            });
            var luxY = msg.luminance.map(item => {
                var luminance = item.luminance;
                if (luminance < 120) {
                    lower++;
                } else if (luminance >= 120 && luminance < 130) {
                    normal++;
                } else {
                    large++;
                }
                return luminance;
            });

            lux.chart.setOption({
                xAxis: {
                    data: luxX,
                    axisLabel: {//坐标轴刻度标签的相关设置。
                        interval: 100,
                        rotate: "45",
                    },
                },
                series: [{
                    name: '亮度',
                    data: luxY
                }]
            })

            lux.pie.setOption({
                series: {
                    type: 'pie',
                    data: [
                        { name: '0~120lux', value: lower },
                        { name: '120~130lux', value: normal },
                        { name: '130lux+', value: large }
                    ]
                },
                tooltip : {
                    trigger: 'item'

                }
            });

            lower = 0;
            normal = 0;
            large = 0;
            var LpX = msg.LpTime.map(item => {
                var time = new Date(item.time);
                return time.getHours() + '时' + time.getMinutes() + '分' + time.getSeconds() + '秒'
            });
            var LpY = msg.LpDB.map(item => {
                var Lp = item.Lp;
                if (Lp < 45) {
                    lower++;
                } else if (Lp >= 45 && Lp < 50) {
                    normal++;
                } else {
                    large++;
                }
                return Lp;
            });
            console.log(lower, normal, large)
            lp.chart.setOption({
                xAxis: {
                    data: LpX,
                    axisLabel: {//坐标轴刻度标签的相关设置。
                        interval: 100,
                        rotate: "45",
                    },
                },
                series: [{
                    name: '声音',
                    data: LpY
                }]
            })

            lp.pie.setOption({
                series: {
                    type: 'pie',
                    data: [
                        { name: '0~45分贝', value: lower },
                        { name: '45~50分贝', value: normal },
                        { name: '50分贝以上', value: large }
                    ]
                },
                tooltip : {
                    trigger: 'item'

                }
            });
        }
    })
})