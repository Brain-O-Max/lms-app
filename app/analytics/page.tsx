'use client';

import DashboardLayout from '@/components/DashboardLayout';
import Script from 'next/script';
import { useEffect, useRef, useState } from 'react';

interface AnalyticsData {
  keyMetrics: { totalBeneficiaries: number; completions: number; activeSessions: number; avgCompletionRate: number };
  locationChart: { labels: string[]; data: number[] };
  genderChart: { male: number; female: number };
  moduleChart: { labels: string[]; data: number[] };
  trendsChart: { labels: string[]; data: number[] };
  umPerformance: { labels: string[]; data: number[] };
}

export default function AnalyticsPage() {
  const chartsInitialized = useRef(false);
  const [data, setData] = useState<AnalyticsData | null>(null);

  useEffect(() => {
    fetch('/api/analytics')
      .then((res) => res.json())
      .then((d) => setData(d))
      .catch(() => {});
  }, []);

  useEffect(() => {
    if (!data || chartsInitialized.current) return;
    const initCharts = () => {
      if (typeof window === 'undefined' || !(window as unknown as Record<string, unknown>).Chart) return;
      const Chart = (window as unknown as Record<string, unknown>).Chart as any;
      chartsInitialized.current = true;

      Chart.defaults.font.family = "'Inter', sans-serif";
      Chart.defaults.color = '#6b7280';

      const locEl = document.getElementById('locationChart') as HTMLCanvasElement;
      if (locEl) {
        new Chart(locEl, {
          type: 'bar',
          data: { labels: data.locationChart.labels, datasets: [{ label: 'Participants', data: data.locationChart.data, backgroundColor: ['rgba(102,126,234,0.8)', 'rgba(118,75,162,0.8)', 'rgba(59,130,246,0.8)', 'rgba(139,92,246,0.8)', 'rgba(99,102,241,0.8)'], borderRadius: 8 }] },
          options: { responsive: true, maintainAspectRatio: false, plugins: { legend: { display: false } }, scales: { y: { beginAtZero: true } } },
        });
      }

      const genEl = document.getElementById('genderChart') as HTMLCanvasElement;
      if (genEl) {
        new Chart(genEl, {
          type: 'doughnut',
          data: { labels: ['Male', 'Female'], datasets: [{ data: [data.genderChart.male, data.genderChart.female], backgroundColor: ['rgba(59,130,246,0.8)', 'rgba(236,72,153,0.8)'], borderWidth: 0 }] },
          options: { responsive: true, maintainAspectRatio: false, plugins: { legend: { position: 'bottom' } } },
        });
      }

      const umEl = document.getElementById('umPerformanceChart') as HTMLCanvasElement;
      if (umEl) {
        new Chart(umEl, {
          type: 'bar',
          data: { labels: data.umPerformance.labels, datasets: [{ label: 'Sessions Conducted', data: data.umPerformance.data, backgroundColor: 'rgba(16,185,129,0.8)', borderRadius: 8 }] },
          options: { responsive: true, maintainAspectRatio: false, indexAxis: 'y', plugins: { legend: { display: false } }, scales: { x: { beginAtZero: true } } },
        });
      }

      const trendEl = document.getElementById('trendsChart') as HTMLCanvasElement;
      if (trendEl) {
        new Chart(trendEl, {
          type: 'line',
          data: { labels: data.trendsChart.labels, datasets: [{ label: 'Completions', data: data.trendsChart.data, borderColor: 'rgba(102,126,234,1)', backgroundColor: 'rgba(102,126,234,0.1)', fill: true, tension: 0.4, borderWidth: 3 }] },
          options: { responsive: true, maintainAspectRatio: false, plugins: { legend: { display: false } }, scales: { y: { beginAtZero: true } } },
        });
      }

      const modEl = document.getElementById('moduleChart') as HTMLCanvasElement;
      if (modEl) {
        new Chart(modEl, {
          type: 'bar',
          data: { labels: data.moduleChart.labels, datasets: [{ label: 'Completion Rate (%)', data: data.moduleChart.data, backgroundColor: ['rgba(102,126,234,0.8)', 'rgba(16,185,129,0.8)', 'rgba(245,158,11,0.8)', 'rgba(236,72,153,0.8)', 'rgba(239,68,68,0.8)'], borderRadius: 8 }] },
          options: { responsive: true, maintainAspectRatio: false, plugins: { legend: { display: false } }, scales: { y: { beginAtZero: true, max: 100, ticks: { callback: (v: number) => v + '%' } } } },
        });
      }
    };

    if ((window as unknown as Record<string, unknown>).Chart) {
      initCharts();
    } else {
      const interval = setInterval(() => {
        if ((window as unknown as Record<string, unknown>).Chart) {
          clearInterval(interval);
          initCharts();
        }
      }, 100);
      return () => clearInterval(interval);
    }
  }, [data]);

  const km = data?.keyMetrics;

  return (
    <DashboardLayout navVariant="gradient">
      <Script src="https://cdn.jsdelivr.net/npm/chart.js@4.4.1/dist/chart.umd.min.js" strategy="afterInteractive" />

      <div className="container">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--space-2xl)', flexWrap: 'wrap', gap: 'var(--space-md)' }}>
          <div>
            <h1>Analytics Dashboard</h1>
            <p className="text-muted">Track performance metrics and insights</p>
          </div>
          <select className="form-select" id="dateRange">
            <option value="7">Last 7 days</option>
            <option value="30" defaultChecked>Last 30 days</option>
            <option value="90">Last 90 days</option>
            <option value="365">Last year</option>
          </select>
        </div>

        {/* Key Metrics */}
        <div className="stats-grid">
          <div className="stat-card"><div className="stat-header"><div className="stat-icon">👥</div></div><div className="stat-label">Total Beneficiaries</div><div className="stat-value">{km?.totalBeneficiaries?.toLocaleString() ?? '...'}</div></div>
          <div className="stat-card success"><div className="stat-header"><div className="stat-icon success">✅</div></div><div className="stat-label">Course Completions</div><div className="stat-value">{km?.completions?.toLocaleString() ?? '...'}</div></div>
          <div className="stat-card warning"><div className="stat-header"><div className="stat-icon warning">📅</div></div><div className="stat-label">Active Sessions</div><div className="stat-value">{km?.activeSessions ?? '...'}</div></div>
          <div className="stat-card info"><div className="stat-header"><div className="stat-icon info">📊</div></div><div className="stat-label">Avg. Completion Rate</div><div className="stat-value">{km?.avgCompletionRate ?? '...'}%</div></div>
        </div>

        {/* Charts Grid */}
        <div className="grid grid-cols-1 grid-md-2 gap-lg">
          <div className="chart-card"><div className="chart-header"><h3 className="chart-title">📍 Location-wise Progress</h3><p className="chart-subtitle">Participants by district</p></div><div className="chart-container"><canvas id="locationChart"></canvas></div></div>
          <div className="chart-card"><div className="chart-header"><h3 className="chart-title">👥 Gender Distribution</h3><p className="chart-subtitle">Male vs Female participants</p></div><div className="chart-container"><canvas id="genderChart"></canvas></div></div>
          <div className="chart-card"><div className="chart-header"><h3 className="chart-title">🎯 Unit Manager Performance</h3><p className="chart-subtitle">Sessions conducted by UM</p></div><div className="chart-container"><canvas id="umPerformanceChart"></canvas></div></div>
          <div className="chart-card"><div className="chart-header"><h3 className="chart-title">📈 Completion Trends</h3><p className="chart-subtitle">Monthly progress over time</p></div><div className="chart-container"><canvas id="trendsChart"></canvas></div></div>
        </div>

        {/* Module-wise Completion */}
        <div className="chart-card" style={{ marginTop: 'var(--space-2xl)' }}>
          <div className="chart-header"><h3 className="chart-title">📚 Module-wise Completion Rates</h3><p className="chart-subtitle">Completion percentage for each module</p></div>
          <div className="chart-container" style={{ height: '400px' }}><canvas id="moduleChart"></canvas></div>
        </div>
      </div>
    </DashboardLayout>
  );
}
