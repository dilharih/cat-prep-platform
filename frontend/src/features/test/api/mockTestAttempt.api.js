import api from "../../../lib/api";

export async function submitMockTest(
  mockTestId,
  answers,
  timeTaken
) {
  const response = await api.post(
    `/mock-test-attempts/${mockTestId}/submit`,
    {
      answers,
      timeTaken,
    }
  );

  return response.data.data;
}