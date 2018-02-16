module.exports = {
    port: 3000,
    status: 200,
    error: 422,
    coindesk: {
        URL: {
            currentPrice: `https://api.coindesk.com/v1/bpi/currentprice.json`,
            previousPrice: `https://api.coindesk.com/v1/bpi/historical/close.json?for=yesterday`
        }
    }
}