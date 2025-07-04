"use client";

import { useParams, useRouter } from "next/navigation";
import { friendsDatabase } from "@/db/db";
import { useLiveQuery } from "dexie-react-hooks";
import { formatTimeUnit } from "@/util/rendering";
import { deleteFriend } from "@/db/friendService";

export default function FriendDetails() {
  const router = useRouter();
  const idString = useParams()["id"] as string;
  const id = idString ? Number.parseInt(idString) : -1;
  const friendArray = useLiveQuery(() =>
    friendsDatabase.friends.where("id").equals(id).toArray()
  );
  const friend =
    friendArray && friendArray.length === 1 ? friendArray[0] : undefined;

  const _deleteFriend = () => {
    if (!id) {
      return;
    }
    deleteFriend(id).then(() => router.push("/"));
  };

  return (
    <div>
      {friend && (
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
          <button onClick={_deleteFriend}>Delete</button>
        </div>
      )}
    </div>
  );
}
