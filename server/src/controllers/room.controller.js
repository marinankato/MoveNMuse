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

const requireStaffRole = (user) =>
    user && (user.role === "staff" || user.role === "admin");

export const roomController = {
    async list(_req, res, next) {
        try {
        const rooms = await Room.find().lean();
        res.status(200).json(rooms.map(toDTO));
    } catch (err) {
        next(err);
    }
},

async get(req, res, next) {
    try {
        const { id } = req.params;
        let room = null;

        if (id.length === 24) {
            room = await Room.findById(id).lean();
        }
        if (!room) {
            const rid = Number(id);
            if (Number.isFinite(rid)) {
                room = await Room.findOne({ roomId: rid }).lean();
            }
        }
        if (!room) return res.status(404).json({ message: "Room not found" });
      res.json(toDTO(room));
    } catch (err) {
      next(err);
    }
},

async create(req, res, next) {
    try {
        if (!requireStaffRole(req.user)) {
            return res.status(403).json({ message: "Forbidden: staff only" });
        }

        const body = req.body ?? {};
        const payload = {
            ...body,
            pricePerHour: body.pricePerHour ?? body.defaultPrice ?? 0,
            images: Array.isArray(body.images)
            ? body.images
            : body.img
            ? [body.img]
            : [],
            amenities: Array.isArray(body.amenities) ? body.amenities : [],
        };

        const created = await Room.create(payload);
        res.status(201).json(toDTO(created));
    } catch (err) {
        next(err);
    }
},

async update(req, res, next) {
    try {
        if (!requireStaffRole(req.user)) {
            return res.status(403).json({message: "Forbidden: staff only"});
        }
        const { id } = req.params;
        const body = req.body ?? {};
        const patch = { ...body };

        if (body.defaultPrice != null && body.pricePerHour == null) {
            patch.pricePerHour = body.defaultPrice;
        }
        if (body.img && !Array.isArray(body.images)) {
            patch.images = [body.img];
        }

        const updated = 
        id.length === 24
        ? await Room.findByIdAndUpdate(id, { $set: patch }, { new: true })
        : await Room.findOneAndUpdate(
            { roomId: Number(id) },
            { $set: patch },
            { new: true }
        );

        if (!updated) return res.status(404).json({ message: "Room not found" });
        res.json(toDTO(updated));
    } catch (err) {
        next(err);
    }
},

    async remove(req, res, next) {
        try {
        if (!requireStaffRole(req.user)) {
            return res.status(403).json({ message: "Forbidden: staff only" });
        }
        
        const { id } = req.params;
        const deleted =
        id.length === 24
        ? await Room.findByIdAndDelete(id)
        : await Room.findOneAndDelete({ roomId: Number(id) });

        if (!deleted)
            return res.status(404).json({message: "Room not found" });

        res.status(200).json({ message: "Room deleted successfully" });
        } catch (err) {
    next(err);
    }
},
};