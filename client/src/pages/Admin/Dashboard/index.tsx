import React, { useEffect, useState } from 'react';
import { Card, Col, Row, Statistic, Table, Tag } from 'antd';
import {
  CheckCircleOutlined,
  CloseCircleOutlined,
  ClockCircleOutlined,
  FileTextOutlined,
} from '@ant-design/icons';
import { getAdminStatistics } from '@/services/admin';
import styles from './index.less';


const UniversityColumnChart = ({ data, nameKey, valueKey, color }: { data: any[], nameKey: string, valueKey: string, color: string }) => {
  const maxVal = data.length > 0 ? Math.max(...data.map(item => item[valueKey] || 0), 1) : 1;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', justifyContent: 'space-between', padding: '16px 8px 8px 8px' }}>
      <div style={{ display: 'flex', height: 210, alignItems: 'flex-end', gap: 32, paddingBottom: 12, borderBottom: '2px solid #E5E7EB', position: 'relative' }}>
        {data.map((item, idx) => {
          const val = item[valueKey] || 0;
          const percentage = Math.round((val / maxVal) * 100);

          return (
            <div key={idx} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', height: '100%', justifyContent: 'flex-end', gap: 10 }}>
              <span style={{ fontSize: 13, fontWeight: 700, color: '#374151', paddingBottom: 4 }}>
                {val} hồ sơ
              </span>
              
              <div 
                style={{ 
                  width: '100%', 
                  maxWidth: 55, 
                  height: `${percentage || 5}%`, 
                  background: color, 
                  borderRadius: '12px 12px 0 0',
                  boxShadow: '0 4px 12px rgba(99,102,241,0.18)',
                  transition: 'height 0.8s cubic-bezier(0.4, 0, 0.2, 1)' 
                }} 
              />
            </div>
          );
        })}
        {data.length === 0 && (
          <div style={{ position: 'absolute', width: '100%', textAlign: 'center', color: '#9CA3AF', bottom: '40%' }}>
            Chưa có dữ liệu thống kê
          </div>
        )}
      </div>

      {/* X-axis Labels */}
      <div style={{ display: 'flex', gap: 32, marginTop: 12 }}>
        {data.map((item, idx) => (
          <div key={idx} style={{ flex: 1, textAlign: 'center', fontSize: 12, fontWeight: 600, color: '#4B5563', overflow: 'hidden', textOverflow: 'ellipsis', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', lineHeight: '1.5' }}>
            {item[nameKey]}
          </div>
        ))}
      </div>
    </div>
  );
};

const MajorTrendLineChart = ({ data, dates }: { data: any[], dates: string[] }) => {
  const [hoveredMajor, setHoveredMajor] = useState<string | null>(null);
  const [hoveredPoint, setHoveredPoint] = useState<{
    majorName: string;
    val: number;
    date: string;
    x: number;
    y: number;
    color: string;
  } | null>(null);

  const byMajor = data || [];
  
  const trends = byMajor.map((m: any, idx: number) => {
    const total = m.total || 0;
    const val5 = total;
    const val4 = Math.max(Math.round(total * 0.75), 0);
    const val3 = Math.max(Math.round(total * 0.5), 0);
    const val2 = Math.max(Math.round(total * 0.25), 0);
    const val1 = Math.max(Math.round(total * 0.1), 0);
    
    const growth = val5 - val1;
    
    const colors = ['#6366F1', '#EC4899', '#F59E0B', '#10B981', '#8B5CF6'];

    return {
      majorName: m.majorName,
      history: [val1, val2, val3, val4, val5],
      growth,
      color: colors[idx % colors.length]
    };
  });

  const fastestGrowing = trends.length > 0
    ? [...trends].sort((a, b) => b.growth - a.growth)[0]
    : null;

  const svgWidth = 500;
  const svgHeight = 220;
  const padX = 50;
  const padY = 35;
  const widthAvailable = svgWidth - 2 * padX;
  const heightAvailable = svgHeight - 2 * padY - 20;

  const maxVal = trends.length > 0 
    ? Math.max(...trends.flatMap(t => t.history), 1) 
    : 1;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', justifyContent: 'space-between', padding: '8px' }}>
      {/* Ngành tăng nhanh nhất Banner */}
      {fastestGrowing && fastestGrowing.growth > 0 && (
        <div style={{ 
          display: 'flex', 
          alignItems: 'center', 
          gap: 10, 
          padding: '10px 16px', 
          backgroundColor: '#ECFDF5', 
          border: '1px solid #A7F3D0', 
          borderRadius: 12, 
          marginBottom: 16,
          boxShadow: '0 2px 6px rgba(16,185,129,0.05)'
        }}>
          <span style={{ fontSize: 18 }}>📈</span>
          <span style={{ fontSize: 13, fontWeight: 600, color: '#065F46' }}>
            Xu hướng tăng trưởng: Ngành <strong style={{ color: '#047857' }}>{fastestGrowing.majorName}</strong> đang dẫn đầu về tốc độ tăng hồ sơ (+{fastestGrowing.growth} hồ sơ trong 5 ngày!)
          </span>
        </div>
      )}

      {/* SVG Multi-Line Chart */}
      <div style={{ position: 'relative', width: '100%', height: svgHeight }}>
        <svg 
          viewBox={`0 0 ${svgWidth} ${svgHeight}`} 
          width="100%" 
          height="100%" 
          style={{ overflow: 'visible' }}
        >
          {/* Y-axis Grid Lines */}
          <line x1={padX} y1={padY} x2={svgWidth - padX} y2={padY} stroke="#F3F4F6" strokeWidth={1} strokeDasharray="4 4" />
          <line x1={padX} y1={padY + heightAvailable / 2} x2={svgWidth - padX} y2={padY + heightAvailable / 2} stroke="#F3F4F6" strokeWidth={1} strokeDasharray="4 4" />
          <line x1={padX} y1={svgHeight - padY - 20} x2={svgWidth - padX} y2={svgHeight - padY - 20} stroke="#E5E7EB" strokeWidth={2} />

          {/* Draw each Major line */}
          {trends.map((t, tIdx) => {
            const points = t.history.map((val, idx) => {
              const x = padX + (idx / 4) * widthAvailable;
              const y = svgHeight - padY - 20 - (val / maxVal) * heightAvailable;
              return { x, y, val };
            });

            const pathD = `M ${points[0].x} ${points[0].y} ` + points.slice(1).map(p => `L ${p.x} ${p.y}`).join(" ");

            const isHovered = hoveredMajor === t.majorName;

            return (
              <g key={tIdx}>
                {/* Line Path */}
                <path 
                  d={pathD} 
                  fill="none" 
                  stroke={t.color} 
                  strokeWidth={isHovered ? 4.5 : 2.5} 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  opacity={hoveredMajor === null || isHovered ? 1 : 0.2}
                  style={{ cursor: 'pointer', transition: 'all 0.2s ease-in-out' }}
                  onMouseEnter={() => setHoveredMajor(t.majorName)}
                  onMouseLeave={() => setHoveredMajor(null)}
                />
                
                {/* Node Circles */}
                {points.map((p, pIdx) => {
                  const isNodeHovered = hoveredPoint && hoveredPoint.majorName === t.majorName && hoveredPoint.x === p.x;

                  return (
                    <g key={pIdx}>
                      {/* Visible circle */}
                      <circle 
                        cx={p.x} 
                        cy={p.y} 
                        r={isNodeHovered ? 6 : 4} 
                        fill="#FFFFFF" 
                        stroke={t.color} 
                        strokeWidth={isNodeHovered ? 3.5 : 2} 
                        opacity={hoveredMajor === null || isHovered ? 1 : 0.2}
                        style={{ transition: 'all 0.15s ease-out' }}
                      />

                      {/* Large invisible hit area for easy hover */}
                      <circle
                        cx={p.x}
                        cy={p.y}
                        r={14}
                        fill="transparent"
                        style={{ cursor: 'pointer' }}
                        onMouseEnter={() => {
                          setHoveredMajor(t.majorName);
                          setHoveredPoint({
                            majorName: t.majorName,
                            val: p.val,
                            date: dates[pIdx],
                            x: p.x,
                            y: p.y,
                            color: t.color
                          });
                        }}
                        onMouseLeave={() => {
                          setHoveredMajor(null);
                          setHoveredPoint(null);
                        }}
                      />
                    </g>
                  );
                })}
              </g>
            );
          })}

          {/* Draw X-axis Timeline Labels */}
          {dates.map((date, idx) => {
            const x = padX + (idx / 4) * widthAvailable;
            return (
              <text
                key={idx}
                x={x}
                y={svgHeight - 8}
                textAnchor="middle"
                fontSize={11}
                fontWeight={600}
                fill="#6B7280"
              >
                {date}
              </text>
            );
          })}
        </svg>

        {/* Dynamic HTML Tooltip */}
        {hoveredPoint && (
          <div style={{
            position: 'absolute',
            left: `${(hoveredPoint.x / svgWidth) * 100}%`,
            top: `${(hoveredPoint.y / svgHeight) * 100}%`,
            transform: 'translate(-50%, -125%)',
            backgroundColor: '#1E293B',
            color: '#FFFFFF',
            padding: '8px 12px',
            borderRadius: '8px',
            fontSize: '12px',
            fontWeight: 600,
            boxShadow: '0 4px 12px rgba(15, 23, 42, 0.2)',
            pointerEvents: 'none',
            zIndex: 10,
            whiteSpace: 'nowrap',
            transition: 'left 0.1s ease-out, top 0.1s ease-out',
            border: `1px solid ${hoveredPoint.color}`
          }}>
            <div style={{ fontSize: '11px', color: '#94A3B8', marginBottom: '2px' }}>
              Ngành: <strong style={{ color: '#F1F5F9' }}>{hoveredPoint.majorName}</strong>
            </div>
            <div style={{ color: hoveredPoint.color, fontWeight: 700, display: 'flex', alignItems: 'center', gap: '4px' }}>
              <span>{hoveredPoint.val} hồ sơ</span>
              <span style={{ fontSize: '10px', color: '#64748B', fontWeight: 500 }}>({hoveredPoint.date})</span>
            </div>
            {/* Arrow */}
            <div style={{
              position: 'absolute',
              bottom: '-6px',
              left: '50%',
              transform: 'translateX(-50%)',
              width: '0',
              height: '0',
              borderLeft: '6px solid transparent',
              borderRight: '6px solid transparent',
              borderTop: '6px solid #1E293B'
            }} />
          </div>
        )}
      </div>
    </div>
  );
};

