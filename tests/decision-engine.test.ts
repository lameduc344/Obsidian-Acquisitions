import { describe, expect, it } from "vitest";
import { evaluateDeal, type DealInput } from "../src/index.js";

const baseDeal: DealInput = {
  id: "deal-clean-001",
  propertyAddress: "101 Simulation Way, Atlanta, GA",
  sellerContractPrice: 121_000,
  transactionReserve: 2_000,
  targetAssignmentFee: 15_000,
  minimumAssignmentFee: 10_000,
  scenarios: {
    conservative: { arv: 245_000, buyerPercentage: 0.75, repairs: 48_000 },
    expected: { arv: 250_000, buyerPercentage: 0.76, repairs: 45_000 },
    optimistic: { arv: 260_000, buyerPercentage: 0.78, repairs: 42_000 },
  },
  seller: {
    titledOwnerConfirmed: true,
    authorityConfirmed: true,
    legalCapacityConfirmed: true,
    motivationScore: 78,
    askingPriceFlexible: true,
  },
  title: {
    bankruptcyOpen: false,
    deceasedOwnerUnresolved: false,
    foreclosureRestrictionUnreviewed: false,
    knownLienTotal: 0,
    riskScore: 10,
  },
  property: {
    accessConfirmed: true,
    inspectionAllowed: true,
    conditionRiskScore: 25,
    repairConfidence: "high",
  },
  market: {
    verifiedBuyerCount: 6,
    buyerMarketScore: 82,
    assignmentAccepted: true,
    likelyLenderRequiresDirectTitle: false,
  },
  execution: {
    complexityRiskScore: 20,
    tenantOccupied: false,
    closingDaysAvailable: 21,
  },
};

describe("evaluateDeal", () => {
  it("pursues a clean deal with verified margin and demand", () => {
    const result = evaluateDeal(baseDeal);
    expect(result.decision).toBe("pursue");
    expect(result.recommendedExit).toBe("assignment");
    expect(result.hardStops).toHaveLength(0);
  });

  it("requires conditions when repair confidence and buyer depth are weak", () => {
    const result = evaluateDeal({
      ...baseDeal,
      property: { ...baseDeal.property, repairConfidence: "low" },
      market: { ...baseDeal.market, verifiedBuyerCount: 1 },
    });
    expect(result.decision).toBe("pursue_with_conditions");
    expect(result.conditions.length).toBeGreaterThanOrEqual(2);
    expect(result.confidence).toBe("low");
  });

  it("refers an unresolved probate deal instead of blessing the score", () => {
    const result = evaluateDeal({
      ...baseDeal,
      seller: { ...baseDeal.seller, authorityConfirmed: false },
      title: { ...baseDeal.title, deceasedOwnerUnresolved: true },
    });
    expect(result.decision).toBe("refer");
    expect(result.hardStops).toContain("Deceased-owner or probate authority is unresolved.");
  });

  it("rejects a deal with negative expected economics", () => {
    const result = evaluateDeal({ ...baseDeal, sellerContractPrice: 190_000 });
    expect(result.decision).toBe("reject");
  });

  it("selects a double close only when the spread can support it", () => {
    const result = evaluateDeal({
      ...baseDeal,
      sellerContractPrice: 100_000,
      market: {
        ...baseDeal.market,
        assignmentAccepted: false,
        likelyLenderRequiresDirectTitle: true,
      },
    });
    expect(result.recommendedExit).toBe("double_close");
  });
});
