import { useContext } from "react";
import { userContext } from "../../App";
import style from "./Info.module.css"

const Info = ()=>{
    const { currentUser, setCurrentUser } = useContext(userContext);

    return (<>
         <div className={style.details}>
            <h3>your profile:</h3>
            <p>id: {currentUser.id}</p>
            <p>name: {currentUser.name}</p>
            <p>username: {currentUser.username}</p>
            <p>email: {currentUser.email}</p>
            <label><h4>address:</h4>
            <p>street: {currentUser.address.street}</p>
            <p>suite: {currentUser.address.suite}</p>
            <p>city: {currentUser.address.city}</p>
            <p>zipcode: {currentUser.address.zipcode}</p>
            <label><h4>geo:</h4>
            <p>lat: {currentUser.address.geo.lat}</p>
            <p>lng: {currentUser.address.geo.lng}</p>
            </label>
            </label>
            <p>phone: {currentUser.phone}</p>
            <label><h4>company:</h4>
            <p>name: {currentUser.company.name}</p>
            <p>catchPhrase: {currentUser.company.catchPhrase}</p>
            <p>bs:{currentUser.company.bs}</p>
            </label>
         </div>
    </>)
}

export default Info;