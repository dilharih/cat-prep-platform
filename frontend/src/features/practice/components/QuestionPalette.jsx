function QuestionPalette({
  questions,
  currentIndex,
  answers,
  onQuestionSelect,
}) {
  return (
    <div className="rounded-xl border bg-white p-6 shadow-sm">
      <h3 className="mb-4 text-lg font-semibold">
        Questions
      </h3>

      <div className="grid grid-cols-5 gap-3">
        {questions.map((question, index) => {
          const answered = !!answers[question.id];
          const active = index === currentIndex;

          let classes =
            "flex h-10 w-10 items-center justify-center rounded-lg border font-medium transition ";

          if (active) {
            classes += "border-blue-600 bg-blue-600 text-white";
          } else if (answered) {
            classes += "border-green-600 bg-green-100 text-green-700";
          } else {
            classes += "border-gray-300 bg-white hover:bg-gray-100";
          }

          return (
            <button
              key={question.id}
              className={classes}
              onClick={() => onQuestionSelect(index)}
            >
              {index + 1}
            </button>
          );
        })}
      </div>

      <div className="mt-6 space-y-2 text-sm">
        <div className="flex items-center gap-2">
          <div className="h-4 w-4 rounded bg-blue-600"></div>
          <span>Current Question</span>
        </div>

        <div className="flex items-center gap-2">
          <div className="h-4 w-4 rounded bg-green-100 border border-green-600"></div>
          <span>Answered</span>
        </div>

        <div className="flex items-center gap-2">
          <div className="h-4 w-4 rounded border border-gray-300"></div>
          <span>Not Answered</span>
        </div>
      </div>
    </div>
  );
}

export default QuestionPalette;