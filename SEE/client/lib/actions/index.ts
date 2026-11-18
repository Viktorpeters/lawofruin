/* Actions: hooks that change something (send a code, sign in, sign out, ask a question), and
   then refresh whatever the change affects. */
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { keys } from "@/lib/queries/keys";
import { token, type Me } from "@/lib/api";
import { startEmail, verifyEmail } from "@/lib/services/auth.service";
import { askBook, type AskBody } from "@/lib/services/ask.service";
import type { Lang } from "@/lib/i18n";

export function useStartEmail() {
  return useMutation({ mutationFn: ({ email, lang }: { email: string; lang: Lang }) => startEmail(email, lang) });
}

/* signed in: keep the token, show the reader at once, and fetch again what depends on who they are */
export function useVerifyEmail() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ email, code, lang }: { email: string; code: string; lang: Lang }) => verifyEmail(email, code, lang),
    onSuccess: ({ token: t, user }) => {
      token.set(t);
      qc.setQueryData<Me | null>(keys.me, user);
      qc.invalidateQueries({ queryKey: keys.bookAll });
      qc.invalidateQueries({ queryKey: keys.purchases });
      qc.invalidateQueries({ queryKey: keys.earn });
    },
  });
}

export function useSignOut() {
  const qc = useQueryClient();
  return () => {
    token.set(null);
    qc.setQueryData<Me | null>(keys.me, null);
    qc.removeQueries({ queryKey: keys.earn });
    qc.invalidateQueries({ queryKey: keys.bookAll });
    qc.invalidateQueries({ queryKey: keys.purchases });
  };
}

export function useAsk() {
  return useMutation({ mutationFn: (body: AskBody) => askBook(body) });
}
