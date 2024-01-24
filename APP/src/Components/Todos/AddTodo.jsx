import { React, useContext} from "react";
import { userContext } from "../../App";
import { cacheContext } from "../../App";

const AddTodo = (props) => {
    const {setTodosArr, closePopUp} = props;
    const {currentUser} = useContext(userContext);
    const {updateCacheFrequencies } = useContext(cacheContext)
    const userId = currentUser.id;

    const todo = {
        "userId": "0",
        "id": 0,
        "title": "",
        "completed": false,
    };

    async function handleAddBtn(event) {
        event.preventDefault();
        todo.userId = userId;
        todo.title = event.target.title.value,
        todo.completed = event.target.completed.checked,
        todo.id = await getTodoId(),
        addTodo();
        closePopUp();
    }

   async function addTodo() {
        await fetch("http://localhost:3000/todos", {
                method: "POST",
                body: JSON.stringify(todo),
                headers: {
                    "Content-type": "application/json; charset=UTF-8",
                },
            })
            .then((respons) => {
                if (respons.ok) {
                    increaseTodoId();
                    let updateData;
                    setTodosArr((prevArr) => {
                        updateData = [...prevArr, todo];
                        return updateData;
                    });
                    localStorage.setItem("todos", JSON.stringify({ user: currentUser.id, data: updateData }))
                    updateCacheFrequencies("todos");
                }
            })
            .catch((error) => console.error(error))
    }

    function increaseTodoId(){
        fetch("http://localhost:3000/config/1", {
            method: "PATCH",
            body: JSON.stringify({ todoId: Number(todo.id) + 1 }),
            headers: {
                "Content-type": "application/json; charset=UTF-8",
            },
        }).catch((err) => console.error(err));
    }

    async function getTodoId() {
        const id = await fetch("http://localhost:3000/config/1")
            .then((result) => result.json())
            .then((json) => json.todoId.toString())
            .catch(err => console.error(err));
        return id;
    }

    return (
        <>
            <div className="container">
                <p>add your todo:</p>
                <form onSubmit={handleAddBtn}>
                    <p>completed   <input type="checkbox" name="completed" /></p>
                    <input placeholder="your todo title:" type="text" name="title"/>
                    <input type="submit" value="Add"></input>
                </form>
            </div>
        </>
    );
};

export default AddTodo;
