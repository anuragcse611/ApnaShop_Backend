const express = require('express')
const cors = require('cors')
const app = express()
const PORT = process.env.PORT || 8080;


 const AuthRoutes = require('./shop/auth')



 app.use('/api/auth', AuthRoutes)


app.use(cors())
app.use(express.json())

app.use(express.static('public'));
app.use('/image', express.static(__dirname + '/image'));

const moment = require('moment-timezone');
moment().tz("Asia/Calcutta").format();
process.env.TZ = 'Asia/Calcutta';

app.listen(PORT, () => {
    var datetime = moment().format('DD MMM YYYY, hh:mm A');
    console.log('---------------')
    console.log('  -ApnaShop App running on port -', PORT, datetime)
})