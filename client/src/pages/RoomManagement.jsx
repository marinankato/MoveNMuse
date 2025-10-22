import React, { useEffect, useState } from "react";
import { listRooms, createRoom, deleteRoom } from "../api/roomAdmin.js";

export default function RoomManagement() {
    const [rooms, setRooms] = useState([]);
    const [loading, setLoading] = useState(true);
    const [form, setForm] = useState({
        roomId: "",
        name: "",
        type: "Dance Studio",
        location: "",
        capacity: "",
        defaultPrice: "",
        images: "",
    });

    const loadRooms = async () => {
        try {
            setLoading(true);
            const data = await listRooms();
            setRooms(data);
        } catch (err) {
            console.error("failed to load rooms:", err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadRooms();
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const payload = {
                roomId: Number(form.roomId),
                name: form.name,
                type: form.type,
                location: form.location,
                capacity: Number(form.capacity),
                defaultPrice: Number(form.defaultPrice),
                images: form.images ? form.images.split(",").map((url) => url.trim())
                : [],
            };
            await createRoom(payload);
            setForm({
                roomId: "",
                name: "",
                type: "Dance Studio",
                location: "",
                capacity: "",
                defaultPrice: "",
                images: "",
            });
            await loadRooms();
        } catch (err) {
            alert("failed to create room");
                console.error(err);
        }
        };

        const handleDelete = async (id) => {
            if (!window.confirm("Delete this room?")) return;
            try {
              await deleteRoom(id);
              await loadRooms();
            } catch (err) {
              alert("Failed to delete room");
            }
          };
        
          return (
            <div className="p-6 max-w-5xl mx-auto">
              <h1 className="text-2xl font-semibold mb-4">Room Management</h1>

              <form onSubmit={handleSubmit}
              className="grid grid-cols-1 sm:grid-cols-2 gap-3 border rounded-xl p-4 bg-white">
                <input placeholder="Room ID"
                value={form.roomId}
                onChange={(e) => setForm({ ...form, roomId: e.target.value })}
                required
                className="border rounded px-3 py-2" />
                <input placeholder="Name"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value})}
                required
                className="border rounded px-3 py-2" />
                <input placeholder="Type"
                value={form.type}
                onChange={(e) => setForm({ ...form, type: e.target.value })}
                className="border rounded px-3 py-2" />
                <input placeholder="Location"
                value={form.location}
                onChange={(e) => setForm({ ...form, location: e.target.value })}
                className="border rounded px-3 py-2" />
                <input type="number"
                placeholder="Capacity"
                value={form.capacity}
                onChange={(e) => setForm({ ...form, capacity: e.target.value })}
                className="border rounded px-3 py-2" />
                <input type="number"
                step="0.01"
                placeholder="Default Price"
                value={form.defaultPrice}
                onChange={(e) => setForm({ ...form, defaultPrice: e.target.value })}
                className="border rounded px-3 py-2" />
                <input
                placeholder="Image URLs (comma separated)"
                value={form.images}
                onChange={(e) => setForm({ ...form, images: e.target.value })}
                className="sm:col-span-2 border rounded px-3 py-2" />
                <button className="sm:col-span-2 rounded bg-zinc-900 text-white px-4 py-2 hover:bg-black">
                    Add Room
                </button>
              </form>

              <h2 className="mt-6 mb-2 text-lg font-semibold">Existing Rooms</h2>
      {loading ? (
        <p>Loading rooms...</p>
      ) : (
        <ul className="space-y-2">
          {rooms.map((r) => (
            <li
              key={r._id}
              className="border rounded-xl p-3 bg-white flex items-center justify-between"
            >
              <div>
                <div className="font-medium">{r.name}</div>
                <div className="text-sm text-zinc-600">
                  {r.type} • {r.location} • Capacity {r.capacity} • $
                  {Number(r.pricePerHour ?? r.defaultPrice ?? 0).toFixed(2)}
                </div>
              </div>
              <button
                onClick={() => handleDelete(r._id)}
                className="rounded border px-3 py-1.5 text-sm hover:bg-zinc-100"
              >
                Delete
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}