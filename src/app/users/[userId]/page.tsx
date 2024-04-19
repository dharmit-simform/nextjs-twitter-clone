"use client";

import Header from "@/components/Header";
import PostFeed from "@/components/posts/PostFeed";
import UserBio from "@/components/users/UserBio";
import UserHero from "@/components/users/UserHero";
import useUser from "@/hooks/useUser";
import { ClipLoader } from "react-spinners";

type SingleUserProps = {
  userId: string;
};

const UserView = ({ params }: { params: SingleUserProps }) => {
  const { userId } = params;
  const { data: fetchedUser, isLoading } = useUser(userId);

  if (isLoading || !fetchedUser) {
    return (
      <div className="flex justify-center items-center h-full">
        <ClipLoader color="lightblue" size={80} />
      </div>
    );
  }

  return (
    <>
      <Header showBackArrow label={fetchedUser?.name} />
      <UserHero userId={userId} />
      <UserBio userId={userId} />
      <PostFeed userId={userId} />
    </>
  );
};

export default UserView;
