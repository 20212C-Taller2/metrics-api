module.exports = {
  MONGODB_URI: process.env.MONGO_URI || "mongodb://127.0.0.1:27017/metrics",
  MONGODB_CONFIG: {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  },
  METRICS_QUEUE: process.env.QUEUE || "service-metrics",
  CLOUDAMQP_URL: process.env.CLOUDAMQP_URL || "amqps://localhost",
};
