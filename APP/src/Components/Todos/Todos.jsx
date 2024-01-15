import React, { useContext } from "react";
import { userContext } from "../../App";
import { List } from "react-virtualized";
import { Navigate, useNavigate } from 'react-router-dom'
import { WindowScroller } from 'react-virtualized/auto';


const Todos = () => {
    const { currentUser, setCurrentUser } = useContext(userContext);
    const userId = currentUser.id;

    let todosArr;
    fetch(`http://localhost:3000/todos/userId/${userId}`).then(response => {
        if(response.status == 200 )
        {
            todosArr= response.json()
            return (
                <List
                    width={1200}
                    height={700}
                    rowRenderer={renderRow}
                    rowCount={todosArr.length}
                    rowHeight={120}
                />
            );
        }    
        else return <h1>ERROR</h1>;
    })
    const renderRow = ({ index, key}) => {
        const todo=todosArr[index]
        return <div key={key} className="todo">
            <span><input type="checkbox" name="completed" onSelect={todo.completed}/></span>
            <span>id: {todo.id}</span>
            <span>{todo.title}</span>
        </div>
    }
    
}

export default Todos

//npm i react-virtualized