import { convexAuth } from "@convex-dev/auth/server";
import { Password } from "@convex-dev/auth/providers/Password";

export const { auth, signIn, signOut, store, isAuthenticated } = convexAuth({
  providers: [
    Password({
      profile(params: any) {
        return {
          email: params.email as string,
          name: (params.name as string) || (params.email as string).split("@")[0],
          role: (params.role as any) || "student",
          institute: params.institute as string,
        };
      },
    }),
  ],
});
