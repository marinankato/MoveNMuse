import { useEffect, useMemo, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { api } from "../api";

const CATEGORIES = ["", "Dance", "Music", "Workshop"];
const LEVELS = [
  { value: "", label: "All levels" },
  { value: "Beginner", label: "Beginner" },
  { value: "Intermediate", label: "Intermediate" },
  { value: "Advanced", label: "Advanced" },
];

function normCourseId(course) {
  return String(course?._id ?? course?.id ?? course?.courseId ?? "");
}

export default function CourseList() {
  const [sp, setSp] = useSearchParams();
  const [kw, setKw] = useState(sp.get("kw") || "");
  const [category, setCategory] = useState(sp.get("category") || "");
  const [level, setLevel] = useState(sp.get("level") || "");
  const [page, setPage] = useState(Number(sp.get("page") || 1));
  const [pageSize] = useState(10);

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [payload, setPayload] = useState({ items: [], total: 0, page: 1, pageSize });

  const params = useMemo(
    () => ({
      kw: kw.trim(),
      category,
      level: level === "" ? undefined : level,
      page,
      pageSize,
    }),
    [kw, category, level, page, pageSize]
  );

  const fetchData = async () => {
    try {
      setError("");
      setLoading(true);
      const res = await api.listCourses(params);
      if (Array.isArray(res)) setPayload({ items: res, total: res.length, page, pageSize });
      else setPayload(res);
    } catch (e) {
      setError(e.message || "request failed");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const next = new URLSearchParams();
    if (kw) next.set("kw", kw);
    if (category) next.set("category", category);
    if (level) next.set("level", level);
    if (page > 1) next.set("page", String(page));
    setSp(next, { replace: true });
  }, [kw, category, level, page, setSp]);

  useEffect(() => {
    fetchData();
  }, [params.page, params.kw, params.category, params.level]);

  // 按回车键时也触发搜索
  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      if (!kw.trim()) {
        setError("Keyword cannot be empty");
        return;
      }
      setError("");
      setPage(1);
      fetchData();
    }
  };

  return (
    <div style={{ padding: "16px" }}>
      <h2>Course List</h2>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 200px 200px auto",
          gap: 8,
          margin: "10px 0",
        }}
      >
        <input
          value={kw}
          onChange={(e) => setKw(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Keyword"
        />
        <select
          value={category}
          onChange={(e) => {
            setPage(1);
            setCategory(e.target.value);
          }}
        >
          {CATEGORIES.map((c) => (
            <option key={c} value={c}>
              {c || "All categories"}
            </option>
          ))}
        </select>
        <select
          value={level}
          onChange={(e) => {
            setPage(1);
            setLevel(e.target.value);
          }}
        >
          {LEVELS.map((l) => (
            <option key={l.value} value={l.value}>
              {l.label}
            </option>
          ))}
        </select>
        <button
          onClick={() => {
            if (!kw.trim()) {
              setError("Keyword cannot be empty");
              return;
            }
            setError("");
            setPage(1);
            fetchData();
          }}
        >
          Search
        </button>
      </div>

      {error && <div style={{ color: "#c00" }}>{error}</div>}
      {loading && <div>Loading…</div>}

      <ul style={{ display: "grid", gap: 10 }}>
        {payload.items.map((c) => {
          const cid = normCourseId(c);
          return (
            <li
              key={cid || c.name}
              style={{
                border: "1px solid #eee",
                borderRadius: 12,
                padding: 12,
                display: "flex",
                justifyContent: "space-between",
              }}
            >
              <div>
                <div style={{ fontWeight: 700 }}>{c.name}</div>
                <div style={{ color: "#666" }}>
                  {c.category} · {c.level || "All levels"}
                </div>
                <div style={{ marginTop: 6 }}>
                  Remaining: <b>{c.remaining}</b>
                  {c.lowCapacity && (
                    <span style={{ color: "#c00" }}> (Limited spots)</span>
                  )}
                </div>
              </div>
              {cid ? (
                <Link to={`/courses/${cid}`}>View Details</Link>
              ) : (
                <span style={{ color: "#999" }}>No ID</span>
              )}
            </li>
          );
        })}
      </ul>

      {payload.total > payload.pageSize && (
        <div style={{ marginTop: 12, display: "flex", gap: 8 }}>
          <button
            disabled={payload.page <= 1}
            onClick={() => setPage((p) => Math.max(1, p - 1))}
          >
            Previous
          </button>
          <button
            disabled={payload.page * payload.pageSize >= payload.total}
            onClick={() => setPage((p) => p + 1)}
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
}



