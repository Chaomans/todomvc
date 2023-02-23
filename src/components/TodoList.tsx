import React, { useState } from "react";
import Todo from "./Todo";
import styles from "./styles/todoList.module.css";

interface Itodo {
    id: number;
    description: string;
    done: boolean;
}

const TodoList = () => {
    const [todoList, setTodoList] = useState<Itodo[]>([
        { id: 0, description: "finish this todo", done: false },
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
                ".create-todo"
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
        setTodoList([
            ...todoList.filter((todo) => todo.id !== id),
            {
                ...doneTodo,
                done: !doneTodo.done,
            },
        ]);
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

    return (
        <div className={styles.container}>
            <h2>Just {todoList.length} left !</h2>
            <div className={styles.inputContainer}>
                <input
                    className={"create-todo " + styles.createTodoInput}
                    type="text"
                    onKeyDown={createTodo}
                    onChange={onChange}
                />
            </div>
            <div className={styles.todolist}>
                {todoList
                    .filter((todo: Itodo) => !todo.done)
                    .map((todo: Itodo) => (
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
                {todoList
                    .filter((todo: Itodo) => todo.done)
                    .map((todo: Itodo) => (
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
            </div>
        </div>
    );
};

export default TodoList;
