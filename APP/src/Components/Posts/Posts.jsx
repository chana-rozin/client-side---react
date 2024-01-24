import React, { useState, useEffect, useContext } from 'react';
import { Link, Outlet, useNavigate, useParams } from 'react-router-dom';
import ReactPaginate from 'react-paginate';
import InfiniteScroll from "react-infinite-scroller";
import { IoIosArrowBack } from "react-icons/io";
import PostDetails from "./PostDetails"
import "../commonStyle/popupStyle.css"
import style from "./Posts.module.css"
import { userContext } from "../../App";
import UpdatePost from './UpdatePost';
import Popup from 'reactjs-popup';
import { FiPlusCircle } from "react-icons/fi";
import AddPost from './AddPost';
import { cacheContext } from "../../App";


const Posts = () => {
    const itemsPerPage = 20;
    const [hasMore, setHasMore] = useState(true);
    const [records, setRecords] = useState(itemsPerPage);
    const navigate = useNavigate();
    let { userId, postId } = useParams();
    const { currentUser, setCurrentUser } = useContext(userContext);
    userId = currentUser.id;
    const {cacheGet, updateCacheFrequencies} = useContext(cacheContext);
    const [filtersArr, setFiltersArr] = useState([{ "key": "userId", "value": userId.toString() }]);
    const [selectedPostId, setSelectedPostId] = useState(postId ?? -1);
    const [displayedData, setDisplayedData] = useState([]);
    const [postsArr, setPostsArr] = useState(cacheGet("posts"));
    const [displayMode, setDisplayMode] = useState(localStorage.getItem("displayMode"));
    const [inEditing, setInEditing] = useState(-1);

    
    const loadMore = () => {
        if (records === displayedData.length) {
            setHasMore(false);
        } else {
            setTimeout(() => {
                setRecords(records + itemsPerPage);
            }, 2000);
        }
    };

    if(selectedPostId!=-1)
    postId??setSelectedPostId(-1);

    useEffect(() => filterAllPosts(), [postsArr, filtersArr]);

    useEffect(() => {
        const fetchPosts = async () => 
                await fetch(`http://localhost:3000/posts`)
                .then(response=>response.json())
                .then(jsonData=>{
                    setPostsArr(jsonData);
                    localStorage.setItem("posts",JSON.stringify({user:userId,data:jsonData}))
                    updateCacheFrequencies("posts");
                })
            .catch( (error) =>console.error(error))
        if(!postsArr.length)
            fetchPosts();
       
    }, []); // Call fetchPosts when the component mounts

    function filterAllPosts() {
        const filteredPostsArr = postsArr.filter(post =>
            filtersArr.every(filter =>
                post[filter.key]
                === filter.value
            )
        )
        setDisplayedData(filteredPostsArr);
    }


    function handleFilter(filterKey, filterValue) {
        const updateFilters = filterValue === ""
            ? removeFilter(filterKey)
            : updateOrAddFilter(filterKey, filterValue);
        setFiltersArr(updateFilters);
    }


    function removeFilter(keyToRemove) {
        return filtersArr.filter(el => el.key !== keyToRemove);
    }


    function updateOrAddFilter(keyToUpdate, value) {
        if (filtersArr.some(el => el.key === keyToUpdate)) {
            return filtersArr.map(el =>
                el.key === keyToUpdate ? { ...el, value } : el);
        } else {
            return [...filtersArr, { key: keyToUpdate, value }];
        }
    }

function changeDisplayMode(){
    if(displayMode=="personalPosts")
    {
        setFiltersArr(removeFilter("userId"));
        setDisplayMode("publicPosts");
        localStorage.setItem("displayMode", "publicPosts")
    }
    else{
        setFiltersArr(updateOrAddFilter("userId", userId));
        setDisplayMode("personalPosts");
        localStorage.setItem("displayMode", "personalPosts")
    }
}

function viewPost(postId){
    navigate(postId);
    setSelectedPostId(postId);
}

    return (
        <>
            <div className={style.contorl}>
                <label> search by:
                    <label htmlFor="searchById"> ID</label>
                    <input type="text" placeholder="" name="searchById" onBlur={(e) => handleFilter("id", e.target.value)}></input>
                    <label htmlFor="searchByTitle">Title</label>
                    <input type="text" placeholder="" name="searchByTitle" onBlur={(e) => handleFilter("title", e.target.value)}></input>
                </label>
            </div>
            {displayMode === "personalPosts" ?
                <button className={style.ViewAllOrMineBtn} onClick={()=>changeDisplayMode()} >press to view all posts</button>
                : <button className={style.ViewAllOrMineBtn} onClick={()=>changeDisplayMode()} >press to view only my posts</button>}
            <Popup trigger=
                {<div className="addBtn" >create new post<FiPlusCircle /></div>}
                position="center center"
                closeOnDocumentClick>

                {close => (
                    <div className="popupContainer">

                        <AddPost postsArr={postsArr} setPostsArr={setPostsArr} closePopUp={close} />

                    </div>
                )}

            </Popup>
            <div>
                
                    <div className={style.listContainer}>{displayedData.map(post => (
                        <div key={post.id} className={style.post}>
                            {selectedPostId !== post.id ? <>
                                <span className={style.postDetails}>{post.id}. </span>
                                <span className={style.postDetails}>{post.title}</span>
                                <button className={style.openBtn}disabled={selectedPostId !== -1} onClick={() => viewPost(post.id)}><IoIosArrowBack /></button>
                            </>
                                : <PostDetails post={post} postsArr={postsArr} setPostsArr={setPostsArr} inEditing={inEditing} setInEditing={setInEditing} setSelectedPostId={setSelectedPostId} />}
                        </div>
                    ))}
                    </div>
            </div>
        </>
    );
};

export default Posts;