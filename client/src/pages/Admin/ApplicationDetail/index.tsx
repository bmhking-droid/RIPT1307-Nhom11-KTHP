import React, { useEffect, useState } from 'react';
import { history, useParams } from 'umi';
import {
  Button,
  Card,
  Descriptions,
  Divider,
  List,
  Select,
  Space,
  Tag,
  message,
} from 'antd';
import {
  getApplicationDetail,
  sendApplicationEmail,
  updateApplicationStatus,
} from '@/services/admin';

const statusOptions = [
  { label: 'Chờ duyệt', value: 'pending' },
  { label: 'Đã duyệt', value: 'approved' },
  { label: 'Từ chối', value: 'rejected' },
];

export default function ApplicationDetailPage() {
  const params = useParams<{ id: string }>();
  const [data, setData] = useState<any>();

  const fetchData = async () => {
    const res = await getApplicationDetail(Number(params.id));
    setData(res.data);
  };

  useEffect(() => {
    fetchData();
  }, [params.id]);

  const renderStatus = (status: string) => {
    const map: any = {
      pending: <Tag color="gold">Chờ duyệt</Tag>,
      approved: <Tag color="green">Đã duyệt</Tag>,
      rejected: <Tag color="red">Từ chối</Tag>,
    };

    return map[status];
  };

  const handleChangeStatus = async (status: 'pending' | 'approved' | 'rejected') => {
    await updateApplicationStatus(Number(params.id), status);

    await sendApplicationEmail(Number(params.id), {
      type: 'status_changed',
      status,
    });

    message.success('Đã cập nhật trạng thái và gửi email thông báo');
    fetchData();
  };

  const handleSendEmail = async () => {
    await sendApplicationEmail(Number(params.id), {
      type: 'manual',
    });

    message.success('Đã gửi email thông báo');
  };

  if (!data) {
    return <Card>Không tìm thấy hồ sơ</Card>;
  }

  return (
    <Card
      title="Chi tiết hồ sơ"
      extra={<Button onClick={() => history.back()}>Quay lại</Button>}
    >
      <Descriptions title="Thông tin thí sinh" bordered column={2}>
        <Descriptions.Item label="Mã hồ sơ">
          {data.code}
        </Descriptions.Item>

        <Descriptions.Item label="Trạng thái">
          {renderStatus(data.status)}
        </Descriptions.Item>

        <Descriptions.Item label="Họ tên">
          {data.candidateName}
        </Descriptions.Item>

        <Descriptions.Item label="Email">
          {data.email}
        </Descriptions.Item>

        <Descriptions.Item label="Số điện thoại">
          {data.phone}
        </Descriptions.Item>

        <Descriptions.Item label="Ngày nộp">
          {data.createdAt}
        </Descriptions.Item>
      </Descriptions>

      <Divider />

      <Descriptions title="Thông tin đăng ký" bordered column={2}>
        <Descriptions.Item label="Trường">
          {data.universityName}
        </Descriptions.Item>

        <Descriptions.Item label="Ngành">
          {data.majorName}
        </Descriptions.Item>

        <Descriptions.Item label="Tổ hợp xét tuyển">
          {data.subjectGroupCode}
        </Descriptions.Item>

        <Descriptions.Item label="Đợt tuyển sinh">
          {data.admissionRoundName}
        </Descriptions.Item>
      </Descriptions>

      <Divider />

      <Card size="small" title="File minh chứng">
        <List
          dataSource={data.evidenceFiles || []}
          renderItem={(file: any) => (
            <List.Item
              actions={[
                <a key="view" href={file.url} target="_blank" rel="noreferrer">
                  Xem file
                </a>,
              ]}
            >
              <List.Item.Meta
                title={file.name}
                description={`Loại file: ${file.type}`}
              />
            </List.Item>
          )}
        />
      </Card>

      <Divider />

      <Space>
        <Select
          placeholder="Chuyển trạng thái"
          style={{ width: 200 }}
          value={data.status}
          onChange={handleChangeStatus}
          options={statusOptions}
        />

        <Button onClick={handleSendEmail}>
          Gửi email thủ công
        </Button>
      </Space>
    </Card>
  );
}