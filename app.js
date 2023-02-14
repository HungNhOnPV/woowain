require('dotenv').config();

const express = require('express')
var cors = require('cors')
const logger = require('morgan')

const port = process.env.PORT || 8080

const app = express()

app.use(logger(process.env.NODE_ENV))
app.use(express.json())
app.use(express.urlencoded({
  extended: true
}));
app.use(cors())
app.use(express.urlencoded({ extended: true }));
app.use(express.json())

app.get('/apple-app-site-association', (req, res, next) => {
  return res.status(200).json({
    "applinks": {
    "apps": [],
    "details": [{
      "appID": process.env.APP_ID,
      "paths": ["*"],
      }]
    }
  })
})

app.use((req, res, next) => {
  const err = new Error('Not Found')
  err.status = 404
  next()
})

app.use((err, req, res, next) => {
  const error = app.get('env') === 'development' ? err : {}
  const status = err.status || 500

  return res.status(status).json({
    error: {
      message: error.message
    }
  })
})

app.listen(port, () => console.log(`Server is listening on port ${port}`))

