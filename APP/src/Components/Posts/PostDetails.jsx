import { Link, Navigate, Outlet, useLocation, useNavigate } from "react-router-dom"
import { userContext } from "../../App";
import { useContext } from "react";
import { RiDeleteBin7Fill } from "react-icons/ri";
import { MdOutlineEdit } from "react-icons/md";
import { IoIosArrowDown } from "react-icons/io";

const PostDetails = (props) => {
    const navigate = useNavigate()
    const href = location.pathname;
    const { post, setAllData, inEditing, setInEditing, setSelectedPostId } = props;
    const { currentUser, setCurrentUser } = useContext(userContext);
    const userId = currentUser.id;
    function deletePost(id) {
        setAllData(prevArr => prevArr.filter(post => post.id != id));

        fetch(`http://localhost:3000/posts/${id}`, {
            method: 'DELETE',
        })
            .then(re => console.log(re));
    }

    function closePost() {
        const href = location.href
        if (href.endsWith("/comments"))
            navigate(-1);
        setSelectedPostId(-1);

    }

    return (
        <>
            <div>
                {post.id != inEditing ?
                    <>
                        <span>id: {post.id} </span>
                        <span>{post.title}</span>
                        <IoIosArrowDown onClick={() => closePost()} />
                        <div>{post.body}</div>
                        <Link to={`${post.id}/comments`} state={{postId:post.id}}>view comments</Link>
                        {post.userId == userId && <>
                            <span onClick={() => deletePost(post.id)}><RiDeleteBin7Fill /></span>
                            <span onClick={() => setInEditing(post.id)}><MdOutlineEdit /></span></>}
                    </>
                    : <UpdatePost post={post} setInEditing={setInEditing} setAllData={setAllData} />}
                <Outlet />
            </div>
        </>)

}

export default PostDetails