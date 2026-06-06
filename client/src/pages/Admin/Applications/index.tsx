import React, { useEffect, useState } from 'react';
import { history } from 'umi';
import {
  Button,
  Card,
  Input,
  Select,
  Space,
  Table,
  Tag,
} from 'antd';
import {
  getAdmissionRounds,
  getApplications,
  getMajors,
  getUniversities,
} from '@/services/admin';
import moment from 'moment'; 
import { DownloadOutlined } from '@ant-design/icons';

const { Search } = Input;

const statusOptions = [
  { label: 'Chờ duyệt', value: 'pending' },
  { label: 'Đã duyệt', value: 'approved' },
  { label: 'Từ chối', value: 'rejected' },
];

export default function ApplicationsPage() {
  const [data, setData] = useState<any[]>([]);
  const [universities, setUniversities] = useState<any[]>([]);
  const [majors, setMajors] = useState<any[]>([]);
  const [rounds, setRounds] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  const [filters, setFilters] = useState<any>({});

  const fetchInitialData = async () => {
    try {
      const [universityRes, majorRes, roundRes] = await Promise.all([
        getUniversities(),
        getMajors(),
        getAdmissionRounds(),
      ]);

      setUniversities(universityRes?.data || []);
      setMajors(majorRes?.data || []);
      setRounds(roundRes?.data || []);
    } catch (error) {
      console.error('Lỗi nạp dữ liệu ban đầu:', error);
    }
  };

  const fetchApplications = async (params = filters) => {
    setLoading(true);
    try {
      const res = await getApplications(params);
      const rows = res?.data?.rows || res?.data || [];
      setData(rows);
    } catch (error) {
      console.error('Lỗi lấy danh sách hồ sơ:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInitialData();
    fetchApplications({});
  }, []);

  const handleFilterChange = async (key: string, value: any) => {
    const nextFilters = {
      ...filters,
      [key]: value || undefined, 
    };

    if (key === 'universityId') {
      nextFilters.majorId = undefined;
      nextFilters.roundId = undefined; 

      const [majorRes, roundRes] = await Promise.all([
        getMajors({ universityId: value }),
        getAdmissionRounds({ universityId: value }),
      ]);

      setMajors(majorRes?.data || []);
      setRounds(roundRes?.data || []);
    }

    setFilters(nextFilters);
    fetchApplications(nextFilters);
  };

  const exportExcel = async () => {
    setLoading(true);
    try {
      const baseUrl = process.env.UMI_APP_API_URL || 'http://localhost:5000/api';
      const queryParams = new URLSearchParams();
      Object.keys(filters).forEach((key) => {
        if (filters[key] !== undefined) {
          queryParams.append(key, filters[key]);
        }
      });

      const token = localStorage.getItem('token');
      const response = await fetch(`${baseUrl}/applications/export?${queryParams.toString()}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      if (!response.ok) {
        throw new Error('Không thể xuất báo cáo');
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `Danh_sach_xet_tuyen_${Date.now()}.xlsx`);
      document.body.appendChild(link);
      link.click();
      link.parentNode?.removeChild(link);
    } catch (error) {
      console.error('Lỗi xuất báo cáo:', error);
    } finally {
      setLoading(false);
    }
  };

  const renderStatus = (status: string) => {
    const map: any = {
      pending: <Tag color="gold">Chờ duyệt</Tag>,
      approved: <Tag color="green">Đã duyệt</Tag>,
      rejected: <Tag color="red">Từ chối</Tag>,
    };
    return map[status] || <Tag color="default">{status}</Tag>;
  };

  const columns = [
    {
      title: 'Mã hồ sơ (ID)',
      dataIndex: 'id',
      width: 150,
      render: (id: string) => <span style={{ fontFamily: 'monospace', fontWeight: 'bold' }}>{id?.substring(0, 8).toUpperCase()}</span>,
    },
    {
      title: 'Thí sinh',
      dataIndex: 'User',
      render: (User: any) => User?.profile?.fullName || 'Chưa cập nhật', 
    },
    {
      title: 'Trường tuyển sinh',
      dataIndex: 'University',
      render: (University: any) => University?.name || '---', 
    },
    {
      title: 'Ngành đăng ký',
      dataIndex: 'Major',
      render: (Major: any) => `[${Major?.code || ''}] ${Major?.name || '---'}`, 
    },
    {
      title: 'Đợt',
      dataIndex: 'AdmissionRound',
      render: (AdmissionRound: any) => AdmissionRound?.name || '---', 
    },
    {
      title: 'Trạng thái',
      dataIndex: 'status',
      render: renderStatus,
    },
    {
      title: 'Ngày nộp hồ sơ',
      dataIndex: 'submittedAt', 
      render: (date: string) => date ? moment(date).format('DD/MM/YYYY HH:mm') : '---',
    },
    {
      title: 'Thao tác',
      width: 100,
      render: (_: any, record: any) => (
        <Button
          type="primary"
          ghost
          size="small"
          onClick={() => history.push(`/admin/applications/${record.id}`)}
        >
          Chi tiết
        </Button>
      ),
    },
  ];

  return (
    <Card title="Hệ thống Quản lý Hồ sơ Xét tuyển">
      <Space style={{ marginBottom: 16 }} wrap>
        <Search
          allowClear
          placeholder="Tìm kiếm thông tin nâng cao..."
          enterButton="Tìm kiếm"
          style={{ width: 320 }}
          onSearch={(value) => handleFilterChange('keyword', value)}
        />

        <Select
          allowClear
          placeholder="Lọc theo Trường học"
          style={{ width: 260 }}
          value={filters.universityId}
          onChange={(value) => handleFilterChange('universityId', value)}
          options={universities.map(item => ({
            label: item.name,
            value: item.id,
          }))}
        />

        <Select
          allowClear
          placeholder="Lọc theo Ngành học"
          style={{ width: 220 }}
          value={filters.majorId}
          onChange={(value) => handleFilterChange('majorId', value)}
          disabled={!filters.universityId}
          options={majors.map(item => ({
            label: item.name,
            value: item.id,
          }))}
        />

        <Select
          allowClear
          placeholder="Lọc theo Đợt tuyển sinh"
          style={{ width: 240 }}
          value={filters.roundId} 
          onChange={(value) => handleFilterChange('roundId', value)}
          disabled={!filters.universityId}
          options={rounds.map(item => ({
            label: item.name,
            value: item.id,
          }))}
        />

        <Select
          allowClear
          placeholder="Trạng thái hồ sơ"
          style={{ width: 160 }}
          value={filters.status}
          onChange={(value) => handleFilterChange('status', value)}
          options={statusOptions}
        />

        <Button
          type="primary"
          icon={<DownloadOutlined />}
          onClick={exportExcel}
          loading={loading}
          style={{ background: '#52c41a', borderColor: '#52c41a' }}
        >
          Xuất Excel
        </Button>
      </Space>

      <Table 
        rowKey="id" 
        columns={columns} 
        dataSource={data} 
        loading={loading}
        bordered
        pagination={{ pageSize: 10 }}
      />
    </Card>
  );
}