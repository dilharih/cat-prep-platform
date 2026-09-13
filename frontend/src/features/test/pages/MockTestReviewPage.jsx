import { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from "../../../lib/api";

function MockTestReviewPage() {
  const { attemptId } = useParams();
  const navigate = useNavigate();

  const [result, setResult] = useState(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadReview() {
      try {
        const response = await api.get(`/mock-test-results/${attemptId}`);
        setResult(response.data.data);
      } catch (loadError) {
        console.error("Failed to load attempt review:", loadError);
        setError(loadError.response?.data?.message || "Failed to load attempt review.");
      } finally {
        setLoading(false);
      }
    }

    loadReview();
  }, [attemptId]);

  const answers = result?.answers || [];
  const currentAnswer = answers[currentIndex];
  const currentQuestion = currentAnswer?.question;

  const availableSections = useMemo(
    () => [...new Set(answers.map((answer) => answer.question?.section).filter(Boolean))],
    [answers]
  );

  const sectionProgress = useMemo(() => {
    const progress = {};
    for (const section of availableSections) {
      const questions = answers.filter((answer) => answer.question?.section === section);
      progress[section] = {
        correct: questions.filter((answer) => answer.isCorrect && answer.selectedAnswer !== null && answer.selectedAnswer !== "").length,
        wrong: questions.filter((answer) => !answer.isCorrect && answer.selectedAnswer !== null && answer.selectedAnswer !== "").length,
        unanswered: questions.filter((answer) => answer.selectedAnswer === null || answer.selectedAnswer === undefined || answer.selectedAnswer === "").length,
        total: questions.length,
      };
    }
    return progress;
  }, [answers, availableSections]);

  const currentSection = currentQuestion?.section;
  const sectionQuestions = useMemo(
    () => answers
      .map((answer, index) => ({ ...answer, originalIndex: index }))
      .filter((answer) => answer.question?.section === currentSection),
    [answers, currentSection]
  );

  const currentSectionQuestionNumber = sectionQuestions.findIndex(
    (answer) => answer.originalIndex === currentIndex
  ) + 1;

  function goToQuestion(index) {
    if (index >= 0 && index < answers.length) setCurrentIndex(index);
  }

  function changeSection(section) {
    const firstIndex = answers.findIndex((answer) => answer.question?.section === section);
    if (firstIndex !== -1) setCurrentIndex(firstIndex);
  }

  function sectionName(section) {
    return section === "VARC" ? "Verbal Ability" : section === "DILR" ? "LR DI" : "Quant";
  }

  function isUnanswered(answer) {
    return answer?.selectedAnswer === null || answer?.selectedAnswer === undefined || answer?.selectedAnswer === "";
  }

  function getOptionText(question, option) {
    const value = question?.[`option${option}`];
    return value === null || value === undefined ? "" : value;
  }

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

  if (error || !result || !answers.length) {
    return (
      <div className="review-page flex min-h-screen items-center justify-center p-4">
        <div className="review-panel w-full max-w-lg rounded-2xl p-7 shadow-sm">
          <p className="review-accent text-sm font-semibold uppercase tracking-wide">Unable to load review</p>
          <h2 className="review-heading mt-2 text-xl font-bold">{error || "Review not found."}</h2>
          <button
            type="button"
            onClick={() => navigate(`/mock-test-result/${attemptId}`)}
            className="mt-5 rounded-xl bg-[#276678] px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-[#1687A7] focus:outline-none focus:ring-2 focus:ring-[#1687A7] focus:ring-offset-2"
          >
            Back to Result
          </button>
        </div>
      </div>
    );
  }

  const unanswered = isUnanswered(currentAnswer);
  const correct = !unanswered && currentAnswer.isCorrect;
  const options = ["A", "B", "C", "D"]
    .map((option) => [option, getOptionText(currentQuestion, option)])
    .filter(([, text]) => text);

  return (
    <div className="review-page flex min-h-screen flex-col font-sans">
      <style>{`
        .review-page { background:#f6f5f5 !important; color:#276678 !important; }
        .review-page .review-header { background:#ffffff !important; border-color:#d3e0ea !important; }
        .review-page .review-panel { background:#ffffff !important; border:1px solid #d3e0ea !important; }
        .review-page .review-heading,
        .review-page .review-title,
        .review-page .review-question,
        .review-page .review-option-text { color:#276678 !important; }
        .review-page .review-muted { color:#5f7f8d !important; }
        .review-page .review-accent { color:#1687a7 !important; }
        .review-page .review-divider { border-color:#d3e0ea !important; }
        .review-page .review-section-button { background:#f6f5f5 !important; color:#276678 !important; }
        .review-page .review-section-button:hover { background:#d3e0ea !important; }
        .review-page .review-section-button.active { background:#276678 !important; color:#ffffff !important; }
        .review-page .review-section-button.active .review-muted { color:#d3e0ea !important; }
        .review-page .review-palette { background:#f6f5f5 !important; border-color:#d3e0ea !important; }
        .review-page .review-palette-number { background:#ffffff !important; border-color:#d3e0ea !important; color:#276678 !important; }
        .review-page .review-palette-number:hover { border-color:#1687a7 !important; }
        .review-page .review-palette-number.current { border-color:#1687a7 !important; box-shadow:0 0 0 2px rgba(22,135,167,.15) !important; }
        .review-page .review-palette-number.correct { background:#dcfce7 !important; border-color:#86efac !important; color:#166534 !important; }
        .review-page .review-palette-number.wrong { background:#fee2e2 !important; border-color:#fca5a5 !important; color:#991b1b !important; }
        .review-page .review-palette-number.unanswered { background:#d3e0ea !important; border-color:#b6ccd5 !important; color:#276678 !important; }
        .review-page .review-option { background:#ffffff !important; border-color:#d3e0ea !important; }
        .review-page .review-option-label { background:#f6f5f5 !important; color:#276678 !important; }
        .review-page .review-option.correct { background:#f0fdf4 !important; border-color:#86efac !important; }
        .review-page .review-option.correct .review-option-label { background:#dcfce7 !important; color:#166534 !important; }
        .review-page .review-option.wrong { background:#fff7f7 !important; border-color:#fca5a5 !important; }
        .review-page .review-option.wrong .review-option-label { background:#fee2e2 !important; color:#991b1b !important; }
        .review-page .review-answer-summary { background:#eef8fb !important; border-color:#c8e2ea !important; }
        .review-page .review-correct-summary { background:#f0fdf4 !important; border-color:#bbf7d0 !important; }
        .review-page .review-wrong-summary { background:#fff7f7 !important; border-color:#fecaca !important; }
        .review-page .review-explanation { background:#eef8fb !important; border-color:#c8e2ea !important; }
        .review-page .review-explanation-text { color:#355f6d !important; }
        .theme-dark .review-page { background:#091a21 !important; color:#d3e0ea !important; }
        .theme-dark .review-page .review-header { background:#102a33 !important; border-color:#245766 !important; }
        .theme-dark .review-page .review-panel { background:#102a33 !important; border-color:#245766 !important; }
        .theme-dark .review-page .review-heading,
        .theme-dark .review-page .review-title,
        .theme-dark .review-page .review-question,
        .theme-dark .review-page .review-option-text { color:#d3e0ea !important; }
        .theme-dark .review-page .review-muted { color:#9bb5bf !important; }
        .theme-dark .review-page .review-accent { color:#45aeca !important; }
        .theme-dark .review-page .review-divider { border-color:#245766 !important; }
        .theme-dark .review-page .review-section-button { background:#194353 !important; color:#d3e0ea !important; }
        .theme-dark .review-page .review-section-button:hover { background:#245766 !important; }
        .theme-dark .review-page .review-section-button.active { background:#1687a7 !important; color:#ffffff !important; }
        .theme-dark .review-page .review-section-button.active .review-muted { color:#d3e0ea !important; }
        .theme-dark .review-page .review-palette { background:#0d242d !important; border-color:#245766 !important; }
        .theme-dark .review-page .review-palette-number { background:#102a33 !important; border-color:#245766 !important; color:#d3e0ea !important; }
        .theme-dark .review-page .review-palette-number:hover { border-color:#1687a7 !important; }
        .theme-dark .review-page .review-palette-number.correct { background:#14532d !important; border-color:#17633f !important; color:#dcfce7 !important; }
        .theme-dark .review-page .review-palette-number.wrong { background:#7f1d1d !important; border-color:#a52a2a !important; color:#fee2e2 !important; }
        .theme-dark .review-page .review-palette-number.unanswered { background:#194353 !important; border-color:#245766 !important; color:#d3e0ea !important; }
        .theme-dark .review-page .review-option { background:#ffffff !important; border-color:#245766 !important; }
        .theme-dark .review-page .review-option-label { background:#d3e0ea !important; color:#276678 !important; }
        .theme-dark .review-page .review-option-text { color:#102a33 !important; }
        .theme-dark .review-page .review-option.correct { background:#f0fdf4 !important; border-color:#86efac !important; }
        .theme-dark .review-page .review-option.correct .review-option-label { background:#dcfce7 !important; color:#166534 !important; }
        .theme-dark .review-page .review-option.wrong { background:#fff7f7 !important; border-color:#fca5a5 !important; }
        .theme-dark .review-page .review-option.wrong .review-option-label { background:#fee2e2 !important; color:#991b1b !important; }
        .theme-dark .review-page .review-answer-summary { background:#123740 !important; border-color:#245766 !important; }
        .theme-dark .review-page .review-correct-summary { background:#123b2a !important; border-color:#17633f !important; }
        .theme-dark .review-page .review-wrong-summary { background:#4b2020 !important; border-color:#7f1d1d !important; }
        .theme-dark .review-page .review-explanation { background:#123740 !important; border-color:#245766 !important; }
        .theme-dark .review-page .review-explanation-text { color:#c8e4eb !important; }
      `}</style>

      <header className="review-header shrink-0 border-b">
        <div className="mx-auto flex w-full max-w-[1400px] items-center justify-between gap-4 px-4 py-3 sm:px-6">
          <div className="flex min-w-0 items-center gap-3">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-[#276678] text-sm font-extrabold text-white">C</div>
            <div className="min-w-0">
              <p className="review-heading truncate text-sm font-extrabold">{result.mockTest.title}</p>
              <p className="review-muted text-[11px] font-semibold uppercase tracking-wider">Mock Test Review</p>
            </div>
          </div>
          <button
            type="button"
            onClick={() => navigate(`/mock-test-result/${attemptId}`)}
            className="shrink-0 rounded-xl border border-[#D3E0EA] px-4 py-2 text-sm font-semibold text-[#276678] transition hover:bg-[#F6F5F5] focus:outline-none focus:ring-2 focus:ring-[#1687A7] focus:ring-offset-2 dark:border-[#245766] dark:text-[#D3E0EA] dark:hover:bg-[#194353]"
          >
            Back to Result
          </button>
        </div>
      </header>

      <div className="review-header shrink-0 border-b px-4 py-3 sm:px-6">
        <div className="mx-auto flex w-full max-w-[1400px] items-center justify-between gap-4">
          <div className="flex min-w-0 gap-2 overflow-x-auto pb-1">
            {availableSections.map((section) => {
              const progress = sectionProgress[section];
              return (
                <button
                  key={section}
                  type="button"
                  onClick={() => changeSection(section)}
                  className={`review-section-button shrink-0 rounded-lg px-4 py-2 text-left transition ${currentSection === section ? "active" : ""}`}
                >
                  <div className="text-sm font-bold">{sectionName(section)}</div>
                  <div className="review-muted mt-1 text-[11px] font-semibold">
                    {progress.correct} correct · {progress.wrong} wrong · {progress.unanswered} skipped
                  </div>
                </button>
              );
            })}
          </div>
          <div className="hidden shrink-0 text-right sm:block">
            <p className="review-muted text-[10px] font-bold uppercase tracking-wider">Questions Reviewed</p>
            <p className="review-heading text-sm font-extrabold">{currentIndex + 1} / {answers.length}</p>
          </div>
        </div>
      </div>

      <main className="min-h-0 flex-1 overflow-hidden p-3 sm:p-4">
        <div className="mx-auto grid h-full min-h-0 w-full max-w-[1400px] gap-3 lg:grid-cols-[minmax(0,1fr)_280px]">
          <section className="review-panel flex min-h-0 flex-col overflow-hidden rounded-2xl shadow-sm">
            <div className="review-divider flex shrink-0 items-center justify-between border-b px-5 py-3 sm:px-6">
              <div>
                <p className="review-accent text-xs font-bold uppercase tracking-wide">{sectionName(currentSection)}</p>
                <h1 className="review-heading mt-1 text-lg font-bold">Question {currentSectionQuestionNumber}</h1>
              </div>
              <div className={`rounded-full px-3 py-1 text-xs font-bold ${correct ? "bg-green-100 text-green-700" : unanswered ? "bg-slate-200 text-slate-600" : "bg-red-100 text-red-700"}`}>
                {correct ? "Correct" : unanswered ? "Unanswered" : "Wrong"}
              </div>
            </div>

            <div className="min-h-0 flex-1 overflow-auto">
              <div className="grid min-h-full lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]">
                {currentQuestion.passage ? (
                  <div className="review-divider border-b p-5 lg:border-b-0 lg:border-r sm:p-6">
                    <p className="review-muted mb-3 text-xs font-bold uppercase tracking-wide">Passage</p>
                    <div className="rounded-xl border border-[#D3E0EA] bg-white p-5 dark:border-[#245766] dark:bg-[#123740]">
                      {currentQuestion.passage.title && <h2 className="review-heading mb-4 text-base font-bold">{currentQuestion.passage.title}</h2>}
                      <div className="whitespace-pre-line text-sm leading-7 text-[#355f6d] dark:text-[#c8e4eb]">{currentQuestion.passage.content}</div>
                    </div>
                  </div>
                ) : null}

                <div className={`p-5 sm:p-6 ${currentQuestion.passage ? "" : "lg:col-span-2 lg:max-w-4xl"}`}>
                  <p className="review-muted mb-2 text-xs font-bold uppercase tracking-wide">Question</p>
                  <p className="review-question text-[15px] font-semibold leading-7 sm:text-base">{currentQuestion.question}</p>

                  {options.length > 0 ? (
                    <div className="mt-6 space-y-3">
                      {options.map(([option, text]) => {
                        const isCorrectOption = currentQuestion.correctAnswer === option;
                        const isWrongSelection = currentAnswer.selectedAnswer === option && !isCorrectOption;
                        const stateClass = isCorrectOption ? "correct" : isWrongSelection ? "wrong" : "";
                        return (
                          <div key={option} className={`review-option ${stateClass} flex items-start gap-3 rounded-xl border p-4`}>
                            <span className="review-option-label flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-xs font-extrabold">{option}</span>
                            <div className="min-w-0 flex-1">
                              <p className="review-option-text text-sm font-medium leading-6">{text}</p>
                              {isCorrectOption && <p className="mt-2 text-xs font-bold text-green-700">✓ Correct answer</p>}
                              {isWrongSelection && <p className="mt-2 text-xs font-bold text-red-700">✕ Your answer</p>}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  ) : (
                    <div className="review-answer-summary mt-6 rounded-xl border p-5">
                      <p className="review-accent text-xs font-bold uppercase tracking-wide">TITA Answer</p>
                      <div className="mt-4 grid gap-3 sm:grid-cols-2">
                        <div>
                          <p className="review-muted text-xs font-bold uppercase tracking-wide">Your answer</p>
                          <p className="review-heading mt-1 text-lg font-extrabold">{unanswered ? "Not answered" : currentAnswer.selectedAnswer}</p>
                        </div>
                        <div>
                          <p className="review-muted text-xs font-bold uppercase tracking-wide">Correct answer</p>
                          <p className="mt-1 text-lg font-extrabold text-green-700">{currentQuestion.correctAnswer}</p>
                        </div>
                      </div>
                    </div>
                  )}

                  {options.length > 0 && (
                    <div className={`mt-4 rounded-xl border p-4 ${correct ? "review-correct-summary" : unanswered ? "review-answer-summary" : "review-wrong-summary"}`}>
                      <p className="review-muted text-xs font-bold uppercase tracking-wide">Your response</p>
                      <p className="review-heading mt-1 text-sm font-bold">{unanswered ? "Not answered" : currentAnswer.selectedAnswer}</p>
                    </div>
                  )}

                  {currentQuestion.explanation && (
                    <div className="review-explanation mt-4 rounded-xl border p-4">
                      <p className="review-accent text-xs font-bold uppercase tracking-wide">Explanation</p>
                      <p className="review-explanation-text mt-2 text-sm leading-7">{currentQuestion.explanation}</p>
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div className="review-divider flex shrink-0 items-center justify-between gap-3 border-t px-5 py-3 sm:px-6">
              <button
                type="button"
                onClick={() => goToQuestion(currentIndex - 1)}
                disabled={currentIndex === 0}
                className="rounded-xl border border-[#D3E0EA] px-4 py-2.5 text-sm font-semibold text-[#276678] transition hover:bg-[#F6F5F5] disabled:cursor-not-allowed disabled:opacity-40 dark:border-[#245766] dark:text-[#D3E0EA] dark:hover:bg-[#194353]"
              >
                ← Previous
              </button>
              <button
                type="button"
                onClick={() => goToQuestion(currentIndex + 1)}
                disabled={currentIndex === answers.length - 1}
                className="rounded-xl bg-[#276678] px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-[#1687A7] disabled:cursor-not-allowed disabled:opacity-40"
              >
                Next →
              </button>
            </div>
          </section>

          <aside className="review-panel min-h-0 overflow-hidden rounded-2xl p-4 shadow-sm lg:overflow-auto">
            <div className="flex items-center justify-between">
              <div>
                <p className="review-accent text-xs font-bold uppercase tracking-wide">Question Palette</p>
                <h2 className="review-heading mt-1 text-base font-bold">{sectionName(currentSection)}</h2>
              </div>
              <span className="review-muted text-xs font-semibold">{sectionQuestions.length}</span>
            </div>

            <div className="review-palette mt-4 rounded-xl border p-3">
              <div className="grid grid-cols-5 gap-2 sm:grid-cols-8 lg:grid-cols-5">
                {sectionQuestions.map((answer) => {
                  const index = answer.originalIndex;
                  const state = isUnanswered(answer) ? "unanswered" : answer.isCorrect ? "correct" : "wrong";
                  return (
                    <button
                      key={answer.id}
                      type="button"
                      onClick={() => goToQuestion(index)}
                      aria-label={`Question ${index + 1}: ${state}`}
                      className={`review-palette-number ${state} ${currentIndex === index ? "current" : ""} flex h-9 items-center justify-center rounded-lg border text-xs font-bold transition`}
                    >
                      {index + 1}
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="mt-4 grid gap-2 text-xs font-semibold">
              <div className="flex items-center gap-2"><span className="h-3 w-3 rounded bg-[#dcfce7]" /> Correct</div>
              <div className="flex items-center gap-2"><span className="h-3 w-3 rounded bg-[#fee2e2]" /> Wrong</div>
              <div className="flex items-center gap-2"><span className="h-3 w-3 rounded bg-[#d3e0ea]" /> Unanswered</div>
            </div>
          </aside>
        </div>
      </main>
    </div>
  );
}

export default MockTestReviewPage;
