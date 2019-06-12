let sql = require('../dao/mysqlDAO.js')

module.exports = {
  getTime() {
    let time = new Date()
    let date = [
      time.getFullYear(),
      time.getMonth() + 1,
      time.getDate(),
      0,
      time.getHours(),
      time.getMinutes(),
      time.getSeconds(),
      time.getMilliseconds()
    ]
    return date
  },
  getHistory(req, res) {
    const startDate = req.query.date
    console.log(req)
    console.log(startDate)
    const endDate = +startDate + 86400000
    console.log(endDate)
    sql.getHistoryValue(startDate, endDate, res)
  },
  saveData(data) {
    let result
    try{
      result = JSON.parse(data)
    }catch(e){
      console.log(data)
      console.log(e.message)
    }
    sql.saveData(result.lum, result.Lp, result.time)
  },
  getData(res) {
    sql.getData(res)
  }
}
