const mysql = require('mysql');

const pool = mysql.createPool({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'detect',
  port: '3306',
  multipleStatements: true
});

function getVal(sql, res) {
  pool.getConnection((err, connection) => {
    var results = {};
    var lumTime = new Promise(function (resolve, reject) {
      connection.query(sql.lumTime, (err, result) => {
        results.lumTime = result;
        resolve()
      })
    })
    var lum = new Promise(function (resolve, reject) {
      connection.query(sql.lum, (err, result) => {
        results.lum = result;
        resolve()
      })
    })
    var LpTime = new Promise(function (resolve, reject) {
      connection.query(sql.LpTime, (err, result) => {
        results.LpTime = result;
        resolve()
      })
    })
    var Lp = new Promise(function (resolve, reject) {
      connection.query(sql.Lp, (err, result) => {
        results.Lp = result;
        resolve()
      })
    })
    Promise.all([lumTime, lum, LpTime, Lp]).then(function () {
      res.json(results)
      connection.release();
    })
  })
}

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
  getLp(res) {
    const sql = 'SELECT * FROM lp order by id desc limit 0,1000;';
    queryValue('get', sql, res)
  },
  getLum(res) {
    const sql = 'SELECT * FROM lum order by id desc limit 0,1000;';
    queryValue('get', sql, res)
  },
  getData(res) {
    const sql = 'SELECT * FROM detect order by id desc limit 0,1000;';
    queryValue('get', sql, res)
  },
  saveData(lum, lp, time) {
    const sql = `INSERT INTO detect VALUES(
      NULL,
      ${lum},
      ${lp},
      ${time}
    )`
    queryValue('save', sql)
  },
  getHistoryValue(startDate, endDate, res) {
    const sql = `SELECT * FROM detect WHERE time BETWEEN ${startDate} and ${endDate}`
    queryValue(sql, res);
  }
}
