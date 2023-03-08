import '@testing-library/jest-dom';
import { render } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import TodoInput from '../TodoInput';

describe("TodoInput component", () => {
    it("Should render properly", () => {
        const { asFragment } = render(
            <TodoInput
                createTodo={() => {}}
                onChange = {() => {}}
            />
        )

        expect(asFragment()).toMatchSnapshot();
    });

    it("Should prevent parent when key pressed", async () => {
        const mockCreateTodo = jest.fn();
        const mockOnChange = jest.fn();

        render(
            <TodoInput
                createTodo={mockCreateTodo}
                onChange={mockOnChange}
            />
        )

        await userEvent.keyboard("x")
        expect(mockCreateTodo).toHaveBeenCalledTimes(1);
        expect(mockOnChange).toHaveBeenCalledTimes(1);
    })
})