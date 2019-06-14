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
    const endDate = +startDate + 3600000
    sql.getHistoryValue(startDate, endDate, res)
  },
  saveData(data) {
    let result
    try{
      result = JSON.parse(data)
      sql.saveData(result['device_id'], result.lum, result.Lp, result.time)
    }catch(e){
      console.log(data)
      console.log(e.message)
    }
  },
  getData(res) {
    sql.getData(res)
  }
}
