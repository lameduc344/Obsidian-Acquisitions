# Product Roadmap

## Phase 0 — Foundation

- Deterministic decision engine
- Strict domain types
- Simulated deal tests
- Policy and data-model documentation
- Continuous typecheck and test verification

## Phase 1 — Internal Acquisition Desk

- Property and owner intake
- Lead pipeline and next-action queue
- Three-case deal calculator
- Decision card with risks and conditions
- Manual buyer records
- Evaluation history and operator overrides

**Definition of done:** an operator can enter one property, evaluate it, save the decision, and assign the next action.

## Phase 2 — Supabase persistence

- Authentication and roles
- Properties, owners, leads, evaluations, buyers, tasks, and activities
- Row-level security
- Private document storage
- Audit log

## Phase 3 — Research workflow

- CSV import for public-record lists
- Duplicate detection by parcel and normalized address
- Research checklist for assessor, taxes, code enforcement, probate, and title
- Source citations and freshness timestamps

## Phase 4 — Seller operations

- Contact attempts and consent/status tracking
- Follow-up sequences
- Appointment notes
- Offer authorization workflow
- Contract and due-diligence deadline monitoring

## Phase 5 — Dispositions

- Buyer criteria and reliability scoring
- Deal-to-buyer matching
- Proof-of-funds verification status
- Buyer offers, earnest money, retrades, and closing performance
- Backup-buyer queue

## Phase 6 — Learning loop

Compare projections with outcomes:

- projected versus actual repair costs;
- projected ARV versus resale;
- recommended versus accepted offer;
- buyer reliability versus performance;
- failure reasons;
- profit by lead source, area, property type, and exit.

Machine-assisted recommendations should begin only after the deterministic rules and outcome records are trustworthy.
