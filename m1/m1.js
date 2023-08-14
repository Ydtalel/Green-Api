const express = require('express');
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

// Функция для обработки задания
async function processTask(task) {
  try {
    const connection = await amqp.connect(config.rabbitMQ.connectionUrl);
    const channel = await connection.createChannel();

    const resultQueue = config.rabbitMQ.resultQueueName;
    const taskQueue = config.rabbitMQ.taskQueueName;

    // Объявляем очереди
    await channel.assertQueue(resultQueue, { durable: true });
    await channel.assertQueue(taskQueue, { durable: true });

    // Отправляем задание в очередь для обработки
    await channel.sendToQueue(taskQueue, Buffer.from(task), { persistent: true });

    // Ожидаем результат обработки и возвращаем его
    return new Promise((resolve, reject) => {
      channel.consume(resultQueue, (message) => {
        const result = message.content.toString();
        resolve(result);
      }, { noAck: true });
    });
  } catch (error) {
    logger.error('M1: Ошибка при обработке задания', { error });
    throw error;
  }
}

const app = express();
const port = 3000;

app.use(express.json());

// Обработчик POST запроса
app.post('/process', async (req, res) => {
  try {
    const task = req.body.task;

    if (!task) {
      return res.status(400).json({ error: 'Введите задание для обработки' });
    }

    // Обрабатываем задание и отправляем результат
    const result = await processTask(task);
    res.status(200).json({ result });
  } catch (error) {
    logger.error('M1: Ошибка', { error });
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.listen(port, () => {
  console.log(`M1 слушает на http://localhost:${port}`);
});
