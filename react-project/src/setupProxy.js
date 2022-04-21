const { createProxyMiddleware } = require("http-proxy-middleware");
module.exports = function (app) {
    app.use(
        "/api/v1/", // General Routes URL
        createProxyMiddleware({
            target: "http://localhost:8081", // API URL
            changeOrigin: true,
        })
    );
};