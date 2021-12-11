const amqp = require("amqplib");
const config = require("./../config/config");
const queue = config.METRICS_QUEUE;
const database = require("./../model/database");
const logger = require("../services/log/logService");
await database.connect();

const Metric = require("./../model/schema/metric");

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
    await metric.save();
    channel.ack(message);
    setTimeout(() => {
      channel.close();
      connection.close();
    }, 500);
  });
}

setInterval(processServicesMetrics, 10000);
