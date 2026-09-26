# Setup Guide — Galaxium Travels

Step-by-step first-run guide for the Galaxium Travels interplanetary booking system.

---

## Prerequisites

| Requirement | Minimum Version | Check |
|---|---|---|
| Python | 3.8+ | `python --version` |
| Node.js | 18+ | `node --version` |
| npm | (bundled with Node) | `npm --version` |
| Git | any recent | `git --version` |

Download links: [Python](https://www.python.org/downloads/) · [Node.js](https://nodejs.org/) · [Git](https://git-scm.com/)

On **Windows**, ensure Python is added to `PATH` during installation.

---

## 1. Clone the Repository

```bash
git clone -b bob-learning-path-branch https://github.com/IBM/galaxium-travels
cd galaxium-travels
```

The `-b bob-learning-path-branch` flag checks out the tutorial branch used with IBM Bob.

---

## 2. Backend Setup

The backend is a **FastAPI** application that runs on port **8080**.

### 2.1 Create a Python virtual environment

**macOS / Linux:**
```bash
cd booking_system_backend
python3 -m venv .venv
source .venv/bin/activate
```

**Windows:**
```bash
cd booking_system_backend
python -m venv .venv
.venv\Scripts\activate
```

Your prompt should now show `(.venv)`.

### 2.2 Install Python dependencies

```bash
pip install -r requirements.txt
```

Key packages installed: `fastapi`, `uvicorn`, `sqlalchemy`, `pydantic`, `fastmcp`, `pytest`.

### 2.3 Environment variables

No environment file is required for the backend. The SQLite database (`booking.db`) is created automatically in the `booking_system_backend/` directory on first run and seeded with demo data.

---

## 3. Frontend Setup

The frontend is a **React 18 + TypeScript + Vite** SPA that runs on port **5173**.

### 3.1 Install Node dependencies

Open a **new terminal** from the repo root:

```bash
cd booking_system_frontend
npm install
```

### 3.2 Configure the API URL

Create (or verify) the `.env` file in `booking_system_frontend/`:

```bash
# macOS / Linux
echo "VITE_API_URL=http://localhost:8080" > .env

# Windows PowerShell
Set-Content .env "VITE_API_URL=http://localhost:8080"
```

The file should contain:
```env
VITE_API_URL=http://localhost:8080
```

If deploying to a remote server, replace `http://localhost:8080` with your backend URL.

---

## 4. Run the Application

### Option A — Quick start (recommended)

From the **repo root**:

**macOS / Linux:**
```bash
./start.sh
```

**Windows:**
```bash
start.bat
```

The script installs dependencies (if missing), starts the backend on `:8080`, and starts the frontend dev server on `:5173` in separate terminal windows.

### Option B — Manual start

You need **two terminals** running simultaneously.

**Terminal 1 — Backend:**
```bash
cd booking_system_backend
source .venv/bin/activate   # Windows: .venv\Scripts\activate
python server.py
```

**Terminal 2 — Frontend:**
```bash
cd booking_system_frontend
npm run dev
```

---

## 5. Verify It Works

Once both servers are running, open these URLs:

| URL | What you should see |
|---|---|
| http://localhost:5173 | Space-themed UI with animated starfield background |
| http://localhost:5173/flights | Grid of sample flights (Earth→Mars, Moon, Venus, etc.) |
| http://localhost:8080 | JSON health-check response from the API |
| http://localhost:8080/docs | Interactive Swagger UI listing all REST endpoints |
| http://localhost:8080/mcp | MCP protocol endpoint (for AI agent use) |

**Quick smoke test:**
1. Open http://localhost:5173/flights
2. Click **"Book Now"** on any flight
3. Enter a name and email (e.g., `Alice` / `alice@example.com`)
4. Confirm the booking — a toast notification should appear
5. Navigate to **"My Bookings"** — your reservation should be listed

The database is pre-seeded with 10 users, 10 flights, and 20 sample bookings.

---

## Troubleshooting

### Backend won't start

| Symptom | Fix |
|---|---|
| `python: command not found` | Install Python 3.8+ and ensure it is on PATH |
| `ModuleNotFoundError: No module named 'fastapi'` | Activate the venv: `source .venv/bin/activate` then `pip install -r requirements.txt` |
| `Address already in use` on port 8080 | Kill the conflicting process: `lsof -i :8080` (mac/linux) or `netstat -ano \| findstr :8080` (windows), then `kill <PID>` |

### Frontend won't start

| Symptom | Fix |
|---|---|
| `node: command not found` | Install Node.js 18+ |
| Port 5173 already in use | Kill process on 5173 or run `npm run dev -- --port 5174` |
| `npm ERR! code ENOENT` | Delete `node_modules` and reinstall: `rm -rf node_modules && npm install` |

### Connection / data issues

| Symptom | Fix |
|---|---|
| "Failed to fetch" errors in the UI | Confirm backend is running on `:8080`; check `VITE_API_URL` in `.env` |
| CORS error in browser console | Restart backend; verify `VITE_API_URL` matches the actual backend address |
| Blank or corrupt data | Delete `booking.db` (`booking_system_backend/booking.db`) and restart the backend — it will re-seed |

---

## Running Tests

```bash
cd booking_system_backend
pytest
```

To also type-check and build the frontend:

```bash
cd booking_system_frontend
npm run build
```
