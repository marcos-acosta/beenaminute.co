"use client";

import { db } from "@/db/db-v2";
import { sortFriends, sortHangs } from "@/util/sorting";
import { useLiveQuery } from "dexie-react-hooks";
import Link from "next/link";

export default function Homepage() {
  const friends = useLiveQuery(() => db.getFriendsWithLastSeen());
  const hangs = useLiveQuery(() => db.getHangsWithFriendNames());
  const friendsOrdered = friends && sortFriends(friends);
  const hangsOrdered = hangs && sortHangs(hangs);

  return (
    <div>
      {friendsOrdered && hangsOrdered && (
        <>
          <h1>Friends</h1>
          <ul>
            {friendsOrdered.map((f) => (
              <li key={f.id}>
                <Link href={`/friend/${f.id}`}>
                  {f.firstName} {f.lastName}, last seen:{" "}
                  {f.lastSeen ? f.lastSeen.toDateString() : "never"}
                </Link>
              </li>
            ))}
          </ul>
          <Link href="/friend">Add</Link>
          <h1>Hangs</h1>
          <ul>
            {hangsOrdered.map((h) => (
              <li key={h.id}>
                <Link href={`/hangs/${h.id}`}>
                  With {h.friendNames.join(", ")} on {h.date.toDateString()}
                </Link>
              </li>
            ))}
          </ul>
          <Link href="/hangs">Add</Link>
        </>
      )}
    </div>
  );
}
