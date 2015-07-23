var env = require('./env.json');

module.exports.sendMessages = function(toArray, message, callback) {

    var twilioNumber = env.TWILIO_PHONE_NUMBER;

    var client = require('twilio')(env.TWILIO_ACCOUNT_SID, env.TWILIO_AUTH_TOKEN);
    var async = require('async');

    var result = {
        count: 0,
        errorCount: 0,
        errors: []
    };

    var sendMessage = function (phone, done) {
        //console.log("This is where I would send \n"+req.body.message+"\nto: "+task.name+"\nIn "+task.county+" county");
        result.count++;


        var msgObj = {
            to: phone,
            from: twilioNumber,
            body: message
        };
        console.log(msgObj);
        client.sendSms(msgObj, function(err, message) {
            if(err) {
                console.error('Error sending:');
                console.error(err);
                result.errorCount++;
                result.errors.push(err);
                return done();
            }
            console.log('Success! The SID for this SMS message is:');
            console.log(message.sid);

            console.log('Message sent on:');
            console.log(message.dateCreated);
            done();
        });
    };

    async.eachLimit(toArray, 25, sendMessage, function (err) {
        if (err) {
            return callback(err);
        }
        callback(null, result);
    });

};

module.exports.smsToEmail = function(req, res) {

    var mandrill = require('mandrill-api/mandrill');
    var mandrill_client = new mandrill.Mandrill(env.MANDRILL_API_KEY);

    var phone = req.body.From.substring(1,12);
    console.log(req.body);
    console.log(mailOptions);


    var message = {
        "html": '<b>SMS from '+req.body.From+':</b><br>\n'+req.body.Body,
        "text": 'SMS from '+req.body.From+':\n'+req.body.Body,
        "subject": 'SMS from '+req.body.From,
        "from_email": "smsapp@starkenterprises.com.au",
        "from_name": "SMS App",
        "to": [{
                "email": "ariane.psom@gmail.com",
                "name": "Ariane Psomotragos",
                "type": "to"
            }],
        "tags": [
            "lean-sms"
        ],
        "subaccount": "lean"
    };
    mandrill_client.messages.send({"message": message});

    res.type('text/xml');
    res.end('<?xml version="1.0" encoding="UTF-8"?><Response></Response>');
};
