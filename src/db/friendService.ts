import { Friend, FriendMinusId } from "@/interfaces";
import { friendsDatabase } from "./db";

export async function addFriend(friend: FriendMinusId) {
  await friendsDatabase.friends.add(friend);
}

export async function updateFriend(id: number, updates: Partial<Friend>) {
  await friendsDatabase.friends.update(id, { ...updates });
}

export async function deleteFriend(id: number) {
  await friendsDatabase.friends.delete(id);
}
