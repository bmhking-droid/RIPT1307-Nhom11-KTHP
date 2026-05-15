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

  const [filters, setFilters] = useState<any>({});

  const fetchInitialData = async () => {
    const [universityRes, majorRes, roundRes] = await Promise.all([
      getUniversities(),
      getMajors(),
      getAdmissionRounds(),
    ]);

    setUniversities(universityRes.data || []);
    setMajors(majorRes.data || []);
    setRounds(roundRes.data || []);
  };

  const fetchApplications = async (params = filters) => {
    const res = await getApplications(params);
    setData(res.data || []);
  };

  useEffect(() => {
    fetchInitialData();
    fetchApplications({});
  }, []);

  const handleFilterChange = async (key: string, value: any) => {
    const nextFilters = {
      ...filters,
      [key]: value,
    };

    if (key === 'universityId') {
      nextFilters.majorId = undefined;
      nextFilters.admissionRoundId = undefined;

      const [majorRes, roundRes] = await Promise.all([
        getMajors({ universityId: value }),
        getAdmissionRounds({ universityId: value }),
      ]);

      setMajors(majorRes.data || []);
      setRounds(roundRes.data || []);
    }

    setFilters(nextFilters);
    fetchApplications(nextFilters);
  };

  const renderStatus = (status: string) => {
    const map: any = {
      pending: <Tag color="gold">Chờ duyệt</Tag>,
      approved: <Tag color="green">Đã duyệt</Tag>,
      rejected: <Tag color="red">Từ chối</Tag>,
    };

    return map[status];
  };

  const columns = [
    {
      title: 'Mã hồ sơ',
      dataIndex: 'code',
      width: 190,
    },
    {
      title: 'Thí sinh',
      dataIndex: 'candidateName',
    },
    {
      title: 'Trường',
      dataIndex: 'universityName',
    },
    {
      title: 'Ngành',
      dataIndex: 'majorName',
    },
    {
      title: 'Đợt',
      dataIndex: 'admissionRoundName',
    },
    {
      title: 'Trạng thái',
      dataIndex: 'status',
      render: renderStatus,
    },
    {
      title: 'Ngày nộp',
      dataIndex: 'createdAt',
    },
    {
      title: 'Thao tác',
      render: (_: any, record: any) => (
        <Button
          type="link"
          onClick={() => history.push(`/admin/applications/${record.id}`)}
        >
          Chi tiết
        </Button>
      ),
    },
  ];

  return (
    <Card title="Quản lý hồ sơ nộp">
      <Space style={{ marginBottom: 16 }} wrap>
        <Search
          allowClear
          placeholder="Tìm mã hồ sơ, tên, email, SĐT"
          enterButton="Tìm"
          style={{ width: 320 }}
          onSearch={(value) => handleFilterChange('keyword', value)}
        />

        <Select
          allowClear
          placeholder="Trường"
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
          placeholder="Ngành"
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
          placeholder="Đợt tuyển sinh"
          style={{ width: 240 }}
          value={filters.admissionRoundId}
          onChange={(value) =>
            handleFilterChange('admissionRoundId', value)
          }
          disabled={!filters.universityId}
          options={rounds.map(item => ({
            label: item.name,
            value: item.id,
          }))}
        />

        <Select
          allowClear
          placeholder="Trạng thái"
          style={{ width: 160 }}
          value={filters.status}
          onChange={(value) => handleFilterChange('status', value)}
          options={statusOptions}
        />
      </Space>

      <Table rowKey="id" columns={columns} dataSource={data} />
    </Card>
  );
}