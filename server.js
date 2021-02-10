const express = require('express');
const app = express();
const port = process.env.PORT || 5000;

// ejs
app.set('view engine', 'ejs');

app.use('/', require('./routes/index.js'));

app.listen(port, () => console.log(`server is running on port ${port}`));