import React, { useState } from "react";

const ROOMS = [
    {
        id: "r1",
        name: "Studio A - Dance Room",
        type: "Dance",
        capacity: 30,   
        pricePerHour: 66,
        rating: 4.7,
        img: "",
        amenities: ["Mirrors", "Speakers", "Monitor"],
    },
    {
        id: "r2",
        name: "Studio B - Dance Room",
        type: "Dance",
        capacity: 20,
        pricePerHour: 55,
        rating: 4.5,
        img: "",
        amenities: ["Mic", "Piano", "Speakers"],
    },
    {
        id: "r3",
        name: "Studio C - Dance Room",
        type: "Dance",
        capacity: 5,
        pricePerHour: 33,
        rating: 4.6,
        img: "",
        amenities: ["Mic", "Piano", "Speakers"],
    },
    {
        id: "r4",
        name: "Studio D - Dance Room",
        type: "Dance",
        capacity: 5,
        pricePerHour: 33,
        rating: 4.7,
        img: "",
        amenities: ["Mic", "Piano", "Speakers"],
    },
    {
        id: "r5",
        name: "Studio E - Dance Room",
        type: "Dance",
        capacity: 60,
        pricePerHour: 82.5,
        rating: 4.8,
        img: "",
        amenities: ["Mic", "Piano", "Speakers"],
    },
    {
        id: "r6",
        name: "Studio E - Dance Room",
        type: "Dance",
        capacity: 8,
        pricePerHour: 33,
        rating: 4.6,
        img: "",
        amenities: ["Mic", "Piano", "Speakers"],
    },
    {
        id: "r7",
        name: "Studio 1 - Music Room",
        type: "Music",
        capacity: 7,
        pricePerHour: 25,
        rating: 4.6,
        img: "",
        amenities: ["Mic", "Piano", "Speakers"],
    },
    {
        id: "r8",
        name: "Studio 2 - Music Room",
        type: "Music",
        capacity: 30,
        pricePerHour: 75,
        rating: 4.6,
        img: "",
        amenities: ["Mic", "Piano", "Speakers"],
    },
    {
        id: "r9",
        name: "Studio 3 - Music room",
        type: "Music",
        capacity: 12,
        pricePerHour: 64,
        rating: 4.6,
        img: "",
        amenities: ["Mic", "Piano", "Speakers"],
    },
    {
        id: "r10",
        name: "Studio 4 - Music Room",
        type: "Music",
        capacity: 1,
        pricePerHour: 40,
        rating: 4.6,
        img: "",
        amenities: ["Mic", "Piano", "Speakers"],
    },
    {
        id: "r11",
        name: "Studio 5 - Music Room",
        type: "Music",
        capacity: 4,
        pricePerHour: 64,
        rating: 4.6,
        img: "",
        amenities: ["Microphone", "Monitor", "Keyboard", "Drum"],
    },
];

// const TIMESLOTS = [
//     "09:00", "10:00", "11:00", "12:00", "13:00", "14:00", "15:00", "16:00", "17:00", "18:00",
// ];

export default function RoomView() {
    return (
        <div className="min-h-screen bg-zinc-50 text-zinc-900 p-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {ROOMS.map((room) => (
                    <article
                    key={room.id}
                    className="rounded-2xl border border-zinc-200 bg-white shadow-sm">
                        <div className="aspect-[16/10] overflow-hidden rounded-t-2xl">
                            <img src={room.img}
                            alt={room.name}
                            className="h-full w-full object-cover" />
                        </div>

                        <div className="p-4 flex flex-col gap-3">
                            <header className="flex items-start justify-between gap-3">
                                <div>
                            <h3 className="font-semibold leading-tight">{room.name}</h3>
                            <p className="text-xs text-zinc-500 mt-0.5">{room.type} · capacity {room.capacity} people</p>
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
                        <button
                            className="ml-auto inline-flex items-center justify-center rounded-xl bg-zinc-900 text-white px-4 py-2 text-sm font-medium hover:bg-black"
                        >
                            Select                           
                            </button>
                        </footer>
                    </div>
                </article>
            ))}
            </div>
        </div>
    );
}