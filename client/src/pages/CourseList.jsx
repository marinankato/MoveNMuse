import React from "react";
import { useNavigate } from "react-router-dom";

const courses = [
  { id: 1, title: "Hip Hop Basics", category: "Dance", instructor: "Mary" },
  { id: 2, title: "Music Production", category: "Music", instructor: "Luke" },
];

function CourseList() {
  const navigate = useNavigate();

  return (
    <div>
      <h1 className="text-xl font-bold mb-4">Course List</h1>
      <div className="grid gap-4">
        {courses.map((c) => (
          <div
            key={c.id}
            className="border p-4 rounded hover:bg-gray-100 cursor-pointer"
            onClick={() => navigate(`/course/${c.id}`)}
          >
            <h3 className="font-semibold">{c.title}</h3>
            <p>Category: {c.category}</p>
            <p>Instructor: {c.instructor}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default CourseList;
