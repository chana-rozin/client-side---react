import React, { useState, useEffect, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import InfiniteScroll from "react-infinite-scroller";
import style from "./Albums.module.css"
import { userContext } from "../../App";
import Popup from 'reactjs-popup';
import { FiPlusCircle } from "react-icons/fi";
import AddAlbum from './AddAlbum';
import { FcFolder } from "react-icons/fc";

const Albums = () => {
  const itemsPerPage = 20;
  const { currentUser, setCurrentUser } = useContext(userContext);
  const userId = currentUser.id;
  const [filtersArr, setFiltersArr] = useState([{"key":"userId" , "value":userId.toString()}]);
  const [displayedAlbums, setDisplayedAlbums] = useState([]);
  const [myAlbums, setMyAlbums] = useState([]);

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
      <div className={style.contorl}>
        <label> <b>Search by:  </b>
          <label htmlFor="searchById">ID</label>
          <input type="text" placeholder="" name="searchById" onBlur={(e) => handleFilter("id", e.target.value)}></input>
          <label htmlFor="searchByTitle" className={style.title}>Title</label>
          <input type="text" placeholder="" name="searchByTitle" onBlur={(e) => handleFilter("title", e.target.value)}></input>
        </label>
        <Popup trigger=
                {<div className="addBtn" >create new album<FiPlusCircle /></div>}
                position="center center"
                closeOnDocumentClick>
                
                   { close => (
                       <div className="popupContainer">
                            
                            <AddAlbum setMyAlbums={setMyAlbums} closePopUp={close} />
                            
                        </div>
                    )}
                
            </Popup>
      </div>
          <div className={style.listContainer}>{displayedAlbums.map(album => (
            <div key={album.id} className={style.album}>
              <><Link to={`${album.id}/photos`} state={{albumId:album.id,albumTitle:album.title}}>
                <div><FcFolder size={200}/></div>
                <span>{album.id}. </span> 
                {album.title}
                </Link>
              </> 
            </div>
          ))}</div>
    </>
  );
};

export default Albums;
