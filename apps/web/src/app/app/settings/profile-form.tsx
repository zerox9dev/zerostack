"use client";

import { useActionState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { updateProfile, type UpdateProfileState } from "./actions";

export function ProfileForm({ initialDisplayName }: { initialDisplayName: string }) {
  const [state, action, pending] = useActionState<UpdateProfileState, FormData>(updateProfile, null);

  return (
    <form action={action} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="displayName">Display name</Label>
        <Input
          id="displayName"
          name="displayName"
          maxLength={80}
          defaultValue={initialDisplayName}
          placeholder="How you want to be addressed"
        />
        <p className="text-xs text-muted-foreground">
          Up to 80 characters. Leave empty to clear.
        </p>
      </div>
      <div className="flex items-center justify-between gap-3">
        {state && (
          <span className={state.ok ? "text-sm text-green-600" : "text-sm text-red-600"} role="status">
            {state.message}
          </span>
        )}
        <Button type="submit" disabled={pending} className="ml-auto">
          {pending ? "Saving…" : "Save"}
        </Button>
      </div>
    </form>
  );
}
