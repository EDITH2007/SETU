"use client";

import React from "react";
import { RouteGuard } from "@/components/auth/RouteGuard";
import { AdminPortal } from "@/components/admin/AdminPortal";

export default function AdminPage() {
  return (
    <RouteGuard allowedRoles={["moTAAdmin"]}>
      <div className="min-h-full pb-12">
        <AdminPortal />
      </div>
    </RouteGuard>
  );
}
