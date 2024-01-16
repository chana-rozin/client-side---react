import React, { useContext, useState, useEffect, useRef } from "react";
import { userContext } from "../../App";
import Select from 'react-select'
import { Navigate, useNavigate } from 'react-router-dom'

const Todos = () => {

    const { currentUser, setCurrentUser } = useContext(userContext);
    const userId = currentUser.id;
    const [toShowTodosArr, setToShowTodosArr] = useState([]);
    const [filtersArr, setFiltersArr] = useState([]);
    const [todosArr, setTodosArr] = useState([]);
    const [sortBy, setSortBy ]= useState("");
    
    useEffect(() => {
        const fetchTodos = async () =>

            fetch(`http://localhost:3000/todos?userId=${userId}`)
                .then(response => response.json())
                .then(data => {
                    installition(data);
                })
                .catch(error =>
                    console.error(error));

        fetchTodos();
    }, []);

    useEffect(() => setToShowTodosArr(todosArr), [todosArr]);

    function installition(data) {
        setTodosArr(data.map((todo, index) =>
        (<div key={index} props={todo}>
            <span><input type="checkbox" name="completed" checked={todo.completed} /></span>
            <span>id: {todo.id} </span>
            <span>{todo.title}</span>
        </div>
        )))
    }

    function handleFilterBy(filterBy, input) {
        const updateFilters = input == "" ?
            filtersArr.filter(el => el.key != filterBy)
            : [...filtersArr, { "key": filterBy, "value": input }];
        setFiltersArr(updateFilters);
        setToShowTodosArr(
            todosArr.filter(todo =>
                updateFilters.every(filter =>
                    todo.props.props[filter.key] === filter.value
                )
            ));
    }

    useEffect(()=>handleSortBy(),[sortBy, toShowTodosArr]);

    function handleSortBy() {

        switch (sortBy) {
            case "id": {
                setToShowTodosArr([...toShowTodosArr].sort((a, b) =>
                    Number(a.props.props.id) - Number(b.props.props.id)));
                break;
            }
            case "title": {
                setToShowTodosArr([...toShowTodosArr].sort((a, b) =>
                    (a.props.props.title).localeCompare((b.props.props.title))));
                break;
            }
            case "completed": {
                setToShowTodosArr([...toShowTodosArr].sort((a, b) =>
                    Number(b.props.props.completed) - Number(a.props.props.completed)));
                break;
            }
            case "notCompleted": {
                setToShowTodosArr([...toShowTodosArr].sort((a, b) =>
                    Number(a.props.props.completed) - Number(b.props.props.completed)));
                break;
            }
            default:
                break;
        }

    }


    const options = [
        { value: 'title', label: 'alphabetical oreder' },
        { value: 'id', label: 'sort by ID' },
        { value: 'completed', label: 'completed: completed to not completed' },
        { value: 'notCompleted', label: 'completed: not completed to completed' }
    ]

    return (
        <>
            <div>
                <Select options={options} name="sortBy" placeholder="sort by" onChange={(e) => setSortBy(e.value)} />
                <label> serach by:
                    <label htmlFor="searchById">ID</label>
                    <input type="text" placeholder="" name="searchById" onBlur={(e) => handleFilterBy("id", e.target.value)}></input>
                    <label htmlFor="searchByTitle">Title</label>
                    <input type="text" placeholder="" name="searchByTitle" onBlur={(e) => handleFilterBy("title", e.target.value)}></input>
                    <label htmlFor="searchByCompleted">Completed</label>
                    <input type="checkbox" name="searchByCompleted" onChange={(e) => handleFilterBy("completed", e.target.checked)}></input></label>
            </div>
            <div>
                {toShowTodosArr}
            </div></>
    );
};

export default Todos;