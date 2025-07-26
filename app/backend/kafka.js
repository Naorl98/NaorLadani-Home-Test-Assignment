const { Kafka } = require('kafkajs')

const kafka = new Kafka({
    clientId: 'backend-service',
    brokers: ['kafka:9092']
})

const producer = kafka.producer()

async function sendUserEvent(event) {
    await producer.connect()

    await producer.send({
        topic: 'user-events',
        messages: [
            {
                key: String(event.userId),
                value: JSON.stringify(event)
            }
        ]
    })

    await producer.disconnect()
}

module.exports = { sendUserEvent }
