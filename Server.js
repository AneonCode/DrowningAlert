//向本模块发送HTTP请求时直接使用ip:port/* (*代表相关功能的路由地址)

var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var config = require('./config')

app.use(bodyParser.urlencoded({
    extended: false
}));

/* 救生员登陆时HTTP请求响应
 *
 * HTTP请求Content-Type: application/x-www-form-urlencoded
 *
 * HTTP请求body参数：
 * ip: 救生员登录时的ip地址
 * label: 区分游泳馆的标识
 * uid：用于唯一标识救生员设备，本项目中使用救生员手机4G网卡的mac地址
 *
 * 返回结果：
 * JSON格式数据
 * result: true/false 成功/不成功执行该功能
 * message: 成功执行的结果信息/不成功的错误信息
 */
app.post("/login", function(req, res) {
    var existORnot = "select * from guard where uid='" + req.body.uid + "'";
    console.log(existORnot);
    config.connection.query(existORnot, function(error, result) {
        if(error)
            throw error;
        
        if(result.length == 0) {
            var sql = 'insert into guard (ip, label, uid) values(?, ?, ?)';
        }
        else {
            var sql = 'update guard set ip=?, label=? where uid=?';
        }
        var ip = req.ip;
            ip = ip.substr(7);
            console.log(ip + "request for login");
            var params = [ip, req.body.label, req.body.uid];
            config.connection.query(sql, params, function(error, result) {
                console.log(sql);
                if(error)
                    throw error;

                if(result.affectedRows != 0) {
                    var response = {
                        'result': 'true',
                        'message': result
                    }
                    console.log(JSON.stringify(response));
                    res.end(JSON.stringify(response));
                    console.log(ip + "disconnected");
                }
                else {
                    var response = {
                        'result': 'false',
                        'message': result
                    };
                    console.log(response);
                    res.end(JSON.stringify(response));
                    console.log(ip + "disconnected");
                }
            });
    });
});

/* 手环写入自己的设备信息和位置信息
 *
 * HTTP请求Content-Type: application/x-www-form-urlencoded
 *
 * HTTP请求body参数：
 * ip: 手环上线时的ip
 * label: 区分游泳馆的标识
 * address: 手环所在位置经纬度信息，本项目采用安信可A9G模组提供定位信息
 * uid: 用于唯一标识手环设备，本项目中使用GPRS模块的IMEI号
 * 
 * 返回结果：
 * JSON格式数据
 * result: true/false 成功/不成功执行该功能
 * message: 成功执行的结果信息/不成功的错误信息
 */
app.post('/user_insert', function(req, res) {
    var existORnot = "select * from guard where uid='" + req.body.uid + "'";
    config.connection.query(existORnot, function(error, result) {
        if(error)
            throw error;

        if(result.length == 0) {
            var sql = 'insert into user (ip, label, address, uid) values(?, ?, ?, ?)';
        }
        else {
            var sql = 'update user set ip=?, label=?, address=? where uid=?';
        }
        var ip = req.ip;
        ip = ip.substr(7);
        console.log(ip + "request for user_insert");
        var params = [ip, req.body.label, req.body.address, req.body.uid];
        config.connection.query(sql, params, function(error, result) {
            if(error)
                throw error;

            if(reslut.affectedRows != 0) {
                var response = {
                    'result': 'true',
                    'message': result
                };
                console.log(response);
                res.end(JSON.stringify(response));
                console.log(ip + "disconnected");
            }
            else {
                var response = {
                    'result': 'false',
                    'message': result
                };
                console.log(response);
                res.end(JSON.stringify(response));
                console.log(ip + "disconnected");
            }
        });
    });
});

var server = app.listen(config.port, function() {
    console.log("listening on %s port", config.port);
});
