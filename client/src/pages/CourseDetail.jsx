import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { api } from "../api";

const DEMO_USER_ID = "111"; // fixed demo user ID for booking

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
        const res = await api.getCourse(id); // get course details
        setData(res);
      } catch (e) { 
        setErr(e.message); // load error
      }
    })();
  }, [id]);

  const onBook = async () => {
    try {
      setErr(""); 
      setMsg("");
      await api.createBooking({ userId: DEMO_USER_ID, courseId: id }); // make booking
      setMsg("Booking successful!");
      const res = await api.getCourse(id); // refresh course details   
      setData(res);
    } catch (e) { 
      setErr(e.message); // booking error
    }
  };

  if (!data) return <div style={{ padding:16 }}>Loading…</div>; // loading state

  return (
    <div style={{ padding:16 }}>
      <button onClick={()=>nav(-1)}>← Back</button> {/* Back button */}
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



