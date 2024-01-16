import { useState } from "react";
import { useLocation } from "react-router-dom";

const UpdateTodo = () => {
    const location = useLocation();
    const { state } = location;
    const { id, todosArr } = state;
    console.log(id);
    console.log(todosArr);
    // console.log(setTodosArr);
  
    return (
      <>
        <h1>kvhcb</h1>
      </>
    );
  }
  export default UpdateTodo
  