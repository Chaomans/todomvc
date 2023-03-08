type TodoInputProps = {
    createTodo: (event: React.KeyboardEvent<HTMLInputElement>) => void;
    onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
};

const TodoInput = ({ createTodo, onChange }: TodoInputProps) => {
    return (
            <input
                type="text"
                placeholder="Whats's next"
                className="new-todo"
                onKeyDown={createTodo}
                onChange={onChange}
                autoFocus
            />
    );
};

export default TodoInput;
