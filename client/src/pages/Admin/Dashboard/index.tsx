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

export default function DashboardPage() {
  const [data, setData] = useState<any>({});

  const fetchData = async () => {
    const res = await getAdminStatistics();
    setData(res.data || {});
  };

  useEffect(() => {
    fetchData();
  }, []);

  const statusColumns = [
    {
      title: 'Trạng thái',
      dataIndex: 'status',
      render: (status: string) => {
        const map: any = {
          pending: <Tag color="gold">Chờ duyệt</Tag>,
          approved: <Tag color="green">Đã duyệt</Tag>,
          rejected: <Tag color="red">Từ chối</Tag>,
        };

        return map[status] || status;
      },
    },
    {
      title: 'Số lượng',
      dataIndex: 'total',
    },
  ];

  return (
    <div>
      <Row gutter={[16, 16]}>
        <Col xs={24} md={6}>
          <Card>
            <Statistic
              title="Tổng hồ sơ"
              value={data.totalApplications || 0}
              prefix={<FileTextOutlined />}
            />
          </Card>
        </Col>

        <Col xs={24} md={6}>
          <Card>
            <Statistic
              title="Chờ duyệt"
              value={data.pendingApplications || 0}
              prefix={<ClockCircleOutlined />}
              valueStyle={{ color: '#faad14' }}
            />
          </Card>
        </Col>

        <Col xs={24} md={6}>
          <Card>
            <Statistic
              title="Đã duyệt"
              value={data.approvedApplications || 0}
              prefix={<CheckCircleOutlined />}
              valueStyle={{ color: '#52c41a' }}
            />
          </Card>
        </Col>

        <Col xs={24} md={6}>
          <Card>
            <Statistic
              title="Từ chối"
              value={data.rejectedApplications || 0}
              prefix={<CloseCircleOutlined />}
              valueStyle={{ color: '#ff4d4f' }}
            />
          </Card>
        </Col>
      </Row>

      <Row gutter={[16, 16]} style={{ marginTop: 24 }}>
        <Col xs={24} md={12}>
          <Card title="Thống kê theo trường">
            <Table
              rowKey="universityName"
              columns={[
                { title: 'Trường', dataIndex: 'universityName' },
                { title: 'Số hồ sơ', dataIndex: 'total' },
              ]}
              dataSource={data.byUniversity || []}
              pagination={false}
            />
          </Card>
        </Col>

        <Col xs={24} md={12}>
          <Card title="Thống kê theo ngành">
            <Table
              rowKey="majorName"
              columns={[
                { title: 'Ngành', dataIndex: 'majorName' },
                { title: 'Số hồ sơ', dataIndex: 'total' },
              ]}
              dataSource={data.byMajor || []}
              pagination={false}
            />
          </Card>
        </Col>
      </Row>

      <Card title="Thống kê theo trạng thái" style={{ marginTop: 24 }}>
        <Table
          rowKey="status"
          columns={statusColumns}
          dataSource={data.byStatus || []}
          pagination={false}
        />
      </Card>
    </div>
  );
}