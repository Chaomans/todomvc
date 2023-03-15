import { useState } from "react";
import { Filter, TodoItem } from "./models/models";
import TodoFooter from "./TodoFooter";
import TodoInput from "./TodoInput";
import TodoList from "./TodoList";

const TodoPage = () => {

    const [todoList, setTodoList] = useState<TodoItem[]>([]);

    const filters: Filter[] = [
        {
            name: "All",
            value: "All"
        },
        {
            name: "Active",
            value: "Active"
        },
        {
            name: "Completed",
            value: "Completed"
        }
    ];
    const [activeFilter, setActiveFilter] = useState("All");

    const handleChangeActiveFilter = (newActiveFilter: string) => {
        setActiveFilter(newActiveFilter);
    }

    const handleCreate = (description: string) => {
        setTodoList([
            ...todoList,
            {
                id: crypto.randomUUID(),
                description,
                done: false
            }
        ])
    };

    const handleDelete = (id: string) => {
        setTodoList(todoList.filter((todo) => todo.id !== id));
    };

    const handleChangeDoneValue = (id: string, done: boolean) => {
        const newTodoList = todoList.map((todo) => {
            if (todo.id === id) {
                return ({
                    ...todo,
                    done
                });
            } else {
                return todo;
            }
        });
        setTodoList(newTodoList);
    };

    const handleEditDescription = (id: string, desc: string) => {
        const toEditIndex =
            todoList.findIndex((todo) => todo.id === id) ?? null;
        if (toEditIndex === null) return;
        const newTodoList: TodoItem[] = [];
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

    const handleChangeAllDoneValue = () => {
        const alldone = todoList.every((todo) => todo.done);
        const newTodoList: TodoItem[] = [];
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

    const handleClearCompleted = () => {
        setTodoList(todoList.filter((todo) => !todo.done));
    }

    const filteredTodoList = (filter: string) => {
        if (filter === "All") return todoList;
        if (filter === "Active") {
            return todoList.filter((todo) => !todo.done);
        }
        if(filter === "Completed"){
            return todoList.filter((todo) => todo.done);
        }
        return []
    }

    return (
        <section className="todoapp">
            <TodoInput createTodo={handleCreate} />
            <section className="main">
                <input
                    type="checkbox"
                    id="toggle-all"
                    className="toggle-all"
                    onChange={() => handleChangeAllDoneValue()}
                />
                <label htmlFor="toggle-all">Mark all as completed</label>
                {todoList.length > 0 && (
                    <TodoList 
                        todos={filteredTodoList(activeFilter)}
                        onChangeDoneValue={handleChangeDoneValue}
                        onEditDescription={handleEditDescription}
                        onDelete={handleDelete}
                    />
                )}
            </section>
            {todoList.length > 0 && (
                <TodoFooter
                    remainingTodos={todoList.filter((todo) => !todo.done).length}
                    completedTodos={todoList.filter((todo) => todo.done).length}
                    filters={filters}
                    activeFilter={activeFilter}
                    onChangeActiveFilter={handleChangeActiveFilter}
                    onClearCompleted={handleClearCompleted}
                />
            )}
        </section>
    );
};

export default TodoPage;