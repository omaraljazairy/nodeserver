const mailConfig = require('./configs/mail.json');
const express = require('express');
const bodyParser = require('body-parser');
const exphbs = require('express-handlebars');
const path = require('path');
const nodemailer = require('nodemailer');
const cors = require('cors')


const app = express();

// setup the view
app.engine('handlebars', exphbs());
app.set('view engine', 'handlebars');
const corsOptions = {
    credentials: true,
    origin: [
        'http://127.0.0.1:3000',
    ],
    "methods": "GET,HEAD,PUT,PATCH,POST,DELETE",
}
app.use(cors(corsOptions))

// Body parser
app.use(bodyParser.urlencoded({ extended: false}));
app.use(bodyParser.json());

// Static public folder
app.use('/public', express.static(path.join(__dirname, 'public')));

app.get('/', (req, res) => {
  res.json({
      status: 'OK',
      message: 'Now I know why'
  });

});

// app.post('/send', (req, res) => {
//     res.json({
//         status: 'OK',
//         message: 'Now I know why'
//     });
  
//   });
/**
 * @todo refactor
 */  
app.post('/send', (req, res) => {

  console.log('url: ', req.url);
  console.log('params: ',req.params);
  console.log('body: ',req.body);
  const output = `
    <p>You have a new client request from ${req.body.companyName} </p>
    <h3>Details</h3>
    <ul>
      <li>Bedrijfnaam: ${req.body.companyName} </li>
      <li>Email address: ${req.body.email} </li>
      <li>Telefoon nummer: ${req.body.tel} </li>
      <li>Stad: ${req.body.city} </li>
      <li>Aantal autos: ${req.body.totalCars} </li>
    </ul
  `;

  let transporter = nodemailer.createTransport({
    host: mailConfig.host ,
    port: mailConfig.port,
    secure: mailConfig.secure,
    auth: {
      user: mailConfig.auth.user,
      pass: mailConfig.auth.pass
    },
    tls: {
      rejectUnauthorized: mailConfig.tls.rejectUnauthorized
    }
  });
  
  let mailOptions = {
    from: '"Order WeWeWa" <order@wipecardetailing.nl',
    to: 'omar@fedal.nl',
    subject: 'Info request',
    text: 'Somebody told me, wah wah wah',
    html: output
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.log('error sending mail: ', error);
      console.log('error res: ', res)
      return res.send(400).send(error);
    }
    console.log('Message sent info: %s', info);
    console.log('Message sent: %s', info.messageId);
    console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));
    res.json({message: 'We hebben uw aanvraag ontvangen.'});
  })
  

})
app.listen(3002, () => console.log('My Server started ...'));
