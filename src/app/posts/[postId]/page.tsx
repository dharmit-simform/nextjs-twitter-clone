"use client";

import Form from "@/components/Form";
import Header from "@/components/Header";
import CommentFeed from "@/components/posts/CommentFeed";
import PostFeed from "@/components/posts/PostFeed";
import PostItem from "@/components/posts/PostItem";
import UserBio from "@/components/users/UserBio";
import UserHero from "@/components/users/UserHero";
import usePost from "@/hooks/usePost";
import useUser from "@/hooks/useUser";
import { ClipLoader } from "react-spinners";

type SinglePostProps = {
  postId: string;
};

const PostView = ({ params }: { params: SinglePostProps }) => {
  const { postId } = params;
  
  const { data: fetchedPost, isLoading } = usePost(postId);

  if (isLoading || !fetchedPost) {
    return (
      <div className="flex justify-center items-center h-full">
        <ClipLoader color="lightblue" size={80} />
      </div>
    );
  }

  return (
    <>
      <Header showBackArrow label={"Tweet"} />
      <PostItem data={fetchedPost} />
      <Form postId={postId} isComment placeholder="Tweet Your Reply" />
      <CommentFeed comments={fetchedPost?.comments} />
    </>
  );
};

export default PostView;
