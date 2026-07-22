# Internal Acquisition Desk — Interface Specification

## Purpose

The Internal Acquisition Desk is the operator-facing command center for moving a property lead from discovery through evaluation, seller follow-up, contract, buyer matching, and closing.

The first release is deliberately internal. It should help one operator make disciplined decisions quickly without hiding the reasoning produced by the deterministic decision engine.

## Product rule

The interface must answer four questions on every important screen:

1. What is happening?
2. What decision has been made?
3. What risk or missing fact could change that decision?
4. What should the operator do next?

## Primary navigation

### 1. Command Center

Default landing page for daily work.

Shows:

- new leads awaiting review;
- overdue follow-ups;
- appointments and deadlines due soon;
- deals requiring operator authorization;
- active contracts;
- buyer-response activity;
- pipeline value by stage;
- recent decision-engine outcomes;
- a single prioritized next-action queue.

Primary actions:

- Add property
- Evaluate lead
- Log contact attempt
- Create follow-up
- Open urgent deal

### 2. Properties

Searchable property and owner record index.

List columns:

- property address;
- owner name;
- lead source;
- distress indicators;
- pipeline stage;
- engine recommendation;
- confidence level;
- next action;
- assigned operator;
- last activity.

Filters:

- stage;
- recommendation;
- county/city/ZIP;
- vacant;
- code violation;
- tax delinquency;
- probate/estate;
- contact status;
- missing critical data;
- date added.

### 3. Deal Analyzer

Property underwriting workspace connected directly to the deterministic decision engine.

Input groups:

- property facts;
- seller situation;
- ARV and comparable-sale basis;
- repair assumptions;
- liens, taxes, title, and closing costs;
- buyer demand;
- target assignment fee;
- known risks and missing facts.

Output groups:

- recommendation: pursue, pursue with conditions, follow up, refer, or reject;
- maximum allowable offer;
- conservative, base, and optimistic cases;
- expected assignment spread;
- hard stops;
- risk flags;
- required conditions;
- confidence level;
- recommended next actions;
- explanation of which rules controlled the result.

The engine result is advisory. The operator must explicitly authorize any offer or override.

### 4. Seller Pipeline

Kanban and table views for seller-side operations.

Initial stages:

1. New
2. Researching
3. Ready to Contact
4. Attempting Contact
5. Qualified
6. Appointment Set
7. Evaluating
8. Offer Ready
9. Negotiating
10. Under Contract
11. Follow Up
12. Referred
13. Dead
14. Closed

Every card shows:

- address;
- seller name;
- motivation summary;
- recommendation;
- offer ceiling;
- next action and due date;
- days in stage;
- last contact result;
- critical risk badge.

### 5. Buyer Desk

Manual buyer CRM for the first release.

Buyer record fields:

- name/company;
- contact information;
- target areas;
- property types;
- price range;
- rehab tolerance;
- occupancy preference;
- desired discount;
- proof-of-funds status and expiration;
- preferred closing speed;
- communication preference;
- reliability score;
- prior offers, retrades, and closes;
- notes and exclusions.

Deal matching view:

- ranked buyer matches;
- match reasons;
- missing qualification information;
- outreach status;
- offer amount;
- earnest-money status;
- backup-buyer order.

### 6. Tasks & Activity

Unified operational history and queue.

Task types:

- call;
- text;
- email;
- public-record research;
- title follow-up;
- appointment;
- comp review;
- offer approval;
- contract deadline;
- buyer outreach;
- earnest-money check;
- closing check.

Activity entries must be append-only for audit purposes, with corrections recorded as new entries rather than silent deletion.

## Core screen layouts

## Command Center layout

### Header

- page title and current date;
- global property/owner search;
- Add Property button;
- operator profile and role.

### First row: operating pulse

Four compact cards:

- New leads
- Follow-ups due
- Deals needing decision
- Active contracts

Each card links to the filtered work queue rather than serving as decoration.

### Second row: Next Action Queue

The dominant module on the page.

Each row contains:

- urgency;
- property;
- action;
- reason;
- due time/date;
- owner/operator;
- one-click completion or reschedule.

Priority order:

