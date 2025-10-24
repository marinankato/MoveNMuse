// Xinyi
import { request } from "./index.jsx";

export const listRooms = () =>
    request("/rooms");

export const createRoom = (payload) =>
    request("/rooms", {
        method: "POST",
        body: JSON.stringify(payload),
    });

export const updateRoom = (id, payload) => 
    request(`/rooms/${encodeURIComponent(id)}`, {
        method: "PUT",
        body: JSON.stringify(payload),
    });

export const deleteRoom = (id) =>
    request(`/rooms/${encodeURIComponent(id)}`, {
        method: "DELETE",
    });
