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
import style from"./Photos.module.css"

const Photos = () => {
    const location = useLocation()
    const { albumId, albumTitle } = location.state;
    const [photosArr, setPhotosArr] = useState([]);
    const [inEditingPhotoId, setInEditingPhotoId] = useState(-1);
    const { currentUser, setCurrentUser } = useContext(userContext);
    const [start, setStart] = useState(0);
    const photosPerFetch = 12;
    const [hasMorePhotos, setHasMorePhotos] = useState(true);

    const fetchPhotos = async () => {
        try {
            const response = await fetch(`http://localhost:3000/photos?albumId=${albumId}&_start=${start}&_limit=${photosPerFetch}`);
            const data = await response.json();
            setPhotosArr(prevPhotosArr => prevPhotosArr.concat(data));
            setHasMorePhotos(data.length === 12);
            setStart(prevStart => prevStart + photosPerFetch);
        } catch (error) {
            console.error(error);
        }
    };

    useEffect(() => {
        fetchPhotos();
    }, []);

    function deletePhoto(id) {
        setPhotosArr(prevArr => prevArr.filter(photo => photo.id !== id));
        fetch(`http://localhost:3000/photos/${id}`, {
            method: 'DELETE',
        })
            .then(re => console.log(re));
    }

    return (
        <>
            <div>
                <Popup trigger=
                    {<FiPlusCircle />}
                    position="down">
                    {close => (
                        <div className='modal'>
                            <div className='content'>
                                <AddPhoto albumId={albumId} setPhotosArr={setPhotosArr} closePopUp={close} />
                            </div>
                        </div>
                    )}
                </Popup>
            </div>
            <div>
                {photosArr.map(photo =>
                    <span key={photo.id}>
                        {inEditingPhotoId !== photo.id ? (
                            <>
                                <div><b>{photo.title}</b></div>
                                <img src={photo.thumbnailUrl} alt={photo.title}></img>
                                <span onClick={() => deletePhoto(photo.id)}><RiDeleteBin7Fill /></span>
                                <span onClick={() => setInEditingPhotoId(photo.id)}><MdOutlineEdit /></span>
                            </>
                        ) : (
                            <UpdatePhoto photo={photo} setInEditing={setInEditingPhotoId} setPhotosArr={setPhotosArr} />
                        )}
                    </span>
                )}
            </div>
          <InfiniteScroll 
                dataLength={hasMorePhotos ? photosArr.length - 2 : photosArr.length}
                next={fetchPhotos}
                hasMore={hasMorePhotos}
                loader={<p>Loading...</p>}
                endMessage={<p>No more data to load.</p>}>
                {photosArr.map(photo =>
                    <span key={photo.id}>
                        {inEditingPhotoId !== photo.id ? (
                            <>
                                <div><b>{photo.title}</b></div>
                                <img src={photo.thumbnailUrl} alt={photo.title}></img>
                                <span onClick={() => deletePhoto(photo.id)}><RiDeleteBin7Fill /></span>
                                <span onClick={() => setInEditingPhotoId(photo.id)}><MdOutlineEdit /></span>
                          </>
                        ) : (
                            <UpdatePhoto photo={photo} setInEditing={setInEditingPhotoId} setPhotosArr={setPhotosArr} />
                        )}
                    </span>
                )}
            </InfiniteScroll>
        </>
    )
}

export default Photos;
