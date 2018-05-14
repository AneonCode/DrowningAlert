var mysql = require('mysql');

var connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'root',
    database: 'db_drowning_alert'
});

module.exports = {
    'port': 8088,
    'connection': connection
}