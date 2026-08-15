import api from "../../../lib/api";

export async function getMockTest(mockTestId) {
  const response = await api.get(
    `/mock-tests/${mockTestId}`
  );

  return response.data.data;
}