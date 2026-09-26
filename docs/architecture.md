# Architecture — Galaxium Travels

## Purpose

Galaxium Travels is a full-stack interplanetary booking system that allows users to search, filter, and book space travel flights between destinations (Earth, Mars, Moon, Venus, Jupiter, Europa, Pluto). It demonstrates modern full-stack development practices with a React frontend and FastAPI backend, supporting type-safe operations and dual protocol support (REST + MCP for AI agents). It is IBM Bob's primary tutorial and demo application.

## Tech Stack

| Layer | Technology | Notes |
|---|---|---|
| **Frontend UI** | React 18 | Component-based SPA with hooks |
| **Frontend Language** | TypeScript | Type-safe frontend development |
| **Frontend Build** | Vite | Fast dev server and production bundling |
| **Frontend Styling** | Tailwind CSS + Framer Motion | Utility-first CSS with animations (starfield) |
| **Frontend HTTP** | Axios | Promise-based HTTP client for API calls |
| **Frontend Routing** | React Router | Client-side navigation between pages |
| **Frontend Notifications** | React Hot Toast | Toast notifications for user feedback |
| **Backend Framework** | FastAPI | Async Python web framework with auto-generated docs |
| **Backend Validation** | Pydantic | Data validation and serialization |
| **Backend ORM** | SQLAlchemy | Object-relational mapper for database operations |
| **Backend AI Protocol** | FastMCP | Model Context Protocol support for AI agents |
| **Backend Server** | Uvicorn | ASGI server for FastAPI |
| **Database** | SQLite | Lightweight file-based SQL database with seed data |
| **Runtime** | Python 3.8+ | Async/await support |

## Key Components

### Frontend

1. **Pages** (`src/pages/`)
   - `Home.tsx` — Landing page with space-themed hero section
   - `Flights.tsx` — Flight search and browse interface with filtering
   - `MyBookings.tsx` — User booking history and cancellation management

2. **Components** (`src/components/`)
   - **Layout** — `Header`, `Footer`, `Layout` wrapper (navigation and page structure)
   - **Flights** — `FlightCard` displays individual flight details with "Book Now" action
   - **Bookings** — `BookingCard` shows booking details; `BookingModal` handles confirmation flow
   - **User** — `UserIdentification` component for name/email login
   - **Common** — Reusable `Button`, `Card`, `Input`, `Modal`, `LoadingSpinner`, `Starfield`

3. **Services & Utilities**
   - `services/api.ts` — Axios client wrapping all REST API calls
   - `types/index.ts` — TypeScript definitions for User, Flight, Booking entities
   - `hooks/useUser.tsx` — Custom hook for user state management (login, logout, persist)
   - `utils/formatters.ts` — Date/time, duration, and currency formatting helpers

### Backend

1. **Service Modules** (`services/`)
   - `flight.py` — `list_flights()` retrieves all available flights
   - `booking.py` — `book_flight()`, `cancel_booking()`, `get_bookings()` for booking lifecycle
   - `user.py` — `register_user()` creates new users with email uniqueness check

2. **Database Layer**
   - `db.py` — SQLAlchemy session management (`SessionLocal`, `get_db`), `init_db()`
   - `models.py` — ORM model definitions (User, Flight, Booking)
   - `seed.py` — Pre-populates the database with demo data on startup

3. **Validation Layer** (`schemas.py`)
   - `FlightOut`, `BookingOut`, `UserOut` — Response schemas
   - `BookingRequest`, `UserRegistration` — Input validation schemas
   - `ErrorResponse` — Standardized error format

4. **API Server** (`server.py`)
   - REST endpoints: `GET /flights`, `POST /book`, `GET /bookings/{user_id}`, `POST /cancel/{booking_id}`, `POST /register`, `GET /user`, `GET /`
   - MCP tools: equivalent functions exposed for AI agent protocols via FastMCP
   - CORS middleware for cross-origin requests from the frontend

