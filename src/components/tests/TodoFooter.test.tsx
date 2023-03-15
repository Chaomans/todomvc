import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Filter } from "../models/models";
import TodoFooter from "../TodoFooter";

describe("TodoFooter component", () => {
    it("Should display properly", () => {
        const filters: Filter[] = [
            {name: "All", value: "All"},
            {name: "Active", value: "Active"},
            {name: "Complete", value: "Complete"}
        ]
        const { asFragment } = render(
            <TodoFooter 
                activeFilter="All" 
                filters={filters}
                remainingTodos={1}
                completedTodos={0}
                onChangeActiveFilter={() => {}}
                onClearCompleted={() => {}} 
            />
        );

        expect(asFragment()).toMatchSnapshot();
    });


    it.each`
        remaining | pluralized      | expected
        ${1}      | ${"item left"}  | ${"1 item left"}
        ${0}      | ${"items left"} | ${"0 items left"}
        ${2}      | ${"items left"} | ${"2 items left"}
    `(
        "Should display remaining items",
        async ({ remaining, pluralized }) => {
            render(
                <TodoFooter 
                activeFilter="" 
                filters={[]}
                remainingTodos={remaining}
                completedTodos={1}
                onChangeActiveFilter={() => {}}
                onClearCompleted={() => {}} 
            />
            );

            expect(
                await screen.findByText(nbItemLeft(remaining, pluralized))
            ).toBeInTheDocument();
        }
    );

    const nbItemLeft = (remaining: number, pluralized: string) => {
        return (content: string, element: Element | null) => {
            return (
                +content === remaining &&
                (element?.parentNode?.textContent?.endsWith(pluralized) ??
                    false)
            );
        };
    };

    it("Should not show the clear button when no completed todos", async () => {
        render(
            <TodoFooter
                activeFilter="" 
                filters={[]}
                remainingTodos={1}
                completedTodos={0}
                onChangeActiveFilter={() => {}}
                onClearCompleted={() => {}} 
            />
        )

        expect(screen.queryByText("Clear completed")).not.toBeInTheDocument();
    })

    it("Should show the clear button when at least one completed todo", async () => {
        render(
            <TodoFooter
                activeFilter="" 
                filters={[]}
                remainingTodos={1}
                completedTodos={1}
                onChangeActiveFilter={() => {}}
                onClearCompleted={() => {}}
            />
        )

        expect(await screen.findByText("Clear completed")).toBeInTheDocument();
    })

    it.each`
    filter
    ${{name: "Tout", value:"All"}}
    ${{name: "En cours", value:"Active"}}
    ${{name: "Terminé", value:"Completed"}}
    `(`Should notify parent when selecting '$filter.value' filter`, async ({filter}) => {
        const mockOnChangeActiveFilter = jest.fn();
        const filters = [
            {name: "Tout", value:"All"},
            {name: "En cours", value:"Active"},
            {name: "Terminé", value:"Completed"},
        ]
        render(
            <TodoFooter
            activeFilter="All" 
            filters={filters}
            remainingTodos={1}
            completedTodos={0}
            onChangeActiveFilter={mockOnChangeActiveFilter}
            onClearCompleted={() => {}}
            />
            )
            await userEvent.click(await screen.findByText(filter.name));
            expect(mockOnChangeActiveFilter).toHaveBeenCalledTimes(1);
            expect(mockOnChangeActiveFilter).toHaveBeenCalledWith(filter.value);
    });

    it("Should notify parent when clearing completed", async () => {
        const mockOnClearCompleted = jest.fn();
        render(
            <TodoFooter
                activeFilter="" 
                filters={[]}
                remainingTodos={1}
                completedTodos={1}
                onChangeActiveFilter={() => {}}
                onClearCompleted={mockOnClearCompleted} 
            />
        )

        await userEvent.click(await screen.findByText("Clear completed"));
        expect(mockOnClearCompleted).toHaveBeenCalledTimes(1);
        expect(mockOnClearCompleted).toHaveBeenCalledWith();
    })
});
