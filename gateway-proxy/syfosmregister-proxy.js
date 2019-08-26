/* eslint arrow-body-style: ["error", "as-needed"] */
const proxy = require('express-http-proxy');
const URL = require('url');

const getPath = req => URL.parse(req.url).path;


const proxyReqPathResolver = (req) => {
    const path = `/syfosmregister/api${getPath(req)}`;
    console.log(`proxy for path: ${path}`);
    return path;
};

const proxyReqOptDecorator = (proxyReqOpts) => {
    // eslint-disable-next-line no-param-reassign
    proxyReqOpts.headers['x-nav-apiKey'] = process.env.SYKEFRAVAER_SYFOSMREGISTERAPI_APIKEY_PASSWORD;
    return proxyReqOpts;
};

const createSyfosmregisterProxy = () => {
    const url = process.env.SYFOSMREGISTERAPI_URL;
    console.log(`Proxyer til url: ${url}`);
    return proxy(url, { proxyReqPathResolver, proxyReqOptDecorator });
};

function startSyfosmregisterProxy(server) {
    server.use('/syfosmregister/api', createSyfosmregisterProxy());
}

module.exports = startSyfosmregisterProxy;
