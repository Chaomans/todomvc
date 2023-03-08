import React, { useState } from "react";
var classNames = require("classnames");

type todoProps = {
    description: string;
    onDelete: () => void;
    onChangeDone: () => void;
    onEditDescription: (desc: string) => void;
    isdone: boolean;
};

const Todo = ({
    description,
    onEditDescription,
    onDelete,
    onChangeDone,
    isdone,
}: todoProps) => {
    // const [done, setDone] = useState<boolean>(isdone);
    const [editing, setEditing] = useState<boolean>(false);
    const [newDesc, setNewDesc] = useState<string>(description);

    const onDoubleClick = () => {
        setEditing(true);
    };

    const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setNewDesc(e.target.value);
    };

    const replaceDesc = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === "Enter" && newDesc.length > 0) {
            onEditDescription(newDesc);
            setEditing(false);
        }
    };

    const liClass = classNames({
        completed: isdone,
        editing: editing,
    });

    return (
        <li className={liClass}>
            <div className="view">
                <input
                    type="checkbox"
                    className="toggle"
                    onChange={onChangeDone}
                    checked={isdone}
                ></input>
                <label onDoubleClick={onDoubleClick}>{description}</label>
                <button onClick={() => onDelete()} className="destroy"></button>
            </div>
            <input
                type="text"
                className="edit"
                autoFocus
                onKeyDown={replaceDesc}
                onChange={onChange}
                value={newDesc}
            />
        </li>
    );
};

export default Todo;
