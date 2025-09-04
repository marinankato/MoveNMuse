import React from "react";
import { useParams, useNavigate } from "react-router-dom";

const courses = [
  {
    id: 1,
    title: "Hip Hop Basics",
    category: "Dance",
    instructor: "Alice",
    sessions: [
      { id: "s1", date: "2025-09-10 18:00", capacity: 20 },
      { id: "s2", date: "2025-09-17 18:00", capacity: 15 },
    ],
  },
  {
    id: 2,
    title: "Music Production",
    category: "Music",
    instructor: "Bob",
    sessions: [
      { id: "s3", date: "2025-09-12 15:00", capacity: 10 },
    ],
  },
];

function CourseDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const course = courses.find((c) => c.id === Number(id));

  if (!course) return <p>Course not found.</p>;

  return (
    <div>
      <h1 className="text-xl font-bold">{course.title}</h1>
      <p>Category: {course.category}</p>
      <p>Instructor: {course.instructor}</p>
      <h2 className="font-semibold mt-4">Sessions</h2>
      <ul className="list-disc ml-6">
        {course.sessions.map((s) => (
          <li key={s.id}>
            {s.date} (Capacity: {s.capacity})
          </li>
        ))}
      </ul>
      <button
        className="mt-4 px-4 py-2 bg-blue-500 text-white rounded"
        onClick={() => navigate("/checkout")}
      >
        Book This Course
      </button>
    </div>
  );
}

export default CourseDetail;
