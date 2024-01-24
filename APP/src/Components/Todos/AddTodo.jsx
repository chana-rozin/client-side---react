import {React, useContext, useState }from "react";
import { useNavigate} from "react-router-dom";
import { userContext } from "../../App";
import { cacheContext } from "../../App";

const AddTodo = (props) => {
    const { setTodosArr, closePopUp, setIsAdded } = props;
    const { currentUser } = useContext(userContext);
    const {cacheGet,updateCacheFrequencies} = useContext(cacheContext)
    const userId = currentUser.id;
    const navigate = useNavigate();

    const initialTodo = {
        userId: "0",
        id: getTodoId(),
        title: "",
        completed: false,
    };

    const [todo, setTodo] = useState({ ...initialTodo });

    const handleAddBtn = async (event) => {
        event.preventDefault();
        const updatedTodo = {
            ...todo,
            userId,
            title: event.target.title.value,
            completed: event.target.completed.checked,
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

            if (response.ok) {
                increaseTodoId(newTodo);
                let updateData;
                setTodosArr((prevArr) => {
                    updateData = [...prevArr, newTodo];
                    return updateData;
                });
                setIsAdded(true);
                localStorage.setItem("todos", JSON.stringify({ user: currentUser.id, data: updateData }))
                updateCacheFrequencies("todos");
            } else {
                console.error("Failed to add todo");
            }
        } catch (error) {
            console.error(error);
        }
    };

    const increaseTodoId = (newTodo) => {
        fetch("http://localhost:3000/config/1", {
            method: "PATCH",
            body: JSON.stringify({ todoId: Number(initialTodo.id) + 1 }),
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
            <div className="container">
                <p>add your todo:</p>
                <form onSubmit={handleAddBtn}>
                    
                    <p>completed   <input type="checkbox" name="completed" /></p>
                    <input
                        placeholder="your todo title:"
                        type="text"
                        name="title"
                        value={todo.title}
                        onChange={(e) => setTodo({ ...todo, title: e.target.value })}
                    />
                    <input type="submit" value="Add"></input>
                </form>
            </div>
        </>
    );
};

export default AddTodo;
