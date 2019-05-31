require('dotenv').config()
const express = require('express')
const morgan = require('morgan')
const cors = require('cors')
const path = require('path')
const app = express()

/* SENTRY ERROS*/
const Sentry = require('@sentry/node');
Sentry.init({ dsn: 'https://69f24078b5e14ae4b79810e2d5a009d5@sentry.io/1458565' });
// The request handler must be the first middleware on the app
app.use(Sentry.Handlers.requestHandler());

// The error handler must be before any other error middleware
app.use(Sentry.Handlers.errorHandler());

// Optional fallthrough error handler
app.use(function onError(err, req, res, next) {
  // The error id is attached to `res.sentry` to be returned
  // and optionally displayed to the user for support.
  res.statusCode = 500;
  res.end(res.sentry + "\n");
});

app.get('/debug-sentry', function mainHandler(req, res) {
    throw new Error('My first Sentry error!');
});
/* FIM SENTRY ERROS*/

app.use(cors())
app.use(express.json())
app.use(morgan('dev'))

app.use(
    "/files",
    express.static(path.resolve(__dirname, "..", "tmp", "uploads"))
);

require('./app/users')(app)
require('./app/auth')(app)

app.get('*' , (req,res)=>{
    return res.status(404).send({message:`Rota '${req.path}' não econtrada`})
})

app.listen(process.env.PORT || 3000)
