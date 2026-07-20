# Obsidian Acquisitions

An internal real-estate acquisition operating system for finding distressed and vacant properties, evaluating wholesale opportunities, managing seller and buyer pipelines, and producing explainable deal decisions.

## First milestone

Enter a simulated property and receive one of five decisions:

- `pursue`
- `pursue_with_conditions`
- `follow_up`
- `refer`
- `reject`

Every decision includes offer ceilings, three-case underwriting, risk flags, required conditions, and next actions.

## Principles

1. Hard stops outrank scores.
2. Conservative underwriting outranks optimistic projections.
3. Missing information lowers confidence.
4. The engine advises; a human authorizes contracts and money movement.
5. Real seller, buyer, title, and contract data must not be committed to source control.

## Repository map

- `src/domain.ts` — core business types
- `src/decision-engine.ts` — deterministic evaluation logic
- `src/index.ts` — public exports
- `tests/decision-engine.test.ts` — executable deal scenarios
- `docs/decision-engine.md` — policy and rule specification
- `docs/data-model.md` — future persistence model
- `docs/roadmap.md` — staged build plan

## Local setup

```bash
npm install
npm test
npm run typecheck
```

## Security

This repository contains software and fictional test fixtures only. Keep production credentials in environment variables and store personally identifiable information in an access-controlled database, not GitHub.

## Status

Foundation draft: deterministic decision engine and documentation.