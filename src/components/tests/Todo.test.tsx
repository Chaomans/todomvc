import "@testing-library/jest-dom";
import { act, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import Todo from "../Todo";

describe("Todo component", () => {
    it("should render properly", () => {
        const { asFragment } = render(
            <Todo
                description="First thing to do"
                isdone={false}
                key={Date.now()}
                onChangeDone={() => {}}
                onDelete={() => {}}
                onEditDescription={() => {}}
            />
        );

        expect(asFragment()).toMatchSnapshot();
    });

    it("Should display the description", async () => {
        const description = "My best description";
        render(
            <Todo
                description={description}
                isdone={false}
                key={Date.now()}
                onChangeDone={() => {}}
                onDelete={() => {}}
                onEditDescription={() => {}}
            />
        );

        expect(await screen.findByText(description)).toBeInTheDocument();
    });

    it("Should prevent the parent when cliked on the checkbox", async () => {
        const mockOnChangeDone = jest.fn();
        render(
            <Todo
                description="First thing to do"
                isdone={false}
                key={Date.now()}
                onChangeDone={mockOnChangeDone}
                onDelete={() => {}}
                onEditDescription={() => {}}
            />
        );

        await userEvent.click(await screen.findByRole("checkbox"));

        expect(mockOnChangeDone).toHaveBeenCalledTimes(1);
    });

    it("Should change li classe on double click", async () => {
        // nécessaire ?
        act(() => {
            render(
                <Todo
                    description="to edit"
                    isdone={false}
                    key={Date.now()}
                    onChangeDone={() => {}}
                    onDelete={() => {}}
                    onEditDescription={() => {}}
                />
            );
        });

        await userEvent.dblClick(await screen.findByText("to edit"));

        expect(await screen.findByRole("listitem")).toHaveClass("editing");
    });

    it("Should prevent parent when trying to delete", async () => {
        const mockDelete = jest.fn();
        render(
            <Todo
                description="First thing to do"
                isdone={false}
                key={Date.now()}
                onChangeDone={() => {}}
                onDelete={mockDelete}
                onEditDescription={() => {}}
            />
        );

        await userEvent.click(await screen.findByRole("button"));

        expect(mockDelete).toHaveBeenCalledTimes(1);
    });

    // it("Should be marked as done when clicked on the checkbox", () => {
    //     fail("todo");
    // });
});
