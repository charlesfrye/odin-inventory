const express = require("express");
const expressLayouts = require("express-ejs-layouts");
const winston = require("winston");
const morgan = require("morgan");
const helmet = require("helmet");
const cors = require("cors");
const rateLimit = require("express-rate-limit");
const compression = require("compression");

const port = process.env.PORT || 3000;
const mongoose = require("mongoose");
const router = require("./router");

const app = express();
app.set("view engine", "ejs");
app.use(expressLayouts);

const logLevel = process.env.LOG_LEVEL || "info";

const loggerFormat =
  process.env.NODE_ENV === "production"
    ? winston.format.combine(winston.format.timestamp(), winston.format.json())
    : winston.format.combine(
        winston.format.colorize(),
        winston.format.simple()
      );

const logger = winston.createLogger({
  level: logLevel,
  format: loggerFormat,
  transports: [new winston.transports.Console()]
});

morgan.token("statusLevel", (req, res) => {
  const status = res.statusCode;

  if (status >= 500) return "error";
  if (status >= 400) return "warn";
  return "info";
});

const morganFormat =
  ":method :url :status :response-time ms - :res[content-length]";

app.use(
  morgan(morganFormat, {
    stream: {
      write: (message) => {
        const [method, url, statusCode, ...rest] = message.trim().split(" ");
        const status = parseInt(statusCode, 10);

        let level = "info";
        if (status >= 500) {
          level = "error";
        } else if (status >= 400) {
          level = "warn";
        }

        const finalMessage = [method, url, statusCode, ...rest].join(" ");

        logger[level](finalMessage);
      }
    }
  })
);

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100
});

app.use(cors());
app.use(helmet());
app.use(compression());
app.use(limiter);
app.use(express.static("public"));

mongoose.set("strictQuery", false);

const mongoDB = process.env.MONGODB_URI;

async function main() {
  await mongoose.connect(mongoDB);
}
main().catch((err) => logger.error(err));

app.get("/", (req, res) => {
  res.render("index", {
    title: "Inventory Home"
  });
});

app.use("/inventory", router);

app.listen(port, () => {
  logger.info(`Server is running on port ${port}`);
});
