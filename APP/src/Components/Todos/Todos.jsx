import React, { useContext, useState, useEffect, useRef,useCallback } from "react";
import { userContext } from "../../App";
import AddTodo from "./AddTodo";
import Select from 'react-select'
import { Link, Navigate, Outlet, useNavigate } from 'react-router-dom';
import deleteIcon from "../../Images/deleteIcon.svg";
import updateIcon from "../../Images/editIcon.svg";

const Todos = () => {

    const { currentUser, setCurrentUser } = useContext(userContext);
    const userId = currentUser.id;
    const [toShowTodosArr, setToShowTodosArr] = useState([]);
    const [filtersArr, setFiltersArr] = useState([]);
    const [todosArr, setTodosArr] = useState([]);
    const [sortBy, setSortBy] = useState("");
    const [isAdded, setIsAdded] = useState(false);
    const [id,setId] = useState(0);
    const navigate = useNavigate();
    useEffect(() => {
        const fetchTodos = async () =>
            fetch(`http://localhost:3000/todos?userId=${userId}`)
                .then(response => response.json())
                .then(data => {
                    displayTodos(data);
                })
                .catch(error =>
                    console.error(error));
        fetchTodos();
    }, []);

    useEffect(() => setToShowTodosArr(todosArr), [todosArr]);

    function displayTodos(data) {
        setTodosArr(data.map((todo, index) =>
        (<div key={index} props={todo}>
            <span><input type="checkbox" name="completed" checked={todo.completed} /></span>
            <span>id: {index+1} </span>
            <span>{todo.title}</span>
            <span onClick={()=>deleteTodo(todo.id)}><img src={deleteIcon}></img></span>
            <span onClick={()=>navToUpdate(todo.id)}><img src={updateIcon}></img></span>
        </div>
        )))
    }

     function navToUpdate(id){
        setTodosArr((prevTodosArr) => {
          console.log(prevTodosArr);
          navigate(`${id}/update`, { state: { id: id, todosArr: prevTodosArr} });
          return prevTodosArr;
        });
      }
      

    function deleteTodo(id)
    {
        setTodosArr(prevArr=>prevArr.filter( todo =>todo.props.props.id != id));

        // fetch(`http://localhost:3000/todos/${id}`,{
        //     method: 'DELETE',})
    }

    function handleFilterBy(filterKey, inputValue) {
        const updateFilters = inputValue === ""
            ? removeFilter(filtersArr, filterKey)
            : updateOrAddFilter(filtersArr, filterKey, inputValue);
        setFiltersArr(updateFilters);
        setToShowTodosArr(
            todosArr.filter(todo =>
                updateFilters.every(filter =>
                    todo.props.props[filter.key] === filter.value
                )
            )
        );
    }

    function removeFilter(filters, keyToRemove) {
        return filters.filter(el => el.key !== keyToRemove);
    }

    function updateOrAddFilter(filters, keyToUpdate, value) {
        if (filters.some(el => el.key === keyToUpdate)) {
            return filters.map(el =>
                el.key === keyToUpdate ? { ...el, value } : el);
        }
        else return [...filters, { key: keyToUpdate, value }];
    }


    useEffect(() => handleSortBy(), [sortBy, filtersArr]);

    function handleSortBy() {
        if (sortBy !== "") {
            const sortedTodos = [...toShowTodosArr].sort((a, b) => {
                switch (sortBy) {
                    case "id":
                        return Number(a.props.props.id) - Number(b.props.props.id);
                    case "title":
                        return a.props.props.title.localeCompare(b.props.props.title);
                    case "completed":
                        return Number(b.props.props.completed) - Number(a.props.props.completed);
                    case "notCompleted":
                        return Number(a.props.props.completed) - Number(b.props.props.completed);
                    default:
                        return 0;
                }
            })
            setToShowTodosArr(sortedTodos);
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
            </div>
            <Link to={"add"}>press to add</Link>
            <Outlet />
        </>
    );
};

export default Todos;