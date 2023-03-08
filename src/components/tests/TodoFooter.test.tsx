import "@testing-library/jest-dom";
import { act, render, screen } from "@testing-library/react";
import TodoFooter from "../TodoFooter";

describe("TodoFooter component", () => {
    it("Should display properly", () => {
        const { asFragment } = render(
            <TodoFooter nbTodo={1} onClearCompleted={() => {}} />
        );

        expect(asFragment()).toMatchSnapshot();
    });

    it("Should display number of items", async () => {
        render(<TodoFooter nbTodo={25} onClearCompleted={() => {}} />);

        expect(await screen.findByText("25")).toBeInTheDocument();
    });

    it.each`
        nbOfTodos | pluralized      | expected
        ${1}      | ${"item left"}  | ${"1 item left"}
        ${0}      | ${"items left"} | ${"0 items left"}
        ${2}      | ${"items left"} | ${"2 items left"}
    `(
        "Should display '$expected' with $nbOfTodos todos",
        async ({ nbOfTodos, pluralized, expected }) => {
            render(
                <TodoFooter nbTodo={nbOfTodos} onClearCompleted={() => {}} />
            );

            expect(
                await screen.findByText(nbItemLeft(nbOfTodos, pluralized))
            ).toBeInTheDocument();
        }
    );

    const nbItemLeft = (nbOfTodos: number, pluralized: string) => {
        return (content: string, element: Element | null) => {
            return (
                +content === nbOfTodos &&
                (element?.parentNode?.textContent?.endsWith(pluralized) ??
                    false)
            );
        };
    };
});
