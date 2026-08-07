import { useState } from "react";
import { useQuestions } from "./useQuestions";

export function usePracticeSession() {
  const { questions, loading } = useQuestions();

  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState({});

  if (loading || questions.length === 0) {
    return {
      loading,
      questions,
      question: null,
      currentIndex,
      answers,
      nextQuestion: () => {},
      previousQuestion: () => {},
      jumpToQuestion: () => {},
      selectAnswer: () => {},
    };
  }

  const question = questions[currentIndex];

  function nextQuestion() {
    if (currentIndex < questions.length - 1) {
      setCurrentIndex((prev) => prev + 1);
    }
  }

  function previousQuestion() {
    if (currentIndex > 0) {
      setCurrentIndex((prev) => prev - 1);
    }
  }

  function jumpToQuestion(index) {
    setCurrentIndex(index);
  }

  function selectAnswer(answer) {
    setAnswers((prev) => ({
      ...prev,
      [question.id]: answer,
    }));
  }

  return {
    loading,
    questions,
    question,
    currentIndex,
    answers,
    nextQuestion,
    previousQuestion,
    jumpToQuestion,
    selectAnswer,
  };
}