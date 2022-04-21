import {API_URL} from "./index";

const { createProxyMiddleware } = require("http-proxy-middleware");
module.exports = function (app) {
    app.use(
        createProxyMiddleware({
            target: API_URL,
            changeOrigin: true,
        })
    );
};