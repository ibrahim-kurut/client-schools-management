"use client";
import React from 'react';
import { useParams } from 'next/navigation';
import MembersManagement from "@/components/dashboard/members/MembersManagement";

export default function MembersPage() {
  const { slug } = useParams();

  return <MembersManagement slug={slug} />;
}
