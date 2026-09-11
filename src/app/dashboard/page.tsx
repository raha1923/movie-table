import { Suspense } from "react";
import { ContentDashboard } from "@/components/dashboard/content-dashboard";

function DashboardFallback() {
  return (
    <div className="mx-auto flex w-full max-w-7xl flex-1 items-center justify-center px-4 py-24 text-sm text-muted">
      Loading dashboard…
    </div>
  );
}

export default function DashboardPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <Suspense fallback={<DashboardFallback />}>
        <ContentDashboard />
      </Suspense>
    </div>
  );
}
