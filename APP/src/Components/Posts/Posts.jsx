import React, { useState, useEffect, useContext } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import ReactPaginate from 'react-paginate';
import InfiniteScroll from "react-infinite-scroller";
import { IoIosArrowBack } from "react-icons/io";
import { IoIosArrowDown } from "react-icons/io";
import './Posts.css'; // Import a separate CSS file for styling
import { userContext } from "../../App";

const Posts = () => {

    const itemsPerPage = 20;
  const [hasMore, setHasMore] = useState(true);
  const [records, setrecords] = useState(itemsPerPage);
  const loadMore = () => {
    if (records === displayedData.length) {
      setHasMore(false);
    } else {
      setTimeout(() => {
        setrecords(records + itemsPerPage);
      }, 2000);
    }
  };
    const navigate = useNavigate();
    const { currentUser, setCurrentUser } = useContext(userContext);
    const userId = currentUser.id;
    const [filtersArr, setFiltersArr] = useState([]);
    const [selectedPostId, setSelectedPostId] = useState(-1)
    const [displayedData, setDisplayedData] = useState([]);
    const [allData, setAllData] = useState([]);

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
        
        const filteredPostsArr=  allData.filter(post =>
            filtersArr.every(filter =>
                post[filter.key] === filter.value
            )
        )
        setDisplayedData(filteredPostsArr);
        
    }
    function handleFilter(filterKey, inputValue) {
        const updateFilters = inputValue === ""
            ? removeFilter(filtersArr, filterKey)
            : updateOrAddFilter(filtersArr, filterKey, inputValue);
    
        setFiltersArr(updateFilters);
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


    function viewPost(post){
        
    }

   function OpenOrClosePost(post){
    if(selectedPostId==post.id)
    {
        setSelectedPostId(-1);
        navigate(`/users/${userId}/posts`)
    }
    else{
        setSelectedPostId(post.id);
        console.log(post.id)
        navigate(`${post.id}`, {state: {postBody:post.body}})
    }
   }



    return (
        <>
         <div>
               
                <label> serach by:
                    <label htmlFor="searchById">ID</label>
                    <input type="text" placeholder="" name="searchById" onBlur={(e) => handleFilter("id", e.target.value)}></input>
                    <label htmlFor="searchByTitle">Title</label>
                    <input type="text" placeholder="" name="searchByTitle" onBlur={(e) => handleFilter("title", e.target.value)}></input>
                    <label htmlFor="searchByCompleted">view only my posts</label>
                    <input type="checkbox" name="searchByUser" onChange={(e) => handleFilter("userId", e.target.checked?userId:"")}></input></label>
            </div>
            <div>
                
               <InfiniteScroll
      pageStart={0}
      loadMore={loadMore}
      hasMore={hasMore}
      loader={<h4 className="loader">Loading...</h4>}
      useWindow={false}
    >
      {displayedData.map(post => (
                    <div key={post.id} className="post">
                       <span>id: {post.id}</span> 
                       <span>{post.title}</span>
                     <span onClick={()=>OpenOrClosePost(post)} style={{color:"red"}}>{selectedPostId==post.id ? <IoIosArrowDown />:<IoIosArrowBack />}</span>
                     {selectedPostId==post.id&&<Outlet/>}
                    </div>
                ))}
    </InfiniteScroll>
            </div>
        </>
    );
};

export default Posts;

// const Posts = () => {
//     const navigate = useNavigate();
//     const { currentUser, setCurrentUser } = useContext(userContext);
//     const userId = currentUser.id;
//     const [filtersArr, setFiltersArr] = useState([]);
//     const [selectedPostId, setSelectedPostId] = useState(-1)
//     const [pagination, setPagination] = useState({
//         data: [],
//         offset: 0,
//         numberPerPage: 25,
//         pageCount: 0,
//         currentData: []
//     });


//     const [allData, setAllData] = useState([]);

//     const fetchPosts = async () => {
//         try {
//             const response = await fetch(`http://localhost:3000/posts`);
//             const jsonData = await response.json();
//             setAllData(jsonData);
            
