import { useState } from "react";
import { TodoItem } from "./models/models";
import Todo from "./Todo";

var classNames = require("classnames");

type TodoListProps = {
    todos: TodoItem[];
    onEditDescription: (id: string, desc: string) => void;
    onDelete: (id: string) => void;
    onChangeDoneValue: (id: string, done: boolean) => void;
}

const TodoList = ({ todos, onEditDescription, onDelete, onChangeDoneValue}: TodoListProps) => {

    const [isEditing, setIsEditing] = useState("");

    const handleSetEditing = (id: string, doSet: boolean) => {
        if(doSet){
            setIsEditing(id);
        } else {
            setIsEditing("");
        }
    }

    return (
            
                <ul className="todo-list">
                    {todos.length > 0 && todos.map((todo) => (
                        <li key={todo.id} className={classNames({
                            completed: todo.done,
                            editing: isEditing === todo.id,
                        })}>
                            <Todo
                                description={todo.description}
                                isdone={todo.done}
                                onSetEditing={(edit) => handleSetEditing(todo.id, edit)}
                                onEditDescription={(desc) =>
                                    onEditDescription(todo.id, desc)
                                }
                                onDelete={() => onDelete(todo.id)}
                                onChangeDone={(done) => onChangeDoneValue(todo.id, done)}
                            />
                        </li>
                    ))}
                </ul>
    );
};

export default TodoList;
