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

// Функция для запуска микросервиса М2
async function startM2() {
  try {
    const connection = await amqp.connect(config.rabbitMQ.connectionUrl);
    const channel = await connection.createChannel();

    const taskQueue = config.rabbitMQ.taskQueueName;
    const resultQueue = config.rabbitMQ.resultQueueName;

    // Объявляем очередь задач
    await channel.assertQueue(taskQueue, { durable: true });

    console.log('M2: Ожидание заданий...');

    // Обработчик сообщений из очереди задач
    channel.consume(taskQueue, async (message) => {
      const task = message.content.toString();
      logger.info(`M2: Получено задание: ${task}`);

      // Простая обработка: перевести текст в верхний регистр
      const result = task.toUpperCase();

      logger.info(`M2: Задание выполнено: ${result}`);

      // Отправляем результат в очередь результатов
      await channel.assertQueue(resultQueue, { durable: true });
      channel.sendToQueue(resultQueue, Buffer.from(result), { persistent: true });

      // Подтверждаем выполнение задания
      channel.ack(message);
    });
  } catch (error) {
    logger.error('M2: Ошибка', { error });
  }
}

startM2();
