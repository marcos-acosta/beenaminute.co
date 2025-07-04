import { Friend, Hang } from "@/interfaces";
import Dexie, { Transaction } from "dexie";

// Database class
export class FriendsDatabase extends Dexie {
  friends!: Dexie.Table<Friend, number>;
  hangs!: Dexie.Table<Hang, number>;

  constructor() {
    super("FriendsDatabase");

    this.version(1).stores({
      friends:
        "++id, firstName, lastName, fullName, tags, inverseFrequency, hangIds, blurb, lastSeen",
      hangs: "++id, friendIds, date, notes, friendNames",
    });
  }

  // Compute lastSeen on demand
  async getFriendsWithLastSeen(): Promise<Friend[]> {
    const friends = await this.friends.toArray();
    const hangs = await this.hangs.orderBy("date").reverse().toArray();

    return friends.map((friend) => {
      const lastHang = hangs.find((hang) =>
        hang.friendIds.includes(friend.id!)
      );
      return {
        ...friend,
        lastSeen: lastHang ? lastHang.date : undefined,
      };
    });
  }

  // Compute friend names on demand
  async getHangsWithFriendNames(): Promise<
    (Hang & { friendNames: string[] })[]
  > {
    const hangs = await this.hangs.toArray();
    const friends = await this.friends.toArray();
    const friendMap = new Map(friends.map((f) => [f.id!, f.fullName]));

    return hangs.map((hang) => ({
      ...hang,
      friendNames: hang.friendIds.map((id) => friendMap.get(id) || "Unknown"),
    }));
  }

  // Helper method to create a hang with friend names automatically populated
  async createHang(
    friendIds: number[],
    date: Date,
    notes: string
  ): Promise<number> {
    const friends = await this.friends.where("id").anyOf(friendIds).toArray();
    const friendNames = friendIds.map((id) => {
      const friend = friends.find((f) => f.id === id);
      return friend ? friend.fullName : "Unknown";
    });

    return await this.hangs.add({
      date,
      friendIds,
      friendNames,
      notes,
    });
  }

  // Helper method to update a hang with friend names automatically updated
  async updateHang(hangId: number, updates: Partial<Hang>): Promise<number> {
    if (updates.friendIds) {
      const friends = await this.friends
        .where("id")
        .anyOf(updates.friendIds)
        .toArray();
      updates.friendNames = updates.friendIds.map((id) => {
        const friend = friends.find((f) => f.id === id);
        return friend ? friend.fullName : "Unknown";
      });
    }

    return await this.hangs.update(hangId, updates);
  }

  // Helper method to get recent hangs with friend names
  async getRecentHangs(limit: number = 10): Promise<Hang[]> {
    return await this.hangs.orderBy("date").reverse().limit(limit).toArray();
  }

  async getFriends(): Promise<Friend[]> {
    return await this.friends.orderBy("lastSeen").reverse().toArray();
  }

  async getHangs(): Promise<Hang[]> {
    return await this.hangs.orderBy("date").reverse().toArray();
  }
}

// Create and export database instance
export const db = new FriendsDatabase();
