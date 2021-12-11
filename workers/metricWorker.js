const amqp = require("amqplib");
const config = require("./../config/config");
const queue = config.METRICS_QUEUE;
const database = require("./../model/Database.js");
const logger = require("../services/log/logService");


const Metric = require("./../model/schema/metric");
const {error} = require("../services/log/logService");

async function processServicesMetrics() {
  logger.log(`Starting processing metrics`);
  const connection = await amqp.connect(config.CLOUDAMQP_URL);
  const channel = await connection.createChannel();
  await channel.assertQueue(queue);
  channel.consume(queue, async (message) => {
    const content = JSON.parse(message.content.toString());
    logger.log(`Received message from "${queue}" queue: `, JSON.stringify(content));
    let metric = new Metric({
      service: content.service,
      operation: content.operation,
      date: content.date,
    });
    try {
      await metric.save();
      channel.ack(message);
    } catch (error) {
      logger.error("Cannot save metrics: ",JSON.stringify(content))
      logger.error(error)
    }
    setTimeout(() => {
      channel.close();
      connection.close();
    }, 500);
  });
}

database.connect().then(() => {
  processServicesMetrics()
}).catch((error) => {
  logger.error("Error in metrics worker: ", error)
})

