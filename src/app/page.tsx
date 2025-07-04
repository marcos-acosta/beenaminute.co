"use client";

import { addFriend } from "@/db/friendService";
import { friendsDatabase } from "../db/db";
import { useLiveQuery } from "dexie-react-hooks";
import { TimeUnit } from "@/interfaces";

export default function Homepage() {
  const friends = useLiveQuery(() => friendsDatabase.friends.toArray());

  const addFriendWithName = (firstName: string, lastName: string) => {
    addFriend({
      firstName: firstName,
      lastName: lastName,
      hangIds: [],
      blurb: "",
      tags: [],
    });
  };

  return (
    <div>
      <ul>
        {friends?.map((f) => (
          <li key={f.id}>
            {f.firstName}, {f.lastName}
          </li>
        ))}
      </ul>
      <button onClick={() => addFriendWithName("joe", "smith")}>Add</button>
    </div>
  );
}
