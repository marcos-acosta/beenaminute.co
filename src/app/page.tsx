"use client";

import { db } from "@/db/db-v2";
import { sortFriends } from "@/util/sorting";
import { useLiveQuery } from "dexie-react-hooks";
import Link from "next/link";

export default function Homepage() {
  const friends = useLiveQuery(() => db.friends.toArray());
  const friendsOrdered = friends && sortFriends(friends);

  return (
    <div>
      <ul>
        {friendsOrdered?.map((f) => (
          <li key={f.id}>
            <Link href={`/friend/${f.id}`}>
              {f.firstName} {f.lastName}
            </Link>
          </li>
        ))}
      </ul>
      <Link href="/friend">Add</Link>
    </div>
  );
}
