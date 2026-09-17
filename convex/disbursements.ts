import { query, mutation } from "./_generated/server";
import { v } from "convex/values";
import { auth } from "./auth";

export const getDisbursements = query({
  args: {},
  handler: async (ctx) => {
    const userId = await auth.getUserId(ctx);
    if (!userId) {
      throw new Error("Unauthorized: Authentication required");
    }
    const user = await ctx.db.get(userId);
    if (!user) throw new Error("Unauthorized: User not found");

    const all = await ctx.db.query("disbursements").collect();

    if (user.role === "moTAAdmin") {
      return all;
    } else if (user.role === "student") {
      return all.filter((d) => d.studentEmail === user.email);
    } else {
      return all;
    }
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
    const userId = await auth.getUserId(ctx);
    if (!userId) {
      throw new Error("Unauthorized: Authentication required");
    }
    const user = await ctx.db.get(userId);
    if (!user || user.role !== "moTAAdmin") {
      throw new Error("Forbidden: Only MoTA Admin can release disbursements");
    }

    return await ctx.db.insert("disbursements", {
      ...args,
      releasedAt: new Date().toISOString().split("T")[0],
      status: "Disbursed",
      transactionRef: `PFMS/2026/MOTA/${Math.floor(100000 + Math.random() * 900000)}`,
    });
  },
});
