import Room from "../models/room.model.js";

const toPlainNumber = (val) => {
    if (val == null) return 0;
    if (typeof val === "object" && val._bsontype === "Decimal128") {
        return parseFloat(val.toString());
    }
    if (typeof val === "object" && val.$numberDecimal) {
        return parseFloat(val.$numberDecimal);
    }
    const n = Number(val);
    return Number.isFinite(n) ? n : 0;
};

const toDTO = (d) => {
    if (!d) return null;
    const r = d._doc ? d._doc : d;
    return {
        _id: r._id,
        id: r._id,
        name: r.name,
        type: r.type ?? r.roomType ?? "Room",
        capacity: toPlainNumber(r.capacity) ?? 0,
        pricePerHour: toPlainNumber(r.pricePerHour ?? r.defaultPrice),
        rating: toPlainNumber(r.rating),
        images: Array.isArray(r.images) ? r.images : (r.img ? [r.img] : []),
        amenities: Array.isArray(r.amenities) ? r.amenities : [],
        location: r.location ?? "",
        status: r.status ?? "Active",
        roomId: r.roomId ?? null,
        createdAt: r.createdAt,
        updatedAt: r.updatedAt,
    };
};

export const roomController = {
    async list(_req, res, next) {
        try {
        const rooms = await Room.find().lean();
        res.json(rooms.map(toDTO));
    } catch (e) {
        next(e);
    }
    },

    async get(req, res, next) {
        try{
        const doc = await Room.findById(req.params.id).lean();
        if (!doc) return res.status(404).json({ message: "Room not found" });
        res.json(toDTO(doc));
    } catch (e) {
        next(e);
    }
    },

    async create(req, res) {
        try {
            const body = req.body ?? {};
            const payload = {
                ...body,
                pricePerHour: body.pricePerHour ?? body.defaultPrice ?? 0,
                images: Array.isArray(body.images) ? body.images : (body.img ? [body.img] : []),
                amenities: Array.isArray(body.amenities) ? body.amenities : [],
            };
            const created = await Room.create(payload);
            res.status(201).json(toDTO(created));
        } catch (e) {
            next(e);
        }
    },

    async update(req, res, next) {
        try {
        const body = req.body ?? {};
        const patch = { ...body, };
        if (body.defaultPrice != null && body.pricePerHour == null) {
            patch.pricePerHour = body.defaultPrice;
        }
        if (body.img && !Array.isArray(body.images)) {
            patch.images = [body.img];
        }
        const updated = await Room.findByIdAndUpdate(
            req.params.id,
            { $set: patch },
            { new: true, runValidators: true }
        );
        if (!updated) return res.status(404).json({ message: "Room not found" });
        res.json(toDTO(updated));
    } catch (e) {
        next (e);
    }
    },

    async remove(req, res, next) {
        try {
        const del = await Room.findByIdAndDelete(req.params.id);
        if (!del) return res.status(404).json({ message: "Room not found" });
        res.status(204).send();
        } catch (e) {
            next(e);
        }
    },
};