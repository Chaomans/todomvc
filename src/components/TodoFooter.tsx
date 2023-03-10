type TodoFooterProps = {
    nbTodo: number;
    onClearCompleted: () => void;
};

const TodoFooter = ({ nbTodo, onClearCompleted }: TodoFooterProps) => {
    return (
        <footer className="footer">
            <span className="todo-count">
                <strong>{nbTodo}</strong>{" "}
                {nbTodo === 0 || nbTodo > 1 ? "items" : "item"} left
            </span>
            <button className="clear-completed" onClick={onClearCompleted}>
                Clear completed
            </button>
        </footer>
    );
};

export default TodoFooter;
