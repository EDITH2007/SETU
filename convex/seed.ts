import { mutation } from "./_generated/server";
import { v } from "convex/values";

export const seedInitialData = mutation({
  args: {
    schemes: v.any(),
    applications: v.any(),
    grievances: v.any(),
    disbursements: v.any(),
  },
  handler: async (ctx, args) => {
    // Check if schemes table is empty
    const existingSchemes = await ctx.db.query("schemes").take(1);
    if (existingSchemes.length === 0 && args.schemes) {
      for (const s of args.schemes) {
        const { id, ...rest } = s;
        await ctx.db.insert("schemes", rest);
      }
    }

    // Check if applications table is empty
    const existingApps = await ctx.db.query("applications").take(1);
    if (existingApps.length === 0 && args.applications) {
      for (const app of args.applications) {
        const { id, documents, ...rest } = app;
        const appDbId = await ctx.db.insert("applications", rest);
        if (documents && Array.isArray(documents)) {
          for (const doc of documents) {
            const { id: docId, ...docRest } = doc;
            await ctx.db.insert("documents", {
              ...docRest,
              applicationId: appDbId,
            });
          }
        }
      }
    }

    // Check if grievances table is empty
    const existingGrv = await ctx.db.query("grievances").take(1);
    if (existingGrv.length === 0 && args.grievances) {
      for (const g of args.grievances) {
        const { id, ...rest } = g;
        await ctx.db.insert("grievances", rest);
      }
    }

    // Check if disbursements table is empty
    const existingDisb = await ctx.db.query("disbursements").take(1);
    if (existingDisb.length === 0 && args.disbursements) {
      for (const d of args.disbursements) {
        const { id, ...rest } = d;
        await ctx.db.insert("disbursements", rest);
      }
    }

    return { success: true };
  },
});
