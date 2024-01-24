import React from "react";
import { useContext } from "react";
import { cacheContext } from "../../App";
import { userContext } from "../../App";

const UpdateTodo = (props) => {
    const { todo, setInEditing, todosArr,setTodosArr } = props;
    const {updateCacheFrequencies} = useContext(cacheContext);
    const {currentUser} = useContext(userContext);
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
                const updateData=todosArr.map((el) => (el.id === todo.id ? updatedTodo : el));
                setTodosArr(updateData);
                localStorage.setItem("todos", JSON.stringify({user:currentUser.id,data:updateData}));
                updateCacheFrequencies("todo")
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
