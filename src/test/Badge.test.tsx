import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { Badge } from "@/components/ui/Badge";

describe("Badge UI Component", () => {
  it("renders badge text with tone", () => {
    render(<Badge tone="info">Level 3 Active</Badge>);
    expect(screen.getByText(/level 3 active/i)).toBeInTheDocument();
  });
});
