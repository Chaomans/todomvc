import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import TodoInput from "../TodoInput";

describe("TodoInput component", () => {
  it("Should render properly", () => {
    const { asFragment } = render(<TodoInput createTodo={() => {}} />);

    expect(asFragment()).toMatchSnapshot();
  });

  it.each`
    chain                         | expected            | spec
    ${"My valid chain"}           | ${"My valid chain"} | ${"trimmed"}
    ${"\u00A0  My valid chain\t"} | ${"My valid chain"} | ${"non trimmed"}
  `(
    "Should notify parent when input is valid ($spec)",
    async ({ chain, expected }) => {
      const mockCreateTodo = jest.fn();

      render(<TodoInput createTodo={mockCreateTodo} />);

      const todoInput = await screen.findByRole("textbox");
      await userEvent.type(todoInput, `${chain}{enter}`);
      expect(mockCreateTodo).toHaveBeenCalledTimes(1);
      expect(mockCreateTodo).toHaveBeenCalledWith(`${expected}`);
    }
  );

  it("Should not notify parent when input is invalid", async () => {
    const mockCreateTodo = jest.fn();

    render(<TodoInput createTodo={mockCreateTodo} />);

    const todoInput = await screen.findByRole("textbox");
    await userEvent.type(todoInput, "  \u00A0 \t{enter}");
    expect(mockCreateTodo).not.toHaveBeenCalled();
  });
});
