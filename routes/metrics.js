const Metric = require("../model/schema/metric");
const logger = require("./../services/log/logService");

function getDateFilter(req) {
  // Expected date format = "YYYY-MM-DD"
  if (req.query.start || req.query.end) {
    let response = {};
    if (req.query.start) {
      response.$gte = new Date(req.query.start + "T00:00:00.000Z");
    }
    if (req.query.end) {
      response.$lte = new Date(req.query.end + "T23:59:59.999Z");
    }
    return response;
  }
  const yesterday = new Date(new Date().getTime() - 24 * 60 * 60 * 1000);
  return {
    $gte: yesterday,
  };
}

async function getServiceMetrics(req, res) {
  const serviceName = req.params.name;
  const dateFilter = getDateFilter(req);
  try {
    const response = await Metric.aggregate([
      {
        $match: {
          service: { $eq: serviceName },
          date: dateFilter,
        },
      },
      {
        $group: {
          _id: "$operation",
          count: { $sum: 1 },
        },
      },
    ]);

    const metrics = response.map((metric) => {
      return {
        operation: metric._id,
        count: metric.count,
      };
    });
    return res.json({
      metrics: metrics,
    });
  } catch (error) {
    logger.error(error);
    res.status(500).send({ message: error.message });
  }
}

module.exports = {
  getServiceMetrics,
};
