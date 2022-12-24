require('dotenv').config()
const express = require('express');
const app = express();
const port = 3000 || process.env.PORT;
const cookieParser = require('cookie-parser');


app.use(cookieParser());

app.use(express.json());



//Route: /users
app.use('/users', require('./Routes/userRoutes'));


//Route: /admin
app.use('/admin', require('./Routes/adminRoutes'));

//404
app.use((req, res, next) => {
  res.status(404).send('404 Not Found');
});

//500
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('500 Internal Server Error');
});



app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});

