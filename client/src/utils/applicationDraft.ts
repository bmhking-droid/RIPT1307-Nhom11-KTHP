const APPLICATION_DRAFT_KEY = 'candidate_application_draft';


 // Lưu trạng thái điền form hiện tại làm bản nháp

export function saveApplicationDraft(data: any): void {
  if (!data) return;
  try {
    localStorage.setItem(APPLICATION_DRAFT_KEY, JSON.stringify(data));
  } catch (error) {
    console.error('Không thể lưu bản nháp hồ sơ:', error);
  }
}


 //Lấy dữ liệu bản nháp để khôi phục vào Form

export function getApplicationDraft(): any {
  try {
    const draft = localStorage.getItem(APPLICATION_DRAFT_KEY);
    return draft ? JSON.parse(draft) : null;
  } catch (error) {
    console.error('Không thể đọc bản nháp hồ sơ:', error);
    return null;
  }
}

// Xóa bản nháp sau khi gửi hồ sơ thành công
export function clearApplicationDraft(): void {
  try {
    localStorage.removeItem(APPLICATION_DRAFT_KEY);
  } catch (error) {
    console.error('Không thể xóa bản nháp hồ sơ:', error);
  }
}