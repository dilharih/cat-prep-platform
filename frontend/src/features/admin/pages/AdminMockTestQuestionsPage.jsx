import { useEffect, useMemo, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { FiArrowLeft, FiEdit2, FiFileText, FiPlus, FiTrash2, FiUpload } from "react-icons/fi";
import { getAdminMockTests } from "../api/adminMockTest.api";
import {
  bulkCreateAdminQuestions,
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

const SAMPLE_JSON = JSON.stringify({
  questions: [
    {
      section: "VARC",
      topic: "Reading Comprehension",
      type: "MCQ",
      question: "Paste the question text here",
      optionA: "Option A",
      optionB: "Option B",
      optionC: "Option C",
      optionD: "Option D",
      correctAnswer: "A",
      explanation: "Optional explanation",
      marks: 3,
      negativeMarks: 1,
      passageTitle: "Optional passage title",
      passageContent: "Optional passage or set content",
    },
  ],
}, null, 2);

function AdminMockTestQuestionsPage() {
  const { mockTestId } = useParams();
  const [mockTest, setMockTest] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [form, setForm] = useState(EMPTY_FORM);
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [importing, setImporting] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [sectionFilter, setSectionFilter] = useState("ALL");
  const [bulkText, setBulkText] = useState("");

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

  function normalizeBulkQuestions(parsed) {
    const list = Array.isArray(parsed) ? parsed : parsed?.questions;
    if (!Array.isArray(list) || list.length === 0) {
      throw new Error("JSON must contain a non-empty questions array.");
    }

    return list.map((item) => ({
      ...item,
      year: item.year ?? mockTest.year,
      slot: item.slot ?? mockTest.slot,
      marks: Number(item.marks ?? 3),
      negativeMarks: Number(item.negativeMarks ?? 1),
      optionA: item.type === "MCQ" ? item.optionA : null,
      optionB: item.type === "MCQ" ? item.optionB : null,
      optionC: item.type === "MCQ" ? item.optionC : null,
      optionD: item.type === "MCQ" ? item.optionD : null,
      passageContent: item.passageContent?.trim() || null,
      passageTitle: item.passageTitle?.trim() || null,
      explanation: item.explanation?.trim() || null,
    }));
  }

  async function handleBulkImport() {
    setError("");
    setSuccess("");
    if (!bulkText.trim()) {
      setError("Paste the JSON questions first.");
      return;
    }

    try {
      const parsed = JSON.parse(bulkText);
      const data = normalizeBulkQuestions(parsed);
      if (!window.confirm(`Import ${data.length} questions into this paper?`)) return;

      setImporting(true);
      const created = await bulkCreateAdminQuestions(mockTestId, data);
      await loadData();
      setBulkText("");
      setSuccess(`${created.length} questions imported successfully.`);
    } catch (requestError) {
      setError(requestError.response?.data?.message || requestError.message || "Unable to import questions.");
    } finally {
      setImporting(false);
    }
  }

  function handleBulkFile(event) {
    const file = event.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => setBulkText(String(reader.result || ""));
    reader.onerror = () => setError("Unable to read the selected file.");
    reader.readAsText(file);
    event.target.value = "";
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setSaving(true);
    setError("");
    setSuccess("");

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
        setSuccess("Question updated successfully.");
      } else {
        const created = await createAdminQuestion(mockTestId, payload);
        setQuestions((current) => [...current, { id: `local-${created.id}`, mockTestId, questionId: created.id, order: current.length, question: created }]);
        setSuccess("Question added successfully.");
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
      setSuccess("");
      await removeAdminQuestion(mockTestId, item.question.id);
      setQuestions((current) => current.filter((entry) => entry.question.id !== item.question.id).map((entry, index) => ({ ...entry, order: index })));
      if (editingId === item.question.id) resetForm();
      setSuccess("Question removed from the paper.");
    } catch (requestError) {
      setError(requestError.response?.data?.message || "Unable to remove question.");
    }
  }

  if (loading) {
    return <section className="min-h-[calc(100vh-72px)] bg-[#f6f5f5] px-5 py-10 dark:bg-[#091a21]"><div className="mx-auto max-w-6xl rounded-2xl border border-[#d3e0ea] bg-white p-10 text-center text-sm text-slate-500 dark:border-[#194353] dark:bg-[#102a33] dark:text-slate-400">Loading question paper...</div></section>;
  }

  const fieldClass = "w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none focus:border-[#1687a7] dark:border-[#194353] dark:bg-[#091a21] dark:text-[#d3e0ea]";
  const labelClass = "mb-2 block text-sm font-semibold text-slate-700 dark:text-slate-300";

  return (
    <section className="min-h-[calc(100vh-72px)] bg-[#f6f5f5] px-5 py-8 dark:bg-[#091a21] sm:px-8 sm:py-10">
      <div className="mx-auto max-w-6xl">
        <Link to="/admin/mock-tests" className="mb-5 inline-flex items-center gap-2 text-sm font-semibold text-[#276678] hover:text-[#1687a7] dark:text-[#d3e0ea]"><FiArrowLeft /> Back to Mock Tests</Link>

        <div className="mb-8 flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
          <div>
            <p className="mb-2 text-sm font-bold uppercase tracking-[0.16em] text-[#1687a7]">Question Paper Builder</p>
            <h1 className="text-3xl font-extrabold tracking-tight text-[#276678] dark:text-[#d3e0ea] sm:text-4xl">{mockTest?.title}</h1>
            <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">Add individual questions or import the whole paper at once.</p>
          </div>
          <div className="rounded-xl border border-[#d3e0ea] bg-white px-4 py-3 text-sm dark:border-[#194353] dark:bg-[#102a33]"><span className="font-bold text-[#276678] dark:text-[#d3e0ea]">{questions.length}</span><span className="ml-1 text-slate-500 dark:text-slate-400">questions</span></div>
        </div>

        {error && <div role="alert" className="mb-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-700 dark:border-red-900/60 dark:bg-red-950/30 dark:text-red-300">{error}</div>}
        {success && <div role="status" className="mb-4 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-medium text-emerald-700 dark:border-emerald-900/60 dark:bg-emerald-950/30 dark:text-emerald-300">{success}</div>}

        <div className="mb-8 rounded-2xl border border-[#d3e0ea] bg-white p-6 shadow-sm dark:border-[#194353] dark:bg-[#102a33] sm:p-7">
          <div className="mb-5 flex flex-col justify-between gap-4 sm:flex-row sm:items-start">
            <div>
              <div className="flex items-center gap-2"><FiUpload className="text-[#1687a7]" /><h2 className="text-lg font-bold text-[#276678] dark:text-[#d3e0ea]">Bulk import</h2></div>
              <p className="mt-1 max-w-3xl text-sm text-slate-500 dark:text-slate-400">Import up to 200 questions in one transaction. Use a JSON file or paste JSON below. Year and slot default to this mock test.</p>
            </div>
            <label className="inline-flex cursor-pointer items-center gap-2 rounded-xl border border-[#d3e0ea] px-4 py-2.5 text-sm font-bold text-[#276678] hover:border-[#1687a7] dark:border-[#194353] dark:text-[#d3e0ea]">
              <FiFileText /> Choose JSON file
              <input type="file" accept=".json,application/json,text/plain" onChange={handleBulkFile} className="hidden" />
            </label>
          </div>

          <textarea value={bulkText} onChange={(event) => setBulkText(event.target.value)} rows={12} placeholder={SAMPLE_JSON} className={`${fieldClass} resize-y font-mono text-xs leading-5`} />
          <div className="mt-4 flex flex-wrap items-center gap-3">
            <button type="button" onClick={() => setBulkText(SAMPLE_JSON)} className="rounded-xl border border-[#d3e0ea] px-4 py-2.5 text-sm font-semibold text-[#276678] hover:border-[#1687a7] dark:border-[#194353] dark:text-[#d3e0ea]">Load template</button>
            <button type="button" disabled={importing} onClick={handleBulkImport} className="inline-flex items-center gap-2 rounded-xl bg-[#1687a7] px-5 py-2.5 text-sm font-bold text-white transition hover:bg-[#276678] disabled:cursor-not-allowed disabled:opacity-60"><FiUpload />{importing ? "Importing..." : "Import Questions"}</button>
            <span className="text-xs text-slate-500 dark:text-slate-400">All-or-nothing: if one question is invalid, none are added.</span>
          </div>
        </div>

        <div className="mb-8 rounded-2xl border border-[#d3e0ea] bg-white p-6 shadow-sm dark:border-[#194353] dark:bg-[#102a33] sm:p-7">
          <div className="mb-5 flex items-center justify-between gap-4"><div><h2 className="text-lg font-bold text-[#276678] dark:text-[#d3e0ea]">{editingId ? "Edit question" : "Add question"}</h2><p className="mt-1 text-sm text-slate-500 dark:text-slate-400">For one-off edits or individual questions.</p></div>{editingId && <button type="button" onClick={resetForm} className="text-sm font-semibold text-slate-500 hover:text-[#276678] dark:text-slate-400">Cancel</button>}</div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="grid gap-5 sm:grid-cols-3">
              <label><span className={labelClass}>Section</span><select name="section" value={form.section} onChange={handleChange} className={fieldClass}><option value="VARC">VARC</option><option value="DILR">DILR</option><option value="QA">QA</option></select></label>
              <label><span className={labelClass}>Topic</span><input name="topic" value={form.topic} onChange={handleChange} required placeholder="Reading Comprehension" className={fieldClass} /></label>
              <label><span className={labelClass}>Type</span><select name="type" value={form.type} onChange={handleChange} className={fieldClass}><option value="MCQ">MCQ</option><option value="TITA">TITA</option></select></label>
            </div>

            <label className="block"><span className={labelClass}>Question</span><textarea name="question" value={form.question} onChange={handleChange} required rows={5} placeholder="Enter the question exactly as it should appear to the student." className={`${fieldClass} resize-y leading-6`} /></label>

            {form.type === "MCQ" && <div className="grid gap-4 sm:grid-cols-2">{[["optionA", "Option A"], ["optionB", "Option B"], ["optionC", "Option C"], ["optionD", "Option D"]].map(([name, label]) => <label key={name}><span className={labelClass}>{label}</span><textarea name={name} value={form[name]} onChange={handleChange} required rows={2} className={`${fieldClass} resize-y`} /></label>)}</div>}

            <div className="grid gap-4 sm:grid-cols-3">
              <label><span className={labelClass}>Correct answer</span><input name="correctAnswer" value={form.correctAnswer} onChange={handleChange} required placeholder={form.type === "MCQ" ? "A" : "42"} className={fieldClass} /></label>
              <label><span className={labelClass}>Marks</span><input name="marks" type="number" min="0" max="100" value={form.marks} onChange={handleChange} className={fieldClass} /></label>
              <label><span className={labelClass}>Negative marks</span><input name="negativeMarks" type="number" min="0" max="100" value={form.negativeMarks} onChange={handleChange} className={fieldClass} /></label>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <label><span className={labelClass}>Passage title <span className="font-normal text-slate-400">(optional)</span></span><input name="passageTitle" value={form.passageTitle} onChange={handleChange} placeholder="Passage / Set title" className={fieldClass} /></label>
              <label><span className={labelClass}>Explanation <span className="font-normal text-slate-400">(optional)</span></span><textarea name="explanation" value={form.explanation} onChange={handleChange} rows={3} className={`${fieldClass} resize-y`} /></label>
            </div>
            <label className="block"><span className={labelClass}>Passage / shared set <span className="font-normal text-slate-400">(optional)</span></span><textarea name="passageContent" value={form.passageContent} onChange={handleChange} rows={6} placeholder="For VARC passages or DILR sets, paste the shared content here." className={`${fieldClass} resize-y leading-6`} /></label>

            <button disabled={saving} type="submit" className="inline-flex items-center gap-2 rounded-xl bg-[#1687a7] px-5 py-3 text-sm font-bold text-white transition hover:bg-[#276678] disabled:cursor-not-allowed disabled:opacity-60"><FiPlus />{saving ? "Saving..." : editingId ? "Save Question" : "Add Question"}</button>
          </form>
        </div>

        <div className="mb-4 flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
          <h2 className="text-xl font-bold text-[#276678] dark:text-[#d3e0ea]">Questions in paper</h2>
          <div className="flex flex-wrap gap-2">{["ALL", "VARC", "DILR", "QA"].map((section) => <button key={section} type="button" onClick={() => setSectionFilter(section)} className={`rounded-lg px-3 py-2 text-sm font-bold ${sectionFilter === section ? "bg-[#276678] text-white" : "border border-[#d3e0ea] bg-white text-[#276678] dark:border-[#194353] dark:bg-[#102a33] dark:text-[#d3e0ea]"}`}>{section}</button>)}</div>
        </div>

        <div className="space-y-3">
          {visibleQuestions.length === 0 && <div className="rounded-2xl border border-dashed border-[#d3e0ea] bg-white p-10 text-center text-sm text-slate-500 dark:border-[#194353] dark:bg-[#102a33] dark:text-slate-400">No questions in this view yet.</div>}
          {visibleQuestions.map((item) => (
            <article key={item.question.id} className="rounded-2xl border border-[#d3e0ea] bg-white p-5 shadow-sm dark:border-[#194353] dark:bg-[#102a33] sm:p-6">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                <div className="min-w-0"><div className="mb-2 flex flex-wrap items-center gap-2 text-xs font-bold uppercase tracking-wide"><span className="rounded-md bg-[#d3e0ea] px-2 py-1 text-[#276678] dark:bg-[#194353] dark:text-[#d3e0ea]">Question {item.order + 1}</span><span className="text-[#1687a7]">{item.question.section}</span><span className="text-slate-400">{item.question.type}</span></div><p className="whitespace-pre-wrap text-sm leading-6 text-slate-700 dark:text-slate-200">{item.question.question}</p></div>
                <div className="flex shrink-0 gap-2"><button type="button" onClick={() => startEdit(item)} className="inline-flex items-center gap-2 rounded-lg border border-[#d3e0ea] px-3 py-2 text-sm font-semibold text-[#276678] hover:border-[#1687a7] dark:border-[#194353] dark:text-[#d3e0ea]"><FiEdit2 /> Edit</button><button type="button" onClick={() => handleRemove(item)} className="inline-flex items-center gap-2 rounded-lg border border-red-200 px-3 py-2 text-sm font-semibold text-red-600 hover:bg-red-50 dark:border-red-900/60 dark:text-red-300 dark:hover:bg-red-950/30"><FiTrash2 /> Remove</button></div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

export default AdminMockTestQuestionsPage;
