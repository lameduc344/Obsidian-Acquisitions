import type {
  Confidence,
  DealEvaluation,
  DealInput,
  ExitStrategy,
  ScenarioResult,
  UnderwritingScenario,
} from "./domain.js";

const clampScore = (value: number): number => Math.max(0, Math.min(100, value));

function evaluateScenario(
  scenario: UnderwritingScenario,
  sellerContractPrice: number,
  transactionReserve: number,
): ScenarioResult {
  const buyerPrice = scenario.arv * scenario.buyerPercentage - scenario.repairs;
  return {
    ...scenario,
    buyerPrice,
    spread: buyerPrice - sellerContractPrice - transactionReserve,
  };
}

function confidenceFor(input: DealInput, hardStops: string[]): Confidence {
  if (hardStops.length > 0 || input.property.repairConfidence === "low") return "low";
  if (
    input.property.repairConfidence === "medium" ||
    input.market.verifiedBuyerCount < 3 ||
    input.title.knownLienTotal === undefined
  ) {
    return "medium";
  }
  return "high";
}

function chooseExit(input: DealInput, expectedSpread: number): ExitStrategy {
  if (expectedSpread < input.minimumAssignmentFee) {
    return input.seller.motivationScore >= 65 ? "listing_referral" : "long_term_follow_up";
  }
  if (!input.market.assignmentAccepted || input.market.likelyLenderRequiresDirectTitle) {
    return expectedSpread >= 25_000 ? "double_close" : "none";
  }
  return "assignment";
}

export function evaluateDeal(input: DealInput): DealEvaluation {
  const conservative = evaluateScenario(
    input.scenarios.conservative,
    input.sellerContractPrice,
    input.transactionReserve,
  );
  const expected = evaluateScenario(
    input.scenarios.expected,
    input.sellerContractPrice,
    input.transactionReserve,
  );
  const optimistic = evaluateScenario(
    input.scenarios.optimistic,
    input.sellerContractPrice,
    input.transactionReserve,
  );

  const hardStops: string[] = [];
  const conditions: string[] = [];
  const risks: string[] = [];
  const nextActions: string[] = [];

  if (!input.seller.titledOwnerConfirmed) hardStops.push("Record owner is not confirmed.");
  if (!input.seller.authorityConfirmed) hardStops.push("Seller authority to convey title is not confirmed.");
  if (!input.seller.legalCapacityConfirmed) hardStops.push("Seller legal capacity is not confirmed.");
  if (!input.property.accessConfirmed) hardStops.push("Property access is not confirmed.");
  if (!input.property.inspectionAllowed) hardStops.push("Seller will not allow required due diligence.");
  if (input.title.bankruptcyOpen) hardStops.push("Open bankruptcy requires professional review.");
  if (input.title.deceasedOwnerUnresolved) hardStops.push("Deceased-owner or probate authority is unresolved.");
  if (input.title.foreclosureRestrictionUnreviewed) {
    hardStops.push("Foreclosure restrictions or deadlines have not been reviewed.");
  }

  if (input.property.repairConfidence !== "high") {
    conditions.push("Obtain an interior inspection and written repair estimate.");
    risks.push(`Repair estimate confidence is ${input.property.repairConfidence}.`);
  }
  if (input.market.verifiedBuyerCount < 3) {
    conditions.push("Confirm demand with at least three verified buyers.");
    risks.push("Buyer demand is not yet deep enough for reliable disposition.");
  }
  if (input.title.knownLienTotal === undefined) {
    conditions.push("Open title and obtain lien and payoff figures.");
    risks.push("Net proceeds and title burden are not fully known.");
  }
  if (input.title.riskScore >= 60) risks.push("Title complexity is high.");
  if (input.property.conditionRiskScore >= 60) risks.push("Property-condition risk is high.");
  if (input.execution.complexityRiskScore >= 60) risks.push("Execution complexity is high.");
  if (input.execution.tenantOccupied) conditions.push("Verify occupancy, access rights, and tenant transition plan.");
  if (input.execution.closingDaysAvailable < 14) risks.push("Closing timeline leaves little room for cure or replacement buyers.");

  const conservativeCeiling =
    conservative.buyerPrice - input.minimumAssignmentFee - input.transactionReserve;
  const expectedCeiling = expected.buyerPrice - input.targetAssignmentFee - input.transactionReserve;
  const maximumApprovedPrice = Math.max(0, Math.min(conservativeCeiling, expectedCeiling));

  const recommendedExit = chooseExit(input, expected.spread);
  const confidence = confidenceFor(input, hardStops);

  let decision: DealEvaluation["decision"];
  if (hardStops.length > 0) {
    decision = "refer";
    nextActions.push("Resolve every hard stop before authorizing a contract.");
  } else if (expected.spread < 0 || maximumApprovedPrice <= 0) {
    decision = "reject";
    nextActions.push("Do not contract at the current price.");
  } else if (expected.spread < input.minimumAssignmentFee) {
    decision = input.seller.motivationScore >= 65 ? "refer" : "follow_up";
    nextActions.push(
      input.seller.followUpTrigger
        ? `Follow up when: ${input.seller.followUpTrigger}`
        : "Place the lead in long-term follow-up.",
    );
  } else if (
    conservative.spread >= input.minimumAssignmentFee &&
    conditions.length === 0 &&
    input.market.buyerMarketScore >= 65
  ) {
    decision = "pursue";
    nextActions.push("Prepare an operator-reviewed offer within the approved ceiling.");
  } else {
    decision = "pursue_with_conditions";
    nextActions.push(...conditions);
    nextActions.push("Re-run evaluation after required facts are verified.");
  }

  const normalizedMotivation = clampScore(input.seller.motivationScore);
  const normalizedBuyerMarket = clampScore(input.market.buyerMarketScore);
  const explanation = [
    `Expected spread: $${Math.round(expected.spread).toLocaleString("en-US")}.`,
    `Conservative spread: $${Math.round(conservative.spread).toLocaleString("en-US")}.`,
    `Seller motivation: ${normalizedMotivation}/100.`,
    `Buyer market: ${normalizedBuyerMarket}/100.`,
    `Recommended exit: ${recommendedExit}.`,
  ].join(" ");

  return {
    decision,
    confidence,
    recommendedExit,
    maximumApprovedPrice,
    scenarios: { conservative, expected, optimistic },
    hardStops,
    conditions,
    risks,
    nextActions: [...new Set(nextActions)],
    explanation,
  };
}
