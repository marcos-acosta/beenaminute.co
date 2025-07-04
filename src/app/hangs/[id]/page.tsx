"use client";

import { useParams, useRouter } from "next/navigation";
import { useLiveQuery } from "dexie-react-hooks";
import { formatTimeUnit } from "@/util/rendering";
import { db } from "@/db/db-v2";

export default function FriendDetails() {
  const router = useRouter();
  const idString = useParams()["id"] as string;
  const id = idString ? Number.parseInt(idString) : -1;
  const hangsArray = useLiveQuery(() =>
    db.hangs.where("id").equals(id).toArray()
  );
  const hang =
    hangsArray && hangsArray.length === 1 ? hangsArray[0] : undefined;

  const _deleteHang = () => {
    if (!id) {
      return;
    }
    db.hangs.delete(id).then(() => router.push("/"));
  };

  return (
    <div>
      {hang && (
        <div>
          <div>On {hang.date.toDateString()}</div>
          <div>With {hang.friendNames.join(", ")}</div>
          <div>Notes: {hang.notes}</div>
          <button onClick={_deleteHang}>Delete</button>
        </div>
      )}
    </div>
  );
}
