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
    const date = req.query.date
    const startDate = new Date(date.split('-').join('/') + ' 00:00:00').getTime()
    const endDate = startDate + 86400000
    sql.getHistoryValue(startDate, endDate, res)
  },
  saveData(data) {
    const result = JSON.parse(data)
    sql.saveData(result.lum, result.Lp, result.time)
  },
  saveLum(data) {
    const result = JSON.parse(data)
    sql.saveLum(result.lum, result.time)
  },
  saveLp(data) {
    const result = JSON.parse(data);
    sql.saveLp(result.Lp, result.time)
  },
  getLp(res) {
    sql.getLp(res)
  },
  getLum(res) {
    sql.getLum(res)
  }
}