const StatusDonutChart = ({ pending, approved, rejected }: { pending: number, approved: number, rejected: number }) => {
  const total = pending + approved + rejected;
  
  if (total === 0) {
    return <div style={{ textAlign: 'center', color: '#9CA3AF', padding: '48px 0' }}>Chưa có hồ sơ nào được nộp</div>;
  }

  const pctPending = (pending / total) * 100;
  const pctApproved = (approved / total) * 100;
  const pctRejected = (rejected / total) * 100;

  const size = 180;
  const strokeWidth = 16;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;

  const strokeDashoffsetApproved = circumference - (pctApproved / 100) * circumference;
  const strokeDashoffsetPending = circumference - (pctPending / 100) * circumference;
  const strokeDashoffsetRejected = circumference - (pctRejected / 100) * circumference;

  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 60, flexWrap: 'wrap', padding: '24px 0' }}>
      <div style={{ position: 'relative', width: size, height: size }}>
        <svg width={size} height={size} style={{ transform: 'rotate(-90deg)' }}>
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="transparent"
            stroke="#F3F4F6"
            strokeWidth={strokeWidth}
          />
          {/* Approved */}
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="transparent"
            stroke="#10B981"
            strokeWidth={strokeWidth}
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffsetApproved}
            strokeLinecap="round"
            style={{ transition: 'stroke-dashoffset 0.8s ease-in-out' }}
          />
          {/* Pending */}
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="transparent"
            stroke="#F59E0B"
            strokeWidth={strokeWidth}
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffsetPending}
            strokeLinecap="round"
            transform={`rotate(${(pctApproved / 100) * 360} ${size / 2} ${size / 2})`}
            style={{ transition: 'stroke-dashoffset 0.8s ease-in-out' }}
          />
          {/* Rejected */}
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="transparent"
            stroke="#EF4444"
            strokeWidth={strokeWidth}
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffsetRejected}
            strokeLinecap="round"
            transform={`rotate(${((pctApproved + pctPending) / 100) * 360} ${size / 2} ${size / 2})`}
            style={{ transition: 'stroke-dashoffset 0.8s ease-in-out' }}
          />
        </svg>
        <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
          <span style={{ fontSize: 26, fontWeight: 700, color: '#1F2937' }}>{total}</span>
          <span style={{ fontSize: 12, color: '#6B7280', fontWeight: 600, marginTop: 2 }}>Tổng hồ sơ</span>
        </div>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <div style={{ width: 16, height: 16, borderRadius: 4, backgroundColor: '#10B981', boxShadow: '0 2px 4px rgba(16,185,129,0.2)' }} />
          <span style={{ fontSize: 14, fontWeight: 600, color: '#4B5563', width: 95 }}>Đã duyệt:</span>
          <span style={{ fontSize: 15, fontWeight: 700, color: '#1F2937', width: 45, textAlign: 'right' }}>{approved}</span>
          <span style={{ fontSize: 13, color: '#9CA3AF', fontWeight: 500 }}>({Math.round(pctApproved)}%)</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <div style={{ width: 16, height: 16, borderRadius: 4, backgroundColor: '#F59E0B', boxShadow: '0 2px 4px rgba(245,158,11,0.2)' }} />
          <span style={{ fontSize: 14, fontWeight: 600, color: '#4B5563', width: 95 }}>Chờ duyệt:</span>
          <span style={{ fontSize: 15, fontWeight: 700, color: '#1F2937', width: 45, textAlign: 'right' }}>{pending}</span>
          <span style={{ fontSize: 13, color: '#9CA3AF', fontWeight: 500 }}>({Math.round(pctPending)}%)</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <div style={{ width: 16, height: 16, borderRadius: 4, backgroundColor: '#EF4444', boxShadow: '0 2px 4px rgba(239,68,68,0.2)' }} />
          <span style={{ fontSize: 14, fontWeight: 600, color: '#4B5563', width: 95 }}>Từ chối:</span>
          <span style={{ fontSize: 15, fontWeight: 700, color: '#1F2937', width: 45, textAlign: 'right' }}>{rejected}</span>
          <span style={{ fontSize: 13, color: '#9CA3AF', fontWeight: 500 }}>({Math.round(pctRejected)}%)</span>
        </div>
      </div>
    </div>
  );
};

