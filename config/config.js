module.exports = {
  rabbitMQ: {
    connectionUrl: 'amqp://localhost',
    taskQueueName: 'task_queue',
    resultQueueName: 'result_queue'
  },
  log: {
    level: 'info' // Уровень логирования
  }
};
