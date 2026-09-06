import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FiEdit2, FiList, FiPlus, FiTrash2 } from "react-icons/fi";
import {
  createAdminMockTest,
  deleteAdminMockTest,
  getAdminMockTests,
  updateAdminMockTest,
} from "../api/adminMockTest.api";

const EMPTY_FORM = {
  title: "",
  duration: 120,
  year: "",
  slot: "",
  isOfficial: false,
  isPublished: false,
};

function AdminMockTestsPage() {
  const navigate = useNavigate();
  const [mockTests, setMockTests] = useState([]);
  const [form, setForm] = useState(EMPTY_FORM);
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  async function loadMockTests() {
    try {
      setLoading(true);
      setError("");
      setMockTests(await getAdminMockTests());
    } catch (requestError) {
      setError(requestError.response?.data?.message || "Unable to load mock tests.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadMockTests();
  }, []);

  function handleChange(event) {
    const { name, value, type, checked } = event.target;
    setForm((current) => ({
      ...current,
      [name]: type === "checkbox" ? checked : value,
    }));
  }

  function startCreate() {
    setEditingId(null);
    setForm(EMPTY_FORM);
    setError("");
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function startEdit(mockTest) {
    setEditingId(mockTest.id);
    setForm({
      title: mockTest.title,
      duration: mockTest.duration,
      year: mockTest.year ?? "",
      slot: mockTest.slot ?? "",
      isOfficial: mockTest.isOfficial,
      isPublished: mockTest.isPublished,
    });
    setError("");
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function cancelEdit() {
    setEditingId(null);
    setForm(EMPTY_FORM);
    setError("");
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setSaving(true);
    setError("");

    const payload = {
      title: form.title,
      duration: Number(form.duration),
      year: form.year === "" ? null : Number(form.year),
      slot: form.slot === "" ? null : Number(form.slot),
      isOfficial: form.isOfficial,
      isPublished: form.isPublished,
    };

    try {
      if (editingId) {
        const updated = await updateAdminMockTest(editingId, payload);
        setMockTests((current) => current.map((item) => (item.id === editingId ? { ...item, ...updated } : item)));
      } else {
        const created = await createAdminMockTest(payload);
        setMockTests((current) => [created, ...current]);
      }

      cancelEdit();
    } catch (requestError) {
      setError(requestError.response?.data?.message || "Unable to save mock test.");
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(mockTest) {
    const confirmed = window.confirm(
      `Delete "${mockTest.title}"? This cannot be undone.`
    );

    if (!confirmed) return;

    try {
      setError("");
      await deleteAdminMockTest(mockTest.id);
      setMockTests((current) => current.filter((item) => item.id !== mockTest.id));
      if (editingId === mockTest.id) cancelEdit();
    } catch (requestError) {
      setError(requestError.response?.data?.message || "Unable to delete mock test.");
    }
  }

  async function togglePublished(mockTest) {
    try {
      setError("");
      const updated = await updateAdminMockTest(mockTest.id, {
        isPublished: !mockTest.isPublished,
      });
      setMockTests((current) => current.map((item) => (item.id === mockTest.id ? { ...item, ...updated } : item)));
    } catch (requestError) {
      setError(requestError.response?.data?.message || "Unable to update publication status.");
    }
  }

  return (
    <section className="min-h-[calc(100vh-72px)] bg-[#f6f5f5] px-5 py-8 dark:bg-[#091a21] sm:px-8 sm:py-10">
      <div className="mx-auto max-w-6xl">
        <div className="mb-8 flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
          <div>
            <p className="mb-2 text-sm font-bold uppercase tracking-[0.16em] text-[#1687a7]">Administration</p>
            <h1 className="text-3xl font-extrabold tracking-tight text-[#276678] dark:text-[#d3e0ea] sm:text-4xl">Mock Tests</h1>
            <p className="mt-2 max-w-2xl text-sm text-slate-600 dark:text-slate-400">Create and maintain the mock tests available to CAT Prep users.</p>
          </div>
          <button
            type="button"
            onClick={startCreate}
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#276678] px-5 py-3 text-sm font-bold text-white transition hover:bg-[#1687a7] focus:outline-none focus:ring-2 focus:ring-[#1687a7] focus:ring-offset-2 dark:focus:ring-offset-[#091a21]"
          >
            <FiPlus />
            New Mock Test
          </button>
        </div>

        {error && (
          <div role="alert" className="mb-6 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-700 dark:border-red-900/60 dark:bg-red-950/30 dark:text-red-300">
            {error}
          </div>
        )}

        <div className="mb-8 rounded-2xl border border-[#d3e0ea] bg-white p-6 shadow-sm dark:border-[#194353] dark:bg-[#102a33] sm:p-7">
          <div className="mb-5 flex items-center justify-between gap-4">
            <div>
              <h2 className="text-lg font-bold text-[#276678] dark:text-[#d3e0ea]">{editingId ? "Edit mock test" : "Create mock test"}</h2>
              <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">Set the basic paper details first. Questions will be managed separately.</p>
            </div>
            {editingId && (
              <button type="button" onClick={cancelEdit} className="text-sm font-semibold text-slate-500 hover:text-[#276678] dark:text-slate-400 dark:hover:text-[#d3e0ea]">Cancel</button>
            )}
          </div>

          <form onSubmit={handleSubmit} className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            <label className="sm:col-span-2 lg:col-span-4">
              <span className="mb-2 block text-sm font-semibold text-slate-700 dark:text-slate-300">Title</span>
              <input name="title" value={form.title} onChange={handleChange} required maxLength={200} placeholder="CAT 2024 Slot 1" className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-[#1687a7] focus:ring-2 focus:ring-[#1687a7]/20 dark:border-[#194353] dark:bg-[#091a21] dark:text-[#d3e0ea]" />
            </label>

            <label>
              <span className="mb-2 block text-sm font-semibold text-slate-700 dark:text-slate-300">Duration (minutes)</span>
              <input name="duration" type="number" min="1" max="600" value={form.duration} onChange={handleChange} required className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none focus:border-[#1687a7] focus:ring-2 focus:ring-[#1687a7]/20 dark:border-[#194353] dark:bg-[#091a21] dark:text-[#d3e0ea]" />
            </label>

            <label>
              <span className="mb-2 block text-sm font-semibold text-slate-700 dark:text-slate-300">Year</span>
              <input name="year" type="number" min="1990" max="2100" value={form.year} onChange={handleChange} placeholder="2024" className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none focus:border-[#1687a7] focus:ring-2 focus:ring-[#1687a7]/20 dark:border-[#194353] dark:bg-[#091a21] dark:text-[#d3e0ea]" />
            </label>

            <label>
              <span className="mb-2 block text-sm font-semibold text-slate-700 dark:text-slate-300">Slot</span>
              <input name="slot" type="number" min="1" max="3" value={form.slot} onChange={handleChange} placeholder="1" className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none focus:border-[#1687a7] focus:ring-2 focus:ring-[#1687a7]/20 dark:border-[#194353] dark:bg-[#091a21] dark:text-[#d3e0ea]" />
            </label>

            <div className="flex flex-col justify-end gap-3">
              <label className="flex items-center gap-3 text-sm font-semibold text-slate-700 dark:text-slate-300">
                <input name="isOfficial" type="checkbox" checked={form.isOfficial} onChange={handleChange} className="h-4 w-4 accent-[#276678]" />
                Official CAT paper
              </label>
              <label className="flex items-center gap-3 text-sm font-semibold text-slate-700 dark:text-slate-300">
                <input name="isPublished" type="checkbox" checked={form.isPublished} onChange={handleChange} className="h-4 w-4 accent-[#276678]" />
                Published
              </label>
            </div>

            <div className="flex items-end sm:col-span-2 lg:col-span-4">
              <button disabled={saving} type="submit" className="w-full rounded-xl bg-[#1687a7] px-5 py-3 text-sm font-bold text-white transition hover:bg-[#276678] disabled:cursor-not-allowed disabled:opacity-60 sm:w-auto">
                {saving ? "Saving..." : editingId ? "Save Changes" : "Create Mock Test"}
              </button>
            </div>
          </form>
        </div>

        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-xl font-bold text-[#276678] dark:text-[#d3e0ea]">Existing mock tests</h2>
          <span className="rounded-full bg-[#d3e0ea] px-3 py-1 text-xs font-bold text-[#276678] dark:bg-[#194353] dark:text-[#d3e0ea]">{mockTests.length} total</span>
        </div>

        {loading ? (
          <div className="rounded-2xl border border-[#d3e0ea] bg-white p-10 text-center text-sm text-slate-500 dark:border-[#194353] dark:bg-[#102a33] dark:text-slate-400">Loading mock tests...</div>
        ) : mockTests.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-[#d3e0ea] bg-white p-10 text-center dark:border-[#194353] dark:bg-[#102a33]">
            <p className="font-semibold text-[#276678] dark:text-[#d3e0ea]">No mock tests yet.</p>
            <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">Create your first mock test above.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {mockTests.map((mockTest) => (
              <article key={mockTest.id} className="rounded-2xl border border-[#d3e0ea] bg-white p-5 shadow-sm dark:border-[#194353] dark:bg-[#102a33] sm:p-6">
                <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
                  <div className="min-w-0">
                    <div className="mb-2 flex flex-wrap items-center gap-2">
                      <h3 className="text-lg font-bold text-[#276678] dark:text-[#d3e0ea]">{mockTest.title}</h3>
                      {mockTest.isOfficial && <span className="rounded-full bg-[#d3e0ea] px-2.5 py-1 text-[11px] font-bold text-[#276678] dark:bg-[#194353] dark:text-[#d3e0ea]">Official</span>}
                      <span className={`rounded-full px-2.5 py-1 text-[11px] font-bold ${mockTest.isPublished ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-950/50 dark:text-emerald-300" : "bg-amber-100 text-amber-700 dark:bg-amber-950/50 dark:text-amber-300"}`}>
                        {mockTest.isPublished ? "Published" : "Draft"}
                      </span>
                    </div>
                    <div className="flex flex-wrap gap-x-5 gap-y-2 text-sm text-slate-500 dark:text-slate-400">
                      <span>{mockTest.questionCount} questions</span>
                      <span>{mockTest.duration} minutes</span>
                      {mockTest.year && <span>{mockTest.year}</span>}
                      {mockTest.slot && <span>Slot {mockTest.slot}</span>}
                      <span>{mockTest.attemptCount} attempts</span>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-2">
                    <button
                      type="button"
                      onClick={() => navigate(`/admin/mock-tests/${mockTest.id}/questions`)}
                      className="inline-flex items-center gap-2 rounded-lg bg-[#1687a7] px-3 py-2 text-sm font-semibold text-white transition hover:bg-[#276678] focus:outline-none focus:ring-2 focus:ring-[#1687a7] focus:ring-offset-2 dark:focus:ring-offset-[#102a33]"
                    >
                      <FiList /> Manage Questions
                    </button>
                    <button type="button" onClick={() => startEdit(mockTest)} className="inline-flex items-center gap-2 rounded-lg border border-slate-200 px-3 py-2 text-sm font-semibold text-slate-700 transition hover:border-[#1687a7] hover:text-[#276678] dark:border-[#194353] dark:text-slate-300 dark:hover:border-[#1687a7] dark:hover:text-[#d3e0ea]">
                      <FiEdit2 /> Edit
                    </button>
                    <button type="button" onClick={() => togglePublished(mockTest)} className="rounded-lg border border-slate-200 px-3 py-2 text-sm font-semibold text-slate-700 transition hover:border-[#1687a7] hover:text-[#276678] dark:border-[#194353] dark:text-slate-300 dark:hover:border-[#1687a7] dark:hover:text-[#d3e0ea]">
                      {mockTest.isPublished ? "Unpublish" : "Publish"}
                    </button>
                    <button type="button" onClick={() => handleDelete(mockTest)} disabled={mockTest.attemptCount > 0} title={mockTest.attemptCount > 0 ? "Tests with attempts cannot be deleted" : "Delete mock test"} className="inline-flex items-center gap-2 rounded-lg border border-red-200 px-3 py-2 text-sm font-semibold text-red-600 transition hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-40 dark:border-red-900/60 dark:text-red-400 dark:hover:bg-red-950/30">
                      <FiTrash2 /> Delete
                    </button>
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}

export default AdminMockTestsPage;
