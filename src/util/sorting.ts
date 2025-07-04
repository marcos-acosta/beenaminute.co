import { Friend } from "@/interfaces";

const compareFriendsByWantToKeepUp = (friendA: Friend, friendB: Friend) =>
  (friendB.inverseFrequency ? 1 : 0) - (friendA.inverseFrequency ? 1 : 0);

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

export const sortFriends = (friends: Friend[]) => {
  return friends.sort(
    (friendA, friendB) =>
      compareFriendsByWantToKeepUp(friendA, friendB) ||
      compareFriendsByLastSeen(friendA, friendB) ||
      compareFriendsByName(friendA, friendB)
  );
};
