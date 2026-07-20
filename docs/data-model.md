# Data Model Draft

Production records belong in an access-controlled database, not source control.

## Core tables

### properties

- id
- parcel_number
- street, city, state, postal_code, county
- property_type
- bedrooms, bathrooms, square_feet, year_built
- occupancy_status
- vacancy_indicators
- code_violation_status
- tax_delinquency_status
- created_at, updated_at

### owners

- id
- property_id
- legal_name
- mailing_address
- phone and email fields
- owner_type
- titled_owner_confirmed
- authority_status
- contact_confidence

### leads

- id
- property_id
- source
- source_record_reference
- motivation_score
- status
- assigned_operator
- next_action
- next_action_due_at
- follow_up_trigger

### deal_evaluations

- id
- lead_id
- rule_version
- input_snapshot JSON
- output_snapshot JSON
- decision
- confidence
- maximum_approved_price
- recommended_exit
- evaluated_at

### title_reviews

- id
- property_id
- title_company_or_attorney
- record_owner_confirmed
- probate_status
- bankruptcy_status
- foreclosure_status
- known_liens
- payoff_total
- risk_score
- review_status

### repair_estimates

- id
- property_id
- estimator
- low_estimate
- expected_estimate
- high_estimate
- confidence
- structural_flag
- permit_flag
- inspection_date

### buyers

- id
- name or entity
- contact fields
- target_areas
- property_types
- price_range
- rehab_tolerance
- proof_of_funds_status
- verified_at
- reliability_score

### buyer_activity

- id
- buyer_id
- deal_id
- offer_amount
- earnest_money_amount
- status
- retrade_amount
- closed_at
- cancellation_reason

### contracts

- id
- deal_id
- contract_type
- effective_date
- due_diligence_deadline
- closing_deadline
- assignment_allowed
- earnest_money
- status
- storage_reference

### tasks and communications

Every call, message, mailing, appointment, title request, inspection, and deadline should create a timestamped activity record.

## Security boundaries

- Separate authentication data from acquisition records.
- Encrypt sensitive fields at rest where appropriate.
- Apply row-level access controls.
- Use private object storage for contracts, IDs, photos, and title documents.
- Never log full credentials, Social Security numbers, bank data, or unredacted identification.
- Maintain an audit trail for exports, overrides, and record access.
