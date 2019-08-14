require('dotenv').config();
var express = require('express');
var bodyParser = require('body-parser');
var nodeMailer = require('nodemailer');
var { google } = require('googleapis');
var OAuth2 = google.auth.OAuth2;
var app = express();

app.set('port', process.env.PORT || 3000);

app.use(express.static('public'));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

var oauth2Client = new OAuth2(
  process.env.CLIENT_ID,
  process.env.CLIENT_SECRET,
  'https://developers.google.com/oauthplayground'
);
oauth2Client.setCredentials({ refresh_token: process.env.REFRESH_TOKEN });
var accessToken = oauth2Client.getAccessToken();


app.post('/contact', (req, res) => {

  var transporter = nodeMailer.createTransport({
    service: 'gmail',
    auth: {
      type: 'OAuth2',
      user: 'hoffman.michelle.e@gmail.com',
      clientId: process.env.CLIENT_ID,
      clientSecret: process.env.CLIENT_SECRET,
      refreshToken: process.env.REFRESH_TOKEN,
      accessToken: accessToken
    }
  });

  var mailOptions = {
    to: 'hoffman.michelle.e@gmail.com',
    from: req.body['contact-email'],
    subject: 'Contact Form Message',
    html: `
      <p>You have a message from the contact form</p>
      <div style="margin-left: 20px">
        <p><strong>Name:</strong> ${ req.body['contact-name'] }</p>
        <p><strong>Email:</strong> ${ req.body['contact-email'] }</p>
        <p><strong>Message:</strong><p>
        <p style="margin-left: 10px">${ req.body['contact-message'] }</p>
      </div>
    `
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      return console.log(error);
    }

    console.log('Message %s sent: %s', info.messageId, info.response);
  });

  res.writeHead(301, { Location: 'index.html' });
  res.end();
})

app.listen(app.get('port'));
