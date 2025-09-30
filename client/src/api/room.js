const SERVER = import.meta.env.VITE_SERVER_URL || "https://localhost:5173";
const API = `${SERVER}/api/rooms`;

export async function fetchRooms() {
    const res = await fetch(API);
    if (!res.ok) throw new Error("Failed");
    return res.json();
}

export async function fetchRoomById(id) {
    const res = await fetch(`${API}/${id}`);
    if (!res.ok) throw new Error("Room not found");
    return res.json();
}

//Staff create rooms
export async function createRoom(data) {
    const res = await fetch(API, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error("Create failed");
    return res.json();
}

export async function updateRoom(id, data) {
    const res = await fetch (`${API}/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error("Update failed");
    return res.json();
}

export async function deleteRoom(id) {
    const res = await fetch(`${API}/${id}`, { method: "DELETE"});
    if (!res.ok) throw new Error("Delete failed");
}