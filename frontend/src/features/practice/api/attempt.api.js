import api from "../../../lib/api";

export async function submitAttempt(
  questionId,
  selectedAnswer,
  timeTaken = 0
) {
  const response = await api.post(
    `/questions/${questionId}/attempt`,
    {
      selectedAnswer,
      timeTaken,
    }
  );

  return response.data.data;
}

export async function getMyAttempts() {
  const response = await api.get("/attempts/my");

  return response.data.data;
}