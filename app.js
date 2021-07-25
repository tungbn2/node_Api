//config evn
require('dotenv').config()

const bodyParser = require('body-parser')
const express = require('express')
const logger = require('morgan')
const mongoose = require('mongoose')
const SecureApp = require ('helmet')


//setup connect mongoDB
mongoose.connect('mongodb://localhost:27017/nodeApi', {
    useCreateIndex: true,
    useNewUrlParser: true, //option tắt cảnh báo
    useUnifiedTopology: true
})
    .then(() => console.log('connected to DB'))
    .catch((err) => console.error(`connect fail: ${err}`))

const usersRoute = require('./routes/usersRoute.js')
const decksRoute = require('./routes/deckRoute')

const app = express();
app.use(SecureApp())

//middleware
app.use(logger('dev'))
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended: false}))

//routes
app.use('/users', usersRoute)
app.use('/decks', decksRoute)

//routes
app.get('/', (req,res, next) => {
    return res.status(200).json({
        massage: 'server is ok'
    })
})

//catch error
app.use((req,res,next) => {
    const err = new Error('Not Found')
    err.status = 404
    next(err)
})

// error handler function -endpoint function err handler => khi gọi hàm next thì sẽ chạy hàm này
app.use ((err, req, res, next) => {
    const error = app.get ('env') === 'development' ? err : {} //kiểm tra môi trường
    const status = err.status || 500

    //res to client
    return res.status(status).json({
        error: {
            massage: error.message
        }
    })
})

//start server
const port = app.get('port') || 3000
app.listen (port, () => console.log(`server is running on ${port}`))