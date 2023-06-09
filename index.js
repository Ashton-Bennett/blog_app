const http = require("http");
const app = require("./app");
const config = require("./utils/config");
const logger = require("./utils/logger");

const server = http.createServer(app);

// server.listen(config.PORT, () => {
//   logger.info(`Server running on port ${config.PORT}`);
// });

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  logger.info(`Server running on port ${PORT}`);
});

// const PORT = process.env.PORT || 8080;
// server.listen(config.PORT, () => {
//   logger.info(`Server running on port ${PORT}`);
// });
