// client/src/pages/StaffSessionsPage.jsx
import { useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import SessionTable from "../components/Course/SessionTable.jsx";
import { listSessions, deleteSession } from "../services/sessionService.js";

export default function AdminSessionsPage() {
  const [sessions, setSessions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState("");
  const [refreshKey, setRefreshKey] = useState(0);
  const nav = useNavigate();

  const fetchData = useCallback(async () => {
    setLoading(true); setErr("");
    try {
      const data = await listSessions({ limit: 50 });
      setSessions(data.items || []);
    } catch (e) {
      setErr(e.message || "Failed to load sessions");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchData(); }, [fetchData, refreshKey]);

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this session?")) return;
    try { await deleteSession(id); setRefreshKey(k => k + 1); }
    catch (e) { alert("Failed: " + e.message); }
  };

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-semibold">Course Sessions</h1>
        <button
          onClick={() => nav("/admin/sessions/new")}
          className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg"
        >
          + New Session
        </button>
      </div>

      {loading && <p>Loading…</p>}
      {err && <p className="text-red-600">{err}</p>}
      {!loading && <SessionTable sessions={sessions} onDelete={handleDelete} />}
    </div>
  );
}
