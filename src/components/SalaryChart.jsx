import React, { useState, useMemo } from 'react';
import { BarChart3, PieChart as PieIcon, DollarSign, TrendingUp, Users } from 'lucide-react';

export function SalaryChart({ departments, employees }) {
  const [chartType, setChartType] = useState('bar');
  const [metricType, setMetricType] = useState('total');
  const [hoveredDept, setHoveredDept] = useState(null);

  const chartData = useMemo(() => {
    return departments.map((dept) => {
      const deptEmployees = employees.filter((e) => e.department === dept.name);
      const totalSalary = deptEmployees.reduce((sum, e) => sum + (e.salary || 0), 0);
      const count = deptEmployees.length;
      const avgSalary = count > 0 ? Math.round(totalSalary / count) : 0;
      const salaries = deptEmployees.map((e) => e.salary || 0);
      const minSalary = salaries.length > 0 ? Math.min(...salaries) : 0;
      const maxSalary = salaries.length > 0 ? Math.max(...salaries) : 0;

      return {
        id: dept._id,
        name: dept.name,
        code: dept.code,
        color: dept.color || '#4f46e5',
        totalSalary,
        avgSalary,
        count,
        minSalary,
        maxSalary
      };
    });
  }, [departments, employees]);

  const overallTotal = useMemo(() => {
    return chartData.reduce((sum, d) => sum + (metricType === 'total' ? d.totalSalary : d.avgSalary), 0);
  }, [chartData, metricType]);

  const maxValue = useMemo(() => {
    const vals = chartData.map((d) => (metricType === 'total' ? d.totalSalary : d.avgSalary));
    const highest = vals.length > 0 ? Math.max(...vals) : 100000;
    return highest > 0 ? highest * 1.15 : 100000;
  }, [chartData, metricType]);

  const pieSlices = useMemo(() => {
    if (overallTotal === 0) return [];

    let currentAngle = -Math.PI / 2;
    const centerX = 160;
    const centerY = 160;
    const outerRadius = 130;
    const innerRadius = 75;

    return chartData.map((dept) => {
      const val = metricType === 'total' ? dept.totalSalary : dept.avgSalary;
      const pct = overallTotal > 0 ? val / overallTotal : 0;
      const sliceAngle = pct * 2 * Math.PI;

      const startAngle = currentAngle;
      const endAngle = currentAngle + sliceAngle;
      currentAngle = endAngle;

      const x1 = centerX + outerRadius * Math.cos(startAngle);
      const y1 = centerY + outerRadius * Math.sin(startAngle);
      const x2 = centerX + outerRadius * Math.cos(endAngle);
      const y2 = centerY + outerRadius * Math.sin(endAngle);

      const ix1 = centerX + innerRadius * Math.cos(endAngle);
      const iy1 = centerY + innerRadius * Math.sin(endAngle);
      const ix2 = centerX + innerRadius * Math.cos(startAngle);
      const iy2 = centerY + innerRadius * Math.sin(startAngle);

      const largeArc = sliceAngle > Math.PI ? 1 : 0;

      const pathData = [
        `M ${x1} ${y1}`,
        `A ${outerRadius} ${outerRadius} 0 ${largeArc} 1 ${x2} ${y2}`,
        `L ${ix1} ${iy1}`,
        `A ${innerRadius} ${innerRadius} 0 ${largeArc} 0 ${ix2} ${iy2}`,
        'Z'
      ].join(' ');

      return {
        ...dept,
        val,
        pct: Math.round(pct * 100),
        pathData
      };
    });
  }, [chartData, overallTotal, metricType]);

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      maximumFractionDigits: 0
    }).format(amount || 0);
  };

  const activeHoverData = hoveredDept
    ? chartData.find((d) => d.id === hoveredDept)
    : null;

  return (
    <div className="panel" style={{ padding: '24px', marginBottom: '24px' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '16px', marginBottom: '20px' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <h3 style={{ fontSize: '1.15rem', fontWeight: 800, color: 'var(--text-primary)' }}>
              Department Salary Distribution
            </h3>
            <span className="badge" style={{ backgroundColor: '#eef2ff', color: '#4f46e5', fontSize: '0.75rem', fontWeight: 700, padding: '2px 8px', borderRadius: '4px' }}>
              Interactive Visualizer
            </span>
          </div>
          <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginTop: '2px' }}>
            Compare compensation budgets and average wage levels across departments.
          </p>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
          <div className="view-toggle">
            <button
              onClick={() => setMetricType('total')}
              className={`view-toggle-btn ${metricType === 'total' ? 'active' : ''}`}
              style={{ fontSize: '0.8rem', padding: '5px 12px', fontWeight: 600 }}
            >
              Total Payroll
            </button>
            <button
              onClick={() => setMetricType('average')}
              className={`view-toggle-btn ${metricType === 'average' ? 'active' : ''}`}
              style={{ fontSize: '0.8rem', padding: '5px 12px', fontWeight: 600 }}
            >
              Average Salary
            </button>
          </div>

          <div className="view-toggle">
            <button
              onClick={() => setChartType('bar')}
              className={`view-toggle-btn ${chartType === 'bar' ? 'active' : ''}`}
              title="Bar Chart"
            >
              <BarChart3 size={16} />
            </button>
            <button
              onClick={() => setChartType('pie')}
              className={`view-toggle-btn ${chartType === 'pie' ? 'active' : ''}`}
              title="Pie / Donut Chart"
            >
              <PieIcon size={16} />
            </button>
          </div>
        </div>
      </div>

      {chartType === 'bar' ? (
        <div>
          <div style={{ position: 'relative', width: '100%', height: '320px', display: 'flex', flexDirection: 'column', justifyContent: 'flex-end', paddingBottom: '36px', paddingTop: '20px' }}>
            {[1, 0.75, 0.5, 0.25, 0].map((step, idx) => {
              const val = Math.round(maxValue * step);
              return (
                <div
                  key={idx}
                  style={{
                    position: 'absolute',
                    left: 0,
                    right: 0,
                    bottom: `${step * 78 + 12}%`,
                    display: 'flex',
                    alignItems: 'center',
                    pointerEvents: 'none'
                  }}
                >
                  <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)', width: '68px', textAlign: 'right', paddingRight: '12px' }}>
                    {formatCurrency(val)}
                  </span>
                  <div style={{ flex: 1, height: '1px', backgroundColor: '#f1f5f9' }} />
                </div>
              );
            })}

            <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-around', height: '100%', marginLeft: '68px', zIndex: 2 }}>
              {chartData.map((d) => {
                const val = metricType === 'total' ? d.totalSalary : d.avgSalary;
                const heightPct = maxValue > 0 ? Math.max(4, Math.round((val / maxValue) * 100)) : 4;
                const isHovered = hoveredDept === d.id;

                return (
                  <div
                    key={d.id}
                    onMouseEnter={() => setHoveredDept(d.id)}
                    onMouseLeave={() => setHoveredDept(null)}
                    style={{
                      flex: 1,
                      maxWidth: '80px',
                      margin: '0 6px',
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      height: '100%',
                      justifyContent: 'flex-end',
                      cursor: 'pointer'
                    }}
                  >
                    <div
                      style={{
                        fontSize: '0.72rem',
                        fontWeight: 700,
                        color: isHovered ? 'var(--primary)' : 'var(--text-secondary)',
                        marginBottom: '6px',
                        opacity: isHovered ? 1 : 0.85,
                        transition: 'opacity 0.2s'
                      }}
                    >
                      {formatCurrency(val)}
                    </div>

                    <div
                      style={{
                        width: '100%',
                        height: `${heightPct}%`,
                        backgroundColor: d.color,
                        borderRadius: '6px 6px 0 0',
                        opacity: hoveredDept && !isHovered ? 0.4 : 0.95,
                        transform: isHovered ? 'scaleY(1.03)' : 'none',
                        transformOrigin: 'bottom',
                        transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
                        boxShadow: isHovered ? '0 4px 12px rgba(0,0,0,0.15)' : 'none'
                      }}
                    />

                    <div
                      style={{
                        marginTop: '10px',
                        textAlign: 'center',
                        fontSize: '0.75rem',
                        fontWeight: isHovered ? 800 : 600,
                        color: isHovered ? 'var(--text-primary)' : 'var(--text-secondary)'
                      }}
                    >
                      {d.code}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '24px', alignItems: 'center', padding: '10px 0' }}>
          <div style={{ display: 'flex', justifyContent: 'center', position: 'relative' }}>
            <svg width="320" height="320" viewBox="0 0 320 320" style={{ overflow: 'visible' }}>
              {pieSlices.map((slice) => {
                const isHovered = hoveredDept === slice.id;
                return (
                  <path
                    key={slice.id}
                    d={slice.pathData}
                    fill={slice.color}
                    opacity={hoveredDept && !isHovered ? 0.4 : 0.95}
                    transform={isHovered ? 'scale(1.04)' : 'none'}
                    transformOrigin="160 160"
                    stroke="#ffffff"
                    strokeWidth="2"
                    onMouseEnter={() => setHoveredDept(slice.id)}
                    onMouseLeave={() => setHoveredDept(null)}
                    style={{
                      cursor: 'pointer',
                      transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)'
                    }}
                  />
                );
              })}
            </svg>

            <div
              style={{
                position: 'absolute',
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%)',
                textAlign: 'center',
                pointerEvents: 'none'
              }}
            >
              <div style={{ fontSize: '0.7rem', textTransform: 'uppercase', fontWeight: 700, color: 'var(--text-muted)' }}>
                {hoveredDept ? 'Department' : metricType === 'total' ? 'Total Payroll' : 'Average Wage'}
              </div>
              <div style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--text-primary)', marginTop: '2px' }}>
                {hoveredDept
                  ? formatCurrency(metricType === 'total' ? activeHoverData?.totalSalary : activeHoverData?.avgSalary)
                  : formatCurrency(overallTotal)}
              </div>
              {hoveredDept && (
                <div style={{ fontSize: '0.75rem', fontWeight: 700, color: activeHoverData?.color }}>
                  {activeHoverData?.name}
                </div>
              )}
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {pieSlices.map((d) => {
              const isHovered = hoveredDept === d.id;
              return (
                <div
                  key={d.id}
                  onMouseEnter={() => setHoveredDept(d.id)}
                  onMouseLeave={() => setHoveredDept(null)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '8px 12px',
                    borderRadius: '8px',
                    backgroundColor: isHovered ? '#f1f5f9' : 'transparent',
                    cursor: 'pointer',
                    transition: 'background-color 0.15s'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <div style={{ width: '12px', height: '12px', borderRadius: '3px', backgroundColor: d.color }} />
                    <span style={{ fontSize: '0.85rem', fontWeight: isHovered ? 700 : 500, color: 'var(--text-primary)' }}>
                      {d.name}
                    </span>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <span style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--text-primary)' }}>
                      {formatCurrency(d.val)}
                    </span>
                    <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', width: '36px', textAlign: 'right' }}>
                      {d.pct}%
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {activeHoverData && (
        <div style={{ marginTop: '16px', padding: '14px 18px', background: '#f8fafc', borderRadius: '10px', border: '1px solid var(--border)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '12px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{ width: '14px', height: '14px', borderRadius: '50%', backgroundColor: activeHoverData.color }} />
            <div>
              <div style={{ fontWeight: 800, fontSize: '0.95rem', color: 'var(--text-primary)' }}>
                {activeHoverData.name} ({activeHoverData.code})
              </div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                {activeHoverData.count} staff members enrolled
              </div>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
            <div>
              <div style={{ fontSize: '0.68rem', textTransform: 'uppercase', fontWeight: 700, color: 'var(--text-muted)' }}>
                Total Payroll
              </div>
              <div style={{ fontWeight: 700, fontSize: '0.9rem', color: 'var(--text-primary)' }}>
                {formatCurrency(activeHoverData.totalSalary)}
              </div>
            </div>

            <div>
              <div style={{ fontSize: '0.68rem', textTransform: 'uppercase', fontWeight: 700, color: 'var(--text-muted)' }}>
                Average Salary
              </div>
              <div style={{ fontWeight: 700, fontSize: '0.9rem', color: 'var(--text-primary)' }}>
                {formatCurrency(activeHoverData.avgSalary)}
              </div>
            </div>

            <div>
              <div style={{ fontSize: '0.68rem', textTransform: 'uppercase', fontWeight: 700, color: 'var(--text-muted)' }}>
                Salary Range
              </div>
              <div style={{ fontWeight: 700, fontSize: '0.9rem', color: 'var(--text-primary)' }}>
                {formatCurrency(activeHoverData.minSalary)} - {formatCurrency(activeHoverData.maxSalary)}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
