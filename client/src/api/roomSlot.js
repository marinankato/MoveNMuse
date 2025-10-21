import { request } from "./index.jsx";


export function fetchRoomSlots(roomId, { from, to } = {}) {
 if (!roomId) throw new Error("roomId is required");
 const sp = new URLSearchParams();
 if (from) sp.set("from", from);
 if (to) sp.set("to", to);
 const qs = sp.toString();
 return request(`/roomSlots/${encodeURIComponent(roomId)}${qs ? "?" + qs : ""}`);
}
