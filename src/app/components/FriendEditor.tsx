import { Friend, TimeUnit } from "@/interfaces";
import { useState } from "react";

interface FriendEditorProps {
  friend?: Partial<Friend>;
  onSubmit: (f: Friend) => void;
  onCancel: () => void;
  submitText: string;
}

export default function FriendEditor(props: FriendEditorProps) {
  const [first, setFirst] = useState(props.friend?.firstName || "");
  const [last, setLast] = useState(props.friend?.lastName || "");
  const [tagText, setTagText] = useState(props.friend?.tags?.join(", ") || "");
  const [blurb, setBlurb] = useState(props.friend?.blurb || "");
  const [keepUp, setKeepUp] = useState(Boolean(props.friend?.inverseFrequency));
  const [amount, setAmount] = useState(
    props.friend?.inverseFrequency?.amount || 1
  );
  const [timeUnit, setTimeUnit] = useState(
    props.friend?.inverseFrequency?.unit || TimeUnit.WEEK
  );

  const canAdd = first.length && last.length;

  const _addFriend = () => {
    const newFriend: Friend = {
      firstName: first,
      lastName: last,
      fullName: `${first} ${last}`,
      tags: tagText
        .split(",")
        .map((tag) => tag.trim())
        .filter((tag) => tag.length > 0),
      blurb: blurb,
      inverseFrequency: keepUp ? { amount: amount, unit: timeUnit } : undefined,
    };

    props.onSubmit(newFriend);
    // db.friends.add(newFriend).then(() => router.push("/"));
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
        {props.submitText}
      </button>
      <button onClick={props.onCancel}>Cancel</button>
    </div>
  );
}
