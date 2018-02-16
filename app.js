const express = require('express');
const bodyParser = require('body-parser');
const fetch = require('node-fetch');
const config = require('./config');

const app = express();
app.use(bodyParser.json());

const PORT = config.port;
const STATUS_SUCCESS = config.status;
const STATUS_USER_ERROR = config.error;

const currentPriceURL = config.coindesk.URL.currentPrice;
const previousPriceURL = config.coindesk.URL.previousPrice;

const cache = {};
const history = [];
const capture = {};

const fetchData = (URL, res) => {
    return fetch(URL)
        .then(response => response.json())
        .then(
            data =>
            URL.includes('currentprice')
                ? (capture.current = data.bpi.USD.rate_float)
                : (capture.previous = Object.values(data.bpi)[0]),
        )
        .then(
            _ =>
                res
                    ? res.status(STATUS_SUCCESS).send({
                        diff:
                            Math.round((capture.current - capture.previous) * 100) / 100,
                        current: capture.current,
                        previous: capture.previous,
                    })
                    : null,
        )
        .catch(err => res.status(STATUS_USER_ERROR).send(err));
};

app.get('/compare', (req, res) => {
    fetchData(currentPriceURL).then(_ => {
        fetchData(previousPriceURL, res);
    });
});

app.listen(PORT, () => {
    console.log(`Server is listening on port: ${PORT}.`);
});

