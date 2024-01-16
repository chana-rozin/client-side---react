import { useLocation } from "react-router-dom";
import React, { useContext, useState, useEffect, useRef } from "react";
import { userContext } from "../../App";

const AddTodo = () => {
    const location = useLocation();
    console.log(location.state);
    const { currentUser, setCurrentUser } = useContext(userContext);
    const userId = currentUser.id;
    
    const todo = {
        "userId": "0",
        "id": 0,
        "title": "",
        "completed": false
    }

    function handleAdd(event)
    {
        event.preventDefault();
        todo.userId = userId;
        todo.title = event.target.title.value;
        user.website = event.target.password.value;
    }

    return (
        <>
            <p>add your todo:</p>
            <div>
                <form>
                    <span><input type="checkbox" name="completed" /></span>
                    <span><input placeholder="your todo title:" type="text" name="title"></input></span>
                    <button onClick={(event)=>handleAdd(event)}>add</button>
                </form>
            </div>
        </>
    )
}
export default AddTodo