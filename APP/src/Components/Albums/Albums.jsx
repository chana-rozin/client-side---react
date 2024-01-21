import React, { useState, useEffect, useContext } from 'react';
import { Link, Outlet, useNavigate } from 'react-router-dom';
import ReactPaginate from 'react-paginate';
import InfiniteScroll from "react-infinite-scroller";
import { IoIosArrowBack } from "react-icons/io";
import { IoIosArrowDown } from "react-icons/io";
// import './Albums.css'; // Import a separate CSS file for styling
import { userContext } from "../../App";
import Popup from 'reactjs-popup';
import { FiPlusCircle } from "react-icons/fi";
import AddAlbum from './AddAlbum';



const Albums = () => {
  const itemsPerPage = 20;
  const [hasMore, setHasMore] = useState(true);
  const [records, setrecords] = useState(itemsPerPage);

  const loadMore = () => {
    if (records === displayedAlbums.length) {
      setHasMore(false);
    }
    else {
      setTimeout(() => {
        setrecords(records + itemsPerPage);
      }, 2000);
    }
  };

    const navigate = useNavigate();
    const { currentUser, setCurrentUser } = useContext(userContext);
    const userId = currentUser.id;
    const [filtersArr, setFiltersArr] = useState([{"key":"userId" , "value":userId.toString()}]);
    const [selectedAlbumId, setSelectedAlbumId] = useState(-1)
    const [displayedAlbums, setDisplayedAlbums] = useState([]);
    const [myAlbums, setMyAlbums] = useState([]);
    const [isAdded, setIsAdded] = useState(false);



    const fetchMyAlbums = async () => {
        try {
            const response = await fetch(`http://localhost:3000/albums?userId=${userId}`);
            const jsonData = await response.json();
            setMyAlbums(jsonData);
            
        } catch (error) {
            console.error(error);
        }
    };

    useEffect(() => filterMyAlbums(), [myAlbums, filtersArr]);


    useEffect(() => {
        fetchMyAlbums();
    }, []); // Call fetchMyAlbums when the component mounts

    

    function filterMyAlbums() {
        
        const filteredAlbumsArr=  myAlbums.filter(album =>
            filtersArr.every(filter =>
                album[filter.key] 
                === filter.value
            )
        )
        setDisplayedAlbums(filteredAlbumsArr);
        
    }


    function handleFilter(filterKey, inputValue) {
        const updateFilters = inputValue === ""
            ? removeFilter(filterKey)
            : updateOrAddFilter(filterKey, inputValue);
    
        setFiltersArr(updateFilters);
    }
    

   

    function removeFilter(keyToRemove) {
        return filtersArr.filter(el => el.key !== keyToRemove);
    }

    function updateOrAddFilter(keyToUpdate, value) {
        
        if (filtersArr.some(el => el.key === keyToUpdate)) {
            return filtersArr.map(el =>
                el.key === keyToUpdate ? { ...el, value } : el);
        }
        else return [...filtersArr,  { key: keyToUpdate, value }];
    }


    return (
        <>
         <div>
                <label> serach by:
                    <label htmlFor="searchById">ID</label>
                    <input type="text" placeholder="" name="searchById" onBlur={(e) => handleFilter("id", e.target.value)}></input>
                    <label htmlFor="searchByTitle">Title</label>
                    <input type="text" placeholder="" name="searchByTitle" onBlur={(e) => handleFilter("title", e.target.value)}></input>
                </label>
            </div>
            <div>
            <InfiniteScroll
            pageStart={0}
            loadMore={loadMore}
            hasMore={hasMore}
            loader={<h4 className="loader">Loading...</h4>}
            useWindow={false}>
            <Popup trigger=
                {<FiPlusCircle />}
                position="down">
                {
                    close => (
                        <div className='modal'>
                            <div className='content'>
                                <AddAlbum setIsAdded={setIsAdded} setMyAlbums={setMyAlbums} closePopUp={close} />
                            </div>
                        </div>
                    )
                }
            </Popup>

            {displayedAlbums.map(album => (
                <div key={album.id} className="album">
                <>
                    <span>id: {album.id}</span> 
                    <Link to={`${album.id}/photos`} state={{albumId:album.id,albumTitle:album.title}}> title: {album.title}</Link>
                </> 
                </div>
            ))}
            </InfiniteScroll>
            </div>
        </>
    );
};

export default Albums;

// const Posts = () => {
//     const navigate = useNavigate();
//     const { currentUser, setCurrentUser } = useContext(userContext);
//     const userId = currentUser.id;
//     const [filtersArr, setFiltersArr] = useState([]);
//     const [selectedAlbumId, setSelectedAlbumId] = useState(-1)
//     const [pagination, setPagination] = useState({
//         data: [],
//         offset: 0,
//         numberPerPage: 25,
//         pageCount: 0,
//         currentData: []
//     });


//     const [myAlbums, setMyAlbums] = useState([]);

//     const fetchMyAlbums = async () => {
//         try {
//             const response = await fetch(`http://localhost:3000/posts`);
//             const jsonData = await response.json();
//             setMyAlbums(jsonData);
            
//         } catch (error) {
//             console.error(error);
//         }
//     };

//     useEffect(() => filterMyAlbums(), [myAlbums, filtersArr]);


//     useEffect(() => {
//         fetchMyAlbumss();
//     }, []); // Call fetchMyAlbumss when the component mounts

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

//     function filterMyAlbums() {
        
//         const filterAlbumsArr=  myAlbums.filter(post =>
//             filtersArr.every(filter =>
//                 post[filter.key] === filter.value
//             )
//         )
//         setPagination(prevPagination => ({
//             ...prevPagination,
//             data: filterAlbumsArr,
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

//    function OpenOrCloseAlbums(post){
//     if(selectedAlbumId==post.id)
//     {
//         setSelectedAlbumId(-1);
//         navigate(`/users/${userId}/posts`)
//     }
//     else{
//         setSelectedAlbumId(post.id);
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
//                      <span onClick={()=>OpenOrCloseAlbums(post)} style={{color:"red"}}>{setSelectedAlbumId==post.id ? <IoIosArrowDown />:<IoIosArrowBack />}</span>
//                      {selectedAlbumId==post.id && <Outlet/>}
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
