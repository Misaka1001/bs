const mysql = require('mysql');

const pool = mysql.createPool({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'detection',
  port: '3306',
  multipleStatements: true
});

function getValue(sql, req, res) {
  pool.getConnection((err, connection) => {
    connection.query(sql, (err, result) => {
      res.json(result);
    })
    connection.release();
  })
}

function getVal(sql, req, res) {
  pool.getConnection((err, connection) => {
    var results = {};
    var luxTime = new Promise(function(resolve, reject) {
      connection.query(sql.luxTime, (err, result) => {
        results.luxTime = result;
        resolve()
      })
    })
    var luminance = new Promise(function(resolve, reject) {
      connection.query(sql.luminance, (err, result) => {
        results.luminance = result;
        resolve()
      })
    })
    var LpTime = new Promise(function(resolve, reject) {
      connection.query(sql.LpTime, (err, result) => {
        results.LpTime = result;
        resolve()
      })
    })
    var LpDB = new Promise(function(resolve, reject) {
      connection.query(sql.LpDB, (err, result) => {
        results.LpDB = result;
        resolve()
      })
    })
    Promise.all([luxTime, luminance, LpTime, LpDB]).then(function() {
      res.json(results);
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
  getLp(req, res) {
    const sql = 'SELECT * FROM lp order by id desc limit 0,1000;';
    getValue(sql, req, res)
  },
  getLux(req, res) {
    const sql = 'SELECT * FROM lux order by id desc limit 0,1000;';
    getValue(sql, req, res)
  },
  socketLp(data) {
    const result = JSON.parse(data);
    const sql = `INSERT INTO Lp VALUES(
            NULL,
            ${result.Lp},
            ${result.time}
        )`
    setValue(sql);
  },
  socketLux(data) {

    const result = JSON.parse(data);
    const sql = `INSERT INTO Lux VALUES(
            NULL,
            ${result.luminance},
            ${result.time}
        )`
    setValue(sql);
  },
  getHistoryValue(req, res) {
    const date = req.query.date;
    const startDate = new Date(date.split('-').join('/') + ' 00:00:00').getTime();
    const EndDate = startDate + 86400000;
    const sql = {
      luxTime: `SELECT time FROM lux WHERE time BETWEEN ${startDate} and ${EndDate}`,
      luminance: `SELECT luminance FROM lux WHERE time BETWEEN ${startDate} and ${EndDate}`,
      LpTime: `SELECT time FROM Lp WHERE time BETWEEN ${startDate} and ${EndDate}`,
      LpDB: `SELECT Lp FROM Lp WHERE time BETWEEN ${startDate} and ${EndDate}`
    }
    getVal(sql, req, res);
  }
}
