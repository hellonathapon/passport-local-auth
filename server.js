const express = require('express');
const app = express();
const port = process.env.PORT || 5000;
const mongoose = require('mongoose');
require('dotenv').config();

// db connection
mongoose.connect(process.env.DB_STRING, { useNewUrlParser: true, useUnifiedTopology: true })
.then(() => console.log(`database connected!`))
.catch((err) => console.err(err));

// ejs
app.set('view engine', 'ejs');

app.use('/', require('./routes/index.js'));

app.listen(port, () => console.log(`server is running on port ${port}`));