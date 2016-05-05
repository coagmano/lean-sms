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

  if (req.body.From === undefined || req.body.Body === undefined) {
    return console.error("POST payload malformed");
  }

  // var phone = req.body.From.substring(1,12);
  console.log(req.body);

  var sendgrid = require('sendgrid')('SENDGRID_API_KEY');
  var email = new sendgrid.Email();

  email.addTo('ariane.psom@gmail.com');
  email.setFrom('smsapp@starkenterprises.com.au');
  email.setSubject('SMS from ' + req.body.From);
  email.setHtml('<b>SMS from ' + req.body.From + ':</b><br>\n' + req.body.Body);

  sendgrid.send(email);

  res.type('text/xml');
  res.end('<?xml version="1.0" encoding="UTF-8"?><Response></Response>');
};
