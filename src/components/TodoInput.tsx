import { useState } from "react";

type TodoInputProps = {
    createTodo: (description: string) => void;
};

const TodoInput = ({ createTodo }: TodoInputProps) => {

    const [newValue, setNewValue] = useState("");

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if(e.key === "Enter") {
            if (newValue.trim().length) createTodo(newValue.trim());
            e.currentTarget.value = "";
        }
    }
    return (
        <header className="header">
            <h1>todos</h1>
            <input
                type="text"
                placeholder="What's next ?"
                className="new-todo"
                onKeyDown={(e) => handleKeyDown(e) }
                onChange={(e) => setNewValue(e.target.value)}
                autoFocus
                />
        </header>
    );
};

export default TodoInput;
