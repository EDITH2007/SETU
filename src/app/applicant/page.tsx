"use client";

import React from "react";
import { RouteGuard } from "@/components/auth/RouteGuard";
import { ApplicantPortal } from "@/components/applicant/ApplicantPortal";

export default function ApplicantPage() {
  return (
    <RouteGuard allowedRoles={["student"]}>
      <div className="min-h-full pb-12">
        <ApplicantPortal />
      </div>
    </RouteGuard>
  );
}
