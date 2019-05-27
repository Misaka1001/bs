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
    var luxTime = new Promise(function (resolve, reject) {
      connection.query(sql.luxTime, (err, result) => {
        results.luxTime = result;
        resolve()
      })
    })
    var luminance = new Promise(function (resolve, reject) {
      connection.query(sql.luminance, (err, result) => {
        results.luminance = result;
        resolve()
      })
    })
    var LpTime = new Promise(function (resolve, reject) {
      connection.query(sql.LpTime, (err, result) => {
        results.LpTime = result;
        resolve()
      })
    })
    var LpDB = new Promise(function (resolve, reject) {
      connection.query(sql.LpDB, (err, result) => {
        results.LpDB = result;
        resolve()
      })
    })
    Promise.all([luxTime, luminance, LpTime, LpDB]).then(function () {
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
      connection.release();
    })
  })
}

//websocket的数据库操作
function setValue(sql) {
  pool.getConnection((err, connection) => {
    connection.query(sql, (err, result) => {
      connection.release();
    })
  })
}

module.exports = {
  getLp(res) {
    const sql = 'SELECT * FROM lp order by id desc limit 0,1000;';
    queryValue('get', sql, res)
  },
  getLum(res) {
    const sql = 'SELECT * FROM lux order by id desc limit 0,1000;';
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
    const sql = `INSERT INTO Lux VALUES(
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
    const sql2 = `INSERT INTO Lux VALUES(
      NULL,
      ${lum},
      ${result}
    )`
    queryValue(sql1)
    queryValue(sql2)
  },
  getHistoryValue(date, startDate, endDate, res) {
    const sql = {
      luxTime: `SELECT time FROM lux WHERE time BETWEEN ${startDate} and ${endDate}`,
      luminance: `SELECT luminance FROM lux WHERE time BETWEEN ${startDate} and ${endDate}`,
      LpTime: `SELECT time FROM Lp WHERE time BETWEEN ${startDate} and ${endDate}`,
      LpDB: `SELECT Lp FROM Lp WHERE time BETWEEN ${startDate} and ${endDate}`
    }
    getVal(sql, res);
  }
}
