import React, { useState } from "react";
import Todo from "./Todo";
import TodoFooter from "./TodoFooter";
import TodoInput from "./TodoInput";

interface Itodo {
    id: number;
    description: string;
    done: boolean;
}

const TodoList = () => {
    const [todoList, setTodoList] = useState<Itodo[]>([
        { id: 0, description: "finish this todo", done: true },
        { id: 1, description: "finish this todo too", done: false },
    ]);

    const [newValue, setNewValue] = useState<string>("");

    const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setNewValue(e.target.value);
    };

    const createTodo = (event: React.KeyboardEvent<HTMLInputElement>) => {
        if (event.key === "Enter" && newValue.length >= 3) {
            setTodoList([
                ...todoList,
                { id: Date.now(), description: newValue, done: false },
            ]);
            const inputEL = document.querySelector(
                ".new-todo"
            ) as HTMLInputElement;
            inputEL.value = "";
            setNewValue("");
        }
    };

    const deleteTodo = (id: number) => {
        setTodoList(todoList.filter((todo) => todo.id !== id));
    };

    const onChangeDone = (id: number) => {
        const doneTodo = todoList.find((todo) => todo.id === id) ?? null;
        if (doneTodo === null) return;
        const doneTodoIndex =
            todoList.findIndex((todo) => todo.id === id) ?? null;
        const newTodoList: Itodo[] = [];
        todoList.forEach((todo, i) => {
            if (i === doneTodoIndex) {
                newTodoList.push({
                    ...todoList[doneTodoIndex],
                    done: !doneTodo.done,
                });
            } else {
                newTodoList.push(todo);
            }
        });
        setTodoList(newTodoList);
    };

    const onEditDescription = (id: number, desc: string) => {
        const toEditIndex =
            todoList.findIndex((todo) => todo.id === id) ?? null;
        if (toEditIndex === null) return;
        const newTodoList: Itodo[] = [];
        todoList.forEach((todo, i) => {
            if (i === toEditIndex) {
                newTodoList.push({
                    ...todoList[toEditIndex],
                    description: desc,
                });
            } else {
                newTodoList.push(todo);
            }
        });
        setTodoList(newTodoList);
    };

    const onToggleAll = () => {
        const alldone = todoList.every((todo) => todo.done);
        const newTodoList: Itodo[] = [];
        if (alldone) {
            todoList.forEach((todo) =>
                newTodoList.push({
                    ...todo,
                    done: false,
                })
            );
        } else {
            todoList.forEach((todo) =>
                newTodoList.push({
                    ...todo,
                    done: true,
                })
            );
        }
        setTodoList(newTodoList);
    };

    const onClearCompleted = () => {
        setTodoList(todoList.filter((todo) => !todo.done));
    };

    return (
        <section className="todoapp">
            <TodoInput createTodo={createTodo} onChange={onChange} />
            <section className="main">
                <input
                    type="checkbox"
                    id="toggle-all"
                    className="toggle-all"
                    onChange={() => onToggleAll()}
                />
                <label htmlFor="toggle-all">Mark all as completed</label>
                <ul className="todo-list">
                    {todoList.map((todo: Itodo) => (
                        <Todo
                            key={todo.id}
                            id={todo.id}
                            description={todo.description}
                            onEditDescription={onEditDescription}
                            onDelete={deleteTodo}
                            onChangeDone={onChangeDone}
                            isdone={todo.done}
                        />
                    ))}
                </ul>
            </section>
            {todoList.length > 0 && (
                <TodoFooter
                    nbTodo={todoList.length}
                    onClearCompleted={onClearCompleted}
                />
            )}
        </section>
    );
};

export default TodoList;
