import QuestionCard from "../components/QuestionCard";
import OptionList from "../components/OptionList";
import { useQuestions } from "../hooks/useQuestions";

function PracticePage() {
  const { questions, loading } = useQuestions();

  if (loading) {
    return <h2>Loading...</h2>;
  }

  const question = questions[0];

  return (
    <div className="mx-auto max-w-4xl p-8">
      <QuestionCard question={question} />

      <OptionList question={question} />
    </div>
  );
}

export default PracticePage;