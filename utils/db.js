const mysql = require('mysql');
const util = require('util');

const pool = mysql.createPool({
  host: 'localhost',
  port: 3306,
  user: 'root',
  password: 'root',
  database: 'udemy',
  connectionLimit: 50,
  insecureAuth: true
});

const pool_query = util.promisify(pool.query).bind(pool);

module.exports = {
  pool_query,
  load: sql => pool_query(sql),
  add: (entity, tableName) => pool_query(`insert into ${tableName} set ?`, entity),
  del: (condition, tableName) => pool_query(`delete from ${tableName} where ?`, condition),
  patch: (entity, condition, tableName) => pool_query(`update ${tableName} set ? where ?`, [entity, condition]),
  update: (value, column, key, key_value, tableName) => pool_query(`update ${tableName} set ${column} = '${value}' where ${key} = '${key_value}'`),
};
