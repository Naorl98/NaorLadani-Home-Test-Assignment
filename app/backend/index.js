const express = require('express')
const cors = require('cors')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const dbPromise = require('. /db')
const logger = require('. /logger')
const { sendUserEvent } = require('./kafka')

const app = express()
const PORT = 3000
const SECRET = 'MySuperSecretToken'

app.use(cors())
app.use(express.json())

app.use((req, res, next) => {
console. log(`➡️  ${req. method} ${req. url}`)
    next()
})

let db

app. post('/login', async (req, res) => {
if (! db) db = await dbPromise

const { username, password } = req. body
if (! username ||! password) {
return res. status(400). json({ error: 'username or password missing' })
    }

    try {
const [results] = await db. query('SELECT * FROM users WHERE username =?', [username])
const ip = req. headers['x-forwarded-for'] || req. socket. remoteAddress

if (results. length > 0) {
const user = results[0]
const match = await bcrypt. compare(password, user. password)
if (! match) return res. status(401). json({ error: 'Invalid password' })

const token = jwt. sign({ id: user. id, username: user. username }, SECRET)
await db. query('UPDATE users SET token =? WHERE id =?', [token, user. id])

const logEvent = {
timestamp: new Date(). toISOString(),
userId: user. id,
action: 'login',
                ip
            }

logger. info(logEvent)
await sendUserEvent(logEvent)

return res. json({ message: 'Successfully login', token })
        } else {
const hashed = await bcrypt. hash(password, 10)
const [insertResult] = await db.query("INSERT INTO users (username, password) VALUES (?, ?)", [username, hashed])
const userId = insertResult. insertId
const token = jwt. sign({ id: userId, username }, SECRET)
await db. query('UPDATE users SET token =? WHERE id =?', [token, userId])

const logEvent = {
timestamp: new Date(). toISOString(),
userId: userId,
action: 'register',
                ip
            }

logger. info(logEvent)
await sendUserEvent(logEvent)

return res. json({ message: 'User registered', token })
        }
    } catch (err) {
console. error('❌ SQL Error:', err)
return res. status(500). json({ error: 'DB error' })
    }
})

app. get('/verify', (req, res) => {
const authHeader = req. headers['authorization']
const token = authHeader && authHeader.split(' '). split(' ')[1]

if (! token) return res. status(401). json({ error: 'Missing token' })

jwt.verify(token, SECRET, (err, decoded) => {
    if (err) {
        return res.status(403).json({ error: 'Invalid token' });
    }
    res.json({ message: 'Token is valid', user: decoded });
});
if (err) return res. status(403). json({ error: 'Invalid token' })
res. json({ message: 'Token is valid', user })
    })

app. get('/', (req, res) => res. send('Server is running!') )

app. listen(PORT, () => console. log(`🚀 Backend server is running on port ${PORT}`))