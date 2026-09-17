import { query, mutation } from "./_generated/server";
import { v } from "convex/values";

export const getApplications = query({
  args: {},
  handler: async (ctx: any) => {
    return await ctx.db.query("applications").collect();
  },
});

export const updateApplicationStatus = mutation({
  args: {
    id: v.id("applications"),
    status: v.union(
      v.literal("Submitted"),
      v.literal("InitialValidation"),
      v.literal("DocumentScrutiny"),
      v.literal("EligibilityVerification"),
      v.literal("Screening"),
      v.literal("Selection"),
      v.literal("FinalDecision")
    ),
  },
  handler: async (ctx: any, args: any) => {
    return await ctx.db.patch(args.id, {
      status: args.status,
      lastUpdatedAt: new Date().toISOString(),
    });
  },
});

export const applyHumanOverride = mutation({
  args: {
    id: v.id("applications"),
    overriddenBy: v.string(),
    reason: v.string(),
    newStatus: v.string(),
    newScore: v.optional(v.number()),
  },
  handler: async (ctx: any, args: any) => {
    const app = await ctx.db.get(args.id);
    if (!app) throw new Error("Application not found");

    return await ctx.db.patch(args.id, {
      humanOverride: {
        overriddenBy: args.overriddenBy,
        overriddenAt: new Date().toISOString(),
        reason: args.reason,
        previousStatus: app.status,
        newStatus: args.newStatus,
        previousScore: app.aiScore,
        newScore: args.newScore || app.aiScore,
      },
      status: args.newStatus as any,
      aiScore: args.newScore !== undefined ? args.newScore : app.aiScore,
      lastUpdatedAt: new Date().toISOString(),
    });
  },
});
