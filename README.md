# 🏠 Home Test Assignment

A full-stack Dockerized application that includes:

- 🧠 **Node.js + Express** backend with JWT authentication and TiDB database
- 💬 **Kafka consumer** that logs user actions
- 🖥️ **Frontend HTML/CSS** login form with animated response
- 🐳 Full Docker Compose setup with Kafka, Zookeeper, TiDB, frontend, and backend

---


---

## 🚀 Getting Started

### Prerequisites

- Docker + Docker Compose
- Node.js (for local testing without Docker)

### Clone the repo

```bash
git clone https://github.com/Naorl98/Home-Test-Assignment.git
cd Home-Test-Assignment
cd app
```
### Initialization with bash script
  ```bash
chmod +x start.sh    
./start.sh
```
### Run with Docker Compose

```bash
docker compose up --build
```


Access the app at: [http://localhost:8080](http://localhost:8080)

---

## 📦 API Endpoints

### `POST /login`

- **Body**: `{ "username": "admin", "password": "1234" }`
- **Returns**: `{ "token": "...", "message": "Login successful" }`

---

## 🧠 Kafka Logging

All login actions are pushed to Kafka topic `user-events`, and consumed by the Kafka consumer (consumer-app). It prints logs with the user's IP, timestamp, and action (login/register).

---

## 🧪 Healthcheck Support

The TiDB service includes a `healthcheck` for robust container startup sequencing.

---

## 📸 Frontend Features

- Responsive login form
- Message shows after login
- Stores JWT in `localStorage`

---

## 🛠️ Technologies

- Node.js + Express
- Kafka + Zookeeper
- TiDB (MySQL-compatible)
- Docker + Docker Compose
- HTML, CSS, Vanilla JS

---

## 🧑‍💻 Author

Created by **Naor Ladani**  
📧 naorlad98@gmail.com  
🌐 [Portfolio](https://naorl98.github.io/Portfolio/)

---

## 📄 License

This project is open source and free to use.
