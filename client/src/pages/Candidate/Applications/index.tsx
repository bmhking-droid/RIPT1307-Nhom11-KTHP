import { useEffect, useState } from 'react';
import { Button, Card, Table, Tag } from 'antd';
import { history } from 'umi';
import PageHeader from '@/components/PageHeader';
import { recentApplications } from '@/mock/admission';
import styles from './index.less';


const statusColor: Record<string, string> = {
  'Chờ duyệt': 'processing',
  'Đã duyệt': 'success',
  'Cần bổ sung': 'warning',
};

export default function CandidateApplications() {
  const [applications, setApplications] = useState<any[]>([]);

  useEffect(() => {
    const localApplications = JSON.parse(
      localStorage.getItem('candidateApplications') || '[]',
    );

    setApplications([...localApplications, ...recentApplications]);
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
          columns={[
            {
              title: 'Mã hồ sơ',
              dataIndex: 'id',
            },
            {
              title: 'Trường đại học',
              dataIndex: 'university',
            },
            {
              title: 'Ngành xét tuyển',
              dataIndex: 'major',
            },
            {
              title: 'Đợt xét tuyển',
              dataIndex: 'admissionRound',
              render: (value) => value || '—',
            },
            {
              title: 'Tổ hợp',
              dataIndex: 'combination',
              render: (value) => value || '—',
            },
            {
              title: 'Trạng thái',
              dataIndex: 'status',
              render: (status: string) => (
                <Tag color={statusColor[status] || 'default'}>{status}</Tag>
              ),
            },
            {
              title: 'Cập nhật',
              dataIndex: 'updatedAt',
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