import { useEffect, useState } from "react";
import { getMyAttempts } from "../api/attempt.api";
import { useQuestions } from "./useQuestions";

export function usePracticeSession() {
  const { questions, loading } = useQuestions();

  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState({});
  const [answeredQuestions, setAnsweredQuestions] = useState({});
  const [results, setResults] = useState({});
  const [attemptsLoading, setAttemptsLoading] = useState(true);

  useEffect(() => {
    async function loadAttempts() {
      try {
        const attempts = await getMyAttempts();

        const savedAnswers = {};
        const savedAnsweredQuestions = {};
        const savedResults = {};

        attempts.forEach((attempt) => {
          // Restore selected answer
          if (attempt.selectedAnswer) {
            savedAnswers[attempt.questionId] =
              attempt.selectedAnswer;
          }

          // Restore submitted state
          savedAnsweredQuestions[attempt.questionId] = true;

          // Restore result
          savedResults[attempt.questionId] = {
            isCorrect: attempt.isCorrect,
            correctAnswer: attempt.question.correctAnswer,
            explanation: attempt.question.explanation,
          };
        });

        setAnswers(savedAnswers);
        setAnsweredQuestions(savedAnsweredQuestions);
        setResults(savedResults);
      } catch (error) {
        console.error(
          "Failed to load previous attempts:",
          error
        );
      } finally {
        setAttemptsLoading(false);
      }
    }

    loadAttempts();
  }, []);

  const isLoading = loading || attemptsLoading;

  if (isLoading || questions.length === 0) {
    return {
      loading: isLoading,
      questions,
      question: null,
      currentIndex,
      answers,
      answeredQuestions,
      results,
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
    loading: isLoading,
    questions,
    question,
    currentIndex,
    answers,
    answeredQuestions,
    results,
    nextQuestion,
    previousQuestion,
    jumpToQuestion,
    selectAnswer,
  };
}