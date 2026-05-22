const { createProxyMiddleware } = require("http-proxy-middleware");

const target = process.env.API_PROXY_TARGET || "http://host.docker.internal:8055";
const shouldProxy = (pathname) => pathname === "/carts" || pathname.startsWith("/api");

module.exports = function setupProxy(app) {
  app.use(createProxyMiddleware({
    pathFilter: shouldProxy,
    target,
    changeOrigin: true,
    ws: true,
    logLevel: "warn",
  }));
};
