# Starter Tasks — Galaxium Travels

Five suggested first tickets for a new contributor. Tasks span both frontend and backend, range from Easy to Medium, and point to the exact files you will need to touch.

---

### Task 1: Add a Logout Button to the Header
**Difficulty:** Easy  
**Why it's a good first task:** The logout function already exists inside `useUser.tsx` — you only need to add the UI button. You'll learn how the custom hook pattern works and practice conditional rendering inside a shared layout component.

**Files to touch:**
- `booking_system_frontend/src/components/layout/Header.tsx` — add the logout button, conditionally rendered when a user is signed in
- `booking_system_frontend/src/hooks/useUser.tsx` — read-only reference; contains the `logout()` method you will call

**What to do:**
- Import `useUser` at the top of `Header.tsx`
- Destructure `const { user, logout } = useUser()`
- Render a "Sign out" button only when `user !== null`
- On click, call `logout()` (it clears the user from context and localStorage)
- Optionally call `useNavigate()` to redirect to `/` after logout
- Style using the existing `Button` component with `variant="secondary"` to match the header palette

---

### Task 2: Show a Low-Seats Warning Badge on FlightCard
**Difficulty:** Easy  
**Why it's a good first task:** The component already computes `isLowSeats` — you are purely enhancing the UI. Good exercise in Tailwind conditional classes and Framer Motion animations.

**Files to touch:**
- `booking_system_frontend/src/components/flights/FlightCard.tsx` — add a visual alert badge when `isLowSeats` is true (the boolean is computed near the top of the component)

**What to do:**
- Locate the `isLowSeats` variable (already set to `true` when `seats_available <= 2`)
- Above the "Book Now" button, add a badge element rendered only when `isLowSeats === true`
- Show text like `"Only {flight.seats_available} seat(s) left!"`
- Import `AlertCircle` from `lucide-react` and place it inline with the text
- Add a gentle Framer Motion pulse: `animate={{ opacity: [1, 0.5, 1] }}` with `transition={{ repeat: Infinity, duration: 2 }}`
- Use `text-orange-400` or the existing `solar-orange` theme colour for visual urgency

---

### Task 3: Add Price-Range Filtering to the Flights Page
**Difficulty:** Medium  
**Why it's a good first task:** The filter section in `Flights.tsx` already exists — you extend it with two numeric inputs. Good exercise in controlled inputs, derived state, and array filtering.

**Files to touch:**
- `booking_system_frontend/src/pages/Flights.tsx` — add `minPrice` / `maxPrice` state and filter logic (the existing search filter lives here and shows the pattern to follow)
- `booking_system_frontend/src/utils/formatters.ts` — read-only reference; `formatCurrency()` is useful for display labels

**What to do:**
- Add two state variables: `const [minPrice, setMinPrice] = useState<number | undefined>()`; same for `maxPrice`
- Inside the filter card, add two side-by-side `<input type="number">` fields with placeholder text "Min $" and "Max $"
- Extend the existing `filteredFlights` derivation to also check: `flight.price >= (minPrice ?? 0) && flight.price <= (maxPrice ?? Infinity)`
- Add a "Clear filters" link/button that resets both states to `undefined`
- Display a results count ("Showing N of M flights") below the filter row

---

### Task 4: Add an API Endpoint for Booking Statistics
**Difficulty:** Medium  
**Why it's a good first task:** Follows the exact same pattern as every other endpoint in `server.py` (route → service function → DB query). Good introduction to SQLAlchemy aggregation queries and Pydantic response models.

**Files to touch:**
- `booking_system_backend/schemas.py` — add a `BookingStatistics` Pydantic response model
- `booking_system_backend/services/booking.py` — add a `get_booking_statistics(db)` function
- `booking_system_backend/server.py` — add a `GET /stats/bookings` route that calls the new service function

**What to do:**
- In `schemas.py`, define:
  ```python
  class BookingStatistics(BaseModel):
      total_bookings: int
      active_bookings: int
      cancelled_bookings: int
      total_revenue: int
  ```
- In `services/booking.py`, query `Booking` rows grouped by status and join `Flight` for price; return counts and sum of prices for active bookings
- In `server.py`, add `@app.get("/stats/bookings", response_model=BookingStatistics)` wired to the new service function
- Verify by opening http://localhost:8080/docs and using the "Try it out" button on the new endpoint

---

### Task 5: Display Flight Duration on FlightCard
**Difficulty:** Easy–Medium  
**Why it's a good first task:** Pure UI work using an existing utility function. Teaches you how utility helpers are consumed in components and gives you a feel for the type definitions.

**Files to touch:**
- `booking_system_frontend/src/components/flights/FlightCard.tsx` — call `calculateDuration()` and render the result alongside departure/arrival times
- `booking_system_frontend/src/utils/formatters.ts` — read-only reference; `calculateDuration(departure, arrival)` already exists and returns a formatted string like "14h 30m"

**What to do:**
- Import `calculateDuration` from `../../utils/formatters`
- Call it inside the component: `const duration = calculateDuration(flight.departure_time, flight.arrival_time)`
- Render the duration between the departure and arrival time rows, e.g., `"✈ 14h 30m"` with a small plane icon from `lucide-react`
- Align it centrally between the origin and destination columns to match the existing layout
- Confirm the display looks correct with the pre-seeded flights (Earth→Mars is notably long)

---

## How to Pick Your First Task

| If you prefer… | Start with |
|---|---|
| Pure UI / component work | Task 2 or Task 5 |
| State management & filtering | Task 3 |
| Auth / user flows | Task 1 |
| Backend / API work | Task 4 |

**General workflow:**
1. Run the app locally (`./start.sh` or manual start — see `docs/setup.md`)
2. Read the files listed in your chosen task before touching anything
3. Make the change in small commits
4. Validate: `npm run build` for frontend changes, `pytest` for backend changes
