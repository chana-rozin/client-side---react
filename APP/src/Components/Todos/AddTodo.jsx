import { useLocation, useNavigate } from "react-router-dom";
import React, { useContext, useState, useEffect, useRef } from "react";
import { userContext } from "../../App";
const AddTodo = (props) => {

    const { setTodosArr, closePopUp,setIsAdded} = props;
    const { currentUser, setCurrentUser } = useContext(userContext);
    const userId = currentUser.id;
    const navigate = useNavigate();

    const todo = {
        "userId": "0",
        "id": 0,
        "title": "",
        "completed": false
    }

    async function handleAddBtn(event) {
        event.preventDefault();
        todo.userId = userId;
        todo.title = event.target.title.value;
        todo.completed = event.target.completed.checked;
        todo.id = await getTodoId();
        postTodo();
        closePopUp();
    }

    async function postTodo() {
        await fetch("http://localhost:3000/todos", {
            method: 'POST',
            body: JSON.stringify(todo),
            headers: {
                'Content-type': 'application/json; charset=UTF-8',
            },
        })
            .then((response) => {
                if (response.status === 201) {
                    increaseTodoId();
                    setTodosArr(prevArr=>[...prevArr,todo]);
                    setIsAdded(true);
                }
                else {
                    setErrMessage("500 something get worng:( try latter.")
                }
            })
    }

    function increaseTodoId() {
        fetch("http://localhost:3000/config/1", {
            method: 'PATCH',
            body: JSON.stringify({ "todoId": (Number)(todo.id) + 1 }),
            headers: {
                "Content-type": "application/json; charset=UTF-8",
            },
        })
            .catch(err => console.error(err))
    }


    async function getTodoId() {
        const id = await fetch("http://localhost:3000/config/1")
            .then(result => result.json())
            .then(json => json.todoId.toString())
            .catch(error => console.error(error));
        return id;
    }

    return (
        <>
            <p>add your todo:</p>
            <div>
                <form onSubmit={(event) => handleAddBtn(event)}>
                    <span><input type="checkbox" name="completed"></input></span>
                    <span><input placeholder="your todo title:" type="text" name="title"></input></span>
                    <button type="submit">add</button>
                </form>
            </div>
        </>
    )
}


export default AddTodo