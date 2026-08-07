function QuestionCard({ question }) {
  if (!question) {
    return (
      <div className="rounded-xl border bg-white p-8 text-center">
        No question found.
      </div>
    );
  }

  return (
    <div className="rounded-xl border bg-white p-8 shadow-sm">
      <div className="mb-4 flex items-center justify-between">
        <span className="rounded-full bg-blue-100 px-3 py-1 text-sm font-medium text-blue-700">
          {question.section}
        </span>

        <span className="text-sm text-gray-500">
          {question.topic}
        </span>
      </div>

      <h2 className="text-xl font-semibold leading-8">
        {question.question}
      </h2>
    </div>
  );
}

export default QuestionCard;