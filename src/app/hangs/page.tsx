"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { db } from "@/db/db-v2";

export default function AddFriend() {
  const router = useRouter();
  const [idsString, setIdsString] = useState("");
  const [dateString, setDateString] = useState("");
  const [notes, setNotes] = useState("");

  const canAdd = idsString.length && dateString.length;

  const _addHang = () => {
    const friendIds = idsString
      .split(",")
      .map((id) => id.trim())
      .filter((id) => id.length > 0)
      .map((id) => Number.parseInt(id))
      .filter(Boolean);
    const date = new Date(dateString);
    db.createHang(friendIds, date, notes).then(() => router.push("/"));
  };

  return (
    <div>
      <input
        type="text"
        placeholder="Friend ids"
        value={idsString}
        onChange={(e) => setIdsString(e.target.value)}
      />
      <input
        type="text"
        placeholder="Date"
        value={dateString}
        onChange={(e) => setDateString(e.target.value)}
      />
      <textarea
        placeholder="Notes"
        value={notes}
        onChange={(e) => setNotes(e.target.value)}
      />
      <button onClick={_addHang} disabled={!canAdd}>
        Add
      </button>
    </div>
  );
}
