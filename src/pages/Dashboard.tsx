import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { DashboardStats } from "@/types";
import { useCustom } from "@refinedev/core";
import {
  Area,
  AreaChart,
  CartesianGrid,
  Cell,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { Users, GraduationCap, BookOpen, Building2 } from "lucide-react";

const CAPACITY_COLORS = { ok: "#22c55e", warning: "#f59e0b", full: "#ef4444" };

const enrollmentChartConfig = {
  count: { label: "Enrollments", color: "#3b82f6" },
};

const departmentChartConfig = {
  count: { label: "Classes", color: "#8b5cf6" },
};

const userDistributionChartConfig = {
  count: { label: "Users", color: "#06b6d4" },
};

const Dashboard = () => {
  const { query } = useCustom<{ data: DashboardStats }>({
    url: "dashboard/stats",
    method: "get",
  });

  const stats = query.data?.data?.data;
  const isLoading = query.isLoading;

  if (isLoading) {
    return (
      <div className="p-6">
        <p>Loading dashboard...</p>
      </div>
    );
  }

  if (!stats) {
    return (
      <div className="p-6">
        <p>
          {query.error instanceof Error
            ? query.error.message
            : "Failed to load dashboard data."}
        </p>
      </div>
    );
  }

  const capacityData = [
    { name: "OK", value: stats.capacityStatus.ok, key: "ok" as const },
    {
      name: "Warning",
      value: stats.capacityStatus.warning,
      key: "warning" as const,
    },
    { name: "Full", value: stats.capacityStatus.full, key: "full" as const },
  ];

  const overviewCards = [
    { label: "Users", value: stats.overview.users, icon: Users },
    { label: "Classes", value: stats.overview.classes, icon: GraduationCap },
    { label: "Enrollments", value: stats.overview.enrollments, icon: BookOpen },
    {
      label: "Departments",
      value: stats.overview.departments,
      icon: Building2,
    },
  ];

  return (
    <div className="space-y-6 p-1">
      <h1 className="page-title">Dashboard</h1>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {overviewCards.map(({ label, value, icon: Icon }) => (
          <Card key={label}>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">{label}</CardTitle>
              <Icon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{value}</div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Enrollment Trends (30 days)</CardTitle>
          </CardHeader>
          <CardContent className="h-64">
            <ChartContainer
              config={enrollmentChartConfig}
              className="h-full w-full"
            >
              <AreaChart data={stats.enrollmentTrends}>
                <CartesianGrid vertical={false} />
                <XAxis dataKey="date" tick={{ fontSize: 11 }} />
                <YAxis allowDecimals={false} />
                <ChartTooltip content={<ChartTooltipContent />} />
                <ChartLegend content={<ChartLegendContent />} />
                <Area
                  type="monotone"
                  dataKey="count"
                  stroke="var(--color-count)"
                  fill="var(--color-count)"
                  fillOpacity={0.2}
                />
              </AreaChart>
            </ChartContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Classes by Department</CardTitle>
          </CardHeader>
          <CardContent className="h-64">
            <ChartContainer
              config={departmentChartConfig}
              className="h-full w-full"
            >
              <AreaChart data={stats.classesByDepartment}>
                <CartesianGrid vertical={false} />
                <XAxis dataKey="department" tick={{ fontSize: 11 }} />
                <YAxis allowDecimals={false} />
                <ChartTooltip content={<ChartTooltipContent />} />
                <ChartLegend content={<ChartLegendContent />} />
                <Area
                  type="monotone"
                  dataKey="count"
                  stroke="var(--color-count)"
                  fill="var(--color-count)"
                  fillOpacity={0.2}
                />
              </AreaChart>
            </ChartContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Capacity Status</CardTitle>
          </CardHeader>
          <CardContent className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={capacityData}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  label
                >
                  {capacityData.map((entry) => (
                    <Cell key={entry.key} fill={CAPACITY_COLORS[entry.key]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>User Distribution</CardTitle>
          </CardHeader>
          <CardContent className="h-64">
            <ChartContainer
              config={userDistributionChartConfig}
              className="h-full w-full"
            >
              <AreaChart data={stats.userDistribution}>
                <CartesianGrid vertical={false} />
                <XAxis dataKey="role" tick={{ fontSize: 11 }} />
                <YAxis allowDecimals={false} />
                <ChartTooltip content={<ChartTooltipContent />} />
                <ChartLegend content={<ChartLegendContent />} />
                <Area
                  type="monotone"
                  dataKey="count"
                  stroke="var(--color-count)"
                  fill="var(--color-count)"
                  fillOpacity={0.2}
                />
              </AreaChart>
            </ChartContainer>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle>Avg Class Size</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">{stats.metrics.avgClassSize}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Fill Rate</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">{stats.metrics.fillRate}%</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Active Classes</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">{stats.metrics.activeClasses}</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Recent Activity</CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="space-y-2">
            {stats.activityFeed.length === 0 && (
              <li className="text-muted-foreground text-sm">
                No recent activity
              </li>
            )}
            {stats.activityFeed.map((item) => (
              <li
                key={item.id}
                className="flex items-center justify-between text-sm border-b pb-2"
              >
                <span>
                  <strong>{item.actorName ?? "System"}</strong> {item.action}{" "}
                  {item.entityType} #{item.entityId}
                </span>
                <span className="text-muted-foreground">
                  {new Date(item.createdAt).toLocaleString()}
                </span>
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>
    </div>
  );
};

export default Dashboard;
