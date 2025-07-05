"use client";

import { useRouter } from "next/navigation";
import { Friend } from "@/interfaces";
import { db } from "@/db/db-v2";
import FriendEditor from "../components/FriendEditor";

export default function AddFriend() {
  const router = useRouter();

  const onAddFriend = (f: Friend) => {
    db.friends.add(f).then(() => router.push("/"));
  };

  return (
    <FriendEditor
      onSubmit={onAddFriend}
      onCancel={() => router.push("/")}
      submitText="Add"
    />
  );
}
