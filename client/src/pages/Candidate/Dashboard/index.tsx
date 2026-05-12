import { Button, Card, Col, Row, Table, Tag } from 'antd';
import { history } from 'umi';
import PageHeader from '@/components/PageHeader';
import StatCard from '@/components/StatCard';
import { candidateStats, recentApplications } from '@/mock/admission';
import styles from './index.less';

const statusColor: Record<string, string> = {
  'Chờ duyệt': 'processing',
  'Đã duyệt': 'success',
  'Cần bổ sung': 'warning',
};

export default function CandidateDashboard() {
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
          pagination={false}
          columns={[
            {
              title: 'Mã hồ sơ',
              dataIndex: 'id',
            },
            {
              title: 'Trường',
              dataIndex: 'university',
            },
            {
              title: 'Ngành',
              dataIndex: 'major',
            },
            {
              title: 'Trạng thái',
              dataIndex: 'status',
              render: (status: string) => (
                <Tag color={statusColor[status]}>{status}</Tag>
              ),
            },
            {
              title: 'Cập nhật',
              dataIndex: 'updatedAt',
            },
          ]}
        />
      </Card>
    </div>
  );
}