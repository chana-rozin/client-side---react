import React from "react";
import { useContext } from "react";
import { cacheContext } from "../../App";
import { userContext } from "../../App";

const UpdateTodo = (props) => {
  const { todo, setInEditing, setTodosArr } = props;
  const { updateCacheFrequencies } = useContext(cacheContext);
  const { currentUser } = useContext(userContext);

  async function handleTodoUpdate(event) {
    event.preventDefault();
    todo.title = event.target.title.value;
    todo.completed = event.target.completed.checked;
    fetch(`http://localhost:3000/todos/${todo.id}`, {
      method: 'PATCH',
      body: JSON.stringify({
        title: todo.title,
        completed: todo.completed,
      }),
      headers: {
        "Content-type": "application/json; charset=UTF-8",
      },
    })
      .then(response => {
        if (response.ok) {
          setInEditing(-1);
          let updateData;
          setTodosArr(prev => {
            updateData = prev.map((el) => (el.id === todo.id ? todo : el));
            return updateData
          });
          localStorage.setItem("todos", JSON.stringify({ user: currentUser.id, data: updateData }));
          updateCacheFrequencies("todo")
        }
      })
      .catch(error =>
        console.error(error))
  }

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
