// Xinyi
import { request } from "./index.jsx";

export async function fetchRoomSlots(roomId, { from, to } = {}) {
 if (!roomId) throw new Error("roomId is required");
 const sp = new URLSearchParams();
 if (from) sp.set("from", from);
 if (to) sp.set("to", to);
 const qs = sp.toString();
 try {
    const data = await request(`/roomSlots/${encodeURIComponent(roomId)}${qs ? "?" + qs : ""}`);
    return Array.isArray(data) ? data : [];
} catch (e) {
    console.error("fetchRoomSlots error:", e);
    return [];
}
}