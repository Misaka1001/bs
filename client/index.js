class Chart {
  constructor(lineId, barId, ws, title, propX, propY) {
    this.X;
    this.Y;
    this.format = lineId;
    this.propX = propX;
    this.propY = propY;
    this.chart = echarts.init(document.getElementById(lineId));
    this.bar = echarts.init(document.getElementById(barId));
    this.ws = ws;
    this.title = title;
    this.barData = null;
  };
  //更新数据
  upDate() {
    //创建websocket连接
    var socket = new WebSocket(this.ws);
    socket.addEventListener('open', function(event) {
      socket.send('连接到客户端')
    });
    //监听事件
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
        xAxis: {
          data: X
        },
        series: [{
          name: title,
          data: Y
        }]
      });
      if (this.propY === 'Lp') {
        lpClass(data[this.propY],this.barData)
      } else {
        luxClass(data[this.propY],this.barData)
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
        msg = msg.reverse();
        //获取柱状图Y轴数据
        if (this.propY === 'Lp') {
          this.barData = {
            '20~30': 0,
            '30~40': 0,
            '40~50': 0,
            '50~70': 0,
            '70~90': 0,
            '90~120': 0,
          }
          let barData = this.barData;
          this.Y = msg.map(item => {
            var temp = item[this.propY];
            lpClass(temp,barData)
            return temp;
          });
        } else {
          this.barData = {
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
          let barData = this.barData
          this.Y = msg.map(item => {
            var temp = item[this.propY];
            luxClass(temp,barData)
            return temp;
          });
        }
        this.X = msg.map(item => {
          var time = new Date(item[this.propX]);
          return time.getHours() + '时' + time.getMinutes() + '分' + time.getSeconds() + 's'
        })
        this.chart.setOption({
          xAxis: {
            type: "category",
            boundaryGap: false,
            data: this.X,
            axisLabel: { //坐标轴刻度标签的相关设置。
              interval: 5,
              rotate: "45",
            },
          },
          yAxis: {
            boundaryGap: [0, '100%'],
            type: 'value',
            axisLabel:{
              formatter:`{value} (${this.format})`
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

        this.bar.setOption({
          tooltip: {
            trigger: 'item'
          },
          xAxis: {
            data: Object.keys(this.barData),
            axisLabel: {
              interval:0,
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
var lp = new Chart('db', 'dbbar', 'ws://123.206.37.27:80/socketTest', '声音', 'time', 'Lp');
lp.load('/data');

var lux = new Chart('lux', 'luxbar', 'ws://123.206.37.27:80/socketLux', '亮度', 'time', 'luminance')
lux.load('/lux');

function lpClass(temp,barData){
  if (temp < 50) {
    if (temp < 40) {
      if (temp < 30) {
        barData['20~30'] += 1
      } else {
        barData['30~40'] += 1
      }
    } else {
      barData['40~50'] += 1
    }
  } else {
    if (temp < 90) {
      if (temp < 70) {
        barData['50~70'] += 1
      } else {
        barData['70~90'] += 1
      }
    } else {
      barData['90~120'] += 1
    }
  }
}
function luxClass(temp,barData){
  temp = parseFloat(temp)
  if (temp < 100) {
    if (temp < 10) {
      if (temp < 3) {
        if (temp < 1) {
          if (temp < 0.5) {
            barData['0~0.5'] += 1
          } else {
            barData['0.5~0.1'] += 1
          }
        } else {
          barData['1~3'] += 1
        }
      } else {
        if (temp < 5) {
          barData['3~5'] += 1
        } else {
          barData['5~10'] += 1
        }
      }
    } else {
      if (temp < 50) {
        if (temp < 30) {
          if (temp < 15) {
            barData['10~15'] += 1
          } else {
            barData['15~30'] += 1
          }
        } else {
          barData['30~50'] += 1
        }
      } else {
        if (temp < 75) {
          barData['50~75'] += 1
        } else {
          barData['75~100'] += 1
        }
      }
    }
  } else {
    if (temp < 750) {
      if (temp < 200) {
        if (temp < 150) {
          barData['100~150'] += 1
        } else {
          barData['150~200'] += 1
        }
      } else {
        if (temp < 500) {
          if (temp < 300) {
            barData['200~300'] += 1
          } else {
            barData['300~500'] += 1
          }
        } else {
          barData['500~750'] += 1
        }
      }
    } else {
      if (temp < 1500) {
        if (temp < 1000) {
          barData['750~1000'] += 1
        } else {
          barData['1000~1500'] += 1
        }
      } else {
        if (temp < 2000) {
          barData['1500~2000'] += 1
        } else {
          if (temp < 3000) {
            barData['2000~3000'] += 1
          } else {
            barData['3000~5000'] += 1
          }
        }
      }
    }
  }
}

$('.search').on('click', function() {
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
      for(let key of Object.keys(lux.barData)){
        barData[key] = 0;
      }
      var luxY = msg.luminance.map(item => {
        var luminance = item.luminance;
        luxClass(luminance,lux.barData)
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
        lpClass(item,lp.barData)
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
