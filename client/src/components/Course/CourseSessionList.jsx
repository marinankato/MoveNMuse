// src/components/CourseSessionList.jsx
import { useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import SessionTable from "./SessionTable.jsx";
import {
  listSessions,
  deleteSession,
} from "../../services/sessionService.js";

export default function SessionList() {
  const [sessions, setSessions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState("");
  const [refreshKey, setRefreshKey] = useState(0);

  const navigate = useNavigate();

  const fetchData = useCallback(async () => {
    setLoading(true);
    setErr("");
    try {
      const data = await listSessions({ limit: 50 });
      setSessions(data.items || []);
    } catch (e) {
      console.error(e);
      setErr(e.message || "Failed to load sessions");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [refreshKey, fetchData]);

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this session?")) return;
    try {
      await deleteSession(id);
      alert("Session deleted successfully");
      setRefreshKey((k) => k + 1);
    } catch (e) {
      alert("Failed to delete session: " + e.message);
    }
  };

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-semibold text-gray-800">
          Course Sessions
        </h1>
        <button
          onClick={() => navigate("/admin/sessions/new")}
          className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg shadow-md"
        >
          + New Session
        </button>
      </div>

      {loading && <p>Loading sessions...</p>}
      {err && <p className="text-red-600">{err}</p>}
        
      {!loading && (
        <SessionTable sessions={sessions} onDelete={handleDelete} />
      )}
    </div>
  );
}
