import { userSchema, type User } from "@zerostack/contracts";

export const demoUser: User = userSchema.parse({
  id: "00000000-0000-0000-0000-000000000000",
  email: "demo@zerostack.dev",
  createdAt: new Date().toISOString(),
});
