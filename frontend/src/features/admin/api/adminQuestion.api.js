import api from "../../../lib/api";

export async function getAdminMockTestQuestions(mockTestId) {
  const response = await api.get(`/admin/mock-tests/${mockTestId}/questions`);
  return response.data.data;
}

export async function createAdminQuestion(mockTestId, data) {
  const response = await api.post(`/admin/mock-tests/${mockTestId}/questions`, data);
  return response.data.data;
}

export async function bulkCreateAdminQuestions(mockTestId, questions) {
  const response = await api.post(`/admin/mock-tests/${mockTestId}/questions/bulk`, { questions });
  return response.data.data;
}

export async function updateAdminQuestion(questionId, data) {
  const response = await api.patch(`/admin/questions/${questionId}`, data);
  return response.data.data;
}

export async function removeAdminQuestion(mockTestId, questionId) {
  return api.delete(`/admin/mock-tests/${mockTestId}/questions/${questionId}`);
}
