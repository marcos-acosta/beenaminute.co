"use client";

import { useParams, useRouter } from "next/navigation";
import { useLiveQuery } from "dexie-react-hooks";
import { formatTimeUnit } from "@/util/rendering";
import { db } from "@/db/db-v2";
import { useState } from "react";
import FriendEditor from "@/app/components/FriendEditor";
import { Friend } from "@/interfaces";

export default function FriendDetails() {
  const router = useRouter();
  const [isEditing, setIsEditing] = useState(false);
  const idString = useParams()["id"] as string;
  const id = idString ? Number.parseInt(idString) : -1;
  const friendArray = useLiveQuery(() =>
    db.friends.where("id").equals(id).toArray()
  );
  const friend =
    friendArray && friendArray.length === 1 ? friendArray[0] : undefined;

  const onDeleteFriend = () => {
    if (!id) {
      return;
    }
    db.friends.delete(id).then(() => router.push("/"));
  };

  const onEditFriend = (f: Friend) => {
    if (!id) {
      return;
    }
    const { firstName, lastName, blurb, tags, inverseFrequency } = f;
    db.friends
      .update(id, { firstName, lastName, blurb, tags, inverseFrequency })
      .then(() => setIsEditing(false));
  };

  return (
    <div>
      {friend &&
        (isEditing ? (
          <FriendEditor
            friend={friend}
            onSubmit={onEditFriend}
            onCancel={() => setIsEditing(false)}
            submitText="Done"
          />
        ) : (
          <div>
            <div>
              {friend.firstName} {friend.lastName}
            </div>
            <div>{friend.blurb}</div>
            <div>
              {friend.tags.map((tag) => (
                <span key={tag}>#{tag}</span>
              ))}
            </div>
            {friend.inverseFrequency && (
              <div>
                Want to see at least every {friend.inverseFrequency.amount}{" "}
                {formatTimeUnit(friend.inverseFrequency.unit)}
              </div>
            )}
            <button onClick={onDeleteFriend}>Delete</button>
            <button onClick={() => setIsEditing(true)}>Edit</button>
          </div>
        ))}
    </div>
  );
}
