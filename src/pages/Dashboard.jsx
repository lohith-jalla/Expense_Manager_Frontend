import React, { useEffect, useMemo, useState } from "react";
import axios from "axios";
import {
  Tooltip, ResponsiveContainer,
  LineChart, Line, XAxis, YAxis, CartesianGrid,
  BarChart, Bar,
} from "recharts";

import { ResponsivePie } from "@nivo/pie";

const API_BASE = "http://localhost:8081/expense";
const API_BASE_2= "http://localhost:8080/user";

// Nice, distinct palette
const COLORS = ["#4f46e5", "#22c55e", "#f97316", "#06b6d4", "#ef4444", "#a855f7", "#10b981", "#f59e0b"];

// --- helpers ---
const currency = (n) =>
  (Number.isFinite(n) ? n : 0).toLocaleString(undefined, { style: "currency", currency: "INR", maximumFractionDigits: 2 });

// try to sort month keys like "Jan", "Feb", "Aug 2025", "2025-08", etc.
const sortMonthKeys = (keys) => {
  const monthIndex = { jan:0,feb:1,mar:2,apr:3,may:4,jun:5,jul:6,aug:7,sep:8,oct:9,nov:10,dec:11 };
  const parseKey = (k) => {
    const s = String(k).toLowerCase().trim();
    // "Aug 2025"
    const m1 = s.match(/^(jan|feb|mar|apr|may|jun|jul|aug|sep|oct|nov|dec)[a-z]*\s+(\d{4})$/i);
    if (m1) return { y: Number(m1[2]), m: monthIndex[m1[1].slice(0,3).toLowerCase()], raw: k };
    // "Jan"
    const m2 = s.match(/^(jan|feb|mar|apr|may|jun|jul|aug|sep|oct|nov|dec)/i);
    if (m2) return { y: 0, m: monthIndex[m2[1].slice(0,3).toLowerCase()], raw: k };
    // "2025-08"
    const m3 = s.match(/^(\d{4})[-/](\d{1,2})$/);
    if (m3) return { y: Number(m3[1]), m: Number(m3[2]) - 1, raw: k };
    // fallback keep as is
    return { y: 0, m: 0, raw: k };
  };
  return [...keys].sort((a, b) => {
    const A = parseKey(a), B = parseKey(b);
    if (A.y !== B.y) return A.y - B.y;
    if (A.m !== B.m) return A.m - B.m;
    return String(A.raw).localeCompare(String(B.raw));
  });
};

