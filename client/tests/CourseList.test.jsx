import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import * as api from "../src/api";
import CourseList from "../src/pages/CourseList";

describe("CourseList", () => {
  beforeEach(() => {
    vi.spyOn(api, "listCourses").mockResolvedValue({ items: [], total: 0, page: 1, pageSize: 10 });
  });

  it("shows error if keyword is empty when clicking Search", async () => {
    render(
      <MemoryRouter>
        <CourseList />
      </MemoryRouter>
    );

    const searchBtn = screen.getByRole("button", { name: /search/i });
    fireEvent.click(searchBtn);

    expect(await screen.findByText(/Keyword cannot be empty/i)).toBeInTheDocument();
    expect(api.listCourses).not.toHaveBeenCalled();
  });

  it("calls api.listCourses when keyword is provided", async () => {
    render(
      <MemoryRouter>
        <CourseList />
      </MemoryRouter>
    );

    const input = screen.getByPlaceholderText(/keyword/i);
    fireEvent.change(input, { target: { value: "piano" } });

    // Simulate pressing Enter key
    fireEvent.keyDown(input, { key: "Enter" });

    //wait for the mock function to be called
    await vi.waitUntil(() => api.listCourses.mock.calls.length > 0, { timeout: 1000 });
    expect(api.listCourses).toHaveBeenCalledWith(
      expect.objectContaining({ kw: "piano" })
    );
  });
});
