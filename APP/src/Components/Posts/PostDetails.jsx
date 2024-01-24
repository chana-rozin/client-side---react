import { Link, Navigate, Outlet, useLocation, useNavigate } from "react-router-dom"
import { userContext } from "../../App";
import { useContext } from "react";
import { RiDeleteBin7Fill } from "react-icons/ri";
import { MdOutlineEdit } from "react-icons/md";
import { IoIosArrowDown } from "react-icons/io";
import UpdatePost from "./UpdatePost";
import style from "./Posts.module.css"

const PostDetails = (props) => {
    const navigate = useNavigate()
    const href = location.pathname;
    const { post, postsArr, setPostsArr, inEditing, setInEditing, setSelectedPostId } = props;
    const { currentUser, setCurrentUser } = useContext(userContext);
    const userId = currentUser.id;

    function deletePost(id) {
        setPostsArr(prevArr => prevArr.filter(post => post.id != id));

        fetch(`http://localhost:3000/posts/${id}`, {
            method: 'DELETE',
        })
            .then(response => {
                if (response.ok) {
                    if (href.endsWith("/comments"))
                        navigate(-1);
                    setSelectedPostId(-1);
                    const updataData=postsArr.filter(post => post.id != id);
                    localStorage.setItem("posts", JSON.stringify({user:currentUser.id,data:updataData}))
                    updateCacheFrequencies("posts");
                    setPostsArr(updataData);
                }
            })
            .catch(error => console.error(error));
    }

    function closePost() {
        const href = location.href
        if (href.endsWith("/comments"))
            navigate(-1);
        navigate(-1);
        setSelectedPostId(-1);

    }

    return (
        <>
            <div>
                {post.id != inEditing ?
                    <>
                        <span className={style.postDetails}>{post.id}. </span>
                        <span className={style.postDetails}><b>{post.title}</b></span>
                        <IoIosArrowDown className={style.closeBtn} onClick={() => closePost()} />
                        <div className={style.postDetails}>{post.body}</div>
                        <Link to={`${post.id}/comments`} state={{ postId: post.id }} className={style.postDetails}>view comments</Link>
                        {post.userId == userId && <>
                            <span onClick={() => deletePost(post.id)}><RiDeleteBin7Fill /></span>
                            <span onClick={() => setInEditing(post.id)}><MdOutlineEdit /></span></>}
                    </>
                    : <UpdatePost post={post} setInEditing={setInEditing} setPostsArr={setPostsArr} />}
                <Outlet />
            </div>
        </>)

}

export default PostDetails