import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { api } from "../api";

const DEMO_USER_ID = "111"; // 临时固定 userId, replace with real userId after login integration

export default function CourseDetail() {
  const { id } = useParams();
  const nav = useNavigate();
  const [data, setData] = useState(null);
  const [err, setErr] = useState("");
  const [msg, setMsg] = useState("");

  useEffect(() => {
    (async () => {
      try {
        setErr(""); 
        setMsg("");
        const res = await api.getCourse(id); // 获取课程详情
        setData(res);
      } catch (e) { 
        setErr(e.message); // 获取失败时提示错误
      }
    })();
  }, [id]);

  const onBook = async () => {
    try {
      setErr(""); 
      setMsg("");
      await api.createBooking({ userId: DEMO_USER_ID, courseId: id }); // 创建预约
      setMsg("✅ Booking successful!");
      const res = await api.getCourse(id); // 预约后刷新课程详情
      setData(res);
    } catch (e) { 
      setErr(e.message); // 预约失败时提示错误
    }
  };

  if (!data) return <div style={{ padding:16 }}>Loading…</div>; // 加载中提示

  return (
    <div style={{ padding:16 }}>
      <button onClick={()=>nav(-1)}>← Back</button> {/* 返回按钮 */}
      <h2 style={{ marginTop:8 }}>{data.name}</h2>
      <div style={{ color:"#666" }}>
        {data.category} · {data.level || "All levels"}
      </div>
      <p style={{ marginTop:6 }}>{data.description}</p>
      <p>
        Capacity: {data.capacity}, Booked: {data.booked}, Remaining: <b>{data.remaining}</b> 
        {data.lowCapacity && <span style={{ color:"#c00" }}> (Limited spots)</span>}
      </p>
      {data.startAt && (
        <p>
          Time: {new Date(data.startAt).toLocaleString()} —{" "}
          {data.endAt ? new Date(data.endAt).toLocaleTimeString() : ""}
        </p>
      )}
      <button disabled={data.remaining<=0} onClick={onBook}>
        {data.remaining>0 ? "Book Now" : "Full"}
      </button>
      {msg && <div style={{ color:"green", marginTop:8 }}>{msg}</div>}
      {err && <div style={{ color:"#c00", marginTop:8 }}>{err}</div>}
    </div>
  );
}



