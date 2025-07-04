"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Friend, TimeUnit } from "@/interfaces";
import { db } from "@/db/db-v2";

export default function AddFriend() {
  const router = useRouter();
  const [first, setFirst] = useState("");
  const [last, setLast] = useState("");
  const [tagText, setTagText] = useState("");
  const [blurb, setBlurb] = useState("");
  const [keepUp, setKeepUp] = useState(false);
  const [amount, setAmount] = useState(1);
  const [timeUnit, setTimeUnit] = useState(TimeUnit.WEEK);

  const canAdd = first.length && last.length;

  const _addFriend = () => {
    const newFriend: Friend = {
      firstName: first,
      lastName: last,
      fullName: `${first} ${last}`,
      tags: tagText
        .split(",")
        .map((tag) => tag.trim())
        .filter((tag) => !tag.length),
      blurb: blurb,
      hangIds: [],
      inverseFrequency: keepUp ? { amount: amount, unit: timeUnit } : undefined,
    };

    db.friends.add(newFriend).then(() => router.push("/"));
  };

  return (
    <div>
      <input
        type="text"
        placeholder="First Name"
        value={first}
        onChange={(e) => setFirst(e.target.value)}
      />
      <input
        type="text"
        placeholder="Last Name"
        value={last}
        onChange={(e) => setLast(e.target.value)}
      />
      <input
        type="text"
        placeholder="Tags (comma separated)"
        value={tagText}
        onChange={(e) => setTagText(e.target.value)}
      />
      <textarea
        placeholder="Blurb"
        value={blurb}
        onChange={(e) => setBlurb(e.target.value)}
      />
      <label>
        <input
          type="checkbox"
          checked={keepUp}
          onChange={(e) => setKeepUp(e.target.checked)}
        />
        Keep Up
      </label>
      {keepUp && (
        <>
          <input
            type="number"
            min={1}
            value={amount}
            onChange={(e) => setAmount(Number(e.target.value))}
          />
          <select
            value={timeUnit}
            onChange={(e) => setTimeUnit(Number(e.target.value))}
          >
            <option value={TimeUnit.DAY}>Day</option>
            <option value={TimeUnit.WEEK}>Week</option>
            <option value={TimeUnit.MONTH}>Month</option>
            <option value={TimeUnit.YEAR}>Year</option>
          </select>
        </>
      )}
      <button onClick={_addFriend} disabled={!canAdd}>
        Add
      </button>
    </div>
  );
}
