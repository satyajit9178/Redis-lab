# Redis Lab 🚀

A hands-on collection of Node.js projects exploring **Redis through real-world use cases** — from caching and temporary data storage to queues, Pub/Sub, and background processing.

The goal is to understand how Redis works, where it fits in backend architecture, and how to use it to build faster, more scalable applications.

## 🧪 Projects

| Project | What it explores |
|---|---|
| `01-Basics` | Redis fundamentals and commands |
| `02-site-banner` | Temporary data and key expiration (TTL) |
| `03-otp-verification` | OTP storage, expiry, and attempt management |
| `04-UserProfile` | Redis-based data handling |
| `05-Job-queue` | Background jobs and queue processing |
| `06-pub-sub` | Real-time messaging with Pub/Sub |
| `Assignment` | Practical Redis implementation challenges |

## 🛠️ Tech Stack

- **Backend:** Node.js, Express.js
- **Database / Cache:** Redis, MongoDB
- **Infrastructure:** Docker, Docker Compose
- **Tools:** Postman, Redis CLI

## ⚡ Getting Started

**1. Clone the repository**

```bash
git clone <your-repository-url>
cd redis-lab
```

**2. Configure environment variables**

```bash
cp .env.example .env
```

Add your local credentials and configuration.

**3. Start Redis and MongoDB**

```bash
docker compose up -d
```

**4. Run a project**

```bash
cd 01-Basics
npm install
```

Run the appropriate script defined in that project's `package.json`.

## 🧹 Stop Containers

```bash
docker compose down
```

This stops and removes the containers while preserving named volumes and stored data.

---

**Learning by building. Understanding by experimenting.**
