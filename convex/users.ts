import { query, mutation } from "./_generated/server";
import { auth } from "./auth";
import { v } from "convex/values";

export const getCurrentUser = query({
  args: {},
  handler: async (ctx) => {
    const userId = await auth.getUserId(ctx);
    if (!userId) {
      return null;
    }
    const user = await ctx.db.get(userId);
    return user;
  },
});

export const updateUserRole = mutation({
  args: {
    role: v.union(
      v.literal("student"),
      v.literal("instituteNodal"),
      v.literal("moTAAdmin")
    ),
    institute: v.optional(v.string()),
    name: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const userId = await auth.getUserId(ctx);
    if (!userId) throw new Error("Unauthorized: User not logged in");
    
    await ctx.db.patch(userId, {
      role: args.role,
      ...(args.institute ? { institute: args.institute } : {}),
      ...(args.name ? { name: args.name } : {}),
    });
    
    return await ctx.db.get(userId);
  },
});
