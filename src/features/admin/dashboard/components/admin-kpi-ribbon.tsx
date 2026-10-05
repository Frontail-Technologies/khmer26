"use client"

import {
  SquaresFour,
  Flag,
  CheckCircle,
  Hourglass,
  Handshake,
} from "@phosphor-icons/react"
import { AdminMetricGroup, type AdminMetricItemProps } from "@/features/admin/components/admin-metric-group"
import { useAdminDashboard } from "../hooks/dashboard.queries"

const formatCount = (value?: number) => (value ?? 0).toLocaleString()

export function AdminKpiRibbon() {
  const { data } = useAdminDashboard()
  const listings = data?.listings

  const metrics: AdminMetricItemProps[] = [
    {
      label: "Total Listings",
      value: formatCount(listings?.total),
      subtext: "Cumulative volume",
      icon: <SquaresFour size={16} weight="bold" />,
      tone: "primary",
    },
    {
      label: "Flagged Listings",
      value: formatCount(listings?.flagged),
      subtext: "Needs moderation",
      icon: <Flag size={16} weight="bold" />,
      tone: "destructive",
    },
    {
      label: "Active Listings",
      value: formatCount(listings?.active),
      subtext: "Live on marketplace",
      icon: <CheckCircle size={16} weight="bold" />,
      tone: "success",
    },
    {
      label: "Expired Listings",
      value: formatCount(listings?.expired),
      subtext: "Awaiting renewal",
      icon: <Hourglass size={16} weight="bold" />,
      tone: "warning",
    },
    {
      label: "Sold Listings",
      value: formatCount(listings?.sold),
      subtext: "Closed transactions",
      icon: <Handshake size={16} weight="bold" />,
      tone: "neutral",
    },
  ]

  return <AdminMetricGroup metrics={metrics} columns={5} />
}
