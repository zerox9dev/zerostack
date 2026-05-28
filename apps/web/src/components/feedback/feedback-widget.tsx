"use client";

import { MessageCircle, X } from "lucide-react";
import { usePathname } from "next/navigation";
import { useActionState, useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { submitFeedback, type FeedbackState } from "./actions";

export function FeedbackWidget() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  const [state, action, pending] = useActionState<FeedbackState, FormData>(submitFeedback, null);
  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    if (state?.ok) {
      formRef.current?.reset();
      const t = setTimeout(() => setOpen(false), 1500);
      return () => clearTimeout(t);
    }
  }, [state]);

  return (
    <div className="fixed bottom-4 right-4 z-50">
      {open ? (
        <div className="w-80 rounded-xl border bg-card p-4 shadow-lg">
          <div className="mb-3 flex items-center justify-between">
            <p className="font-medium">Send feedback</p>
            <Button
              type="button"
              variant="ghost"
              size="icon"
              aria-label="Close feedback"
              onClick={() => setOpen(false)}
            >
              <X className="size-4" />
            </Button>
          </div>
          <form ref={formRef} action={action} className="space-y-3">
            <input type="hidden" name="page" value={pathname} />
            <Textarea
              name="message"
              required
              rows={4}
              maxLength={5000}
              placeholder="What's working? What's broken? What's missing?"
            />
            <div className="flex items-center justify-between gap-2">
              {state ? (
                <span className={state.ok ? "text-xs text-green-600" : "text-xs text-red-600"}>
                  {state.message}
                </span>
              ) : (
                <span />
              )}
              <Button type="submit" size="sm" disabled={pending}>
                {pending ? "Sending…" : "Send"}
              </Button>
            </div>
          </form>
        </div>
      ) : (
        <Button
          type="button"
          size="icon"
          className="size-12 rounded-full shadow-lg"
          aria-label="Send feedback"
          onClick={() => setOpen(true)}
        >
          <MessageCircle className="size-5" />
        </Button>
      )}
    </div>
  );
}
