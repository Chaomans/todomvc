import React, { useState } from "react";
import styles from "./styles/todo.module.css";

type todoProps = {
    id: number;
    description: string;
    onDelete: (id: number) => void;
    onChangeDone: (id: number) => void;
    onEditDescription: (id: number, desc: string) => void;
    isdone: boolean;
};

const Todo = ({
    id,
    description,
    onEditDescription,
    onDelete,
    onChangeDone,
    isdone,
}: todoProps) => {
    const [done, setDone] = useState<boolean>(isdone);
    const [edit, setEdit] = useState<boolean>(false);
    const [newDesc, setNewDesc] = useState<string>("");

    const onClickDone = () => {
        setDone(!done);
        onChangeDone(id);
    };

    const onDoubleClick = () => {
        setEdit(true);
    };

    const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setNewDesc(e.target.value);
    };

    const replaceDesc = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === "Enter" && newDesc.length > 3) {
            setEdit(false);
            onEditDescription(id, newDesc);
        }
    };

    const getPClass = () => {
        const base = done ? styles.pDone : styles.p;
        return edit ? `${base} ${styles.pEdit}` : base;
    };

    return (
        <div className={styles.container}>
            <div className={styles.subContainer}>
                <button
                    className={done ? styles.buttonDone : styles.buttonComplete}
                    onClick={() => onClickDone()}
                >
                    ✔
                </button>
                <p className={getPClass()} onDoubleClick={onDoubleClick}>
                    {description}
                </p>
                <input
                    type="text"
                    autoFocus
                    className={edit ? styles.editOn : styles.editOff}
                    onKeyDown={replaceDesc}
                    onChange={onChange}
                />
            </div>
            <button
                className={done ? styles.buttonDone : styles.buttonDelete}
                onClick={() => onDelete(id)}
            >
                X
            </button>
        </div>
    );
};

export default Todo;
