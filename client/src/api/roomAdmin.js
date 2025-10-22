import { request } from "./index.jsx";

const api = {
    listRooms: () => request("/rooms"),

    createRoom: (payload) =>
        request("/rooms", {
            method: "POST",
            body: JSON.stringify(payload),
        }),

        deleteRoom: (id) =>
            request(`/rooms/${encodeURIComponent(id)}`, {
                method: "DELETE",
            }),
};

export default api;
export const { listRooms, createRoom, deleteRoom } = api;

// export const listRooms = () => request("/rooms");

// export const createRoom = (payload) =>
//     request("/rooms", {
//         method: "POST",
//         body: JSON.stringify(payload),
//     });

// export const deleteRoom = (id) =>
//     request(`/rooms/${encodeURIComponent(id)}`, {
//         method: "DELETE",
//     });