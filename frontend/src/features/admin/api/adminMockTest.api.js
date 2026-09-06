import api from "../../../lib/api";

export async function getAdminMockTests() {
  const response = await api.get("/admin/mock-tests");
  return response.data.data;
}

export async function createAdminMockTest(data) {
  const response = await api.post("/admin/mock-tests", data);
  return response.data.data;
}

export async function updateAdminMockTest(id, data) {
  const response = await api.patch(`/admin/mock-tests/${id}`, data);
  return response.data.data;
}

export async function deleteAdminMockTest(id) {
  const response = await api.delete(`/admin/mock-tests/${id}`);
  return response.data;
}
