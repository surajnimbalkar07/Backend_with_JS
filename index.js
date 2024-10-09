const express = require('express');
const app = express();

require('dotenv').config();

app.get('/', (req, res) => {
    res.send("welcome")
})

app.listen(process.env.PORT, () => {
    console.log("listening to port ");
})