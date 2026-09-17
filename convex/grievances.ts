import { query, mutation } from "./_generated/server";
import { v } from "convex/values";
import { auth } from "./auth";

export const getGrievances = query({
  args: {},
  handler: async (ctx) => {
    const userId = await auth.getUserId(ctx);
    if (!userId) {
      throw new Error("Unauthorized: Authentication required");
    }
    const user = await ctx.db.get(userId);
    if (!user) {
      throw new Error("Unauthorized: User not found");
    }

    const all = await ctx.db.query("grievances").collect();

    if (user.role === "moTAAdmin") {
      return all;
    } else if (user.role === "student") {
      return all.filter((g) => g.studentEmail === user.email);
    } else if (user.role === "instituteNodal") {
      return all;
    }

    throw new Error("Forbidden: Invalid role");
  },
});

export const raiseGrievance = mutation({
  args: {
    applicationId: v.string(),
    applicationNumber: v.string(),
    studentName: v.string(),
    schemeName: v.string(),
    subject: v.string(),
    description: v.string(),
  },
  handler: async (ctx, args) => {
    const userId = await auth.getUserId(ctx);
    if (!userId) {
      throw new Error("Unauthorized: Authentication required");
    }
    const user = await ctx.db.get(userId);
    if (!user) throw new Error("Unauthorized: User not found");

    const raisedAt = new Date().toISOString();
    const slaDeadline = new Date(Date.now() + 7 * 86400000).toISOString();

    return await ctx.db.insert("grievances", {
      ...args,
      studentEmail: user.email,
      raisedAt,
      slaDeadline,
      status: "Open",
      escalationLevel: 1,
    });
  },
});

export const resolveGrievance = mutation({
  args: {
    id: v.id("grievances"),
    resolutionNotes: v.string(),
  },
  handler: async (ctx, args) => {
    const userId = await auth.getUserId(ctx);
    if (!userId) {
      throw new Error("Unauthorized: Authentication required");
    }
    const user = await ctx.db.get(userId);
    if (!user || user.role !== "moTAAdmin") {
      throw new Error("Forbidden: Only MoTA Admin can resolve grievances");
    }

    return await ctx.db.patch(args.id, {
      status: "Resolved",
      resolvedAt: new Date().toISOString(),
      resolutionNotes: args.resolutionNotes,
    });
  },
});