### Database Models

Three core SQLAlchemy ORM models defined in `models.py`:

| Model | Key Fields |
|---|---|
| **User** | `user_id` (PK), `name`, `email` (unique) |
| **Flight** | `flight_id` (PK), `origin`, `destination`, `departure_time`, `arrival_time`, `price`, `seats_available` |
| **Booking** | `booking_id` (PK), `user_id` (FK→User), `flight_id` (FK→Flight), `status`, `booking_time` |

## Folder Structure

```
galaxium-travels/
├── booking_system_backend/          # FastAPI + SQLAlchemy backend (Python)
│   ├── server.py                    # Entry point: REST routes + MCP tools
│   ├── models.py                    # SQLAlchemy ORM: User, Flight, Booking
│   ├── schemas.py                   # Pydantic validation schemas
│   ├── db.py                        # Session management + init_db
│   ├── seed.py                      # Demo data seeder
│   ├── requirements.txt             # Python dependencies
│   ├── pytest.ini                   # Test configuration
│   ├── Dockerfile                   # Container image
│   ├── services/                    # Business logic layer
│   │   ├── flight.py                # list_flights()
│   │   ├── booking.py               # book_flight(), cancel_booking(), get_bookings()
│   │   └── user.py                  # register_user()
│   └── tests/                       # pytest test suite
│       ├── test_services.py
│       ├── test_rest.py
│       └── conftest.py
│
├── booking_system_frontend/         # React 18 + TypeScript SPA
│   ├── src/
│   │   ├── main.tsx                 # React entry point
│   │   ├── App.tsx                  # Root component + routing
│   │   ├── pages/
│   │   │   ├── Home.tsx             # Landing page
│   │   │   ├── Flights.tsx          # Flight search/browse
│   │   │   └── MyBookings.tsx       # Booking management
│   │   ├── components/
│   │   │   ├── layout/              # Header, Footer, Layout
│   │   │   ├── flights/             # FlightCard
│   │   │   ├── bookings/            # BookingCard, BookingModal
│   │   │   ├── user/                # UserIdentification
│   │   │   └── common/              # Button, Card, Input, Modal, LoadingSpinner, Starfield
│   │   ├── services/api.ts          # Axios HTTP client wrapper
│   │   ├── hooks/useUser.tsx        # User state hook
│   │   ├── types/index.ts           # TypeScript entity definitions
│   │   └── utils/formatters.ts     # Date/currency formatting
│   ├── package.json
│   ├── vite.config.ts
│   ├── tailwind.config.js
│   └── Dockerfile
│
├── start.sh                         # Unix/Mac one-command startup
├── start.bat                        # Windows one-command startup
├── AGENTS.md                        # Agent context (Bob)
└── README.md
```

## Data Flow

### Booking a Flight (Happy Path)

1. **Browse** — User opens `/flights`. Frontend calls `GET /flights`; backend queries all `Flight` rows and returns them as `FlightOut[]`.
2. **Identify** — User clicks "Book Now". If no cached user, `UserIdentification` component collects name + email and calls `POST /register`; backend upserts a `User` row and returns `user_id`.
3. **Confirm** — `BookingModal` shows flight details. User confirms; frontend calls `POST /book` with `{ user_id, flight_id }`.
4. **Persist** — Backend `book_flight()` service validates seats available, creates a `Booking` row (status=`confirmed`), decrements `seats_available` on the `Flight` row, and commits the transaction.
5. **Feedback** — Backend returns `BookingOut`. Frontend shows a toast notification and the booking appears on `MyBookings`.

### Cancellation

1. User opens `MyBookings` → frontend calls `GET /bookings/{user_id}`.
2. User clicks "Cancel" → frontend calls `POST /cancel/{booking_id}`.
3. Backend sets booking `status=cancelled` and increments `seats_available` on the flight.
4. Frontend updates the booking list in place.
