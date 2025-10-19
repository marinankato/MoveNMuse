// src/pages/CourseList.jsx
import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { listCourses } from "../services/courseService";
import CourseCard from "../components/Course/CourseCard.jsx";

export default function CourseList() {
  const [sp, setSp] = useSearchParams();
  const [kw, setKw] = useState(sp.get("kw") || "");
  const [category, setCategory] = useState(sp.get("category") || "");
  const [level, setLevel] = useState(sp.get("level") || "");
  const pageSize = 9;
  const [page, setPage] = useState(Math.max(1, Number(sp.get("page") || 1)));

  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState("");
  const [data, setData] = useState({ items: [], total: 0 });

  const totalPages = useMemo(
    () => Math.max(1, Math.ceil((data.total || 0) / pageSize)),
    [data.total]
  );

  useEffect(() => {
    let dead = false;
    (async () => {
      setLoading(true);
      setErr("");
      try {
        const r = await listCourses({ kw, category, level, page, pageSize });
        if (!dead) setData({ items: r.items || [], total: Number(r.total) || 0 });
      } catch (e) {
        if (!dead) setErr(e.message || "Failed to load");
      } finally {
        if (!dead) setLoading(false);
      }
    })();
    setSp((old) => {
      const p = new URLSearchParams(old);
      kw ? p.set("kw", kw) : p.delete("kw");
      category ? p.set("category", category) : p.delete("category");
      level ? p.set("level", level) : p.delete("level");
      p.set("page", String(page));
      p.set("pageSize", String(pageSize));
      return p;
    });
    return () => {
      dead = true;
    };
  }, [kw, category, level, page, pageSize, setSp]);

  return (
    <div className="mx-auto max-w-5xl p-4">
      <h1 className="text-2xl font-bold">Course List</h1>

      <div className="mt-4 flex flex-wrap items-center gap-2">
        <input
          className="w-64 rounded-lg border px-3 py-2 text-sm"
          placeholder="Search courses..."
          value={kw}
          onChange={(e) => {
            setPage(1);
            setKw(e.target.value);
          }}
        />
        <select
          className="rounded-lg border px-3 py-2 text-sm"
          value={category}
          onChange={(e) => {
            setPage(1);
            setCategory(e.target.value);
          }}
        >
          <option value="">All Categories</option>
          <option value="Dance">Dance</option>
          <option value="Workshop">Workshop</option>
          <option value="Music">Music</option>
        </select>
        <select
          className="rounded-lg border px-3 py-2 text-sm"
          value={level}
          onChange={(e) => {
            setPage(1);
            setLevel(e.target.value);
          }}
        >
          <option value="">All Levels</option>
          <option value="Beginner">Beginner</option>
          <option value="Intermediate">Intermediate</option>
          <option value="Advanced">Advanced</option>
        </select>
      </div>

      <div className="mt-4 min-h-40">
        {loading && <div className="text-gray-500 text-sm">Loading…</div>}
        {err && !loading && <div className="text-red-600 text-sm">{err}</div>}
        {!loading && !err && (
          data.items.length ? (
            <ul className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {data.items.map((c) => (
                <CourseCard key={c.courseId} c={c} />
              ))}
            </ul>
          ) : (
            <div className="text-gray-500 text-sm">No data available</div>
          )
        )}
      </div>

      {data.total > pageSize && (
        <div className="flex items-center justify-center gap-2 mt-6">
          <button
            className="rounded-lg border px-3 py-1 text-sm disabled:opacity-50"
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={page <= 1 || loading}
          >
            Previous
          </button>
          <span className="text-sm">
            {page} / {totalPages}
          </span>
          <button
            className="rounded-lg border px-3 py-1 text-sm disabled:opacity-50"
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            disabled={page >= totalPages || loading}
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
}





