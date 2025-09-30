import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { fetchRoomById } from "../api/room.js";

export default function RoomDetail() {
    const { id } = useParams();
    const [room, setRoom] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchRoomById(id)
        .then((data) => setRoom(data))
        .catch(() => setRoom(null))
        .finally(() => setLoading(false));
    }, [id]);

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

            {/* buttom */}
            <div className="flex gap-3 pt-2">
                <Link to="/rooms" className="rounded-xl border border-zinc-300 px-4 py-2 text-sm">Back</Link>
                <Link to={`/checkout?roomId=${room.id}`} className="ml-auto inline-flex items-center justify-center rounded-xl bg-zinc-900 text-white text-sm font-medium hover:bg-black">
                Continue to checkout
                </Link>
            </div>
        </div>
    );
}