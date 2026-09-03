import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from "../../../lib/api";

function MockTestReviewPage() {
  const { attemptId } = useParams();
  const navigate = useNavigate();

  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadReview() {
      try {
        const response = await api.get(`/mock-test-results/${attemptId}`);
        setResult(response.data.data);
      } catch (error) {
        console.error("Failed to load attempt review:", error);
        setError(error.response?.data?.message || "Failed to load attempt review.");
      } finally {
        setLoading(false);
      }
    }

    loadReview();
  }, [attemptId]);

  if (loading) {
    return (
      <div className="review-page flex min-h-screen items-center justify-center p-4">
        <div className="review-panel rounded-2xl p-7 text-center shadow-sm">
          <div className="mx-auto mb-3 h-8 w-8 animate-spin rounded-full border-2 border-[#D3E0EA] border-t-[#1687A7]" />
          <h2 className="review-heading text-lg font-semibold">Loading review...</h2>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="review-page flex min-h-screen items-center justify-center p-4">
        <div className="review-panel w-full max-w-lg rounded-2xl p-7 shadow-sm">
          <p className="text-sm font-semibold uppercase tracking-wide text-red-500">Unable to load review</p>
          <h2 className="review-heading mt-2 text-xl font-bold">{error}</h2>
          <button
            onClick={() => navigate(`/mock-test-result/${attemptId}`)}
            className="mt-5 rounded-xl bg-[#276678] px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-[#1687A7] focus:outline-none focus:ring-2 focus:ring-[#1687A7] focus:ring-offset-2"
          >
            Back to Result
          </button>
        </div>
      </div>
    );
  }

  if (!result) {
    return (
      <div className="review-page flex min-h-screen items-center justify-center p-4">
        <div className="review-panel rounded-2xl p-7 shadow-sm">
          <h2 className="review-heading text-xl font-bold">Review not found.</h2>
        </div>
      </div>
    );
  }

  const answers = result.answers || [];

  return (
    <div className="review-page min-h-screen font-sans">
      <style>{`
        .review-page { background:#f6f5f5 !important; color:#276678 !important; }
        .review-page .review-header { background:#ffffff !important; border-color:#d3e0ea !important; }
        .review-page .review-panel { background:#ffffff !important; border:1px solid #d3e0ea !important; }
        .review-page .review-brand,
        .review-page .review-heading,
        .review-page .review-title,
        .review-page .review-question,
        .review-page .review-answer,
        .review-page .review-count { color:#276678 !important; }
        .review-page .review-muted { color:#5f7f8d !important; }
        .review-page .review-accent { color:#1687a7 !important; }
        .review-page .review-question-header,
        .review-page .review-actions { border-color:#d3e0ea !important; }
        .review-page .review-question-number { background:#d3e0ea !important; color:#276678 !important; }
        .review-page .review-answer-block { background:#f6f5f5 !important; border-color:#d3e0ea !important; }
        .review-page .review-correct-block { background:#f0fdf4 !important; border-color:#bbf7d0 !important; }
        .review-page .review-correct-answer { color:#166534 !important; }
        .review-page .review-explanation { background:#eef8fb !important; border-color:#c8e2ea !important; }
        .review-page .review-explanation-text { color:#355f6d !important; }
        .review-page .review-status-correct { background:#dcfce7 !important; color:#166534 !important; }
        .review-page .review-status-wrong { background:#fee2e2 !important; color:#991b1b !important; }
        .review-page .review-status-unanswered { background:#d3e0ea !important; color:#276678 !important; }
        .review-page .review-secondary-button { background:#f6f5f5 !important; border:1px solid #d3e0ea !important; color:#276678 !important; }
        .review-page .review-secondary-button:hover { background:#d3e0ea !important; border-color:#1687a7 !important; }

        .theme-dark .review-page { background:#091a21 !important; color:#d3e0ea !important; }
        .theme-dark .review-page .review-header { background:#102a33 !important; border-color:#245766 !important; }
        .theme-dark .review-page .review-panel { background:#102a33 !important; border-color:#245766 !important; }
        .theme-dark .review-page .review-brand,
        .theme-dark .review-page .review-heading,
        .theme-dark .review-page .review-title,
        .theme-dark .review-page .review-question,
        .theme-dark .review-page .review-answer,
        .theme-dark .review-page .review-count { color:#d3e0ea !important; }
        .theme-dark .review-page .review-muted { color:#9bb5bf !important; }
        .theme-dark .review-page .review-accent { color:#45aeca !important; }
        .theme-dark .review-page .review-question-header,
        .theme-dark .review-page .review-actions { border-color:#245766 !important; }
        .theme-dark .review-page .review-question-number { background:#194353 !important; color:#d3e0ea !important; }
        .theme-dark .review-page .review-answer-block { background:#123740 !important; border-color:#245766 !important; }
        .theme-dark .review-page .review-correct-block { background:#123b2a !important; border-color:#17633f !important; }
        .theme-dark .review-page .review-correct-answer { color:#bbf7d0 !important; }
        .theme-dark .review-page .review-explanation { background:#123740 !important; border-color:#245766 !important; }
        .theme-dark .review-page .review-explanation-text { color:#c8e4eb !important; }
        .theme-dark .review-page .review-status-correct { background:#14532d !important; color:#dcfce7 !important; }
        .theme-dark .review-page .review-status-wrong { background:#7f1d1d !important; color:#fee2e2 !important; }
        .theme-dark .review-page .review-status-unanswered { background:#194353 !important; color:#d3e0ea !important; }
        .theme-dark .review-page .review-secondary-button { background:#194353 !important; border-color:#245766 !important; color:#d3e0ea !important; }
        .theme-dark .review-page .review-secondary-button:hover { background:#245766 !important; border-color:#1687a7 !important; }
      `}</style>

      <header className="review-header border-b">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-4 sm:px-6 lg:px-8">
          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <span className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-[#276678] text-sm font-extrabold text-white">C</span>
              <span className="review-brand text-sm font-bold tracking-wide">CATPrep</span>
            </div>
            <p className="review-muted mt-2 text-xs font-semibold uppercase tracking-wider">Attempt Review</p>
          </div>

          <button
            onClick={() => navigate(`/mock-test-result/${attemptId}`)}
            className="review-secondary-button shrink-0 rounded-xl px-4 py-2.5 text-sm font-semibold transition focus:outline-none focus:ring-2 focus:ring-[#1687A7] focus:ring-offset-2"
          >
            Back to Result
          </button>
        </div>
      </header>

      <main className="mx-auto w-full max-w-5xl px-4 py-6 sm:px-6 sm:py-8 lg:px-8">
        <section className="review-panel rounded-2xl p-5 shadow-sm sm:p-6">
          <p className="review-accent text-xs font-bold uppercase tracking-wider">Review</p>
          <h1 className="review-title mt-2 text-2xl font-extrabold tracking-tight sm:text-3xl">{result.mockTest.title}</h1>
          <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-2 text-sm">
            <span className="review-muted">Review your answers and explanations.</span>
            <span className="review-count font-semibold">{answers.length} questions</span>
          </div>
        </section>

        <div className="mt-5 space-y-5">
          {answers.map((answer, index) => {
            const unanswered =
              answer.selectedAnswer === null ||
              answer.selectedAnswer === undefined ||
              answer.selectedAnswer === "";
            const correct = !unanswered && answer.isCorrect;

            return (
              <article key={answer.id} className="review-panel overflow-hidden rounded-2xl shadow-sm">
                <div className="review-question-header flex flex-col gap-3 border-b px-5 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-6">
                  <div className="flex items-center gap-3">
                    <span className="review-question-number inline-flex h-9 min-w-9 items-center justify-center rounded-xl px-2 text-sm font-extrabold">{index + 1}</span>
                    <h2 className="review-heading text-base font-bold">Question {index + 1}</h2>
                  </div>

                  {correct && <span className="review-status review-status-correct rounded-full px-3 py-1 text-xs font-bold">Correct</span>}
                  {!correct && !unanswered && <span className="review-status review-status-wrong rounded-full px-3 py-1 text-xs font-bold">Wrong</span>}
                  {unanswered && <span className="review-status review-status-unanswered rounded-full px-3 py-1 text-xs font-bold">Unanswered</span>}
                </div>

                <div className="p-5 sm:p-6">
                  <p className="review-question text-base font-medium leading-7 sm:text-lg">{answer.question.question}</p>

                  <div className="mt-5 grid gap-4 md:grid-cols-2">
                    <div className="review-answer-block rounded-xl border p-4">
                      <p className="review-muted text-xs font-bold uppercase tracking-wider">Your Answer</p>
                      <p className="review-answer mt-2 text-sm font-semibold leading-6">{unanswered ? "Not answered" : answer.selectedAnswer}</p>
                    </div>

                    <div className="review-correct-block rounded-xl border p-4">
                      <p className="review-muted text-xs font-bold uppercase tracking-wider">Correct Answer</p>
                      <p className="review-correct-answer mt-2 text-sm font-semibold leading-6">{answer.question.correctAnswer}</p>
                    </div>
                  </div>

                  {answer.question.explanation && (
                    <div className="review-explanation mt-4 rounded-xl border p-4">
                      <p className="review-accent text-xs font-bold uppercase tracking-wider">Explanation</p>
                      <p className="review-explanation-text mt-2 text-sm leading-6">{answer.question.explanation}</p>
                    </div>
                  )}
                </div>
              </article>
            );
          })}
        </div>

        <div className="review-actions mt-5 flex flex-wrap gap-2 border-t pt-5 pb-10">
          <button
            onClick={() => navigate(`/mock-test-result/${attemptId}`)}
            className="rounded-xl bg-[#276678] px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-[#1687A7] focus:outline-none focus:ring-2 focus:ring-[#1687A7] focus:ring-offset-2"
          >
            Back to Result
          </button>
          <button
            onClick={() => navigate("/mock-tests")}
            className="review-secondary-button rounded-xl px-5 py-2.5 text-sm font-semibold transition focus:outline-none focus:ring-2 focus:ring-[#1687A7] focus:ring-offset-2"
          >
            Mock Tests
          </button>
        </div>
      </main>
    </div>
  );
}

export default MockTestReviewPage;
