import { query, mutation } from "./_generated/server";
import { v } from "convex/values";

export const getSchemes = query({
  args: {},
  handler: async (ctx: any) => {
    return await ctx.db.query("schemes").collect();
  },
});

export const addScheme = mutation({
  args: {
    name: v.string(),
    code: v.string(),
    type: v.string(),
    totalCorpus: v.number(),
    allocatedYears: v.number(),
    currentYearBudget: v.number(),
    eligibilityRules: v.object({
      category: v.array(v.string()),
      ageMax: v.optional(v.number()),
      academicQualification: v.string(),
      minMarksPercent: v.optional(v.number()),
      incomeCeiling: v.number(),
      programmeType: v.string(),
    }),
    requiredDocs: v.array(v.string()),
    disbursementFrequency: v.string(),
    applicationWindow: v.object({
      startDate: v.string(),
      endDate: v.string(),
    }),
    selectionCriteria: v.string(),
    isActive: v.boolean(),
  },
  handler: async (ctx: any, args: any) => {
    return await ctx.db.insert("schemes", args);
  },
});
