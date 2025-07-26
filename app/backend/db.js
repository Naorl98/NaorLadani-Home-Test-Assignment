const mysql = require('mysql2/promise')
const bcrypt = require('bcrypt')

async function waitForTiDB(host, port, retries = 20, delay = 2000) {
    for (let i = 0; i < retries; i++) {
        try {
            const connection = await mysql.createConnection({
                host,
                port,
                user: 'root',
                password: ''
            })
            await connection.end()
            console.log('TiDB is ready!')
            return
        } catch (err) {
            console.log(`Waiting for TiDB... (${i + 1}/${retries})`)
            await new Promise(res => setTimeout(res, delay))
        }
    }
    throw new Error('TiDB is not responding on time')
}

async function initializeDatabase() {
    const host = 'tidb'
    const port = 4000

    await waitForTiDB(host, port)

    const connection = await mysql.createConnection({
        host,
        user: 'root',
        password: '',
        port
    })

    await connection.query(`CREATE DATABASE IF NOT EXISTS appdb`)
    console.log('Database "appdb" is ready')
    await connection.end()

    const pool = mysql.createPool({
        host,
        user: 'root',
        password: '',
        port,
        database: 'appdb',
        waitForConnections: true,
        connectionLimit: 10,
        queueLimit: 0
    })

    const db = pool

    await db.query(`
        CREATE TABLE IF NOT EXISTS users (
            id INT PRIMARY KEY AUTO_INCREMENT,
            username VARCHAR(255) NOT NULL UNIQUE,
            password VARCHAR(255) NOT NULL,
            token VARCHAR(255)
        )
    `)
    console.log(' Table "users" is ready')

    const [users] = await db.query('SELECT * FROM users WHERE username = ?', ['admin'])
    if (users.length === 0) {
        const hashed = await bcrypt.hash('admin123', 10)
        await db.query('INSERT INTO users (username, password) VALUES (?, ?)', ['admin', hashed])
        console.log('efault user "admin" created with password "admin123"')
    } else {
        console.log('ℹDefault user "admin" already exists')
    }

    return db
}

module.exports = initializeDatabase()
