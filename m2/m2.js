const amqp = require('amqplib');
const winston = require('winston');
const config = require('../config/config');

const logger = winston.createLogger({
  level: config.log.level,
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.json()
  ),
  transports: [
    new winston.transports.Console(),
    new winston.transports.File({ filename: 'error.log', level: 'error' })
  ]
});

async function startM2() {
  try {
    const connection = await amqp.connect(config.rabbitMQ.connectionUrl);
    const channel = await connection.createChannel();

    const taskQueue = config.rabbitMQ.taskQueueName;
    await channel.assertQueue(taskQueue, { durable: true });

    console.log('M2: Ожидание заданий...');

    channel.consume(taskQueue, async (message) => {
      const task = message.content.toString();
      logger.info(`M2: Получено задание: ${task}`);

      // Простая обработка: перевести текст в верхний регистр
      const result = task.toUpperCase();

      logger.info(`M2: Задание выполнено: ${result}`);

      const resultQueue = config.rabbitMQ.resultQueueName;
      await channel.assertQueue(resultQueue, { durable: true });
      channel.sendToQueue(resultQueue, Buffer.from(result), { persistent: true });

      channel.ack(message);
    });
  } catch (error) {
    logger.error('M2: Ошибка', { error });
  }
}

startM2();
