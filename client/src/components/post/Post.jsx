// import "./post.scss";
// import FavoriteBorderOutlinedIcon from "@mui/icons-material/FavoriteBorderOutlined";
// import FavoriteOutlinedIcon from "@mui/icons-material/FavoriteOutlined";
// import TextsmsOutlinedIcon from "@mui/icons-material/TextsmsOutlined";
// import ShareOutlinedIcon from "@mui/icons-material/ShareOutlined";
// import MoreHorizIcon from "@mui/icons-material/MoreHoriz";
// import { Link } from "react-router-dom";
// import Comments from "../comments/Comments";
// import { useContext, useEffect, useState } from "react";
// import  moment  from "moment";
// import {useMutation,useQueryClient,} from '@tanstack/react-query'
// import {makeRequest} from "../../axios"
// import {useQuery} from '@tanstack/react-query'
// import { AuthContext } from "../../context/authContext";
// import axios from "axios";
// // import Posts from "../posts/Posts";
// const Post = ({ post }) => {
//   const [commentOpen, setCommentOpen] = useState(false);
//   const {currentUser}=useContext(AuthContext)
// // console.log('post',post.id)
// //   const { isLoading, error, data } = useQuery(["likes",post.id], () =>
// //   makeRequest.get("/likes?postId="+post.id).then((res) => {
// //     return res.data;
// // })
// // );
// const { isLoading, error, data } = useQuery(["likes", post.id], () => {
//   return makeRequest.get("/likes?postId=" + post.id)
//     .then((res) => {
//       // console.log("Data received:", res.data);
//       return res.data;
//     })
//     .catch((error) => {
//       console.error("Error fetching data:", error);
//     });
// });


// const queryClient = useQueryClient()
//   console.log("post.id",post.id)

// const mutation = useMutation(
//   () => {
//   //  if (liked) return makeRequest.delete("/likes?postId="+ post.id);
//   return makeRequest.post("/likes",{postId:post.id});
//   // console.log("post.id",post.id)
//   },
 
//   {
//     onSuccess: () => {
//       queryClient.invalidateQueries(["likes"]);
//     },
//   }
// );

// // console.log("likedataaaa",currentUser.Id);
//    const handleLike=()=>{
//       mutation.mutate.data.includes(currentUser.Id)
      
//    };


// console.log("dataattaa",mutation);
  
//   return (
//     <div className="post">
//       <div className="container">
//         <div className="user">
//           <div className="userInfo">
//             <img src={post.profilePic} alt="" />
//             <div className="details">
//               <Link
//                 to={`/profile/${post.userId}`}
//                 style={{ textDecoration: "none", color: "inherit" }}
//               >
//                 <span className="name">{post.name}</span>
//               </Link>
//               <span className="date">{moment(post.createdAt).fromNow()}</span>
//             </div>
//           </div>
//           <MoreHorizIcon />
//         </div>
//         <div className="content">
//           <p>{ post.desc}</p>
//           <img src={"./upload/"+post.img} alt="" />
//         </div>
//         <div className="info">
//           <div className="item">
//             {isLoading ?("isLoading")
//             :data && Array.isArray(data) && data.includes(currentUser.id)? 
//              <FavoriteOutlinedIcon style={{color:"red"}} onClick={handleLike} /> 
//               :( <FavoriteBorderOutlinedIcon  />
//             )}
//           {data&& data.length}  Likes
//          {data&& console.log("length",data.length)}
//           </div>
//           <div className="item" onClick={() => setCommentOpen(!commentOpen)}>
//             <TextsmsOutlinedIcon />
//             12 Comments
//           </div>
//           <div className="item">
//             <ShareOutlinedIcon />
//             Share
//           </div>
//         </div>
//         {commentOpen && <Comments postId={post.id} />}
//       </div>
//     </div>
//   );
// };

// export default Post;
import "./post.scss";
import FavoriteBorderOutlinedIcon from "@mui/icons-material/FavoriteBorderOutlined";
import FavoriteOutlinedIcon from "@mui/icons-material/FavoriteOutlined";
import TextsmsOutlinedIcon from "@mui/icons-material/TextsmsOutlined";
import ShareOutlinedIcon from "@mui/icons-material/ShareOutlined";
import MoreHorizIcon from "@mui/icons-material/MoreHoriz";
import { Link } from "react-router-dom";
import Comments from "../comments/Comments";
import { useState } from "react";
import moment from "moment";
import { useQuery, useQueryClient, useMutation } from "@tanstack/react-query";
import { makeRequest } from "../../axios";
import { useContext } from "react";
import { AuthContext } from "../../context/authContext";

const Post = ({ post }) => {
  const [commentOpen, setCommentOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  const { currentUser } = useContext(AuthContext);

  const { isLoading, error, data } = useQuery(["likes", post.id], () =>
    makeRequest.get("/likes?postId=" + post.id).then((res) => {
      return res.data;
    })
  );

  const queryClient = useQueryClient();

  const mutation = useMutation(
    (liked) => {
      if (liked) return makeRequest.delete("/likes?postId=" + post.id);
      return makeRequest.post("/likes", { postId: post.id });
    },
    {
      onSuccess: () => {
        // Invalidate and refetch
        queryClient.invalidateQueries(["likes"]);
      },
    }
  );
  const deleteMutation = useMutation(
    (postId) => {
      return makeRequest.delete("/posts/" + postId);
    },
    {
      onSuccess: () => {
        // Invalidate and refetch
        queryClient.invalidateQueries(["posts"]);
      },
    }
  );

  const handleLike = () => {
    mutation.mutate(data.includes(currentUser.id));
  };

  const handleDelete = () => {
    deleteMutation.mutate(post.id);
  };

  return (
    <div className="post">
      <div className="container">
        <div className="user">
          <div className="userInfo">
            <img src={"/upload/"+post.profilePic} alt="" />
            <div className="details">
              <Link
                to={`/profile/${post.userId}`}
                style={{ textDecoration: "none", color: "inherit" }}
              >
                <span className="name">{post.name}</span>
              </Link>
              <span className="date">{moment(post.createdAt).fromNow()}</span>
            </div>
          </div>
          <MoreHorizIcon onClick={() => setMenuOpen(!menuOpen)} />
          {menuOpen && post.userId === currentUser.id && (
            <button onClick={handleDelete}>delete</button>
          )}
        </div>
        <div className="content">
          <p>{post.desc}</p>
          <img src={"/upload/" + post.img} alt="" />
        </div>
        <div className="info">
          <div className="item">
            {isLoading ? (
              "loading"
            ) : data.includes(currentUser.id) ? (
              <FavoriteOutlinedIcon
                style={{ color: "red" }}
                onClick={handleLike}
              />
            ) : (
              <FavoriteBorderOutlinedIcon onClick={handleLike} />
            )}
            {data?.length} Likes
          </div>
          <div className="item" onClick={() => setCommentOpen(!commentOpen)}>
            <TextsmsOutlinedIcon />
            See Comments
          </div>
          <div className="item">
            <ShareOutlinedIcon />
            Share
          </div>
        </div>
        {commentOpen && <Comments postId={post.id} />}
      </div>
    </div>
  );
};

export default Post;
