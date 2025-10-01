// client/src/pages/CourseDetail.jsx
import { useEffect, useMemo, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { api } from "../api";

/**
 * ------------------------------------------------------------
 * Config: Adjust according to your backend (paths/field names)
 * ------------------------------------------------------------
 */
const USER_ID = 1;                        // Keep consistent with CartPage
const CART_QUERY_URL = (uid) => `/api/cart?userId=${uid}`;
const CART_ADD_URL = `/api/cart/item`;    // Change if your backend uses a different path

/**
 * ------------------------------------------------------------
 * Lightweight local cart (localStorage) as a fallback
 * ------------------------------------------------------------
 */
const CART_KEY = "movenmuse_cart_v1";

function loadLocalCart() {
  try {
    return JSON.parse(localStorage.getItem(CART_KEY) || "[]");
  } catch {
    return [];
  }
}
function saveLocalCart(items) {
  localStorage.setItem(CART_KEY, JSON.stringify(items));
}
function normId(course) {
  return String(course?.id ?? course?._id ?? course?.courseId ?? "");
}
function normName(course) {
  return String(course?.name ?? course?.courseName ?? "Untitled");
}
function normPrice(course) {
  const n = Number(course?.price ?? course?.defaultPrice ?? 0);
  return Number.isFinite(n) ? n : 0;
}
function normRemaining(course) {
  const cap = Number(course?.capacity ?? 0);
  const booked = Number(course?.booked ?? 0);
  const rem = Number(course?.remaining ?? (cap - booked));
  return Math.max(0, Number.isFinite(rem) ? rem : 0);
}
function addToLocalCart(course, qty = 1) {
  const id = normId(course);
  if (!id) throw new Error("Invalid course id");

  const items = loadLocalCart();
  const idx = items.findIndex((it) => it.id === id);
  const remaining = normRemaining(course);

  if (idx >= 0) {
    const nextQty = (items[idx].qty || 1) + qty;
    items[idx].qty = remaining > 0 ? Math.min(nextQty, remaining) : nextQty;
  } else {
    items.push({
      id,
      name: normName(course),
      price: normPrice(course),
      category: course?.category || "",
      level: course?.level || "All levels",
      remaining,
      qty: remaining > 0 ? Math.min(1, remaining) : 1,
    });
  }

  saveLocalCart(items);
  return items;
}

/**
 * ------------------------------------------------------------
 * Server cart helpers
 * ------------------------------------------------------------
 */
async function ensureServerCartId(userId) {
  const res = await fetch(CART_QUERY_URL(userId));
  if (!res.ok) throw new Error("Failed to get cart");
  const data = await res.json();
  if (!data?.cartId) throw new Error("Backend did not return cartId");
  return String(data.cartId);
}

/**
 * Add course to server cart
 * - If your backend uses different field names (e.g. productId/itemType/occurrence),
 *   adjust the body below.
 */
async function addItemToServerCart({
  userId,
  cartId,
  courseId,
  occurrenceId,
  qty = 1,
}) {
  const res = await fetch(CART_ADD_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      cartId,
      userId,
      productType: "course",
      courseId,
      occurrenceId, // optional
      quantity: qty,
    }),
  });
  if (!res.ok) {
    const msg = await res.text().catch(() => "");
    throw new Error(msg || "Failed to add to cart");
  }
  return res.json(); // might return { cart, item } etc.
}

/**
 * ------------------------------------------------------------
 * Course detail component
 * ------------------------------------------------------------
 */
