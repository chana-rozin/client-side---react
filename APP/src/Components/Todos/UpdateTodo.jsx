import React from "react";

const UpdateTodo = (props) => {
    const { todo, setInEditing, setTodosArr } = props;

    const handleTodoUpdate = async (event) => {
        event.preventDefault();
        const updatedTodo = {
            ...todo,
            title: event.target.title.value,
            completed: event.target.completed.checked,
        };

        try {
            const response = await fetch(`http://localhost:3000/todos/${todo.id}`, {
                method: "PUT",
                body: JSON.stringify(updatedTodo),
                headers: {
                    "Content-type": "application/json; charset=UTF-8",
                },
            });

            if (response.ok) {
                setInEditing(-1);
                setTodosArr((prevArr) => prevArr.map((el) => (el.id === todo.id ? updatedTodo : el)));
            } else {
                console.error("Failed to update todo");
            }
        } catch (error) {
            console.error(error);
        }
    };

    return (
        <>
            <form onSubmit={(e) => handleTodoUpdate(e)}>
                <span>
                    <input type="checkbox" name="completed" defaultChecked={todo.completed} />
                </span>
                <input type="text" name="title" defaultValue={todo.title} />
                <input type="submit" value="update" />
            </form>
        </>
    );
};

export default UpdateTodo;
