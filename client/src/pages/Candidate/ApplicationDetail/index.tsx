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
  message,
} from 'antd';
import { getCandidateApplicationDetail } from '@/services/candidate';

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
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(true);

  const fetchData = async () => {
    try {
      setLoading(true);
      if (!params.id) return;

      const res = await getCandidateApplicationDetail(params.id);
      setData(res.data);
    } catch (error) {
      message.error('Không thể tải thông tin hồ sơ xét tuyển');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [params.id]);

  if (loading) {
    return <Card loading={true} />;
  }

  if (!data) {
    return (
      <Card>
        <Empty description="Không tìm thấy hồ sơ xét tuyển hợp lệ" />
      </Card>
    );
  }

  const profile = data.User?.profile || {};
  const university = data.University || {};
  const major = data.Major || {};
  const admissionRound = data.AdmissionRound || {};

  return (
    <div>
      <Card
        title="Chi tiết hồ sơ xét tuyển của bạn"
        extra={<Button onClick={() => history.back()}>Quay lại</Button>}
      >
        {/* KHỐI THÔNG TIN CÁ NHÂN CỦA THÍ SINH */}
        <Descriptions title="Thông tin thí sinh" bordered column={2}>
          <Descriptions.Item label="Mã hồ sơ">
            {data.id?.substring(0, 8).toUpperCase() || '---'}
          </Descriptions.Item>

          <Descriptions.Item label="Trạng thái">
            <Tag color={statusMap[data.status]?.color}>
              {statusMap[data.status]?.text || data.status}
            </Tag>
          </Descriptions.Item>

          <Descriptions.Item label="Họ tên">
            {profile.fullName || '---'}
          </Descriptions.Item>

          <Descriptions.Item label="Email">
            {data.User?.email || '---'}
          </Descriptions.Item>

          <Descriptions.Item label="Số điện thoại">
            {profile.phone || '---'}
          </Descriptions.Item>

          <Descriptions.Item label="Ngày nộp">
            {data.submittedAt ? new Date(data.submittedAt).toLocaleDateString('vi-VN') : '---'}
          </Descriptions.Item>

          {data.status === 'rejected' && data.rejectionReason && (
            <Descriptions.Item label="Lý do từ chối từ nhà trường" span={2}>
              <span style={{ color: '#ff4d4f', fontWeight: 'bold' }}>
                {data.rejectionReason}
              </span>
            </Descriptions.Item>
          )}
        </Descriptions>

        <Divider />

        {/* KHỐI THÔNG TIN NGUYỆN VỌNG ĐĂNG KÝ */}
        <Descriptions title="Thông tin đăng ký" bordered column={2}>
          <Descriptions.Item label="Trường">
            {university.name || '---'}
          </Descriptions.Item>

          <Descriptions.Item label="Ngành">
            {major.name || '---'}
          </Descriptions.Item>

          <Descriptions.Item label="Tổ hợp xét tuyển">
            {data.AdmissionCombination?.code || data.AdmissionCombination?.subjects || '---'}
          </Descriptions.Item>

          <Descriptions.Item label="Đợt tuyển sinh">
            {admissionRound.name || '---'}
          </Descriptions.Item>
        </Descriptions>

        <Divider />

        {/* KHỐI MINH CHỨNG TÀI LIỆU ĐÃ TẢI LÊN */}
        <Card size="small" title="File minh chứng đã nộp">
          <List
            dataSource={data.documents || []}
            renderItem={(file: any) => (
              <List.Item
                actions={[
                  <a
                    key="view"
                    href={file.fileUrl ? (file.fileUrl.startsWith('http') ? file.fileUrl : `http://localhost:5000${file.fileUrl}`) : '#'}
                    target="_blank"
                    rel="noreferrer"
                  >
                    Xem file trực tuyến
                  </a>,
                ]}
              >
                <List.Item.Meta
                  title={file.originalName || 'Tài liệu chưa đặt tên'}
                  description={`Loại tài liệu: ${file.documentType || 'N/A'}`}
                />
              </List.Item>
            )}
          />
        </Card>

        <Divider />

        {/* KHỐI TIẾN TRÌNH LỊCH SỬ XỬ LÝ HỒ SƠ */}
        <Card size="small" title="Tiến trình xử lý hồ sơ">
          <Timeline
            items={[
              {
                color: 'blue',
                children: 'Thí sinh hoàn tất gửi hồ sơ lên hệ thống',
              },
              {
                color: data.status !== 'pending' ? 'blue' : 'gray',
                children: 'Hội đồng tuyển sinh nhà trường tiếp nhận hồ sơ',
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
                    ? 'Hồ sơ đủ điều kiện và đã được phê duyệt thành công'
                    : data.status === 'rejected'
                      ? `Hồ sơ bị từ chối duyệt (Lý do: ${data.rejectionReason || 'Không có lý do cụ thể'})`
                      : 'Đang xếp hàng chờ hội đồng xét duyệt kết quả',
              },
            ]}
          />
        </Card>
      </Card>
    </div>
  );
}