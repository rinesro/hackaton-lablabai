# Diagrams — Galaxium Travels

## Diagram 1 — Class Diagram

Domain models and their relationships, derived from `booking_system_backend/models.py`.

```mermaid
classDiagram
    class User {
        int user_id
        string name
        string email
    }

    class Flight {
        int flight_id
        string origin
        string destination
        string departure_time
        string arrival_time
        int price
        int seats_available
    }

    class Booking {
        int booking_id
        int user_id
        int flight_id
        string status
        string booking_time
    }

    User "1" --> "0..*" Booking : has
    Flight "1" --> "0..*" Booking : reserved via
```

## Diagram 2 — Sequence Diagram

Main user booking flow: browse → identify → book → view → cancel.

```mermaid
sequenceDiagram
    actor U as User (Browser)
    participant FE as React Frontend
    participant BE as FastAPI Backend
    participant DB as SQLite DB

    U->>FE: Navigate to /flights
    FE->>BE: GET /flights
    BE->>DB: SELECT * FROM flights
    DB-->>BE: Flight rows
    BE-->>FE: FlightOut[]
    FE-->>U: Render flight cards

    U->>FE: Click "Book Now" (new user)
    FE->>BE: POST /register {name, email}
    BE->>DB: INSERT INTO users
    DB-->>BE: user_id
    BE-->>FE: UserOut {user_id}

    U->>FE: Confirm booking in modal
    FE->>BE: POST /book {user_id, flight_id}
    BE->>DB: Check seats_available > 0
    DB-->>BE: Flight row
    BE->>DB: INSERT INTO bookings
    BE->>DB: UPDATE flights SET seats_available - 1
    DB-->>BE: booking_id
    BE-->>FE: BookingOut {booking_id, status}
    FE-->>U: Toast: "Booking confirmed!"

    U->>FE: Navigate to /my-bookings
    FE->>BE: GET /bookings/{user_id}
    BE->>DB: SELECT bookings JOIN flights WHERE user_id
    DB-->>BE: Booking + Flight rows
    BE-->>FE: BookingOut[]
    FE-->>U: Render booking cards

    U->>FE: Click "Cancel"
    FE->>BE: POST /cancel/{booking_id}
    BE->>DB: UPDATE bookings SET status = cancelled
    BE->>DB: UPDATE flights SET seats_available + 1
    DB-->>BE: OK
    BE-->>FE: BookingOut {status: cancelled}
    FE-->>U: Booking marked as cancelled
```
