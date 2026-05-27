import { useEffect, useState } from 'react';
import { Button, Card, Col, Row, Table, Tag, message } from 'antd';
import { history } from 'umi';
import dayjs from 'dayjs'; 
import PageHeader from '@/components/PageHeader';
import StatCard from '@/components/StatCard';
import styles from './index.less';
import { getMyApplications } from '@/services/application';

const statusConfig: Record<string, { text: string; color: string }> = {
  pending: { text: 'Chờ duyệt', color: 'processing' },
  approved: { text: 'Đã duyệt', color: 'success' },
  rejected: { text: 'Từ chối', color: 'error' },
};

export default function CandidateDashboard() {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchApplications = async () => {
    try {
      setLoading(true);
      const res = await getMyApplications();
      setApplications(res.data || res || []);
    } catch (error) {
      console.error('💥 Lỗi tải danh sách hồ sơ:', error);
      message.error('Không thể kết nối máy chủ để lấy dữ liệu hồ sơ.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchApplications();
  }, []);

  const candidateStats = [
    { 
      label: 'Tổng hồ sơ', 
      value: applications.length || 0 
    },
    { 
      label: 'Đã duyệt', 
      value: applications.filter((a: any) => a.status === 'approved').length || 0 
    },
    { 
      label: 'Chờ duyệt', 
      value: applications.filter((a: any) => a.status === 'pending').length || 0 
    },
  ];

  const recentApplications = applications.slice(0, 5);

  return (
    <div className={styles.dashboard}>
      <PageHeader
        title="Tổng quan hồ sơ"
        description="Theo dõi nhanh tình trạng hồ sơ xét tuyển và các cập nhật mới nhất."
        extra={
          <Button type="primary" onClick={() => history.push('/candidate/applications/create')}>
            Nộp hồ sơ mới
          </Button>
        }
      />

      {/* HIỂN THỊ SỐ LIỆU ĐÃ ĐƯỢC ĐỒNG BỘ ĐẾM CHUẨN */}
      <Row gutter={[20, 20]}>
        {candidateStats.map((item) => (
          <Col xs={24} md={8} key={item.label}>
            <StatCard {...item} />
          </Col>
        ))}
      </Row>

      <Card className={styles.tableCard} title="Hồ sơ gần đây">
        <Table
          rowKey="id"
          dataSource={recentApplications}
          loading={loading}
          pagination={false}
          columns={[
            {
              title: 'Mã hồ sơ',
              dataIndex: 'id',
              render: (id: string) => <span style={{ fontFamily: 'monospace', fontWeight: 'bold' }}>{id ? id.substring(0, 8).toUpperCase() : '—'}</span>
            },
            {
              title: 'Trường đăng ký',
              render: (_, record: any) => record.University?.name || '---',
            },
            {
              title: 'Ngành học',
              render: (_, record: any) => record.Major?.name || '---',
            },
            {
              title: 'Trạng thái',
              dataIndex: 'status',
              render: (status: string) => {
                const config = statusConfig[status] || { text: status, color: 'default' };
                return <Tag color={config.color}>{config.text}</Tag>;
              },
            },
            {
              title: 'Thời gian nộp',
              dataIndex: 'submittedAt',
              render: (date: string) => date ? dayjs(date).format('DD/MM/YYYY HH:mm') : '---',
            },
          ]}
        />
      </Card>
    </div>
  );
}