1. legal/contract deadlines;
2. appointments and promised seller callbacks;
3. unresolved hard-stop conditions;
4. offer authorizations;
5. active buyer responses;
6. ordinary follow-up;
7. research tasks.

### Third row

Left: seller pipeline summary by stage.

Right: decision outcomes for the last 30 days, including confidence and rejection reasons.

### Fourth row

- recent activity;
- stalled leads;
- missing-data alerts.

## Property workspace layout

A single property record should use a persistent header and tabbed body.

### Persistent header

- address;
- stage;
- recommendation;
- confidence;
- owner;
- next action;
- assigned operator;
- Add Activity button;
- Evaluate button.

### Tabs

1. Overview
2. Owner & Seller
3. Property Research
4. Evaluation
5. Communications
6. Documents
7. Buyers
8. Activity

### Overview tab

- property summary;
- seller motivation summary;
- decision card;
- next action;
- open tasks;
- key numbers;
- critical risks;
- missing facts;
- recent activity.

## Decision card

The decision card is the most important reusable component in the product.

It must display:

- recommendation in plain language;
- confidence level;
- maximum offer;
- base-case assignment spread;
- controlling reasons;
- hard stops;
- conditions required before proceeding;
- missing information;
- recommended next actions;
- engine evaluation timestamp and version;
- operator authorization or override status.

An override requires:

- selected replacement decision;
- written reason;
- operator identity;
- timestamp.

The original engine recommendation must remain visible in history.

## Visual direction

The interface should feel like a disciplined acquisition desk, not a flashy real-estate seminar funnel.

### Tone

- dark, restrained, and professional;
- high contrast;
- compact but readable;
- numbers and actions first;
- warnings unmistakable;
- minimal animation.

### Suggested palette

- near-black/charcoal surfaces;
- warm ivory text;
- muted bronze or amber for primary actions;
- green only for verified positive states;
- red only for hard stops, expired deadlines, and destructive actions;
- blue or slate for informational states.

### Status treatment

Do not rely on color alone. Every status must include a text label and, where helpful, an icon.

## Responsive behavior

Desktop is primary because underwriting and research are information-dense.

Tablet should support field review and seller appointments.

Mobile should prioritize:

- next actions;
- property summary;
- click-to-call/contact logging;
- appointment notes;
- photo upload;
- quick status changes.

Complex underwriting tables may collapse into stacked sections on mobile.

## Access roles

Initial roles:

- Admin: full access, settings, users, overrides, exports;
- Acquisition Manager: all properties, evaluations, approvals, assignments;
- Acquisition Operator: assigned leads, research, contacts, draft evaluations;
- Disposition Operator: buyer records, matching, outreach, offer tracking;
- Read Only: view without editing.

## Public site boundary

The public website is not the first build priority. Its initial function is lead capture and trust.

Initial public pages:

- Home
- Sell Your Property
- How It Works
- About
- Contact
- Privacy
- Terms/Disclosures

The seller form should create a lead for review. It must not expose internal underwriting, buyer data, operator notes, or decision-engine reasoning.

## First clickable build slice

The first implementation should prove one complete operator journey:

1. Open Command Center.
2. Click Add Property.
3. Enter a fictional property and owner.
4. Open the Deal Analyzer.
5. Run the deterministic engine.
6. Review the decision card.
7. Save the evaluation.
8. Assign the next action.
9. See the property appear in the pipeline and Command Center queue.

## Technical recommendation

Convert the repository into a workspace rather than burying the engine inside a web framework.

Suggested structure:

```text
apps/
  web/                 # Next.js operator interface
packages/
  acquisition-engine/  # current deterministic domain and decision engine
  ui/                  # shared interface components later
docs/
```

For the first build, the web app may use fictional in-memory fixtures while the engine remains deterministic. Supabase persistence should follow after the workflow is usable and the data fields have stabilized.

## Definition of done for interface milestone 1

- Command Center renders with fictional work queues.
- Property intake creates a local fictional record.
- Deal Analyzer calls the existing decision engine.
- Decision card displays recommendation, offer limits, risks, conditions, confidence, and next actions.
- Operator can assign a next action.
- Property appears in a pipeline view.
- No production credentials or real seller data are stored in the repository.
