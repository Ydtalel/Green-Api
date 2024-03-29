# Локальное развертывание проекта "Green API"

Этот файл содержит инструкции по локальному развертыванию и запуску проекта "Green API", который включает два микросервиса для обработки HTTP запросов и задач через RabbitMQ.

## Требования

Перед началом, убедитесь, что у вас установлены:

- [Node.js](https://nodejs.org/) (рекомендуемая версия: LTS)
- RabbitMQ ([Следуйте инструкции по установке на официальном сайте](https://www.rabbitmq.com/))

## Установка зависимостей

1. Склонируйте репозиторий:

    ```
    git clone https://github.com/ydtalel/green-api.git
    ```

2. Перейдите в папку проекта:

    ```
    cd green-api
    ```

3. Установите зависимости для каждого микросервиса (m1 и m2):

    ```
    cd m1
    npm install

    cd ../m2
    npm install
    ```

## Запуск микросервисов

1. Откройте терминал и перейдите в папку первого микросервиса:

    ```
    cd m1
    ```

2. Запустите первый микросервис:

    ```
    node m1.js
    ```

3. В новом терминале перейдите в папку второго микросервиса:

    ```
    cd ../m2
    ```

4. Запустите второй микросервис:

    ```
    node m2.js
    ```

## Тестирование через Postman

1. Откройте Postman или аналогичное приложение для тестирования HTTP запросов.

2. Создайте POST запрос к `http://localhost:3000/process` с заголовком `Content-Type: application/json` и телом запроса в формате JSON:

    ```json
    {
      "task": "Пример задачи для обработки"
    }
    ```

3. Вы должны получить ответ, содержащий результат обработки задачи.

## Завершение

Чтобы остановить микросервисы, вернитесь в соответствующие терминалы и нажмите `Ctrl + C`.

Теперь вы успешно развернули и запустили проект "Green API" локально.