//         } catch (error) {
//             console.error(error);
//         }
//     };

//     useEffect(() => filterAllPosts(), [allData, filtersArr]);


//     useEffect(() => {
//         fetchPosts();
//     }, []); // Call fetchPosts when the component mounts

//     useEffect(() => {
//         setPagination(prevState => ({
//             ...prevState,
//             pageCount: Math.ceil(prevState.data.length / prevState.numberPerPage),
//             currentData: prevState.data.slice(pagination.offset, pagination.offset + pagination.numberPerPage)
//         }));
//     }, [pagination.numberPerPage, pagination.offset, pagination.data]);

//     const handlePageClick = event => {
//         const selected = event.selected;
//         const offset = selected * pagination.numberPerPage;
//         setPagination({ ...pagination, offset });
//     };

//     function filterAllPosts() {
        
//         const filteredPostsArr=  allData.filter(post =>
//             filtersArr.every(filter =>
//                 post[filter.key] === filter.value
//             )
//         )
//         setPagination(prevPagination => ({
//             ...prevPagination,
//             data: filteredPostsArr,
//             offset: 0
           
//         }))
        
//     }
//     function handleFilter(filterKey, inputValue) {
//         const updateFilters = inputValue === ""
//             ? removeFilter(filtersArr, filterKey)
//             : updateOrAddFilter(filtersArr, filterKey, inputValue);
    
//         setFiltersArr(updateFilters);
//     }
    

   

//     function removeFilter(filters, keyToRemove) {
//         return filters.filter(el => el.key !== keyToRemove);
//     }

//     function updateOrAddFilter(filters, keyToUpdate, value) {
        
//         if (filters.some(el => el.key === keyToUpdate)) {
//             return filters.map(el =>
//                 el.key === keyToUpdate ? { ...el, value } : el);
//         }
//         else return [...filters, { key: keyToUpdate, value }];
//     }


//     function viewPost(post){
        
//     }

//    function OpenOrClosePost(post){
//     if(selectedPostId==post.id)
//     {
//         setSelectedPostId(-1);
//         navigate(`/users/${userId}/posts`)
//     }
//     else{
//         setSelectedPostId(post.id);
//         console.log(post.id)
//         navigate(`${post.id}`, {state: {postBody:post.body}})
//     }
//    }



//     return (
//         <>
//          <div>
               
//                 <label> serach by:
//                     <label htmlFor="searchById">ID</label>
//                     <input type="text" placeholder="" name="searchById" onBlur={(e) => handleFilter("id", e.target.value)}></input>
//                     <label htmlFor="searchByTitle">Title</label>
//                     <input type="text" placeholder="" name="searchByTitle" onBlur={(e) => handleFilter("title", e.target.value)}></input>
//                     <label htmlFor="searchByCompleted">view only my posts</label>
//                     <input type="checkbox" name="searchByUser" onChange={(e) => handleFilter("userId", e.target.checked?userId:"")}></input></label>
//             </div>
//             <div>
//                 {pagination.currentData.map(post => (
//                     <div key={post.id} className="post">
//                        <span>id: {post.id}</span> 
//                        <span>{post.title}</span>
//                      <span onClick={()=>OpenOrClosePost(post)} style={{color:"red"}}>{selectedPostId==post.id ? <IoIosArrowDown />:<IoIosArrowBack />}</span>
//                      {selectedPostId==post.id&&<Outlet/>}
//                     </div>
//                 ))}
//                 <ReactPaginate
//                     previousLabel={'previous'}
//                     nextLabel={'next'}
//                     breakLabel={'...'}
//                     pageCount={pagination.pageCount}
//                     marginPagesDisplayed={2}
//                     pageRangeDisplayed={5}
//                     onPageChange={handlePageClick}
//                     containerClassName={'pagination'}
//                     activeClassName={'active'}
//                 />
//             </div>
//         </>
//     );
// };

// export default Posts;
