import React from "react";
import { useNavigate } from "react-router-dom";
import { userContext } from "../../App";

const AddTodo = (props) => {
    const { setTodosArr, closePopUp, setIsAdded } = props;
    const { currentUser } = React.useContext(userContext);
    const userId = currentUser.id;
    const navigate = useNavigate();

    const initialTodo = {
        userId: "0",
        id: 0,
        title: "",
        completed: false,
    };

    const [todo, setTodo] = React.useState({ ...initialTodo });

    const handleAddBtn = async (event) => {
        event.preventDefault();
        const updatedTodo = {
            ...todo,
            userId,
            title: event.target.title.value,
            completed: event.target.completed.checked,
            id: await getTodoId(),
        };
        addTodo(updatedTodo);
        closePopUp();
    };

    const addTodo = async (newTodo) => {
        try {
            const response = await fetch("http://localhost:3000/todos", {
                method: "POST",
                body: JSON.stringify(newTodo),
                headers: {
                    "Content-type": "application/json; charset=UTF-8",
                },
            });

            if (response.status === 201) {
                increaseTodoId();
                setTodosArr((prevArr) => [...prevArr, newTodo]);
                setIsAdded(true);
            } else {
                console.error("Failed to add todo");
            }
        } catch (error) {
            console.error(error);
        }
    };

    const increaseTodoId = () => {
        fetch("http://localhost:3000/config/1", {
            method: "PATCH",
            body: JSON.stringify({ todoId: Number(todo.id) + 1 }),
            headers: {
                "Content-type": "application/json; charset=UTF-8",
            },
        }).catch((err) => console.error(err));
    };

    const getTodoId = async () => {
        try {
            const id = await fetch("http://localhost:3000/config/1")
                .then((result) => result.json())
                .then((json) => json.todoId.toString());

            return id;
        } catch (error) {
            console.error(error);
        }
    };

    return (
        <>
            <p>add your todo:</p>
            <div>
                <form onSubmit={(event) => handleAddBtn(event)}>
                    <span>
                        <input type="checkbox" name="completed" />
                    </span>
                    <span>
                        <input
                            placeholder="your todo title:"
                            type="text"
                            name="title"
                            value={todo.title}
                            onChange={(e) => setTodo({ ...todo, title: e.target.value })}
                        />
                    </span>
                    <button type="submit">add</button>
                </form>
            </div>
        </>
    );
};

export default AddTodo;
