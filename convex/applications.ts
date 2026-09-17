import { query, mutation } from "./_generated/server";
import { v } from "convex/values";
import { auth } from "./auth";

export const getApplications = query({
  args: {},
  handler: async (ctx) => {
    const userId = await auth.getUserId(ctx);
    if (!userId) {
      throw new Error("Unauthorized: Authentication required to access applications");
    }

    const user = await ctx.db.get(userId);
    if (!user) {
      throw new Error("Unauthorized: Authenticated user record not found");
    }

    const allApps = await ctx.db.query("applications").collect();

    if (user.role === "moTAAdmin") {
      return allApps;
    } else if (user.role === "instituteNodal") {
      // Return applications matching user's institute, or if none set return matching institute
      const targetInst = user.institute || "National Institute of Technology, Rourkela";
      return allApps.filter(
        (app) => app.institute?.toLowerCase() === targetInst.toLowerCase()
      );
    } else if (user.role === "student") {
      return allApps.filter(
        (app) => app.studentEmail === user.email || app.userId === userId
      );
    }

    throw new Error("Forbidden: Role lacks permission to access applications");
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
  handler: async (ctx, args) => {
    const userId = await auth.getUserId(ctx);
    if (!userId) {
      throw new Error("Unauthorized: Authentication required");
    }
    const user = await ctx.db.get(userId);
    if (!user) {
      throw new Error("Unauthorized: User not found");
    }
    if (user.role === "student") {
      throw new Error("Forbidden: Students cannot update application status");
    }

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
  handler: async (ctx, args) => {
    const userId = await auth.getUserId(ctx);
    if (!userId) {
      throw new Error("Unauthorized: Authentication required");
    }
    const user = await ctx.db.get(userId);
    if (!user || user.role !== "moTAAdmin") {
      throw new Error("Forbidden: Only MoTA Admin can apply human overrides");
    }

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
