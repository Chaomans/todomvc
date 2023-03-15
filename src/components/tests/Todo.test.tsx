import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import Todo from "../Todo";

describe("Todo component", () => {
    it("should render properly", () => {
        const { asFragment } = render(
            <Todo
                description="First thing to do"
                isdone={false}
                onChangeDone={() => {}}
                onDelete={() => {}}
                onEditDescription={() => {}}
                onSetEditing={() => {}}
            />
        );

        expect(asFragment()).toMatchSnapshot();
    });

    it.each`
    completed   | status    
    ${true}     | ${"be"}
    ${false}     | ${"not be"}
    `("Should $status checked if completed", async ({completed}) => {
        render(
            <Todo
                description={"todo"}
                isdone={completed}
                onChangeDone={() => {}}
                onDelete={() => {}}
                onEditDescription={() => {}}
                onSetEditing={() => {}}
            />
        );

        const checkbox = await screen.findByRole("checkbox") as HTMLInputElement;
        expect(checkbox.checked).toEqual(completed);
    });

    it.each`
    completed   | status
    ${true}     | ${"completed"}
    ${false}    | ${"active"}
    `("Should notify the parent when change status from $status", async ({completed}) => {
        const mockOnChangeDone = jest.fn();
        render(
            <Todo
                description="First thing to do"
                isdone={completed}
                onChangeDone={mockOnChangeDone}
                onDelete={() => {}}
                onEditDescription={() => {}}
                onSetEditing={() => {}}
            />
        );

        await userEvent.click(await screen.findByRole("checkbox"));

        expect(mockOnChangeDone).toHaveBeenCalledTimes(1);
        expect(mockOnChangeDone).toHaveBeenCalledWith(!completed);
    });

    it("Should notify parent on enter in editing mode", async () => {
        const mockOnSetEditing = jest.fn();
        render(
            <Todo
                description="to edit"
                isdone={false}
                onChangeDone={() => {}}
                onDelete={() => {}}
                onEditDescription={() => {}}
                onSetEditing={mockOnSetEditing}
            />
        );

        await userEvent.dblClick(await screen.findByText("to edit"));

        expect(mockOnSetEditing).toHaveBeenCalledTimes(1);
        expect(mockOnSetEditing).toHaveBeenCalledWith(true);
    });

    it("Should switch between view and edit on enter and on exit editing mode", async () => {
        const mockOnSetEditing = jest.fn();
        render(
            <Todo
                description="to do"
                isdone={false}
                onChangeDone={() => {}}
                onDelete={() => {}}
                onEditDescription={() => {}}
                onSetEditing={mockOnSetEditing}
            />
        );

        // enter: hide view, show edit
        await userEvent.dblClick(await screen.findByText("to do"));
        expect(screen.queryByText("to do")).not.toBeInTheDocument();
        expect(await screen.findByRole("textbox")).toBeInTheDocument();
        // exit: show view, hide edit
        await userEvent.keyboard('{Escape}');
        expect(await screen.findByText("to do")).toBeInTheDocument();
        expect(screen.queryByRole("textbox")).not.toBeInTheDocument();
    })

    it("Should notify parent if edit is valid", async () => {
        const mockOnEditDescription = jest.fn();
        const mockOnSetEditing = jest.fn();
        render(
            <Todo
                description="to edit"
                isdone={false}
                onChangeDone={() => {}}
                onDelete={() => {}}
                onEditDescription={mockOnEditDescription}
                onSetEditing={mockOnSetEditing}
            />
        );
        await userEvent.dblClick(await screen.findByText("to edit"));
        expect(mockOnSetEditing).toHaveBeenNthCalledWith(1, true);
        await userEvent.type( await screen.findByRole("textbox"), "insert{Enter}");
        expect(mockOnEditDescription).toHaveBeenCalledTimes(1);
        expect(mockOnEditDescription).toHaveBeenCalledWith("to editinsert");
        expect(mockOnSetEditing).toHaveBeenNthCalledWith(2, false);
    });

    it("Should notify parent to delete if edit is invalid", async () => {
        const mockOnDelete = jest.fn();
        const mockOnSetEditing = jest.fn();
        render(
            <Todo
                description="to edit"
                isdone={false}
                onChangeDone={() => {}}
                onDelete={mockOnDelete}
                onEditDescription={() => {}}
                onSetEditing={mockOnSetEditing}
            />
        );
        await userEvent.dblClick(await screen.findByText("to edit"));
        expect(mockOnSetEditing).toHaveBeenNthCalledWith(1, true);
        await userEvent.type( await screen.findByRole("textbox"),`${'{backspace}'.repeat(7)} \t{Enter}`);
        expect(mockOnDelete).toHaveBeenCalledTimes(1);
        expect(mockOnDelete).toHaveBeenCalledWith();
    });

    it("Should notify parent when trying to delete", async () => {
        const mockDelete = jest.fn();
        render(
            <Todo
                description="First thing to do"
                isdone={false}
                onChangeDone={() => {}}
                onDelete={mockDelete}
                onEditDescription={() => {}}
                onSetEditing={() => {}}
            />
        );

        await userEvent.click(await screen.findByRole("button"));

        expect(mockDelete).toHaveBeenCalledTimes(1);
        expect(mockDelete).toHaveBeenCalledWith();

    });

    it("Should discard changes and exit editing mode when escape is pressed", async () => {
        const mockOnEditDescription = jest.fn();
        const mockOnSetEditing = jest.fn();
        render(
            <Todo
                description="First thing to do"
                isdone={false}
                onChangeDone={() => {}}
                onDelete={() => {}}
                onEditDescription={mockOnEditDescription}
                onSetEditing={mockOnSetEditing}
            />
        );

        await userEvent.dblClick(await screen.findByText("First thing to do"));
        expect(mockOnSetEditing).toHaveBeenCalledTimes(1);
        expect(mockOnSetEditing).toHaveBeenCalledWith(true);
        await userEvent.type(await screen.findByRole("textbox"), "insert");
        await userEvent.keyboard('{Escape}');
        expect(mockOnEditDescription).not.toHaveBeenCalled();
        expect(mockOnSetEditing).toHaveBeenLastCalledWith(false);

    });   
    
});
