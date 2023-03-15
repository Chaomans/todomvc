import { useState } from "react";

type todoProps = {
    description: string;
    onDelete: () => void;
    onChangeDone: (isDone: boolean) => void;
    onEditDescription: (desc: string) => void;
    onSetEditing: (editing: boolean) => void;
    isdone: boolean;
};

const Todo = ({
    description,
    isdone,
    onEditDescription,
    onDelete,
    onChangeDone,
    onSetEditing,
}: todoProps) => {
    const [newDesc, setNewDesc] = useState(description);
    const [editing, setEditing] = useState(false);

    const onEditing = (newDescription: string) => {
        setNewDesc(newDescription);
    };

    const replaceDesc = (key: string) => {
        if (key === "Enter") {
            if(newDesc.trim().length > 0){
                onEditDescription(newDesc.trim());
                setEditing(false);
                onSetEditing(false);
            } else {
                onDelete();
            }
        }
        if(key === "Escape") {
            onSetEditing(false);
            setEditing(false);
            setNewDesc(description);
        }
    };

    const handleDoubleClick = () => {
        onSetEditing(true);
        setEditing(true);
    }

    return (
        <>
            {!editing && (<div className="view">
                <input
                    type="checkbox"
                    className="toggle"
                    onChange={(e) => onChangeDone(e.target.checked)}
                    checked={isdone}
                ></input>
                <label onDoubleClick={() => handleDoubleClick()}>{description}</label>
                <button onClick={() => onDelete()} className="destroy"></button>
            </div>)}
            { editing && (
                <input
                    type="text"
                    className="edit"
                    onKeyDown={(e) => replaceDesc(e.key)}
                    onChange={(e) => onEditing(e.target.value)}
                    value={newDesc}
                    autoFocus
                />
            )}
        </>
    );
};

export default Todo;
