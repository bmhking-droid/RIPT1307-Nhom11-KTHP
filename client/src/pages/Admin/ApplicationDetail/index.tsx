import React, { useEffect, useState } from 'react';
import { history, useParams } from 'umi';
import {
  Button,
  Card,
  Descriptions,
  Divider,
  List,
  Tag,
  Modal,
  Input,
  message,
  Checkbox,
  Image,
} from 'antd';
import { CheckOutlined, CloseOutlined, UndoOutlined, FilePdfOutlined, PictureOutlined } from '@ant-design/icons';
import {
  getApplicationDetail,
  updateApplicationStatus,
} from '@/services/admin';
import { getFileUrl } from '@/services/request';

export default function ApplicationDetailPage() {
  // Lấy ID dạng String/UUID từ URL
  const params = useParams<{ id: string }>();
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [rejectModalOpen, setRejectModalOpen] = useState(false);
  const [selectedReasons, setSelectedReasons] = useState<string[]>([]);
  const [customReason, setCustomReason] = useState('');

  const fetchData = async () => {
    try {
      setLoading(true);
      if (!params.id) return;
      
      const res = await getApplicationDetail(params.id);
      setData(res.data);
    } catch (error) {
      message.error('Không thể tải thông tin chi tiết hồ sơ');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [params.id]);

  const renderStatus = (status: string) => {
    const map: Record<string, React.ReactNode> = {
      pending: <Tag color="gold">Chờ duyệt</Tag>,
      approved: <Tag color="green">Đã duyệt</Tag>,
      rejected: <Tag color="red">Từ chối</Tag>,
    };
    return map[status] || <Tag>{status}</Tag>;
  };

  // Hàm gọi API cập nhật trạng thái chung
  const executeUpdateStatus = async (status: string, rejectionReason?: string) => {
    try {
      if (!params.id) return;

    
      await updateApplicationStatus(params.id, { status, rejectionReason });

      message.success('Cập nhật trạng thái và gửi email thông báo thành công');
      fetchData();
    } catch (error) {
      message.error('Cập nhật trạng thái thất bại');
    }
  };

  const handleConfirmReject = async () => {
    if (selectedReasons.length === 0) {
      message.warning('Vui lòng chọn ít nhất một lý do từ chối!');
      return;
    }

    const hasOther = selectedReasons.includes('other');
    if (hasOther && !customReason.trim()) {
      message.warning('Vui lòng nhập chi tiết lý do khác!');
      return;
    }

    // Kết hợp các lý do đã chọn
    const reasonsToSave = selectedReasons
      .filter(r => r !== 'other')
      .concat(hasOther ? [`Lý do khác: ${customReason.trim()}`] : []);

    const finalReasonString = reasonsToSave.join('; ');

    await executeUpdateStatus('rejected', finalReasonString);
    setRejectModalOpen(false);
    setSelectedReasons([]);
    setCustomReason('');
  };

  const handleApprove = () => {
    Modal.confirm({
      title: <span style={{ fontWeight: 700 }}>Xác nhận phê duyệt hồ sơ</span>,
      content: 'Bạn có chắc chắn muốn phê duyệt hồ sơ xét tuyển này không?',
      okText: 'Phê duyệt',
      okType: 'primary',
      okButtonProps: { style: { backgroundColor: '#10B981', borderColor: '#10B981', borderRadius: 6 } },
      cancelText: 'Hủy bỏ',
      cancelButtonProps: { style: { borderRadius: 6 } },
      onOk: () => executeUpdateStatus('approved'),
    });
  };

  const handlePending = () => {
    Modal.confirm({
      title: <span style={{ fontWeight: 700 }}>Hoàn tác về chờ duyệt</span>,
      content: 'Bạn có chắc chắn muốn chuyển trạng thái hồ sơ này quay về Chờ duyệt không?',
      okText: 'Xác nhận',
      cancelText: 'Hủy bỏ',
      okButtonProps: { style: { backgroundColor: '#D97706', borderColor: '#D97706', borderRadius: 6 } },
      cancelButtonProps: { style: { borderRadius: 6 } },
      onOk: () => executeUpdateStatus('pending'),
    });
  };

  if (loading) return <Card loading={true} />;
  if (!data) return <Card>Không tìm thấy thông tin hồ sơ hợp lệ</Card>;

  const profile = data.User?.profile || {};
  const university = data.University || {};
  const major = data.Major || {};
  const admissionRound = data.AdmissionRound || {};

  return (
    <Card
      title="Chi tiết hồ sơ xét tuyển"
      extra={<Button onClick={() => history.back()}>Quay lại</Button>}
    >
      {/* KHỐI 1: THÔNG TIN THÍ SINH */}
      <Descriptions title="Thông tin thí sinh" bordered column={2}>
        <Descriptions.Item label="Mã hồ sơ">{data.id?.substring(0, 8).toUpperCase() || '---'}</Descriptions.Item>
        <Descriptions.Item label="Trạng thái">{renderStatus(data.status)}</Descriptions.Item>
        
        {/* Lấy từ User.profile.fullName */}
        <Descriptions.Item label="Họ tên">{profile.fullName || '---'}</Descriptions.Item>
        {/* Lấy từ User.email */}
        <Descriptions.Item label="Email">{data.User?.email || '---'}</Descriptions.Item>
        
        {/* Lấy từ User.profile.phone */}
        <Descriptions.Item label="Số điện thoại">{profile.phone || '---'}</Descriptions.Item>
        {/* Thay thế createdAt bằng submittedAt */}
        <Descriptions.Item label="Ngày nộp">
          {data.submittedAt ? new Date(data.submittedAt).toLocaleDateString('vi-VN') : '---'}
        </Descriptions.Item>

        {data.status === 'rejected' && data.rejectionReason && (
          <Descriptions.Item label="Lý do từ chối" span={2}>
            <span style={{ color: '#ff4d4f', fontWeight: 'bold' }}>{data.rejectionReason}</span>
          </Descriptions.Item>
        )}
      </Descriptions>

      <Divider />

      {/* KHỐI 2: THÔNG TIN ĐĂNG KÝ XÉT TUYỂN */}
      <Descriptions title="Thông tin đăng ký" bordered column={2}>
        <Descriptions.Item label="Trường">{university.name || '---'}</Descriptions.Item>
        <Descriptions.Item label="Ngành">{major.name || '---'}</Descriptions.Item>
        <Descriptions.Item label="Tổ hợp xét tuyển">{data.AdmissionCombination?.code || data.AdmissionCombination?.subjects || '---'}</Descriptions.Item>
        <Descriptions.Item label="Đợt tuyển sinh">{admissionRound.name || '---'}</Descriptions.Item>
      </Descriptions>

      <Divider />

      {/* KHỐI 3: FILE MINH CHỨNG */}
      <Card size="small" title="Danh sách tài liệu minh chứng">
        <List
          dataSource={data.documents || []}  
          renderItem={(file: any) => {
            const isPdf = file.fileUrl?.toLowerCase().endsWith('.pdf');
            const fileUrl = getFileUrl(file.fileUrl);

            return (
              <List.Item
                actions={[
                  <a 
                    key="view" 
                    href={fileUrl} 
                    target="_blank" 
                    rel="noreferrer"
                    style={{ fontWeight: 600, color: '#4f46e5' }}
                  >
                    Xem file gốc (Tab mới)
                  </a>,
                ]}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: 16, width: '100%' }}>
                  <div style={{ width: 60, height: 60, display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: '#f3f4f6', borderRadius: 8, overflow: 'hidden', border: '1px solid #e5e7eb', flexShrink: 0 }}>
                    {isPdf ? (
                      <a href={fileUrl} target="_blank" rel="noreferrer" title="Click để xem PDF">
                        <FilePdfOutlined style={{ fontSize: 32, color: '#ef4444' }} />
                      </a>
                    ) : (
                      <Image
                        src={fileUrl}
                        alt={file.originalName}
                        style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                        fallback="https://placehold.co/600x800.png/e2e8f0/475569?text=LOI+ANH"
                      />
                    )}
                  </div>
                  <List.Item.Meta
                    title={
                      <div style={{ fontWeight: 600 }}>
                        {file.originalName || 'Tài liệu không tên'}
                      </div>
                    }
                    description={
                      <div style={{ fontSize: 13, color: '#6b7280' }}>
                        Loại tài liệu: <Tag color="blue" style={{ borderRadius: 6, fontWeight: 500 }}>{file.documentType || 'N/A'}</Tag>
                      </div>
                    }
                  />
                </div>
              </List.Item>
            );
          }}
        />
      </Card>

      <Divider />

      {/* KHỐI 4: ĐIỀU HƯỚNG / THAO TÁC */}
      <div style={{ display: 'flex', justifyContent: 'center', gap: 16, marginTop: 32, padding: '20px 0', borderTop: '1px solid #f0f0f0' }}>
        {data.status !== 'approved' && (
          <Button
            type="primary"
            icon={<CheckOutlined />}
            style={{ backgroundColor: '#10B981', borderColor: '#10B981', height: 40, borderRadius: 8, padding: '0 24px', fontWeight: 600 }}
            onClick={handleApprove}
          >
            Phê duyệt Hồ sơ
          </Button>
        )}
        
        {data.status !== 'rejected' && (
          <Button
            type="primary"
            danger
            icon={<CloseOutlined />}
            style={{ height: 40, borderRadius: 8, padding: '0 24px', fontWeight: 600 }}
            onClick={() => setRejectModalOpen(true)}
          >
            Từ chối Hồ sơ
          </Button>
        )}

        {(data.status === 'approved' || data.status === 'rejected') && (
          <Button
            type="default"
            icon={<UndoOutlined />}
            style={{ borderColor: '#D97706', color: '#D97706', height: 40, borderRadius: 8, padding: '0 24px', fontWeight: 600 }}
            onClick={handlePending}
          >
            Hoàn tác về Chờ duyệt
          </Button>
        )}
      </div>

      {/* MODAL TỪ CHỐI VỚI CHECKBOX OPTIONS */}
      <Modal
        title={<span style={{ fontSize: 18, fontWeight: 700, color: '#EF4444' }}>Xác nhận từ chối hồ sơ</span>}
        open={rejectModalOpen}
        onOk={handleConfirmReject}
        onCancel={() => {
          setRejectModalOpen(false);
          setSelectedReasons([]);
          setCustomReason('');
        }}
        okText="Xác nhận từ chối"
        cancelText="Hủy bỏ"
        okButtonProps={{ danger: true, style: { borderRadius: 6, fontWeight: 500 } }}
        cancelButtonProps={{ style: { borderRadius: 6 } }}
        width={600}
      >
        <div style={{ marginTop: 16 }}>
          <p style={{ fontWeight: 600, color: '#374151', marginBottom: 12 }}>Vui lòng tích chọn các lý do từ chối hồ sơ (bắt buộc):</p>
          
          <Checkbox.Group
            style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: 12 }}
            value={selectedReasons}
            onChange={(checkedValues) => setSelectedReasons(checkedValues as string[])}
          >
            <Checkbox value="Ảnh tài liệu minh chứng bị mờ, không rõ thông tin">
              Ảnh tài liệu minh chứng bị mờ, không rõ thông tin
            </Checkbox>
            <Checkbox value="Điểm số khai báo không khớp với học bạ/bảng điểm">
              Điểm số khai báo không khớp với học bạ/bảng điểm
            </Checkbox>
            <Checkbox value="Thông tin cá nhân (Họ tên, ngày sinh, số CCCD) không khớp">
              Thông tin cá nhân (Họ tên, ngày sinh, số CCCD) không khớp
            </Checkbox>
            <Checkbox value="Tài liệu minh chứng đính kèm bị thiếu hoặc không hợp lệ">
              Tài liệu minh chứng đính kèm bị thiếu hoặc không hợp lệ
            </Checkbox>
            <Checkbox value="other">
              Lý do khác (điền chi tiết bên dưới)
            </Checkbox>
          </Checkbox.Group>

          {selectedReasons.includes('other') && (
            <div style={{ marginTop: 16 }}>
              <p style={{ fontWeight: 600, color: '#4B5563', marginBottom: 6 }}>Chi tiết lý do khác:</p>
              <Input.TextArea
                rows={3}
                placeholder="Vui lòng điền chi tiết lý do từ chối khác..."
                value={customReason}
                onChange={(e) => setCustomReason(e.target.value)}
                style={{ borderRadius: 8, padding: 8 }}
              />
            </div>
          )}
        </div>
      </Modal>
    </Card>
  );
}