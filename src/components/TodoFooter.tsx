import { Filter } from "./models/models";

type TodoFooterProps = {
    remainingTodos: number;
    completedTodos: number;
    activeFilter: string;
    filters: Filter[];
    onClearCompleted: () => void;
    onChangeActiveFilter: (filterName: string) => void;
};

const TodoFooter = ({ remainingTodos, completedTodos, activeFilter, filters, onClearCompleted, onChangeActiveFilter }: TodoFooterProps) => {

    const beforeChangeActiveFilter = (filter: string) =>{
        onChangeActiveFilter(filter);
    }

    return (
        <footer className="footer">
            <span className="todo-count">
                <strong>{remainingTodos}</strong>{" "}
                {remainingTodos === 0 || remainingTodos > 1 ? "items" : "item"} left
            </span>
            {filters.length > 0 && (
                <ul className="filters">
                    {filters.map((filter) =>(
                        <li key={ filter.value }>
                            <a 
                                href="/" 
                                onClick={(e) => {
                                    e.preventDefault();
                                    beforeChangeActiveFilter(filter.value)
                                }} 
                                className={activeFilter === filter.value ? "selected": ""}
                            >
                                {filter.name}
                            </a>
                        </li>
                    ))}
                </ul>
            )}
            {completedTodos > 0 && (
                <button className="clear-completed" onClick={() => onClearCompleted()}>
                    Clear completed
                </button>
            )}
        </footer>
    );
};

export default TodoFooter;