export default function CourseDetail() {
  const { id } = useParams();
  const nav = useNavigate();

  const [data, setData] = useState(null);
  const [selectedOccurrenceId, setSelectedOccurrenceId] = useState("");
  const [loading, setLoading] = useState(true);
  const [adding, setAdding] = useState(false);
  const [msg, setMsg] = useState("");
  const [err, setErr] = useState("");

  // Fetch course details
  useEffect(() => {
    if (!id || id === "undefined") { 
      setErr("Invalid course ID");
      setLoading(false);
      return;
    }
    (async () => {
      try {
        setLoading(true);
        setErr("");
        setMsg("");
        const res = await api.getCourse(id);
        setData(res);
      } catch (e) {
        setErr(e?.message || "Failed to load course");
      } finally {
        setLoading(false);
      }
    })();
  }, [id]);


  // Normalize occurrences (support id/_id/occurrenceId)
  const occurrences = useMemo(() => {
    const list = Array.isArray(data?.occurrences) ? data.occurrences : [];
    return list.map((o, idx) => {
      const oid = String(o?.id ?? o?._id ?? o?.occurrenceId ?? idx);
      const start = o?.startTime ? new Date(o.startTime) : null;
      const label = start
        ? start.toISOString().slice(0, 16).replace("T", " ")
        : `Occurrence ${idx + 1}`;
      return {
        raw: o,
        id: oid,
        label,
        duration: o?.duration,
        price: o?.price,
      };
    });
  }, [data]);

  // Default to first occurrence if available
  useEffect(() => {
    if (occurrences.length > 0) {
      setSelectedOccurrenceId((prev) => prev || occurrences[0].id);
    } else {
      setSelectedOccurrenceId("");
    }
  }, [occurrences]);

  const price = useMemo(
    () => data?.price ?? data?.defaultPrice ?? 0,
    [data?.price, data?.defaultPrice]
  );

  const onBook = async () => {
    setErr("");
    setMsg("");
    setAdding(true);
    try {
      const courseId = normId(data);
      if (!courseId) throw new Error("Invalid course id");

      // Use occurrenceId if available
      const occurrenceId = occurrences.length ? selectedOccurrenceId : undefined;

      // 1) Ensure server cartId
      const cartId = await ensureServerCartId(USER_ID);

      // 2) Add item to server cart
      await addItemToServerCart({
        userId: USER_ID,
        cartId,
        courseId,
        occurrenceId,
        qty: 1,
      });

      setMsg("Added to cart ✓");
    } catch (e) {
      // Fallback: save to local cart
      try {
        addToLocalCart(data, 1);
        setMsg("Added to local cart ✓");
      } catch {
        /* ignore */
      }
      setErr(e?.message || "Failed to add to cart");
    } finally {
      setAdding(false);
    }
  };

  if (loading) return <div style={{ padding: 16 }}>Loading…</div>;

  if (err && !data) {
    return (
      <div style={{ padding: 16 }}>
        <button onClick={() => nav(-1)}>← Back</button>
        <div style={{ color: "#c00", marginTop: 12 }}>{err}</div>
      </div>
    );
  }

  if (!data) return null;

  return (
    <div style={{ padding: 16, maxWidth: 800, margin: "0 auto" }}>
      <button onClick={() => nav(-1)}>← Back</button>

      <h2 style={{ marginTop: 8 }}>{normName(data)}</h2>

      <div style={{ color: "#666", marginTop: 4 }}>
        {data?.category || "Course"} · {data?.level || "All levels"}
      </div>

      {data?.description && (
        <p style={{ marginTop: 8, lineHeight: 1.6 }}>{data.description}</p>
      )}

      <div style={{ marginTop: 12 }}>
        <div>Capacity: {data?.capacity ?? 0}</div>
        <div>Booked: {data?.booked ?? 0}</div>
        <div>
          Remaining:{" "}
          <b>
            {data?.remaining ??
              Math.max((data?.capacity || 0) - (data?.booked || 0), 0)}
          </b>
        </div>
      </div>

      <p style={{ marginTop: 10 }}>
        Price: <b>${price}</b>
      </p>

      {/* Occurrence selection (if available) */}
      {occurrences.length > 0 && (
        <div style={{ marginTop: 10 }}>
          <label style={{ marginRight: 8 }}>Choose a time:</label>
          <select
            value={selectedOccurrenceId}
            onChange={(e) => setSelectedOccurrenceId(e.target.value)}
          >
            {occurrences.map((o) => (
              <option key={o.id} value={o.id}>
                {o.label}
              </option>
            ))}
          </select>
        </div>
      )}

      <div style={{ marginTop: 14, display: "flex", gap: 8 }}>
        <button disabled={adding} onClick={onBook}>
          {adding ? "Adding…" : "Book"}
        </button>
        <button onClick={() => nav("/cart")}>Go to Cart →</button>
      </div>

      {msg && <div style={{ color: "green", marginTop: 8 }}>{msg}</div>}
      {err && <div style={{ color: "#c00", marginTop: 8 }}>{err}</div>}
    </div>
  );
}









