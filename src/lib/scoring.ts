import { Scheme, Application, DocumentItem, AiScoreReasoning, ScoreRuleBreakdown } from "@/types";

export function calculateDeterministicEligibilityScore(
  scheme: Scheme,
  incomeAmount: number,
  marksPercent: number,
  age: number,
  category: string,
  documents: DocumentItem[]
): { aiScore: number; reasoning: AiScoreReasoning } {
  const scoreBreakdown: ScoreRuleBreakdown[] = [];
  let totalScore = 0;

  // 1. Category Check (Max 25 pts)
  const isCategoryValid = scheme.eligibilityRules.category.includes(category);
  if (isCategoryValid) {
    totalScore += 25;
    scoreBreakdown.push({
      rule: "Category Eligibility (Scheduled Tribe)",
      weight: 25,
      status: "Passed",
      detail: `Applicant category '${category}' matches mandatory requirement [${scheme.eligibilityRules.category.join(", ")}] (+25 pts).`,
    });
  } else {
    scoreBreakdown.push({
      rule: "Category Eligibility (Scheduled Tribe)",
      weight: 25,
      status: "Failed",
      detail: `Applicant category '${category}' does not match required categories [${scheme.eligibilityRules.category.join(", ")}] (+0 pts).`,
    });
  }

  // 2. Household Income Ceiling Check (Max 30 pts)
  const incomeCeiling = scheme.eligibilityRules.incomeCeiling;
  if (incomeAmount <= incomeCeiling) {
    // Give max points, plus small merit weight if lower income tier
    const incomeRatio = incomeAmount / incomeCeiling;
    const score = Math.round(25 + (1 - incomeRatio) * 5);
    totalScore += score;
    scoreBreakdown.push({
      rule: "Income Ceiling Compliance",
      weight: 30,
      status: "Passed",
      detail: `Annual household income ₹${incomeAmount.toLocaleString("en-IN")} is within scheme ceiling ₹${incomeCeiling.toLocaleString("en-IN")} (+${score} pts).`,
    });
  } else {
    scoreBreakdown.push({
      rule: "Income Ceiling Compliance",
      weight: 30,
      status: "Failed",
      detail: `Annual household income ₹${incomeAmount.toLocaleString("en-IN")} exceeds ceiling ₹${incomeCeiling.toLocaleString("en-IN")} (+0 pts).`,
    });
  }

  // 3. Academic Qualification / Marks Check (Max 25 pts)
  const minMarks = scheme.eligibilityRules.minMarksPercent || 50;
  if (marksPercent >= minMarks) {
    const markBonus = Math.min(10, Math.round(((marksPercent - minMarks) / (100 - minMarks)) * 10));
    const score = 15 + markBonus;
    totalScore += score;
    scoreBreakdown.push({
      rule: "Academic Merit Threshold",
      weight: 25,
      status: "Passed",
      detail: `Academic score of ${marksPercent}% meets minimum requirement of ${minMarks}% (+${score} pts).`,
    });
  } else {
    scoreBreakdown.push({
      rule: "Academic Merit Threshold",
      weight: 25,
      status: "Failed",
      detail: `Academic score of ${marksPercent}% is below required ${minMarks}% threshold (+0 pts).`,
    });
  }

  // 4. Age Limit Check (Max 10 pts)
  if (scheme.eligibilityRules.ageMax) {
    const ageMax = scheme.eligibilityRules.ageMax;
    if (age <= ageMax) {
      totalScore += 10;
      scoreBreakdown.push({
        rule: "Age Limit Criteria",
        weight: 10,
        status: "Passed",
        detail: `Applicant age ${age} yrs is within maximum limit of ${ageMax} yrs (+10 pts).`,
      });
    } else {
      scoreBreakdown.push({
        rule: "Age Limit Criteria",
        weight: 10,
        status: "Failed",
        detail: `Applicant age ${age} yrs exceeds maximum limit of ${ageMax} yrs (+0 pts).`,
      });
    }
  } else {
    totalScore += 10;
    scoreBreakdown.push({
      rule: "Age Limit Criteria",
      weight: 10,
      status: "Passed",
      detail: `No upper age restriction specified for scheme (+10 pts).`,
    });
  }

  // 5. Document Completeness & Scrutiny (Max 10 pts)
  const requiredCount = scheme.requiredDocs.length;
  const validDocsCount = documents.filter(
    (doc) => doc.verificationStatus === "Available"
  ).length;

  if (requiredCount > 0) {
    const docScore = Math.round((validDocsCount / requiredCount) * 10);
    totalScore += docScore;
    if (validDocsCount === requiredCount) {
      scoreBreakdown.push({
        rule: "Document Scrutiny Completeness",
        weight: 10,
        status: "Passed",
        detail: `All ${requiredCount} required documents uploaded and verified (+10 pts).`,
      });
    } else {
      scoreBreakdown.push({
        rule: "Document Scrutiny Completeness",
        weight: 10,
        status: "Warning",
        detail: `Only ${validDocsCount} of ${requiredCount} required documents verified (${requiredCount - validDocsCount} pending/deficient) (+${docScore} pts).`,
      });
    }
  }

  const finalScore = Math.min(100, Math.max(0, totalScore));

  const summary =
    finalScore >= 75
      ? `High Eligibility Fit (${finalScore}/100): Candidate satisfies key statutory rules and academic thresholds.`
      : finalScore >= 50
      ? `Moderate Eligibility Fit (${finalScore}/100): Candidate passes basic criteria but requires human review or document correction.`
      : `Low Eligibility Fit (${finalScore}/100): Candidate fails core statutory limits (income or category criteria).`;

  return {
    aiScore: finalScore,
    reasoning: {
      scoreBreakdown,
      summary,
    },
  };
}
