import api from "../../../lib/api";

export async function getQuestions() {
  const response = await api.get("/questions");
  return response.data.data;
}