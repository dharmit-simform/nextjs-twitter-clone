"use client";

import useCurrentUser from "@/hooks/useCurrentUser";
import useEditModal from "@/hooks/useEditModal";
import useUser from "@/hooks/useUser";
import axios from "axios";
import { useCallback, useEffect, useState } from "react";
import toast from "react-hot-toast";
import Modal from "../Modal";
import Input from "../Input";
import ImageUpload from "../ImageUpload";

const EditModal = () => {
  const { data: currentUser } = useCurrentUser();
  const { mutate: mutateFetchedUser } = useUser(currentUser?.id);
  const editModal = useEditModal();

  const [profileImage, setProfileImage] = useState("");
  const [coverImage, setCoverImage] = useState("");
  const [name, setName] = useState("");
  const [username, setUsername] = useState("");
  const [bio, setBio] = useState("");

  useEffect(() => {
    setProfileImage(currentUser?.profileImage);
    setCoverImage(currentUser?.coverImage);
    setName(currentUser?.name);
    setUsername(currentUser?.username);
    setBio(currentUser?.bio || "");
  }, [
    currentUser?.bio,
    currentUser?.coverImage,
    currentUser?.name,
    currentUser?.profileImage,
    currentUser?.username,
  ]);

  const [isLoading, setIsLoading] = useState(false);

  const onSubmit = useCallback(async () => {
    try {
      setIsLoading(true);

      await axios.patch("/api/edit", {
        name,
        username,
        bio,
        coverImage,
        profileImage,
      });

      mutateFetchedUser();

      toast.success("Profile Updated");

      editModal.onClose();
    } catch (error) {
      toast.error("Something went wrong.");
    } finally {
      setIsLoading(false);
    }
  }, [
    bio,
    coverImage,
    editModal,
    mutateFetchedUser,
    name,
    profileImage,
    username,
  ]);

  const bodyContent = (
    <div className="flex flex-col gap-4">
      <ImageUpload
        value={profileImage}
        disabled={isLoading}
        onChange={(image) => setProfileImage(image)}
        label="Upload Profile Image"
      />
      <ImageUpload
        value={coverImage}
        disabled={isLoading}
        onChange={(image) => setCoverImage(image)}
        label="Upload Cover Image"
      />
      <Input
        placeholder="Name"
        onChange={(e) => setName(e.target.value)}
        value={name}
        disabled={isLoading}
      />
      <Input
        placeholder="Username"
        onChange={(e) => setUsername(e.target.value)}
        value={username}
        disabled={isLoading}
      />
      <Input
        placeholder="Bio"
        onChange={(e) => setBio(e.target.value)}
        value={bio}
        disabled={isLoading}
      />
    </div>
  );

  return (
    <Modal
      disabled={isLoading}
      isOpen={editModal.isOpen}
      title="Edit Your Profile"
      actionLabel="Save"
      onClose={editModal.onClose}
      onSubmit={onSubmit}
      body={bodyContent}
    />
  );
};

export default EditModal;
