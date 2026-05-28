"use client";

import { useActionState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { joinWaitlist, type JoinWaitlistState } from "./actions";

export function WaitlistForm({ source }: { source?: string }) {
  const [state, action, pending] = useActionState<JoinWaitlistState, FormData>(joinWaitlist, null);

  return (
    <form action={action} className="flex w-full max-w-md flex-col gap-2 sm:flex-row">
      {source && <input type="hidden" name="source" value={source} />}
      <Input
        type="email"
        name="email"
        required
        placeholder="you@example.com"
        className="sm:flex-1"
        aria-label="Email"
      />
      <Button type="submit" disabled={pending}>
        {pending ? "Joining…" : "Join the waitlist"}
      </Button>
      {state && (
        <p
          className={
            state.ok
              ? "w-full text-xs text-green-600 sm:basis-full"
              : "w-full text-xs text-red-600 sm:basis-full"
          }
          role="status"
        >
          {state.message}
        </p>
      )}
    </form>
  );
}
