import React, { useEffect, useState, useMemo } from "react";
import { useParams, Link } from "react-router-dom";
import { fetchRoomById } from "../api/room.js";
import { fetchRoomSlots } from "../api/roomSlot.js";

const fmtTime = (t) => new Date(t).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
const fmtDate = (t) => new Date(t).toLocaleDateString([], { year: "numeric", month: "short", day: "numeric" });
const dayToLocalRange = (dayStr) => {
  const from = new Date(`${dayStr}T00:00:00`);
  const to = new Date(`${dayStr}T23:59:59`);
  return { from: from.toISOString(), to: to.toISOString() };
};

export default function RoomDetail() {
   const { id } = useParams();
   const [room, setRoom] = useState(null);
   const [loading, setLoading] = useState(true);
   const [slots, setSlots] = useState([]);
    const [loadingSlots, setLoadingSlots] = useState(true);
    const [day, setDay] = useState(() => new Date().toISOString().slice(0, 10));
    const [onlyAvailable, setOnlyAvailable] = useState(true);

   useEffect(() => {
       fetchRoomById(id)
       .then((data) => setRoom(data))
       .catch(() => setRoom(null))
       .finally(() => setLoading(false));
   }, [id]);

   useEffect(() => {
    if (!room) return;
    const roomKey = room.roomId ?? room.id ?? room._id;
    const { from, to } = dayToLocalRange(day);
    setLoadingSlots(true);
    fetchRoomSlots(roomKey, { from, to})
    .then(setSlots)
    .catch(() => setSlots([]))
    .finally(() => setLoadingSlots(false));
   }, [room, day]);

   const filteredSlots = useMemo(
    () => slots.filter((s) => (onlyAvailable ? s.isAvailable : true)),
    [slots, onlyAvailable]
   );

   if (loading) return <div className="p-6">Loading...</div>;
   if (!room) return <div className="p-6">Room not found</div>;


   return (
       <div className="min-h-screen bg-zinc-50 text-zinc-900 p-6">
           <div className="mx-auto max-w-4xl rounded-2xl border border-zinc-200 bg-white shadow-sm overflow-hidden">
               //image
               <div className="aspect-[16/9] bg-zinc-100">
                   <img src={room.images?. [0] || "https://via.placeholder.com/800x450?text=No+Image"}/>
               </div>


               {/* room detail */}
               <div>
                   <h1 className="text-2xl font-semibold">{room.name}</h1>
                   <p className="text-sm text-zinc-600">{room.type} capacity {room.capacity} people</p>
               </div>
               <div className="text-right">
                   <div className="text-xl font-semibold">${room.pricePerHour}/h</div>
                   <div className="text-xs text-zinc-500">rating {room.rating}</div>
               </div>
           </div>


           {/* room equipments */}
           <ul className="flex flex-wrap gap-2">
               {room.amenities?.map(a => (
                   <li key={a} className="text-[11px] px-2 py-1 rounded-full bg-zinc-100 border border-zinc-200">{a}</li>
               ))}
           </ul>

           <div className="mt-4 rounded-xl bg-white border border-zinc-200 shadow-sm p-4 flex flex-wrap gap-4 items-center">
        <label>
          Date:{" "}
          <input
            type="date"
            value={day}
            onChange={(e) => setDay(e.target.value)}
            className="rounded-md border border-zinc-300 px-2 py-1 text-sm"
          />
        </label>
        <label className="text-sm inline-flex items-center gap-2">
          <input
            type="checkbox"
            checked={onlyAvailable}
            onChange={(e) => setOnlyAvailable(e.target.checked)}
          />
          Only available
        </label>
      </div>

      <div className="mt-4 rounded-xl bg-white border border-zinc-200 shadow-sm p-4">
        <h2 className="text-lg font-semibold mb-3">Time Slots</h2>
        {loadingSlots ? (
          <p className="text-sm text-zinc-500">Loading slots...</p>
        ) : filteredSlots.length === 0 ? (
          <p className="text-sm text-zinc-500">No slots found for this day.</p>
        ) : (
          <ul className="space-y-2">
            {filteredSlots.map((s) => (
              <li
                key={s._id || `${s.startTime}-${s.endTime}`}
                className="flex justify-between items-center border rounded-md p-2"
              >
                <div>
                  <div className="font-medium">{fmtDate(s.startTime)}</div>
                  <div className="text-sm">
                    {fmtTime(s.startTime)} – {fmtTime(s.endTime)}
                  </div>
                </div>
                <div className="text-sm text-right">
                  <div>${s.price}</div>
                  <div className={s.isAvailable ? "text-emerald-600" : "text-zinc-500"}>
                    {s.isAvailable ? "Available" : "Booked"}
                  </div>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>

      <div className="flex gap-3 pt-4">
        <Link
          to="/rooms"
          className="rounded-xl border border-zinc-300 px-4 py-2 text-sm hover:bg-zinc-100"
        >
          Back
        </Link>
        <Link
          to={`/checkout?roomId=${room._id || room.id}`}
          className="ml-auto inline-flex items-center justify-center rounded-xl bg-zinc-900 text-white text-sm font-medium hover:bg-black px-4 py-2"
        >
          Add to cart
        </Link>
      </div>
    </div>
  );
}