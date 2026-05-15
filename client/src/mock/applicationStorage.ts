 import { adminApplicationsMock } from './admin';

const ADMIN_APPLICATIONS_STORAGE_KEY = 'adminApplications';

export const getAdminApplications = () => {
  const localApplications = JSON.parse(
    localStorage.getItem(ADMIN_APPLICATIONS_STORAGE_KEY) || '[]',
  );

  return adminApplicationsMock.map((mockItem) => {
    const localItem = localApplications.find(
      (item: any) => item.id === mockItem.id,
    );

    return localItem ? { ...mockItem, ...localItem } : mockItem;
  });
};

export const updateAdminApplicationStatus = (
  application: any,
  status: string,
) => {
  const localApplications = JSON.parse(
    localStorage.getItem(ADMIN_APPLICATIONS_STORAGE_KEY) || '[]',
  );

  const existed = localApplications.some(
    (item: any) => item.id === application.id,
  );

  const nextApplications = existed
    ? localApplications.map((item: any) =>
        item.id === application.id
          ? {
              ...item,
              status,
              updatedAt: new Date().toLocaleDateString('vi-VN'),
            }
          : item,
      )
    : [
        {
          id: application.id,
          candidateName: application.candidateName,
          university: application.university,
          major: application.major,
          admissionRound: application.admissionRound,
          score: application.score,
          status,
          createdAt: application.createdAt,
          updatedAt: new Date().toLocaleDateString('vi-VN'),
        },
        ...localApplications,
      ];

  localStorage.setItem(
    ADMIN_APPLICATIONS_STORAGE_KEY,
    JSON.stringify(nextApplications),
  );
};