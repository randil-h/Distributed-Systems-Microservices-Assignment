const express = require('express')
const httpProxy = require('http-proxy')
const cors = require('cors')
const PORT = process.env.PORT || 8000

const app = express()
const proxy = httpProxy.createProxyServer({})

app.use(cors())
app.use(express.json())

proxy.on('error', (err, req, res) => {
    console.error('Proxy error:', err);
    res.status(500).send({ error: 'Proxy Error' });
});

app.get('/health', (req, res) => {
    res.status(200).send({ status: 'API Gateway is healthy' });
});

app.listen(PORT, () => {
    console.log(`API Gateway listening on port ${PORT}`);
});
