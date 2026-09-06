import { useEffect, useMemo, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { FiArrowLeft, FiEdit2, FiPlus, FiTrash2 } from "react-icons/fi";
import { getAdminMockTests } from "../api/adminMockTest.api";
import {
  createAdminQuestion,
  getAdminMockTestQuestions,
  removeAdminQuestion,
  updateAdminQuestion,
} from "../api/adminQuestion.api";

const EMPTY_FORM = {
  section: "VARC",
  topic: "",
  type: "MCQ",
  question: "",
  optionA: "",
  optionB: "",
  optionC: "",
  optionD: "",
  correctAnswer: "",
  explanation: "",
  marks: 3,
  negativeMarks: 1,
  passageTitle: "",
  passageContent: "",
};

function AdminMockTestQuestionsPage() {
  const { mockTestId } = useParams();
  const [mockTest, setMockTest] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [form, setForm] = useState(EMPTY_FORM);
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [sectionFilter, setSectionFilter] = useState("ALL");

  const visibleQuestions = useMemo(
    () => sectionFilter === "ALL" ? questions : questions.filter((item) => item.question.section === sectionFilter),
    [questions, sectionFilter]
  );

  async function loadData() {
    try {
      setLoading(true);
      setError("");
      const [tests, loadedQuestions] = await Promise.all([
        getAdminMockTests(),
        getAdminMockTestQuestions(mockTestId),
      ]);
      const currentTest = tests.find((item) => item.id === mockTestId);
      if (!currentTest) throw new Error("Mock test not found");
      setMockTest(currentTest);
      setQuestions(loadedQuestions);
    } catch (requestError) {
      setError(requestError.response?.data?.message || requestError.message || "Unable to load question paper.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadData();
  }, [mockTestId]);

  function handleChange(event) {
    const { name, value } = event.target;
    setForm((current) => ({ ...current, [name]: value }));
  }

  function resetForm() {
    setForm(EMPTY_FORM);
    setEditingId(null);
  }

  function startEdit(item) {
    const question = item.question;
    setEditingId(question.id);
    setForm({
      section: question.section,
      topic: question.topic,
      type: question.type,
      question: question.question,
      optionA: question.optionA || "",
      optionB: question.optionB || "",
      optionC: question.optionC || "",
      optionD: question.optionD || "",
      correctAnswer: question.correctAnswer,
      explanation: question.explanation || "",
      marks: question.marks,
      negativeMarks: question.negativeMarks,
      passageTitle: question.passage?.title || "",
      passageContent: question.passage?.content || "",
    });
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setSaving(true);
    setError("");

    const payload = {
      ...form,
      year: mockTest.year,
      slot: mockTest.slot,
      marks: Number(form.marks),
      negativeMarks: Number(form.negativeMarks),
      optionA: form.type === "MCQ" ? form.optionA : null,
      optionB: form.type === "MCQ" ? form.optionB : null,
      optionC: form.type === "MCQ" ? form.optionC : null,
      optionD: form.type === "MCQ" ? form.optionD : null,
      passageContent: form.passageContent.trim() || null,
      passageTitle: form.passageTitle.trim() || null,
    };

    try {
      if (editingId) {
        const updated = await updateAdminQuestion(editingId, payload);
        setQuestions((current) => current.map((item) => item.question.id === editingId ? { ...item, question: updated } : item));
      } else {
        const created = await createAdminQuestion(mockTestId, payload);
        setQuestions((current) => [...current, { id: `local-${created.id}`, mockTestId, questionId: created.id, order: current.length, question: created }]);
      }
      resetForm();
    } catch (requestError) {
      setError(requestError.response?.data?.message || "Unable to save question.");
    } finally {
      setSaving(false);
    }
  }

  async function handleRemove(item) {
    if (!window.confirm(`Remove Question ${item.order + 1} from this paper?`)) return;
    try {
      setError("");
      await removeAdminQuestion(mockTestId, item.question.id);
      setQuestions((current) => current.filter((entry) => entry.question.id !== item.question.id).map((entry, index) => ({ ...entry, order: index })));
      if (editingId === item.question.id) resetForm();
    } catch (requestError) {
      setError(requestError.response?.data?.message || "Unable to remove question.");
    }
  }

  if (loading) {
    return <section className="min-h-[calc(100vh-72px)] bg-[#f6f5f5] px-5 py-10 dark:bg-[#091a21]"><div className="mx-auto max-w-6xl rounded-2xl border border-[#d3e0ea] bg-white p-10 text-center text-sm text-slate-500 dark:border-[#194353] dark:bg-[#102a33] dark:text-slate-400">Loading question paper...</div></section>;
  }

  return (
    <section className="min-h-[calc(100vh-72px)] bg-[#f6f5f5] px-5 py-8 dark:bg-[#091a21] sm:px-8 sm:py-10">
      <div className="mx-auto max-w-6xl">
        <Link to="/admin/mock-tests" className="mb-5 inline-flex items-center gap-2 text-sm font-semibold text-[#276678] hover:text-[#1687a7] dark:text-[#d3e0ea]">
          <FiArrowLeft /> Back to Mock Tests
        </Link>

        <div className="mb-8 flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
          <div>
            <p className="mb-2 text-sm font-bold uppercase tracking-[0.16em] text-[#1687a7]">Question Paper Builder</p>
            <h1 className="text-3xl font-extrabold tracking-tight text-[#276678] dark:text-[#d3e0ea] sm:text-4xl">{mockTest?.title}</h1>
            <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">Add, edit, and arrange the questions that belong to this paper.</p>
          </div>
          <div className="rounded-xl border border-[#d3e0ea] bg-white px-4 py-3 text-sm dark:border-[#194353] dark:bg-[#102a33]">
            <span className="font-bold text-[#276678] dark:text-[#d3e0ea]">{questions.length}</span><span className="ml-1 text-slate-500 dark:text-slate-400">questions</span>
          </div>
        </div>

        {error && <div role="alert" className="mb-6 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-700 dark:border-red-900/60 dark:bg-red-950/30 dark:text-red-300">{error}</div>}

        <div className="mb-8 rounded-2xl border border-[#d3e0ea] bg-white p-6 shadow-sm dark:border-[#194353] dark:bg-[#102a33] sm:p-7">
          <div className="mb-5 flex items-center justify-between gap-4">
            <div>
              <h2 className="text-lg font-bold text-[#276678] dark:text-[#d3e0ea]">{editingId ? "Edit question" : "Add question"}</h2>
              <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">Question year and slot are inherited from the mock test.</p>
            </div>
            {editingId && <button type="button" onClick={resetForm} className="text-sm font-semibold text-slate-500 hover:text-[#276678] dark:text-slate-400 dark:hover:text-[#d3e0ea]">Cancel</button>}
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="grid gap-5 sm:grid-cols-3">
              <label><span className="mb-2 block text-sm font-semibold text-slate-700 dark:text-slate-300">Section</span><select name="section" value={form.section} onChange={handleChange} className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none focus:border-[#1687a7] dark:border-[#194353] dark:bg-[#091a21] dark:text-[#d3e0ea]"><option value="VARC">VARC</option><option value="DILR">DILR</option><option value="QA">QA</option></select></label>
              <label><span className="mb-2 block text-sm font-semibold text-slate-700 dark:text-slate-300">Topic</span><input name="topic" value={form.topic} onChange={handleChange} required placeholder="Reading Comprehension" className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none focus:border-[#1687a7] dark:border-[#194353] dark:bg-[#091a21] dark:text-[#d3e0ea]" /></label>
              <label><span className="mb-2 block text-sm font-semibold text-slate-700 dark:text-slate-300">Type</span><select name="type" value={form.type} onChange={handleChange} className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none focus:border-[#1687a7] dark:border-[#194353] dark:bg-[#091a21] dark:text-[#d3e0ea]"><option value="MCQ">MCQ</option><option value="TITA">TITA</option></select></label>
            </div>

            <label className="block"><span className="mb-2 block text-sm font-semibold text-slate-700 dark:text-slate-300">Question</span><textarea name="question" value={form.question} onChange={handleChange} required rows={5} placeholder="Enter the question exactly as it should appear to the student." className="w-full resize-y rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm leading-6 outline-none focus:border-[#1687a7] dark:border-[#194353] dark:bg-[#091a21] dark:text-[#d3e0ea]" /></label>

            {form.type === "MCQ" && <div className="grid gap-4 sm:grid-cols-2">
              {[["optionA", "Option A"], ["optionB", "Option B"], ["optionC", "Option C"], ["optionD", "Option D"]].map(([name, label]) => <label key={name}><span className="mb-2 block text-sm font-semibold text-slate-700 dark:text-slate-300">{label}</span><textarea name={name} value={form[name]} onChange={handleChange} required rows={2} className="w-full resize-y rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none focus:border-[#1687a7] dark:border-[#194353] dark:bg-[#091a21] dark:text-[#d3e0ea]" /></label>)}
            </div>}

            <div className="grid gap-4 sm:grid-cols-3">
              <label><span className="mb-2 block text-sm font-semibold text-slate-700 dark:text-slate-300">Correct answer</span><input name="correctAnswer" value={form.correctAnswer} onChange={handleChange} required placeholder={form.type === "MCQ" ? "A" : "42"} className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none focus:border-[#1687a7] dark:border-[#194353] dark:bg-[#091a21] dark:text-[#d3e0ea]" /></label>
              <label><span className="mb-2 block text-sm font-semibold text-slate-700 dark:text-slate-300">Marks</span><input name="marks" type="number" min="0" max="100" value={form.marks} onChange={handleChange} className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none focus:border-[#1687a7] dark:border-[#194353] dark:bg-[#091a21] dark:text-[#d3e0ea]" /></label>
              <label><span className="mb-2 block text-sm font-semibold text-slate-700 dark:text-slate-300">Negative marks</span><input name="negativeMarks" type="number" min="0" max="100" value={form.negativeMarks} onChange={handleChange} className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none focus:border-[#1687a7] dark:border-[#194353] dark:bg-[#091a21] dark:text-[#d3e0ea]" /></label>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <label><span className="mb-2 block text-sm font-semibold text-slate-700 dark:text-slate-300">Passage title <span className="font-normal text-slate-400">(optional)</span></span><input name="passageTitle" value={form.passageTitle} onChange={handleChange} placeholder="Passage / Set title" className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none focus:border-[#1687a7] dark:border-[#194353] dark:bg-[#091a21] dark:text-[#d3e0ea]" /></label>
              <label><span className="mb-2 block text-sm font-semibold text-slate-700 dark:text-slate-300">Explanation <span className="font-normal text-slate-400">(optional)</span></span><textarea name="explanation" value={form.explanation} onChange={handleChange} rows={3} className="w-full resize-y rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none focus:border-[#1687a7] dark:border-[#194353] dark:bg-[#091a21] dark:text-[#d3e0ea]" /></label>
            </div>
            <label className="block"><span className="mb-2 block text-sm font-semibold text-slate-700 dark:text-slate-300">Passage / shared set <span className="font-normal text-slate-400">(optional)</span></span><textarea name="passageContent" value={form.passageContent} onChange={handleChange} rows={6} placeholder="For VARC passages or DILR sets, paste the shared content here." className="w-full resize-y rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm leading-6 outline-none focus:border-[#1687a7] dark:border-[#194353] dark:bg-[#091a21] dark:text-[#d3e0ea]" /></label>

            <button disabled={saving} type="submit" className="inline-flex items-center gap-2 rounded-xl bg-[#1687a7] px-5 py-3 text-sm font-bold text-white transition hover:bg-[#276678] disabled:cursor-not-allowed disabled:opacity-60"><FiPlus />{saving ? "Saving..." : editingId ? "Save Question" : "Add Question"}</button>
          </form>
        </div>

        <div className="mb-4 flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
          <h2 className="text-xl font-bold text-[#276678] dark:text-[#d3e0ea]">Questions in paper</h2>
          <div className="flex flex-wrap gap-2">
            {["ALL", "VARC", "DILR", "QA"].map((section) => <button key={section} type="button" onClick={() => setSectionFilter(section)} className={`rounded-full px-3 py-1.5 text-xs font-bold transition ${sectionFilter === section ? "bg-[#276678] text-white" : "bg-[#d3e0ea] text-[#276678] hover:bg-[#1687a7] hover:text-white dark:bg-[#194353] dark:text-[#d3e0ea]"}`}>{section === "ALL" ? "All" : section}</button>)}
          </div>
        </div>

        {visibleQuestions.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-[#d3e0ea] bg-white p-10 text-center dark:border-[#194353] dark:bg-[#102a33]"><p className="font-semibold text-[#276678] dark:text-[#d3e0ea]">No questions added yet.</p><p className="mt-1 text-sm text-slate-500 dark:text-slate-400">Use the form above to start building this paper.</p></div>
        ) : (
          <div className="space-y-3">
            {visibleQuestions.map((item) => <article key={item.question.id} className="rounded-2xl border border-[#d3e0ea] bg-white p-5 shadow-sm dark:border-[#194353] dark:bg-[#102a33]">
              <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                <div className="min-w-0">
                  <div className="mb-2 flex flex-wrap items-center gap-2"><span className="rounded-full bg-[#d3e0ea] px-2.5 py-1 text-[11px] font-bold text-[#276678] dark:bg-[#194353] dark:text-[#d3e0ea]">Q{item.order + 1}</span><span className="rounded-full bg-slate-100 px-2.5 py-1 text-[11px] font-bold text-slate-600 dark:bg-[#091a21] dark:text-slate-300">{item.question.section}</span><span className="rounded-full bg-slate-100 px-2.5 py-1 text-[11px] font-bold text-slate-600 dark:bg-[#091a21] dark:text-slate-300">{item.question.type}</span><span className="text-xs text-slate-500 dark:text-slate-400">{item.question.topic}</span></div>
                  <p className="whitespace-pre-wrap text-sm font-medium leading-6 text-slate-800 dark:text-slate-200">{item.question.question}</p>
                  {item.question.passage && <p className="mt-3 rounded-lg bg-[#f6f5f5] p-3 text-xs leading-5 text-slate-600 dark:bg-[#091a21] dark:text-slate-400">Shared passage/set attached</p>}
                </div>
                <div className="flex shrink-0 gap-2"><button type="button" onClick={() => startEdit(item)} className="inline-flex items-center gap-2 rounded-lg border border-slate-200 px-3 py-2 text-sm font-semibold text-slate-700 hover:border-[#1687a7] hover:text-[#276678] dark:border-[#194353] dark:text-slate-300"><FiEdit2 /> Edit</button><button type="button" onClick={() => handleRemove(item)} className="inline-flex items-center gap-2 rounded-lg border border-red-200 px-3 py-2 text-sm font-semibold text-red-600 hover:bg-red-50 dark:border-red-900/60 dark:text-red-400 dark:hover:bg-red-950/30"><FiTrash2 /> Remove</button></div>
              </div>
            </article>)}
          </div>
        )}
      </div>
    </section>
  );
}

export default AdminMockTestQuestionsPage;
