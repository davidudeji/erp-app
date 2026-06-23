"use client";

import { motion } from "framer-motion";
import {
  TrendingUp,
  TrendingDown,
  DollarSign,
  ShoppingCart,
  Package,
  Users,
} from "lucide-react";
import AnalyticsCard from "@/components/analytics-card";
import RevenueChart from "@/components/revenue-chart";
import ActivityFeed from "@/components/activity-feed";
import InventoryOverview from "@/components/inventory-overview";

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.3,
    },
  },
};

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 },
};

export default function DashboardPage() {
  return (
    <div className="space-y-8 p-6 md:p-8">
      {/* Page Header */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
        <p className="mt-2 text-sm text-gray-400">
          Real-time insights into your business performance
        </p>
      </div>

      {/* Analytics Cards Grid */}
      <motion.div
        variants={container}
        initial="hidden"
        animate="show"
        className="grid gap-4 md:grid-cols-2 lg:grid-cols-4"
      >
        {/* Total Revenue */}
        <motion.div variants={item}>
          <AnalyticsCard
            title="Total Revenue"
            value="$124,650"
            change="+12.5%"
            isPositive={true}
            icon={DollarSign}
            trend={<TrendingUp className="h-4 w-4" />}
          />
        </motion.div>

        {/* Total Orders */}
        <motion.div variants={item}>
          <AnalyticsCard
            title="Total Orders"
            value="1,245"
            change="+8.2%"
            isPositive={true}
            icon={ShoppingCart}
            trend={<TrendingUp className="h-4 w-4" />}
          />
        </motion.div>

        {/* Inventory Items */}
        <motion.div variants={item}>
          <AnalyticsCard
            title="Inventory Items"
            value="3,456"
            change="-2.3%"
            isPositive={false}
            icon={Package}
            trend={<TrendingDown className="h-4 w-4" />}
          />
        </motion.div>

        {/* Active Customers */}
        <motion.div variants={item}>
          <AnalyticsCard
            title="Active Customers"
            value="892"
            change="+18.7%"
            isPositive={true}
            icon={Users}
            trend={<TrendingUp className="h-4 w-4" />}
          />
        </motion.div>
      </motion.div>

      {/* Main Charts */}
      <motion.div
        variants={container}
        initial="hidden"
        animate="show"
        className="grid gap-6 lg:grid-cols-3"
      >
        {/* Revenue Chart - Spans 2 cols */}
        <motion.div variants={item} className="lg:col-span-2">
          <RevenueChart />
        </motion.div>

        {/* Inventory Overview */}
        <motion.div variants={item}>
          <InventoryOverview />
        </motion.div>
      </motion.div>

      {/* Activity Feed */}
      <motion.div variants={item}>
        <ActivityFeed />
      </motion.div>
    </div>
  );
}
