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

const TIMESLOTS = [
    "09:00", "10:00", "11:00", "12:00", "13:00", "14:00", "15:00", "16:00", "17:00", "18:00",
];

export default function RoomView() {

}