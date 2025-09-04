import React, { useMemo, useState } from "react";

const ROOMS = [
    {
        id: "r1",
        name: "Studio A - Dance Room",
        type: "Dance",
        capacity: 12,   
        pricePerHour: 38,
        rating: 4.7,
        img: "",
        amenities: ["Mirrors", "Speakers", "Monitor"],
    },
    {
        id: "r2",
        name: "Studio B - Music Room",
        type: "Music",
        capacity: 4,
        pricePerHour: 28,
        rating: 4.5,
        img: "",
        amenities: ["Mic", "Piano", "Speakers"],
    },
];

// const TIMESLOTS = [
//     "09:00", "10:00", "11:00", "12:00", "13:00", "14:00", "15:00", "16:00", "17:00", "18:00",
// ];

export default function RoomView() {
    const [slot] = useState("14:00");
    const [duration] = useState(1);

    return (
        <div className="min-h-screen bg-zinc-50 text-zinc-900 p-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {ROOMS.map((room) => (
                    <article key={room.id} className="rounded-2xl border border-zinc-200 bg-white shadow-sm">
                        <div className="aspect-[16/10] overflow-hidden rounded-t-2xl">
                            <img src={room.img} alt={room.name} className="h-full w-full object-cover" />
                        </div>
                            <div className="p-4 flex flex-col gap-3">
                            <header className="flex items-start justify-between gap-3">
                        <div>
                            <h3 className="font-semibold leading-tight">{room.name}</h3>
                            <p className="text-xs text-zinc-500 mt-0.5">{room.type} · capacity {room.capacity} 人</p>
                        </div>
                        <div className="text-right">
                            <div className="text-lg font-semibold">${room.pricePerHour}/h</div>
                            <div className="text-xs text-zinc-500">rating {room.rating}</div>
                        </div>
                    </header>
                    <ul className="flex flex-wrap gap-2">
                        {room.amenities.map((a) => (
                            <li key={a} className="text-[11px] px-2 py-1 rounded-full bg-zinc-100 border border-zinc-200">{a}</li>
                        ))}
                    </ul>
                    <footer className="flex items-center gap-3">
                        <select
                            value={duration}
                            className="rounded-xl border border-zinc-300 px-3 py-2 text-sm"
                        >
                            {[1,2,3,4].map((h)=> (
                            <option key={h} value={h}>{h} 小时</option>
                            ))}
                        </select>
                        <button
                            className="ml-auto inline-flex items-center justify-center rounded-xl bg-zinc-900 text-white px-4 py-2 text-sm font-medium hover:bg-black"
                        >
                            Booking {slot}                           
                            </button>
                        </footer>
                    </div>
                </article>
            ))}
            </div>
            </div>
    );
}