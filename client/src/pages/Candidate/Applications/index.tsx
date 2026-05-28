import { useEffect, useState } from 'react';
import { Button, Card, Table, Tag, message } from 'antd';
import { history } from 'umi';
import dayjs from 'dayjs';
import PageHeader from '@/components/PageHeader';
import { getMyApplications } from '@/services/application';
import styles from './index.less';

const statusConfig: Record<string, { text: string; color: string }> = {
  pending: { text: 'Chờ duyệt', color: 'processing' },
  approved: { text: 'Đã duyệt', color: 'success' },
  rejected: { text: 'Từ chối', color: 'error' },
};

export default function CandidateApplications() {
  const [applications, setApplications] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchApplications = async () => {
    try {
      setLoading(true);
      const res = await getMyApplications();
      setApplications(res.data || res || []);
    } catch (error) {
      console.error('Lỗi tải danh sách hồ sơ:', error);
      message.error('Không thể tải danh sách hồ sơ từ máy chủ');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchApplications();
  }, []);

  return (
    <div className={styles.applicationsPage}>
      <PageHeader
        title="Hồ sơ của tôi"
        description="Theo dõi danh sách hồ sơ xét tuyển đã nộp."
        extra={
          <Button
            type="primary"
            onClick={() => history.push('/candidate/applications/create')}
          >
            Nộp hồ sơ mới
          </Button>
        }
      />

      <Card className={styles.tableCard}>
        <Table
          rowKey="id"
          dataSource={applications}
          loading={loading}
          columns={[
            {
              title: 'Mã hồ sơ',
              dataIndex: 'id',
              render: (id: string) => <span style={{ fontFamily: 'monospace' }}>{id?.slice(0, 8).toUpperCase()}</span>,
            },
            {
              title: 'Trường đại học',
              render: (_, record: any) => record.University?.name || '—',
            },
            {
              title: 'Ngành xét tuyển',
              render: (_, record: any) => record.Major?.name || '—',
            },
            {
              title: 'Đợt xét tuyển',
              render: (_, record: any) => record.AdmissionRound?.name || '—',
            },
            {
              title: 'Tổ hợp',
              render: (_, record: any) => record.AdmissionCombination?.code || record.AdmissionCombination?.subjects || '—',
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
              title: 'Ngày nộp',
              dataIndex: 'submittedAt',
              render: (date: string) => date ? dayjs(date).format('DD/MM/YYYY HH:mm') : '—',
            },
            {
              title: 'Thao tác',
              render: (_: any, record: any) => (
                <Button
                  type="link"
                  onClick={() => history.push(`/candidate/applications/${record.id}`)}
                >
                  Xem chi tiết
                </Button>
              ),
            }
          ]}
        />
      </Card>
    </div>
  );
}