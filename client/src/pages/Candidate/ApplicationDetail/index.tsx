import React, { useEffect, useState } from 'react';
import { history, useParams } from 'umi';
import {
  Button,
  Card,
  Descriptions,
  Divider,
  List,
  Tag,
  Timeline,
  Empty,
} from 'antd';
import { getCandidateApplicationDetail } from '@/services/candidate';
// import styles from './index.less';

const statusMap: any = {
  pending: {
    color: 'gold',
    text: 'Chờ duyệt',
  },
  approved: {
    color: 'green',
    text: 'Đã duyệt',
  },
  rejected: {
    color: 'red',
    text: 'Từ chối',
  },
};

export default function CandidateApplicationDetail() {
  const params = useParams<{ id: string }>();
  const [data, setData] = useState<any>();

  const fetchData = async () => {
    const res = await getCandidateApplicationDetail(Number(params.id));
    setData(res.data);
  };

  useEffect(() => {
    fetchData();
  }, [params.id]);

  if (!data) {
    return (
      <Card>
        <Empty description="Không tìm thấy hồ sơ" />
      </Card>
    );
  }

  return (
    <div className={styles.page}>
      <Card
        title="Chi tiết hồ sơ"
        extra={<Button onClick={() => history.back()}>Quay lại</Button>}
      >
        <Descriptions bordered column={2}>
          <Descriptions.Item label="Mã hồ sơ">
            {data.code}
          </Descriptions.Item>

          <Descriptions.Item label="Trạng thái">
            <Tag color={statusMap[data.status]?.color}>
              {statusMap[data.status]?.text}
            </Tag>
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

        <Card size="small" title="File minh chứng đã nộp">
          <List
            dataSource={data.evidenceFiles || []}
            renderItem={(file: any) => (
              <List.Item
                actions={[
                  <a
                    key="view"
                    href={file.url}
                    target="_blank"
                    rel="noreferrer"
                  >
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

        <Card size="small" title="Tiến trình xử lý hồ sơ">
          <Timeline
            items={[
              {
                color: 'blue',
                children: 'Thí sinh đã nộp hồ sơ',
              },
              {
                color: data.status !== 'pending' ? 'blue' : 'gray',
                children: 'Nhà trường tiếp nhận hồ sơ',
              },
              {
                color:
                  data.status === 'approved'
                    ? 'green'
                    : data.status === 'rejected'
                      ? 'red'
                      : 'gray',
                children:
                  data.status === 'approved'
                    ? 'Hồ sơ đã được duyệt'
                    : data.status === 'rejected'
                      ? 'Hồ sơ bị từ chối'
                      : 'Đang chờ kết quả xét duyệt',
              },
            ]}
          />
        </Card>
      </Card>
    </div>
  );
}