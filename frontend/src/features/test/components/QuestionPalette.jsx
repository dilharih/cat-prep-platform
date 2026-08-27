function QuestionPalette({
  questions,
  currentIndex,
  answers,
  markedQuestions,
  onQuestionSelect,
}) {
  return (
    <div className="rounded-xl border bg-white p-5 shadow-sm">
      <h2 className="mb-4 text-lg font-bold">
        Questions
      </h2>

      <div className="grid grid-cols-5 gap-3">
        {questions.map((item, index) => {
          const questionId = item.question.id;

          const isAnswered = !!answers[questionId];
          const isMarked = !!markedQuestions[questionId];
          const isCurrent = index === currentIndex;

          let buttonClass =
            "border-gray-300 bg-gray-100 text-gray-700";

          if (isMarked) {
            buttonClass =
              "border-yellow-500 bg-yellow-100 text-yellow-800";
          } else if (isAnswered) {
            buttonClass =
              "border-green-500 bg-green-100 text-green-800";
          }

          if (isCurrent) {
            buttonClass +=
              " ring-2 ring-blue-500";
          }

          return (
            <button
              key={questionId}
              onClick={() => onQuestionSelect(index)}
              className={`flex h-10 w-10 items-center justify-center rounded-lg border font-semibold transition hover:scale-105 ${buttonClass}`}
            >
              {index + 1}
            </button>
          );
        })}
      </div>

      {/* Legend */}
      <div className="mt-6 space-y-2 text-sm">
        <div className="flex items-center gap-2">
          <span className="h-3 w-3 rounded-full bg-gray-300" />
          Not Answered
        </div>

        <div className="flex items-center gap-2">
          <span className="h-3 w-3 rounded-full bg-green-500" />
          Answered
        </div>

        <div className="flex items-center gap-2">
          <span className="h-3 w-3 rounded-full bg-yellow-500" />
          Marked for Review
        </div>
      </div>
    </div>
  );
}

export default QuestionPalette;