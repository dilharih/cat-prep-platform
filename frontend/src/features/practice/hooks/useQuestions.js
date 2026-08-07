import { useEffect, useState } from "react";
import { getQuestions } from "../api/question.api";

export function useQuestions() {
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadQuestions() {
      try {
        const data = await getQuestions();
        setQuestions(data);
      } finally {
        setLoading(false);
      }
    }

    loadQuestions();
  }, []);

  return {
    questions,
    loading,
  };
}