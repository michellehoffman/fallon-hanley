require('dotenv').config();
var express = require('express');
var bodyParser = require('body-parser');
var nodeMailer = require('nodemailer');
var csurf = require('csurf');
var cookieParser = require('cookie-parser');
var helmet = require('helmet');
var { google } = require('googleapis');
var { check, validationResult, matchedData } = require('express-validator');

var app = express();
app.set('port', process.env.PORT || 3000);
app.set('view engine', 'ejs');

var csrfMiddleware = csurf({ cookie: true });

app.use(express.static('public'));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(helmet());
app.use(cookieParser());
app.use(csrfMiddleware);

var OAuth2 = google.auth.OAuth2;
var oauth2Client = new OAuth2(
  process.env.CLIENT_ID,
  process.env.CLIENT_SECRET,
  'https://developers.google.com/oauthplayground'
);
oauth2Client.setCredentials({ refresh_token: process.env.REFRESH_TOKEN });
var accessToken = oauth2Client.getAccessToken();
 
var validation = [
  check('name')
    .not().isEmpty()
    .withMessage('Your name is required')
    .trim()
    .escape(),
  check('email')
    .isEmail()
    .withMessage('That email doesn\'t look right')
    .trim()
    .normalizeEmail(),
  check('message')
    .not().isEmpty()
    .withMessage('Message is required')
    .trim()
    .escape()
]

app.get('/', (request, response) => {
  response.render('index', { csrfToken: request.csrfToken() });
})

app.post('/contact', validation, (request, response) => {
  var result = validationResult(request);
  if (result.errors.length) {
    response.status(422).send({ error: result.errors })
  }

  var data = matchedData(request);

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
    from: data.email,
    subject: 'Contact Form Message',
    html: `
      <p>You have a message from the contact form</p>
      <div style="margin-left: 20px">
        <p><strong>Name:</strong> ${ data.name }</p>
        <p><strong>Email:</strong> ${ data.email }</p>
        <p><strong>Message:</strong><p>
        <p style="margin-left: 10px">${ data.message }</p>
      </div>
    `
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      response.status(500).send({ error: 'There was an error sending your message.' });
    } else {
      response.status(200).send({ message: 'Thanks for reaching out! Your message was sent.' });
    }
  });
});

app.listen(app.get('port'));
