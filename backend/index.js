const express = require('express');
const cors = require('cors')

const app = express()

app.use(cors())

require('dotenv').config();

app.get('/', (req, res) => {
    res.send("welcome")
})

app.get('/api/jokes', (req, res) => {
    const jokes=[
        {
            "name": "John",
            "id": 2,
            "rate":1,
        },
        {
            "name": "dohn",
            "id": 3,
            "rate":4,
        }
    ]
    res.send(jokes);
})
app.listen(process.env.PORT, () => {
    console.log("listening to port ");
})


//Notes: CORS -Cross Origin Resource Sharing
/*
Imagine your browser is like a security guard.
It does not allow your website to talk to another website directly unless that website says it’s okay.

For example:

Your website: http://myapp.com

API server: http://api.com

If your website tries to get data from api.com, the browser will block it unless the API allows it.

same here ur frontend is on different port calling backend of defferent port so all this issue is solved by cors
*/