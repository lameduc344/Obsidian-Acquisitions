export type Confidence = "low" | "medium" | "high";

export type Decision =
  | "pursue"
  | "pursue_with_conditions"
  | "follow_up"
  | "refer"
  | "reject";

export type ExitStrategy =
  | "assignment"
  | "double_close"
  | "joint_venture"
  | "listing_referral"
  | "seller_finance_review"
  | "long_term_follow_up"
  | "none";

export interface UnderwritingScenario {
  arv: number;
  buyerPercentage: number;
  repairs: number;
}

export interface DealInput {
  id: string;
  propertyAddress: string;
  sellerContractPrice: number;
  transactionReserve: number;
  targetAssignmentFee: number;
  minimumAssignmentFee: number;
  scenarios: {
    conservative: UnderwritingScenario;
    expected: UnderwritingScenario;
    optimistic: UnderwritingScenario;
  };
  seller: {
    titledOwnerConfirmed: boolean;
    authorityConfirmed: boolean;
    legalCapacityConfirmed: boolean;
    motivationScore: number;
    askingPriceFlexible: boolean;
    followUpTrigger?: string;
  };
  title: {
    bankruptcyOpen: boolean;
    deceasedOwnerUnresolved: boolean;
    foreclosureRestrictionUnreviewed: boolean;
    knownLienTotal?: number;
    riskScore: number;
  };
  property: {
    accessConfirmed: boolean;
    inspectionAllowed: boolean;
    conditionRiskScore: number;
    repairConfidence: Confidence;
  };
  market: {
    verifiedBuyerCount: number;
    buyerMarketScore: number;
    assignmentAccepted: boolean;
    likelyLenderRequiresDirectTitle: boolean;
  };
  execution: {
    complexityRiskScore: number;
    tenantOccupied: boolean;
    closingDaysAvailable: number;
  };
}

export interface ScenarioResult extends UnderwritingScenario {
  buyerPrice: number;
  spread: number;
}

export interface DealEvaluation {
  decision: Decision;
  confidence: Confidence;
  recommendedExit: ExitStrategy;
  maximumApprovedPrice: number;
  scenarios: {
    conservative: ScenarioResult;
    expected: ScenarioResult;
    optimistic: ScenarioResult;
  };
  hardStops: string[];
  conditions: string[];
  risks: string[];
  nextActions: string[];
  explanation: string;
}
