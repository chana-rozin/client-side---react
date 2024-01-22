import React, { useState, useEffect, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import InfiniteScroll from "react-infinite-scroller";
// import './Albums.css'; // Import a separate CSS file for styling
import { userContext } from "../../App";
import Popup from 'reactjs-popup';
import { FiPlusCircle } from "react-icons/fi";
import AddAlbum from './AddAlbum';

const Albums = () => {
  const itemsPerPage = 20;
  const [hasMore, setHasMore] = useState(true);
  const [records, setRecords] = useState(itemsPerPage);

  const loadMore = () => {
    if (records === displayedAlbums.length) {
      setHasMore(false);
    } else {
      setTimeout(() => {
        setRecords(records + itemsPerPage);
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
    const filteredAlbumsArr = myAlbums.filter(album =>
      filtersArr.every(filter =>
        album[filter.key] === filter.value
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
    } else {
      return [...filtersArr,  { key: keyToUpdate, value }];
    }
  }

  return (
    <>
      <div>
        <label> Search by:
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