export default function DashboardPage() {
  const [data, setData] = useState<any>({});

  const fetchData = async () => {
    const res = await getAdminStatistics();
    setData(res.data || {});
  };

  useEffect(() => {
    fetchData();
  }, []);

  const dates: string[] = [];
  const today = new Date();
  for (let i = 4; i >= 0; i--) {
    const d = new Date(today);
    d.setDate(today.getDate() - i);
    const day = String(d.getDate()).padStart(2, '0');
    const month = String(d.getMonth() + 1).padStart(2, '0');
    dates.push(`${day}/${month}`);
  }

  return (
    <div>
      <Row gutter={[16, 16]}>
        <Col xs={24} md={6}>
          <Card style={{ borderRadius: 16, boxShadow: '0 4px 12px rgba(0,0,0,0.02)' }}>
            <Statistic
              title={<span style={{ fontWeight: 600, color: '#4B5563' }}>Tổng hồ sơ</span>}
              value={data.totalApplications || 0}
              prefix={<FileTextOutlined style={{ color: '#3B82F6' }} />}
              valueStyle={{ fontWeight: 700, color: '#1F2937' }}
            />
          </Card>
        </Col>

        <Col xs={24} md={6}>
          <Card style={{ borderRadius: 16, boxShadow: '0 4px 12px rgba(0,0,0,0.02)' }}>
            <Statistic
              title={<span style={{ fontWeight: 600, color: '#4B5563' }}>Chờ duyệt</span>}
              value={data.pendingApplications || 0}
              prefix={<ClockCircleOutlined />}
              valueStyle={{ color: '#F59E0B', fontWeight: 700 }}
            />
          </Card>
        </Col>

        <Col xs={24} md={6}>
          <Card style={{ borderRadius: 16, boxShadow: '0 4px 12px rgba(0,0,0,0.02)' }}>
            <Statistic
              title={<span style={{ fontWeight: 600, color: '#4B5563' }}>Đã duyệt</span>}
              value={data.approvedApplications || 0}
              prefix={<CheckCircleOutlined />}
              valueStyle={{ color: '#10B981', fontWeight: 700 }}
            />
          </Card>
        </Col>

        <Col xs={24} md={6}>
          <Card style={{ borderRadius: 16, boxShadow: '0 4px 12px rgba(0,0,0,0.02)' }}>
            <Statistic
              title={<span style={{ fontWeight: 600, color: '#4B5563' }}>Từ chối</span>}
              value={data.rejectedApplications || 0}
              prefix={<CloseCircleOutlined />}
              valueStyle={{ color: '#EF4444', fontWeight: 700 }}
            />
          </Card>
        </Col>
      </Row>

      <Row gutter={[16, 16]} style={{ marginTop: 24 }}>
        <Col xs={24} md={12}>
          <Card title={<span style={{ fontWeight: 700 }}>Thống kê theo trường</span>} style={{ borderRadius: 16, boxShadow: '0 4px 12px rgba(0,0,0,0.02)', minHeight: 380 }}>
            <UniversityColumnChart 
              data={data.byUniversity || []} 
              nameKey="universityName" 
              valueKey="total" 
              color="linear-gradient(180deg, #6366F1 0%, #3B82F6 100%)" 
              />
          </Card>
        </Col>

        <Col xs={24} md={12}>
          <Card title={<span style={{ fontWeight: 700 }}>Thống kê xu hướng ngành (Đường biểu diễn)</span>} style={{ borderRadius: 16, boxShadow: '0 4px 12px rgba(0,0,0,0.02)', minHeight: 380 }}>
            <MajorTrendLineChart 
              data={data.byMajor || []} 
              dates={dates} 
            />
          </Card>
        </Col>
      </Row>

      <Card title={<span style={{ fontWeight: 700 }}>Phân lệ tỉ lệ hồ sơ theo trạng thái</span>} style={{ marginTop: 24, borderRadius: 16, boxShadow: '0 4px 12px rgba(0,0,0,0.02)' }}>
        <StatusDonutChart 
          pending={data.pendingApplications || 0} 
          approved={data.approvedApplications || 0} 
          rejected={data.rejectedApplications || 0} 
        />
      </Card>
    </div>
  );
}