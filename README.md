# QualiTrack

QualiTrack is a starter Quality Control Management System built for manufacturing traceability. The current scaffold focuses on the MVP: capturing incoming goods inspections, storing QC results, and automatically raising an NCR when failures are recorded.

## MVP Scope

- Role-ready full-stack architecture
- Incoming QC data capture
- PostgreSQL schema for core QC records
- Automatic NCR creation on failed quantities
- React-based web app starter with a production-style layout

## Tech Stack

- Frontend: React
- Backend: Node.js + Express
- Database: PostgreSQL
- Authentication: JWT in a future phase
- File storage: Cloudinary or Firebase in a future phase

## Project Structure

```text
QualiTrack/
├── backend/
│   ├── sql/
│   │   ├── schema.sql
│   │   └── seed.sql
│   ├── src/
│   │   ├── config/
│   │   │   └── db.js
│   │   ├── controllers/
│   │   │   └── qcController.js
│   │   ├── middleware/
│   │   │   └── errorHandler.js
│   │   ├── routes/
│   │   │   └── qcRoutes.js
│   │   ├── utils/
│   │   │   └── buildNcrNumber.js
│   │   └── app.js
│   ├── .env.example
│   ├── package.json
│   └── README.md
├── docs/
│   └── architecture.md
├── frontend/
│   ├── scripts/
│   │   ├── build.mjs
│   │   ├── dev.mjs
│   │   └── preview.mjs
│   ├── src/
│   │   ├── components/
│   │   │   └── AppShell.jsx
│   │   ├── pages/
│   │   │   └── IncomingQC.jsx
│   │   ├── services/
│   │   │   └── api.js
│   │   ├── App.jsx
│   │   ├── main.jsx
│   │   └── styles.css
│   ├── .env.example
│   ├── index.html
│   ├── package.json
│   └── README.md
├── .gitignore
└── README.md
```

## Getting Started

### 1. Backend

```bash
cd backend
npm install
copy .env.example .env
```

Update `.env` with your PostgreSQL credentials, then create the database schema:

```bash
psql -U postgres -d qualitrack -f sql/schema.sql
psql -U postgres -d qualitrack -f sql/seed.sql
npm run dev
```

### 2. Frontend

```bash
cd frontend
npm install
npm run dev
```

The frontend defaults to `http://localhost:5000/api`.

## How The App Works

### 1. You start the backend

The Express API starts from `backend/src/app.js` and connects to PostgreSQL using the settings in `backend/.env`.

### 2. You start the frontend

The React app loads the Incoming QC page, which is the first working module in the system.

### 3. The page loads existing inspection data

When the page opens, the frontend sends a request to:

```text
GET /api/qc/incoming/summary
```

The backend returns:

- Total inspections
- Total quantity received
- Total failed quantity
- Recent inspection records

This data is shown in the dashboard cards and the recent inspections panel.

### 4. The inspector fills in the Incoming QC form

The user enters:

- PO number
- Part number
- Supplier ID
- Inspector ID
- Quantity received
- Quantity passed
- Quantity failed
- Inspection comments

### 5. The frontend submits the form to the backend

When the user clicks `Submit Incoming QC`, the frontend sends:

```text
POST /api/qc/incoming
```

The form data is sent as JSON from `frontend/src/pages/IncomingQC.jsx` through `frontend/src/services/api.js`.

### 6. The backend validates the data

Inside `backend/src/controllers/qcController.js`, the backend checks that:

- Required fields are present
- Supplier ID and inspector ID are valid numbers
- Quantities are numeric
- Quantities are not negative
- Passed + failed does not exceed received

If validation fails, the API returns an error response and nothing is saved.

### 7. The backend saves the inspection

If validation passes, the backend opens a database transaction and inserts the inspection into the `incoming_qc` table.

The record is saved with:

- The QC details
- Comments
- Any photo URLs
- A status of `Accepted` or `Rejected`

### 8. The backend checks for failures

If the failed quantity is greater than `0`, the backend automatically:

- Generates an NCR number
- Creates an NCR record in the `ncrs` table
- Links the NCR to the saved Incoming QC record
- Marks the inspection as `Rejected`

This happens in the same transaction, so the QC record and NCR stay in sync.

### 9. The frontend shows the result

After the save:

- A success message is shown
- The form resets
- The app reloads the summary data
- The new inspection appears in the recent inspections list

### 10. What the current MVP covers

Right now, the app supports:

- Incoming goods inspection capture
- Database storage of QC records
- Automatic NCR creation for failed quantities
- A simple inspection history view

## Next Build Steps

1. Add JWT authentication and role-based access.
2. Add supplier, part, and user management screens.
3. Add photo upload integration.
4. Add PDF report generation.
5. Expand into in-process QC, PCB testing, final QC, and warranty claims.
