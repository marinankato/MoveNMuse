import { useEffect, useMemo, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { api } from "../api";

const CATEGORIES = ["", "Dance", "Music", "Workshop"];
// 注意：这里的 "" 代表“全部”，label 用 All levels
const LEVELS = [
  { value: "", label: "All levels" },
  { value: "Beginner", label: "Beginner" },
  { value: "Intermediate", label: "Intermediate" },
  { value: "Advanced", label: "Advanced" },
];

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

  // 构造请求参数时：空串就代表不传
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
      setError(e.message || "请求失败");
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
        {payload.items.map((c) => (
          <li
            key={c._id}
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
            <Link to={`/courses/${c._id}`}>View Details</Link>
          </li>
        ))}
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



