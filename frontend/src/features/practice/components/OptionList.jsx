function OptionList({ question }) {
  const options = [
    question.optionA,
    question.optionB,
    question.optionC,
    question.optionD,
  ];

  return (
    <div className="mt-6 space-y-4">
      {options.map((option, index) => (
        <button
          key={index}
          className="w-full rounded-xl border p-4 text-left transition hover:border-blue-500 hover:bg-blue-50"
        >
          <span className="font-semibold mr-2">
            {String.fromCharCode(65 + index)}.
          </span>

          {option}
        </button>
      ))}
    </div>
  );
}

export default OptionList;