import React, { useContext, useState, useEffect, useRef, useCallback } from "react";
import { userContext } from "../../App";
import AddTodo from "./AddTodo";
import Select from 'react-select'
import { Link, Navigate, Outlet, json, useNavigate } from 'react-router-dom';
import { RiDeleteBin7Fill } from "react-icons/ri";
import { MdOutlineEdit, MdWidthNormal } from "react-icons/md";
import updateIcon from "../../Images/editIcon.svg";
import Popup from 'reactjs-popup';
import UpdateTodo from "./UpdateTodo";
import style from "./Todos.module.css";
import "../commonStyle/popupStyle.css"
import { FiPlusCircle } from "react-icons/fi";
import { cacheContext } from "../../App";
const Todos = () => {

    const { currentUser, setCurrentUser} = useContext(userContext);
    const userId = currentUser.id;
    const {cacheGet, updateCacheFrequencies} = useContext(cacheContext);
    const [toShowTodosArr, setToShowTodosArr] = useState([]);
    const [filtersArr, setFiltersArr] = useState([]);
    const [todosArr, setTodosArr] = useState(cacheGet("todos"));
    const [sortBy, setSortBy] = useState("");
    const [isAdded, setIsAdded] = useState(false);
    const [id, setId] = useState(0);
    const navigate = useNavigate();
    const [inEditing, setInEditing] = useState(-1);

    useEffect(() => {
        const fetchTodos = async () =>
            fetch(`http://localhost:3000/todos?userId=${userId}`)
                .then(response => response.json())
                .then(data => {
                    localStorage.setItem("todos",JSON.stringify({user:userId,data:data}));
                    updateCacheFrequencies("todos");
                    setTodosArr(data);
                })
                .catch(error =>
                    console.error(error));
        if(!todosArr.length)
            fetchTodos();
    }, []);

    useEffect(() => { setToShowTodosArr(todosArr) }, [todosArr]);
    useEffect(() => { handleFilterBy(); handleSortBy() }, [inEditing, isAdded]);



    function deleteTodo(id) {
        

        fetch(`http://localhost:3000/todos/${id}`, {
            method: 'DELETE',
        })
            .then(response => 
                {if(response.ok)
                   { const updataData=todosArr.filter(todo => todo.id != id);
                    localStorage.setItem("todos", JSON.stringify({user:currentUser.id,data:updataData}))
                    updateCacheFrequencies("todos");
                    setTodosArr(updataData);}
                });
    }

    function handleFilterBy(filterKey, inputValue) {
        const updateFilters = inputValue === ""
            ? removeFilter(filtersArr, filterKey)
            : updateOrAddFilter(filtersArr, filterKey, inputValue);
        setFiltersArr(updateFilters);
        setToShowTodosArr(
            todosArr.filter(todo =>
                updateFilters.every(filter =>
                    todo[filter.key] === filter.value)
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
                        return Number(a.id) - Number(b.id);
                    case "title":
                        return a.title.localeCompare(b.title);
                    case "completed":
                        return Number(b.completed) - Number(a.completed);
                    case "notCompleted":
                        return Number(a.completed) - Number(b.completed);
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
            <div className={style.todosWarpper}>
                <div className={style.contorl}>
                    <label> <b>  serach by: </b>
                        <label htmlFor="searchById">ID</label>
                        <input type="text" placeholder="" name="searchById" onBlur={(e) => handleFilterBy("id", e.target.value)}></input>
                        <label htmlFor="searchByTitle">Title</label>
                        <input type="text" placeholder="" name="searchByTitle" onBlur={(e) => handleFilterBy("title", e.target.value)}></input>
                        <label htmlFor="searchByCompleted">Completed</label>
                        <input type="checkbox" name="searchByCompleted" onChange={(e) => handleFilterBy("completed", e.target.checked ? true : "")}></input></label>
                    <Select className={style.filter} options={options} name="sortBy" placeholder="sort by" onChange={(e) => setSortBy(e.value)} />
                </div>
                <Popup trigger=
                    {<div className="addBtn" >new todo<FiPlusCircle /></div>}
                    position="center center"
                    closeOnDocumentClick>

                    {close => (
                        <div className="popupContainer">

                            <AddTodo setIsAdded={setIsAdded} todosArr={todosArr} setTodosArr={setTodosArr} closePopUp={close} />

                        </div>
                    )}
                </Popup>
                <div className={style.listContainer}>
                    {toShowTodosArr.map((todo, index) =>
                    (<div key={index} className={style.todo}>
                        {index != inEditing ? <>
                            <input readOnly type="checkbox" name="completed" checked={todo.completed} />
                            <span>{todo.id}.</span>
                            <span> {todo.title} </span>
                            <span onClick={() => deleteTodo(todo.id)}><RiDeleteBin7Fill /></span>
                            <span onClick={() => setInEditing(index)}><MdOutlineEdit /></span></> :
                            <UpdateTodo todo={todo} setInEditing={setInEditing} setTodosArr={setTodosArr} />}
                    </div>
                    ))}
                    <Outlet />
                </div></div>
        </>)
}

export default Todos;
//npm i reactjs-popup