import { FiPlusCircle } from "react-icons/fi";
import { RiDeleteBin7Fill } from "react-icons/ri";
import { MdOutlineEdit } from "react-icons/md";
import { useLocation } from "react-router-dom";
import UpdatePhoto from "./UpdatePhoto";
import AddPhoto from "./AddPhoto";
import { useState, useContext, useEffect } from "react";
import { userContext } from "../../App";
import Popup from 'reactjs-popup';
import InfiniteScroll from "react-infinite-scroll-component";
import style from "./Photos.module.css"
import "../commonStyle/popupStyle.css"
import { cacheContext } from "../../App";

const Photos = () => {
    const location = useLocation()
    const { albumId, albumTitle } = location.state;
    const { cacheGet, updateCacheFrequencies } = useContext(cacheContext);
    const { currentUser } = useContext(userContext);
    const [photosArr, setPhotosArr] = useState(cacheGet(`album${albumId}Photos`));
    const [inEditing, setInEditing] = useState(-1);
    const [start, setStart] = useState(photosArr.length);
    const photosPerFetch = 12;
    const [hasMore, setHasMore] = useState(true);

    const fetchPhotos = async () =>
        fetch(`http://localhost:3000/photos?albumId=${albumId}&_start=${start}&_end=${start + photosPerFetch}`)
            .then(response => response.json())
            .then(data => {
                const updateData = photosArr.concat(data)
                setPhotosArr(updateData);
                setHasMore(data.length === photosPerFetch)
                setStart(prev => prev + data.length)
                localStorage.setItem(`album${albumId}Photos`, JSON.stringify({ user: currentUser.id, data: updateData }));
                updateCacheFrequencies(`album${albumId}Photos`);
            })
            .catch(error =>
                console.error(error));


    useEffect(() => {
        if (!photosArr.length)
            fetchPhotos();
    }, []);


    function deletePhoto(id) {
        fetch(`http://localhost:3000/photos/${id}`, {
            method: 'DELETE',
        })
            .then(response => {
                if (response.ok) {
                    let updataData;
                    setPhotosArr(prev => {
                        updataData = prev.filter(photo => photo.id != id);
                        return updataData;
                    });
                    localStorage.setItem(`album${albumId}Photos`, JSON.stringify({ user: currentUser.id, data: updataData }))
                    updateCacheFrequencies(`album${albumId}Photos`);
                }
            });
    }


    return (
        <>
            <div className="popupContent"> <Popup trigger=
                {<div className="addBtn" >add photo to <b>{albumTitle}</b> album <FiPlusCircle /></div>}
                position="center center"
                closeOnDocumentClick>

                {close => (
                    <div className="popupContainer"> <div className={style.popup_overlay} >

                        <AddPhoto albumId={albumId} hasMore={hasMore} photosArr={photosArr} setPhotosArr={setPhotosArr} closePopUp={close} />

                    </div></div>
                )}

            </Popup></div>

            <InfiniteScroll
                dataLength={hasMore ? photosArr.length - 2 : photosArr.length}
                next={(fetchPhotos)}
                hasMore={hasMore}
                loader={<p>Loading...</p>}
                endMessage={<p>That's all your photos.</p>}>
                <div className={style.listContainer}> {photosArr.map(photo =>
                    <span className={style.photo} key={photo.id}>
                        {inEditing != photo.id ? <>
                            <img src={photo.thumbnailUrl}></img>
                            <div ><b>{photo.title}</b></div>
                            <span onClick={() => deletePhoto(photo.id)}><RiDeleteBin7Fill /></span>
                            <span onClick={() => setInEditing(photo.id)}><MdOutlineEdit /></span>
                        </>
                            : <UpdatePhoto photo={photo} setInEditing={setInEditing} hasMore={hasMore} photosArr={photosArr} setPhotosArr={setPhotosArr} />}
                    </span>
                )}</div>

            </InfiniteScroll>
        </>
    )
}
export default Photos;