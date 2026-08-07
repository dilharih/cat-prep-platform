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