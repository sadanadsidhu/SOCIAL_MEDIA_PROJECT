import { makeRequest } from "../../axios";
import Post from "../post/Post";
import "./posts.scss";
import {useQuery} from '@tanstack/react-query'

const Posts = () => {
  const postId=3;
  const { isLoading, error, data } = useQuery(["posts",postId], () =>
  makeRequest.get(`/posts?userId=${postId}`).then((res) => res.data)
  );
  // console.log("datasss",data);
  return(
     <div className="posts">
    {error ?"Something went wrong!":isLoading 
    ?"loading..."
    :data.map(post=>(
      <Post post={post} key={post.id}/>
    ))}
  </div>
  );
    }
export default Posts;

