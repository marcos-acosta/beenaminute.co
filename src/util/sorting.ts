import { Friend, Hang } from "@/interfaces";

const compareFriendsByLastSeen = (friendA: Friend, friendB: Friend) => {
  if (!friendA.lastSeen && friendB.lastSeen) {
    return -1;
  } else if (!friendB.lastSeen && friendA.lastSeen) {
    return 1;
  } else if (!friendA.lastSeen && !friendB.lastSeen) {
    return 0;
  } else if (friendA.lastSeen && friendB.lastSeen) {
    return friendB.lastSeen.valueOf() - friendA.lastSeen.valueOf();
  } else {
    return 0;
  }
};

const compareFriendsByName = (friendA: Friend, friendB: Friend) => {
  return friendA.fullName.localeCompare(friendB.fullName);
};

const _sortFriends = (friends: Friend[]) => {
  return friends.sort(
    (friendA, friendB) =>
      compareFriendsByLastSeen(friendA, friendB) ||
      compareFriendsByName(friendA, friendB)
  );
};

export const sortFriends = (friends: Friend[]) => {
  const friendsToSeeOften = friends.filter((f) => f.inverseFrequency);
  const otherFriends = friends.filter((f) => !f.inverseFrequency);
  return [..._sortFriends(friendsToSeeOften), ..._sortFriends(otherFriends)];
};

export const sortHangs = (hangs: Hang[]) => {
  return hangs.sort(
    (hangA, hangB) => hangB.date.valueOf() - hangA.date.valueOf()
  );
};
