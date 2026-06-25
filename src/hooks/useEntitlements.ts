import { useQuery, useQueryClient } from "@tanstack/react-query";
import { userApi } from "@/integrations/api";
import { useAuth } from "@/features/auth/useAuth";

export const entitlementsKey = ["entitlements"] as const;

/**
 * Quyền & giới hạn theo tier. Single source of truth cho gate UI (CREDIT_PREMIUM_SPEC.md 6.1).
 * staleTime ngắn; invalidate sau generate / thanh toán để số cập nhật.
 */
export function useEntitlements() {
  const { user } = useAuth();
  return useQuery({
    queryKey: entitlementsKey,
    queryFn: userApi.getEntitlements,
    enabled: !!user,
    staleTime: 30_000,
  });
}

export function useInvalidateEntitlements() {
  const qc = useQueryClient();
  return () => qc.invalidateQueries({ queryKey: entitlementsKey });
}
