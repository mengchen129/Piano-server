var express = require('express');
var app = express();
var bodyParser = require('body-parser');

var mysql = require('mysql');
var mysqlConfig = require('./mysql-config');        // 使用Node.js CMD方式加载配置

var conn = mysql.createConnection(mysqlConfig);

conn.connect(function(err) {
    if (!err) {
        console.log('connect database success');
    }
});

app.use(bodyParser.urlencoded({extended: true}));

app.get('/upload-page', function(req, res) {
    res.sendfile('upload.html', {root: __dirname});
});

app.post('/music-upload', function(req, res) {

    var body = req.body;
    console.log(body);
    var musicName = body.music_name;
    var musicFeel = body.music_feel;
    var musicTune = body.music_tune;
    var musicAuthor = body.music_author;
    var recordDataStr = body.record_data;

    conn.query('insert into piano_music_record(music_name, music_feel, music_tune, music_author, music_create_time) values(?, ?, ?, ?, now())',
        [musicName, musicFeel, musicTune, musicAuthor], function(err, result) {
            if (err) {
                console.log('[ERROR] - ' + err.message);
                return;
            }

            var musicId = result.insertId;
            var recordData = JSON.parse(recordDataStr);

            var params = [];
            var sql = "insert into piano_record_detail(music_id, record_time, record_tunes) values ";
            for (var i = 0; i < recordData.length; i++) {
                var record = recordData[i];
                var time = record.time;
                var tunes = record.tunes;

                params.push(musicId, time, JSON.stringify(tunes));
                sql += "(?, ?, ?),";
                if (i == recordData.length - 1) {
                    sql = sql.slice(0, sql.length - 1) + ';';
                }
            }

            console.log(sql);

            conn.query(sql, params, function(err) {
                if (err) {
                    console.log('[ERROR] - ' + err.message);
                }
            });
        });

    res.sendfile('upload-success.html', {root: __dirname});
});

app.get('/list-page', function(req, res) {
    res.sendfile('list.html', {root: __dirname});
});

app.get('/music-list', function(req, res) {
    var resObj = {code: 0};
    conn.query('select id, music_name, music_feel, music_tune, music_author, music_create_time, music_play_count from piano_music_record order by music_create_time desc', function(err, result) {
        if (err) {
            console.log('[ERROR] - ' + err.message);
            return;
        }

        resObj.data = result;
        res.json(resObj);
    });
});

app.get('/music-detail', function(req, res) {
    var musicId = req.query.music_id;
    var resObj = {code: 0};

    conn.query('update piano_music_record set music_play_count = music_play_count + 1 where id = ?', [musicId]);

    conn.query('select record_time, record_tunes from piano_record_detail where music_id = ?', [musicId], function(err, result) {
        if (err) {
            console.log('[ERROR] - ' + err.message);
            return;
        }

        resObj.data = result;
        res.json(resObj);
    });
});

app.listen(9527, function() {
    console.log('Piano Server is started.');
});