// --- component ---
const Dashboard = () => {
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState(null);

  // raw responses
  const [progressPage, setProgressPage] = useState(null);  // Page<Object>
  const [mapByType, setMapByType] = useState({});          // Map<ExpenseType, Double>
  const [mapMonthly, setMapMonthly] = useState({});        // Map<String, Double>
  const [mapWeekly, setMapWeekly] = useState({});          // Map<String, Double>

  useEffect(() => {
    (async () => {
      try {
        setLoading(true);
        setErr(null);
        const token = localStorage.getItem("jwtToken");
        const headers = token ? { Authorization: `Bearer ${token}` } : {};

        const [progressRes, monthlyRes, weeklyRes, categoryRes , Limit] = await Promise.all([
          axios.get(`${API_BASE}/progress`, { headers }),
          axios.get(`${API_BASE}/monthly-summary`, { headers }),
          axios.get(`${API_BASE}/weekly-summary`, { headers }),
          axios.get(`${API_BASE}/summary/type`, { headers }),
          axios.get(`${API_BASE_2}/getLimit`,{ headers })
        ]);

        setProgressPage(progressRes?.data ?? null);
        setMapMonthly(monthlyRes?.data ?? {});
        setMapWeekly(weeklyRes?.data ?? {});
        setMapByType(categoryRes?.data ?? {});
      } catch (e) {
        console.error("Dashboard fetch error:", e);
        setErr(e?.response?.data?.message || e.message || "Failed to load");
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  // ---- derived values ----

  // total from /progress content
  const totalExpenses = useMemo(() => {
    const content = Array.isArray(progressPage?.content) ? progressPage.content : Array.isArray(progressPage) ? progressPage : [];
    return content.reduce((acc, item) => acc + Number(item?.total || 0), 0);
  }, [progressPage]);

  // monthly trend array for recharts
  const monthlyData = useMemo(() => {
    if (!mapMonthly || typeof mapMonthly !== "object") return [];
    const keys = sortMonthKeys(Object.keys(mapMonthly));
    return keys.map((k) => ({ month: k, total: Number(mapMonthly[k] || 0) }));
  }, [mapMonthly]);

  // latest month total (last after sorting)
  const monthlyLatest = monthlyData.length ? monthlyData[monthlyData.length - 1].total : 0;

  // weekly trend array
  const weeklyData = useMemo(() => {
    if (!mapWeekly || typeof mapWeekly !== "object") return [];
    const keys = Object.keys(mapWeekly);
    // attempt to keep "Week1, Week2" sorted numerically
    const sorted = [...keys].sort((a, b) => {
      const na = Number(String(a).match(/\d+/)?.[0] || 0);
      const nb = Number(String(b).match(/\d+/)?.[0] || 0);
      if (na !== nb) return na - nb;
      return String(a).localeCompare(String(b));
    });
    return sorted.map((k) => ({ week: k, total: Number(mapWeekly[k] || 0) }));
  }, [mapWeekly]);

  const weeklyLatest = weeklyData.length ? weeklyData[weeklyData.length - 1].total : 0;

  // categories from map to array with percentage
  const categoryData = useMemo(() => {
    if (!mapByType || typeof mapByType !== "object") return [];
    const entries = Object.entries(mapByType); // [[ "FOOD", 200 ], ["TRAVEL", 150 ]]
    const sum = entries.reduce((acc, [, v]) => acc + Number(v || 0), 0);
    return entries.map(([type, amount]) => ({
      name: String(type).replace(/_/g, " "),
      value: Number(amount || 0),
      pct: sum > 0 ? (Number(amount || 0) / sum) * 100 : 0,
    }));
  }, [mapByType]);

  const topCategory = useMemo(() => {
    if (!categoryData.length) return { name: "-", value: 0 };
    return categoryData.slice().sort((a, b) => b.value - a.value)[0];
  }, [categoryData]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 p-6 flex items-center justify-center">
        <div className="animate-pulse text-gray-600">Loading dashboard…</div>
      </div>
    );
  }

  if (err) {
    return (
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="max-w-4xl mx-auto">
          <div className="bg-red-50 text-red-700 border border-red-200 rounded-xl p-4">
            <div className="font-semibold mb-1">Failed to load dashboard</div>
            <div className="text-sm">{String(err)}</div>
            <div className="text-xs mt-2 text-red-600/80">
              Tip: ensure your JWT is in <code>localStorage.jwtToken</code> and the backend is running on <code>8081</code>.
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Dashboard</h1>

        {/* Stat Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-2xl shadow p-5">
            <div className="text-sm text-gray-500">Total Expenses</div>
            <div className="text-xl font-extrabold mt-1">{currency(totalExpenses)}</div>
          </div>
          <div className="bg-white rounded-2xl shadow p-5">
            <div className="text-sm text-gray-500">This Month</div>
            <div className="text-xl font-extrabold mt-1">{currency(monthlyLatest)}</div>
          </div>
          <div className="bg-white rounded-2xl shadow p-5">
            <div className="text-sm text-gray-500">This Week</div>
            <div className="text-xl font-extrabold mt-1">{currency(weeklyLatest)}</div>
          </div>
          <div className="bg-white rounded-2xl shadow p-5">
            <div className="text-sm text-gray-500">Top Category</div>
            <div className="text-xl font-extrabold mt-1 text-green-600">
              {topCategory.name} {topCategory.value ? `· ${currency(topCategory.value)}` : ""}
            </div>
          </div>
        </div>

        {/* Charts grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
          <div className="bg-white rounded-2xl shadow p-10">
            <h2 className="text-lg font-semibold mb-4">Category Breakdown</h2>
            {categoryData.length ? (
              <div style={{ height: 320 }}>
                <ResponsivePie
                  data={categoryData.map((c) => ({
                    id: c.name,
                    label: c.name,
                    value: c.value,
                  }))}
                  margin={{ top: 40, right: 80, bottom: 80, left: 80 }}
                  innerRadius={0.5} // donut style
                  padAngle={1}
                  cornerRadius={3}
                  activeOuterRadiusOffset={8}
                  colors={{ scheme: "set2" }} // nice color palette
                  borderWidth={1}
                  borderColor={{ from: "color", modifiers: [["darker", 0.2]] }}
                  arcLinkLabelsSkipAngle={10}
                  arcLinkLabelsTextColor="#333"
                  arcLinkLabelsThickness={2}
                  arcLinkLabelsColor={{ from: "color" }}
                  arcLabelsSkipAngle={10}
                  arcLabelsTextColor={{ from: "color", modifiers: [["darker", 2]] }}
                  tooltip={({ datum }) => (
                    <div
                      style={{
                        padding: "6px 9px",
                        background: "white",
                        border: "1px solid #ddd",
                        borderRadius: "6px",
                      }}
                    >
                      <strong>{datum.id}</strong>: {currency(datum.value)}
                    </div>
                  )}
                />
              </div>
            ) : (
              <div className="text-gray-500 text-sm">No category data.</div>
            )}
          </div>

          {/* Monthly Line */}
          <div className="bg-white rounded-2xl shadow p-6">
            <h2 className="text-lg font-semibold mb-4">Monthly Trend</h2>
            {monthlyData.length ? (
              <ResponsiveContainer width="100%" height={320}>
                <LineChart data={monthlyData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip formatter={(v) => currency(v)} />
                  <Line type="monotone" dataKey="total" stroke="#4f46e5" strokeWidth={2} dot />
                </LineChart>
              </ResponsiveContainer>
            ) : (
              <div className="text-gray-500 text-sm">No monthly data.</div>
            )}
          </div>

          {/* Weekly Bar (full width on large screens) */}
          <div className="bg-white rounded-2xl shadow p-6 lg:col-span-2">
            <h2 className="text-lg font-semibold mb-4">Weekly Summary</h2>
            {weeklyData.length ? (
              <ResponsiveContainer width="100%" height={320}>
                <BarChart data={weeklyData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="week" />
                  <YAxis />
                  <Tooltip formatter={(v) => currency(v)} />
                  <Bar dataKey="total" fill="#22c55e" />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="text-gray-500 text-sm">No weekly data.</div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
