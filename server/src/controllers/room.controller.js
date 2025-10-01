import { Room } from "../models/room.model.js";

export const roomController = {
    async list(_req, res) {
        const rooms = await Room.find().lean();
        res.json(rooms);
    },

    async get(req, res) {
        const room = await Room.findById(req.params.id).lean();
        if (!room) return res.status(404).json({ message: "Room not found" });
        res.status(204).send();
    },

    async create(req, res) {
        const room = await Room.create(req.body);
        res.status(201).json(room);
    },

    async update(req, res) {
        const room = await Room.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!room) return res.status(404).json({ message: "Room not found" });
        res.json(room);
    },

    async remove(req, res) {
        const room = await Room.findByIdAndDelete(req.params.id);
        if (!room) return res.status(404).json({ message: "Room not found" });
        res.status(204).send();
    },
    
    async seed(_req, res) {
        const count = await Room.countDocuments();
        if (count > 0) return res.status(400).json({ message: "Already seeded"});
        await Room.insertMany([
            {
                        name: "Studio A - Dance Room",
                        type: "Dance",
                        capacity: 30,   
                        pricePerHour: 66,
                        rating: 4.7,
                        img: "",
                        amenities: ["Mirrors", "Speakers", "Monitor"],
                    },
                    {
                        name: "Studio B - Dance Room",
                        type: "Dance",
                        capacity: 20,
                        pricePerHour: 55,
                        rating: 4.5,
                        img: "",
                        amenities: ["Mic", "Piano", "Speakers"],
                    },
                    {
                        name: "Studio C - Dance Room",
                        type: "Dance",
                        capacity: 5,
                        pricePerHour: 33,
                        rating: 4.6,
                        img: "",
                        amenities: ["Mic", "Piano", "Speakers"],
                    },
                    {
                        name: "Studio D - Dance Room",
                        type: "Dance",
                        capacity: 5,
                        pricePerHour: 33,
                        rating: 4.7,
                        img: "",
                        amenities: ["Mic", "Piano", "Speakers"],
                    },
                    {
                        name: "Studio E - Dance Room",
                        type: "Dance",
                        capacity: 60,
                        pricePerHour: 82.5,
                        rating: 4.8,
                        img: "",
                        amenities: ["Mic", "Piano", "Speakers"],
                    },
                    {
                        name: "Studio E - Dance Room",
                        type: "Dance",
                        capacity: 8,
                        pricePerHour: 33,
                        rating: 4.6,
                        img: "",
                        amenities: ["Mic", "Piano", "Speakers"],
                    },
                    {
                        name: "Studio 1 - Music Room",
                        type: "Music",
                        capacity: 7,
                        pricePerHour: 25,
                        rating: 4.6,
                        img: "",
                        amenities: ["Mic", "Piano", "Speakers"],
                    },
                    {
                        name: "Studio 2 - Music Room",
                        type: "Music",
                        capacity: 30,
                        pricePerHour: 75,
                        rating: 4.6,
                        img: "",
                        amenities: ["Mic", "Piano", "Speakers"],
                    },
                    {
                        name: "Studio 3 - Music room",
                        type: "Music",
                        capacity: 12,
                        pricePerHour: 64,
                        rating: 4.6,
                        img: "",
                        amenities: ["Mic", "Piano", "Speakers"],
                    },
                    {
                        name: "Studio 4 - Music Room",
                        type: "Music",
                        capacity: 1,
                        pricePerHour: 40,
                        rating: 4.6,
                        img: "",
                        amenities: ["Mic", "Piano", "Speakers"],
                    },
                    {
                        name: "Studio 5 - Music Room",
                        type: "Music",
                        capacity: 4,
                        pricePerHour: 64,
                        rating: 4.6,
                        img: "",
                        amenities: ["Microphone", "Monitor", "Keyboard", "Drum"],
                    }
        ]);
        res.json({ ok: true });
    }
};