import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { Button } from "@/components/ui/Button";

describe("Button UI Component", () => {
  it("renders children correctly", () => {
    render(<Button>Click Me</Button>);
    expect(screen.getByRole("button", { name: /click me/i })).toBeInTheDocument();
  });

  it("handles disabled prop", () => {
    render(<Button disabled>Disabled Button</Button>);
    expect(screen.getByRole("button", { name: /disabled button/i })).toBeDisabled();
  });
});
