import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { TodoItem } from "../models/models";
import TodoList from "../TodoList";

describe("TodoList component", () => {

    it("Should render properly", () => {
        const todoList: TodoItem[] = [
            {id: "1A2Z", description: "Eat a rainbow", done: false},
            {id: "2Z3E", description: "Play rhythm game", done: true},
        ]

        const { asFragment } = render(
            <TodoList
                todos={todoList}
                onEditDescription={() => {}}
                onChangeDoneValue={() => {}}
                onDelete={() => {}}
            />
        )

        expect(asFragment()).toMatchSnapshot();
    })

    it("Should give 'editing' class to li when enter in editing mode", async () => {
        const todo: TodoItem = {
            id: "1A2Z",
            description: "Eat a rainbow",
            done: false
        };

        render(
            <TodoList
            todos={[todo]}
            onEditDescription={() => {}}
            onChangeDoneValue={() => {}}
            onDelete={() => {}}
            />
        )

        await userEvent.dblClick(await screen.findByText(todo.description));
        expect(await screen.findByRole("listitem")).toHaveClass("editing");
    })

    it("Should notify parent to update the description if the edition is valid", async () => {
        const mockOnEditDescription = jest.fn();

        const todo: TodoItem = {
            id: "1A2Z",
            description: "Eat a rainbow",
            done: false
        };

        render(
            <TodoList
            todos={[todo]}
            onEditDescription={mockOnEditDescription}
            onChangeDoneValue={() => {}}
            onDelete={() => {}}
            />
        )
        
        await userEvent.dblClick(await screen.findByText(todo.description));
        await userEvent.type(
            await screen.findByRole("textbox"),
            `${'{backspace}'.repeat(7)}burger{enter}`
        );
        expect(mockOnEditDescription).toHaveBeenCalledTimes(1);
        expect(mockOnEditDescription).toHaveBeenCalledWith(todo.id, "Eat a burger");
    });

    it("Should notify parent to delete the todo if the edition is invalid", async () => {
        const mockOnEditDescription = jest.fn();
        const mockOnDelete = jest.fn();

        const todo: TodoItem = {
            id: "1A2Z",
            description: "Eat a rainbow",
            done: false
        };

        render(
            <TodoList
            todos={[todo]}
            onEditDescription={mockOnEditDescription}
            onChangeDoneValue={() => {}}
            onDelete={mockOnDelete}
            />
        )
        
        await userEvent.dblClick( await screen.findByText(todo.description));
        await userEvent.type(
            await screen.findByRole("textbox"),
            `${'{backspace}'.repeat(todo.description.length)}   \t\t{Enter}`
        );
        expect(mockOnEditDescription).not.toHaveBeenCalled();
        expect(mockOnDelete).toHaveBeenCalledTimes(1);
        expect(mockOnDelete).toHaveBeenCalledWith(todo.id);
    });

    it("Should remove editing class if escape is pressed", async () => {
        const mockOnEditDescription = jest.fn();
        const todo: TodoItem = {
            id: "1A2Z",
            description: "Eat a rainbow",
            done: false
        };

        render(
            <TodoList
            todos={[todo]}
            onEditDescription={mockOnEditDescription}
            onChangeDoneValue={() => {}}
            onDelete={() => {}}
            />
        )

        
        await userEvent.dblClick( await screen.findByText(todo.description));
        await userEvent.type(await screen.findByRole("textbox"), "insert smth");
        await userEvent.keyboard('{Escape}');
        expect(mockOnEditDescription).not.toHaveBeenCalled();
        expect(await screen.findByRole("listitem")).not.toHaveClass("editing");
    });
    
    it("Should notify parent on delete", async () => {
        const mockOnDelete = jest.fn();
        const todo: TodoItem = {
            id: "1A2Z",
            description: "Eat a rainbow",
            done: false
        };

        render(
            <TodoList
            todos={[todo]}
            onEditDescription={() => {}}
            onChangeDoneValue={() => {}}
            onDelete={mockOnDelete}
            />
        )

        await userEvent.click(await screen.findByRole("button"));
        expect(mockOnDelete).toHaveBeenCalledTimes(1);
        expect(mockOnDelete).toHaveBeenCalledWith(todo.id);
    })

    it.each`
    completed  | status
    ${true}    | ${"completed"}
    ${false}    | ${"active"}
    `("Should prevent parent to change status from $status", async ({completed}) => {
        const mockOnChangeDoneValue = jest.fn();
        const todo: TodoItem = {
            id: "1A2Z",
            description: "Eat a rainbow",
            done: completed
        };

        render(
            <TodoList
            todos={[todo]}
            onEditDescription={() => {}}
            onChangeDoneValue={mockOnChangeDoneValue}
            onDelete={() => {}}
            />
        )

        await userEvent.click(await screen.findByRole("checkbox"));
        expect(mockOnChangeDoneValue).toHaveBeenCalledTimes(1);
        expect(mockOnChangeDoneValue).toHaveBeenCalledWith(todo.id, !completed);
    })

});