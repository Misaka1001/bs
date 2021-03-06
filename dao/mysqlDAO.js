const mysql = require('mysql');
const pool = mysql.createPool({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'detect',
  port: '3306',
  multipleStatements: true
});

function queryValue(flag, sql, res) {
  pool.getConnection((err, connection) => {
    connection.query(sql, (err, result) => {
      if (flag === 'get') {
        res.json(result);
      }
    })
    connection.release();
  })
}

module.exports = {
  getData(res) {
    let now = new Date()
    let hour = now.getHours()+':00:00'
    let time = now.toString().split(' ')
    time[4] = hour
    now = new Date(time.join(' ')).getTime()
    const sql = `SELECT * FROM detect WHERE time BETWEEN ${now} and ${now + 3600000}`
    queryValue('get', sql, res)
  },
  saveData(deviceId, lum, lp, time) {
    const sql = `INSERT INTO detect VALUES(
      NULL,
      '${deviceId}',
      ${lum},
      ${lp},
      ${time}
    )`
    queryValue('save', sql)
  },
  getHistoryValue(startDate, endDate, res) {
    const sql = `SELECT * FROM detect WHERE time BETWEEN ${startDate} and ${endDate}`
    queryValue('get', sql, res);
  }
}
