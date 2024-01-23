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

const Posts = () => {
    const itemsPerPage = 20;
    const [hasMore, setHasMore] = useState(true);
    const [records, setRecords] = useState(itemsPerPage);
    const navigate = useNavigate();
    let { userId, postId } = useParams();
    const { currentUser, setCurrentUser } = useContext(userContext);
    userId = currentUser.id;
    const [filtersArr, setFiltersArr] = useState([{ "key": "userId", "value": userId.toString() }]);
    const [selectedPostId, setSelectedPostId] = useState(postId ?? -1);
    const [displayedData, setDisplayedData] = useState([]);
    const [allData, setAllData] = useState([]);
    const [displayMode, setDisplayMode] = useState("myPosts");
    const [inEditing, setInEditing] = useState(-1);
    const [isAdded, setIsAdded] = useState(false);

    const loadMore = () => {
        if (records === displayedData.length) {
            setHasMore(false);
        } else {
            setTimeout(() => {
                setRecords(records + itemsPerPage);
            }, 2000);
        }
    };

    const fetchPosts = async () => {
        try {
            const response = await fetch(`http://localhost:3000/posts`);
            const jsonData = await response.json();
            setAllData(jsonData);

        } catch (error) {
            console.error(error);
        }
    };

    useEffect(() => filterAllPosts(), [allData, filtersArr]);

    useEffect(() => {
        fetchPosts();
    }, []); // Call fetchPosts when the component mounts

    function filterAllPosts() {
        const filteredPostsArr = allData.filter(post =>
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
            {displayMode === "myPosts" ?
                <button className={style.ViewAllOrMineBtn} onClick={() => { setFiltersArr(removeFilter("userId")); setDisplayMode("allPosts") }} >press to view all posts</button>
                : <button className={style.ViewAllOrMineBtn} onClick={() => { setFiltersArr(updateOrAddFilter("userId", userId)); setDisplayMode("myPosts") }} >press to view only my posts</button>}
            <Popup trigger=
                {<div className="addBtn" >create new post<FiPlusCircle /></div>}
                position="center center"
                closeOnDocumentClick>

                {close => (
                    <div className="popupContainer">

                        <AddPost setIsAdded={setIsAdded} setAllData={setAllData} closePopUp={close} />

                    </div>
                )}

            </Popup>
            <div>
                <InfiniteScroll
                    pageStart={0}
                    loadMore={loadMore}
                    useWindow={false}>
                    <div className={style.listContainer}>{displayedData.map(post => (
                        <div key={post.id} className={style.post}>
                            {selectedPostId !== post.id ? <>
                                <span className={style.postDetails}>{post.id}. </span>
                                <span className={style.postDetails}>{post.title}</span>
                                <button className={style.openBtn} disabled={selectedPostId !== -1} onClick={() => {setSelectedPostId(post.id); navigate(post.id)}}><IoIosArrowBack /></button>
                            </>
                                : <PostDetails post={post} setAllData={setAllData} inEditing={inEditing} setInEditing={setInEditing} setSelectedPostId={setSelectedPostId} />}
                        </div>
                    ))}
                    </div>

                </InfiniteScroll>
            </div>
        </>
    );
};

export default Posts;