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

    // Set up hooks
    this.setupHooks();
  }

  private setupHooks(): void {
    // Hook for when hangs are created - update lastSeen for friends
    this.hangs.hook("creating", (primKey, obj, trans) => {
      this.updateLastSeenForFriends(obj.friendIds, obj.date, trans);
    });

    // Hook for when hangs are updated - update lastSeen for friends
    this.hangs.hook("updating", (modifications, primKey, obj, trans) => {
      if (
        modifications.hasOwnProperty("friendIds") ||
        modifications.hasOwnProperty("date")
      ) {
        const updatedObj = { ...obj, ...modifications };
        this.updateLastSeenForFriends(
          updatedObj.friendIds,
          updatedObj.date,
          trans
        );
      }
    });

    // Hook for when hangs are deleted - recalculate lastSeen for affected friends
    this.hangs.hook("deleting", (primKey, obj, trans) => {
      this.recalculateLastSeenForFriends(obj.friendIds, trans);
    });

    // Hook for when friends are updated - update their names in hangs
    this.friends.hook("updating", (modifications, primKey, obj, trans) => {
      if ("fullName" in modifications) {
        this.updateFriendNameInHangs(
          primKey,
          modifications.fullName as string,
          trans
        );
      }
    });
  }

  // Update lastSeen field for friends when they appear in a hang
  private async updateLastSeenForFriends(
    friendIds: number[],
    hangDate: Date,
    trans: Transaction
  ): Promise<void> {
    for (const friendId of friendIds) {
      const friend = await trans.table("friends").get(friendId);
      if (friend && (!friend.lastSeen || hangDate > friend.lastSeen)) {
        await trans.table("friends").update(friendId, { lastSeen: hangDate });
      }
    }
  }

  // Recalculate lastSeen for friends (used when hangs are deleted)
  private async recalculateLastSeenForFriends(
    friendIds: number[],
    trans: Transaction
  ): Promise<void> {
    for (const friendId of friendIds) {
      const latestHangs = await trans
        .table("hangs")
        .where("friendIds")
        .equals(friendId)
        .reverse()
        .sortBy("date");

      const lastSeen = latestHangs.length > 0 ? latestHangs[0].date : undefined;
      await trans.table("friends").update(friendId, { lastSeen });
    }
  }

  // Update friend names in hangs when a friend's name changes
  private async updateFriendNameInHangs(
    friendId: number,
    fullName: string,
    trans: Transaction
  ): Promise<void> {
    const hangsToUpdate = await trans
      .table("hangs")
      .where("friendIds")
      .equals(friendId)
      .toArray();

    for (const hang of hangsToUpdate) {
      const friendIndex = hang.friendIds.indexOf(friendId);
      if (friendIndex !== -1) {
        const updatedFriendNames = [...hang.friendNames];
        updatedFriendNames[friendIndex] = fullName;
        await trans
          .table("hangs")
          .update(hang.id!, { friendNames: updatedFriendNames });
      }
    }
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
