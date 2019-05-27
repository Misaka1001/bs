const mysql = require('mysql');

const pool = mysql.createPool({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'detection',
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
  saveLp(Lp, time) {
    const sql = `INSERT INTO Lp VALUES(
            NULL,
            ${Lp},
            ${time}
        )`
    queryValue('save', sql);
  },
  saveLum(lum, result) {
    const sql = `INSERT INTO Lum VALUES(
            NULL,
            ${lum},
            ${result}
        )`
    queryValue('save', sql);
  },
  saveData(lum, Lp, time) {
    const sql1 = `INSERT INTO Lp VALUES(
      NULL,
      ${Lp},
      ${time}
    )`
    const sql2 = `INSERT INTO lum VALUES(
      NULL,
      ${lum},
      ${time}
    )`
    console.log(lum,Lp,time)
    queryValue('save', sql1)
    queryValue('save', sql2)
  },
  getHistoryValue(startDate, endDate, res) {
    const sql = {
      luxTime: `SELECT time FROM lum WHERE time BETWEEN ${startDate} and ${endDate}`,
      lum: `SELECT luminance FROM lum WHERE time BETWEEN ${startDate} and ${endDate}`,
      LpTime: `SELECT time FROM Lp WHERE time BETWEEN ${startDate} and ${endDate}`,
      Lp: `SELECT Lp FROM Lp WHERE time BETWEEN ${startDate} and ${endDate}`
    }
    getVal(sql, res);
  }
}
