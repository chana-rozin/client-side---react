import { useState } from "react";
import { useLocation } from "react-router-dom";

const UpdateTodo = (props) => {
  const { todo, setInEditing, setTodosArr } = props;

  async function handleTodoUpdate(event) {
    event.preventDefault();
    todo.title = event.target.title.value;
    todo.completed = event.target.completed.checked;
    fetch(`http://localhost:3000/todos/${todo.id}`, {
      method: 'PUT',
      body: JSON.stringify(todo),
      headers: {
        "Content-type": "application/json; charset=UTF-8",
      },
    })
      .then(response =>{
        if(response.ok)
        {
          
          setInEditing(-1);
          setTodosArr(prevArr=>prevArr.map(el=>el.id===todo.id?todo:el));
        }
        else{
          console.error("failed to update todo");
        }
      })
  
      .catch(err => console.error(err))

  }

  return (
    <>
      <form onSubmit={(e) => handleTodoUpdate(e)}>
        <span><input type="checkbox" name="completed" defaultChecked={todo.completed} /></span>
        <input type="text" name="title" defaultValue={todo.title} ></input>
        <input type="submit" value="update"></input>
      </form>
    </>
  );
}
export default UpdateTodo
