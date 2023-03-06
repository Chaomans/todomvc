import React, { useState } from "react";

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
    const [done, setDone] = useState<boolean>(isdone);
    const [editing, setEditing] = useState<boolean>(false);
    const [newDesc, setNewDesc] = useState<string>(description);

    const onClickDone = () => {
        setDone(!done);
        onChangeDone();
    };

    const onDoubleClick = () => {
        setEditing(true);
    };

    const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setNewDesc(e.target.value);
    };

    const replaceDesc = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === "Enter" && newDesc.length > 3) {
            onEditDescription(newDesc);
            setEditing(false);
        }
    };

    const setLiClass = (): string => {
        const liClass = [];
        if (done) liClass.push("completed");
        if (editing) liClass.push("editing");
        return liClass.join(" ");
    };

    return (
        <li className={setLiClass()}>
            <div className="view">
                <input
                    type="checkbox"
                    className="toggle"
                    onChange={onClickDone}
                    checked={done}
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
