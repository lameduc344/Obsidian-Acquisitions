# Decision Engine Specification

## Purpose

The engine produces an explainable recommendation without independently binding the company. Human approval remains required for offers, contracts, earnest money, extensions, double closes, joint ventures, creative finance, and legal-risk transactions.

## Evaluation order

1. Validate authority, legal capacity, access, inspection rights, and legal restrictions.
2. Underwrite conservative, expected, and optimistic scenarios.
3. Calculate buyer prices, spreads, and offer ceilings.
4. Identify title, condition, market, and execution risks.
5. Select a recommended exit.
6. Return a decision, confidence level, conditions, risks, and next actions.

## Hard stops

Hard stops override otherwise favorable scores:

- record owner not confirmed;
- seller authority not confirmed;
- legal capacity not confirmed;
- property access unavailable;
- inspection or due diligence refused;
- unresolved bankruptcy;
- unresolved deceased-owner or probate authority;
- unreviewed foreclosure restrictions or deadlines.

A hard stop normally produces `refer`, not automatic rejection, because title or legal professionals may cure the problem.

## Underwriting

For each scenario:

```text
buyerPrice = ARV × buyerPercentage − repairs
spread = buyerPrice − sellerContractPrice − transactionReserve
```

Offer ceilings:

```text
conservativeCeiling = conservativeBuyerPrice − minimumFee − reserve
expectedCeiling = expectedBuyerPrice − targetFee − reserve
maximumApprovedPrice = min(conservativeCeiling, expectedCeiling)
```

The optimistic scenario measures upside; it does not authorize a higher offer.

## Decisions

### pursue

No hard stop, conservative spread meets the minimum fee, required facts are verified, and buyer demand is strong.

### pursue_with_conditions

Expected economics work, but repairs, title, occupancy, buyer demand, or another material fact requires verification.

### follow_up

The current spread is too thin and seller motivation does not justify a professional referral. Assign a trigger and follow-up date.

### refer

A professional cure, licensed listing, probate/title intervention, or other specialized path is more appropriate.

### reject

The deal has negative economics or cannot satisfy company policy at the current price.

## Exit selection

- Assignment when permitted and economically viable.
- Double close when direct title is required and expected spread is at least $25,000 before added costs.
- Listing referral when seller motivation exists but wholesale spread is insufficient.
- Long-term follow-up when motivation or price has not matured.

Future versions will add joint-venture, wholetail, seller-finance, and subject-to review policies only after legal and operational controls are written.

## Confidence

- `high`: repair confidence is high, title burden is known, and at least three verified buyers exist.
- `medium`: one significant input remains partially verified.
- `low`: a hard stop exists or repair confidence is low.

## Auditability

Every evaluation should eventually persist:

- input snapshot;
- rule-set version;
- output snapshot;
- operator decision;
- override reason;
- final deal outcome.
