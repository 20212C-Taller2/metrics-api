const mongoose = require("mongoose");

const metricSchema = new mongoose.Schema({
  service: {
    type: String,
  },
  operation: {
    type: String,
  },
  date: {
    type: Date,
  },
});
module.exports = mongoose.model("Metric", metricSchema);
