import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import TodoPage from "../TodoPage";


const crypto = require('crypto');

Object.defineProperty(globalThis, 'crypto', {
  value: {
    randomUUID: () => crypto.randomUUID()
  }
});

describe("TodoPage component", () => {
    it("Should render properly", () => {
        const { asFragment } = render(
            <TodoPage/>
        )

        expect(asFragment()).toMatchSnapshot();
    });

    it("Should create a todo", async () => {
        render(
            <TodoPage/>
        )

        await userEvent.type(await screen.findByPlaceholderText("What's next ?"), "eat a rainbow{Enter}");
        expect(await screen.findByText("eat a rainbow")).toBeInTheDocument();
        await userEvent.type(await screen.findByPlaceholderText("What's next ?"), "eat a burger{Enter}");
        expect(await screen.findByText("eat a burger")).toBeInTheDocument();
        const lists = await screen.findAllByRole("list");
        expect(lists[0].childElementCount).toEqual(2);
    });

    it("Should delete the chosen todo", async () => {
        render(
            <TodoPage/>
        )

        await userEvent.type(await screen.findByPlaceholderText("What's next ?"), "eat a rainbow{Enter}");
        expect(await screen.findByText("eat a rainbow")).toBeInTheDocument();
        await userEvent.type(await screen.findByPlaceholderText("What's next ?"), "eat a burger{Enter}");
        expect(await screen.findByText("eat a burger")).toBeInTheDocument();
        const lists = await screen.findAllByRole("list");
        expect(lists[0].childElementCount).toEqual(2);
        const buttons = await within(lists[0]).findAllByRole("button");
        await userEvent.click(buttons[0]);
        expect(screen.queryByText("eat a rainbow")).not.toBeInTheDocument();
        expect(lists[0].childElementCount).toEqual(1);
    });

    it("Should show list and footer if 1+ todos", async () => {
        render(
            <TodoPage/>
        )

        await userEvent.type(await screen.findByPlaceholderText("What's next ?"), "eat a rainbow{Enter}");
        expect(document.querySelector(".main")).toBeInTheDocument();
        expect(document.querySelector(".footer")).toBeInTheDocument();
    });

    it.each`
    filter          
    ${"All"}      
    ${"Active"}
    ${"Completed"}
    `("Should filter and display $filter todos", async ({filter}) => {
        render(
            <TodoPage/>
        )

        await userEvent.type(await screen.findByPlaceholderText("What's next ?"), "eat a rainbow{Enter}");
        expect(await screen.findByText("eat a rainbow")).toBeInTheDocument();
        await userEvent.type(await screen.findByPlaceholderText("What's next ?"), "eat a burger{Enter}");
        expect(await screen.findByText("eat a burger")).toBeInTheDocument();
        const lists = await screen.findAllByRole("list");
        const chkboxs = await within(lists[0]).findAllByRole("checkbox");
        await userEvent.click(chkboxs[0]);

        await userEvent.click(await screen.findByRole("link", {name: filter}));
        expect(lists[0].childElementCount).toEqual(filter === "All" ? 2 : 1);
        expect(await screen.findByText(filter === "Active" ? "eat a burger" : "eat a rainbow")).toBeInTheDocument();
    });

});