var bodyParser = require('body-parser');
var express = require('express');
var app = express();

var smsService = require('./twilioFuncs.js');

var auth = require('http-auth');
var basic = auth.basic({
    realm: "LEAN sms blast",
    file: __dirname + "/users.htpasswd"
});
//app.use('/',auth.connect(basic));
app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(bodyParser.json());

app.post('/send', function(req, res) {

    var count = 0;
    var toArray = req.body['send-to']
                    .split(',')
                    .map(function (val) {
                        if (val.substring(0,1) === '0') {
                            val = val.substring(1);
                        }
                        return "+61" + val;
                    });
    var message = req.body.message;

    smsService.sendMessages(toArray, message, function(err, sendResult){
        if (err) {
            return res.end("Error sending messages "+err);
        }
        console.log(sendResult);
        var html = "Sent "+sendResult.count+" messages successfully\n";
        if (sendResult.errorCount > 0) {
            html += "and encountered "+sendResult.errorCount+" errors\n";
            for (var e in sendResult.errors) {
                html += e+": "+JSON.stringify(sendResult.errors[e])+"\n";
            }
        }
        res.end(html);
    });
});
app.post('/incoming', smsService.smsToEmail);

app.use(express.static(__dirname + '/public'));
app.listen(8080);

