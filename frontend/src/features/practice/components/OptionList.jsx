function OptionList({
  question,
  selected,
  onSelect,
  disabled = false,
}) {
  const options = [
    question.optionA,
    question.optionB,
    question.optionC,
    question.optionD,
  ];

  return (
    <div className="mt-6 space-y-4">
      {options.map((option, index) => {
        const letter = String.fromCharCode(65 + index);

        return (
          <button
            key={letter}
            disabled={disabled}
            onClick={() => onSelect(letter)}
            className={`w-full rounded-xl border p-4 text-left transition ${
              selected === letter
                ? "border-blue-600 bg-blue-100"
                : "hover:border-blue-500 hover:bg-blue-50"
            } ${
              disabled
                ? "cursor-not-allowed opacity-70"
                : ""
            }`}
          >
            <span className="mr-2 font-semibold">
              {letter}.
            </span>

            {option}
          </button>
        );
      })}
    </div>
  );
}

export default OptionList;