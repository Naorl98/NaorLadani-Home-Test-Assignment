const { Kafka } = require('kafkajs')
const log4js = require('log4js')

log4js.configure({
appenders: { console: { type: 'console' } },
categories: { default: { appenders: ['console'], level: 'info' } }
})
const logger = log4js. getLogger()

const kafka = new Kafka({
    clientId: 'consumer-app',
    brokers: ['kafka:9092'] 
})

const topic = 'user-events'
const groupId = 'user-event-consumer-group'

const consumer = kafka. consumer({ groupId })

async function startConsumer() {
    await consumer.connect()
await consumer. subscribe({ topic, fromBeginning: true })

console. log('Kafka consumer is up and listening to topic:', topic)

    await consumer.run({
eachMessage: async ({ topic, partition, message }) => {
const decoded = message. value. toString()
            try {
const data = JSON. parse(decoded)
                logger.info({
timestamp: new Date(). toISOString(),
source: 'kafka-consumer',
                  ...data
                })
            } catch (err) {
logger. error({ error: 'Could not parse message, raw:', decoded })
            }
        }
    })
}

startConsumer(). catch((err) => {
logger. error('Consumer error:', err)
    process.exit(1)
})