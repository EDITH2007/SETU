import { query, mutation } from "./_generated/server";
import { v } from "convex/values";
import { auth } from "./auth";

export const getDisbursements = query({
  args: {},
  handler: async (ctx) => {
    const userId = await auth.getUserId(ctx);
    const all = await ctx.db.query("disbursements").collect();
    if (!userId) {
      return all;
    }
    const user = await ctx.db.get(userId);
    if (!user) return all;

    if (user.role === "student" && user.email) {
      return all.filter((d) => d.studentEmail === user.email);
    }
    return all;
  },
});

export const releaseDisbursement = mutation({
  args: {
    schemeId: v.string(),
    applicationId: v.string(),
    studentName: v.string(),
    studentEmail: v.optional(v.string()),
    quarter: v.string(),
    amountReleased: v.number(),
  },
  handler: async (ctx, args) => {
    return await ctx.db.insert("disbursements", {
      ...args,
      releasedAt: new Date().toISOString().split("T")[0],
      status: "Disbursed",
      transactionRef: `PFMS/2026/MOTA/${Math.floor(100000 + Math.random() * 900000)}`,
    });
  },
});

export const seedDisbursements = mutation({
  args: {
    disbursements: v.array(
      v.object({
        schemeId: v.string(),
        applicationId: v.string(),
        studentName: v.string(),
        studentEmail: v.optional(v.string()),
        quarter: v.string(),
        amountReleased: v.number(),
        releasedAt: v.string(),
        status: v.union(
          v.literal("Scheduled"),
          v.literal("Processing"),
          v.literal("Disbursed"),
          v.literal("Flagged")
        ),
        transactionRef: v.string(),
      })
    ),
  },
  handler: async (ctx, args) => {
    const existing = await ctx.db.query("disbursements").take(1);
    if (existing.length === 0) {
      for (const d of args.disbursements) {
        await ctx.db.insert("disbursements", d);
      }
    }
  },
});

export const resetDisbursements = mutation({
  args: {
    initialDisbursements: v.array(
      v.object({
        schemeId: v.string(),
        applicationId: v.string(),
        studentName: v.string(),
        studentEmail: v.optional(v.string()),
        quarter: v.string(),
        amountReleased: v.number(),
        releasedAt: v.string(),
        status: v.union(
          v.literal("Scheduled"),
          v.literal("Processing"),
          v.literal("Disbursed"),
          v.literal("Flagged")
        ),
        transactionRef: v.string(),
      })
    ),
  },
  handler: async (ctx, args) => {
    const all = await ctx.db.query("disbursements").collect();
    for (const d of all) {
      await ctx.db.delete(d._id);
    }
    for (const d of args.initialDisbursements) {
      await ctx.db.insert("disbursements", d);
    }
  },
});
