import request from './request';

export async function uploadDocument(
  file: File,
  documentType: string,
) {
  const formData = new FormData();

  formData.append('file', file);

  formData.append(
    'documentType',
    documentType,
  );

  return request.post(
    '/upload/document',
    formData,
    {
      headers: {
        'Content-Type':
          'multipart/form-data',
      },
    },
  );
}