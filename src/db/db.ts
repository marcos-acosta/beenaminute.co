import Dexie, { type EntityTable } from "dexie";
import { Friend, Hang } from "../interfaces";

const friendsDatabase = new Dexie("FriendsDatabase") as Dexie & {
  friends: EntityTable<Friend, "id">;
};
friendsDatabase.version(1).stores({
  friends: "++id, firstName, lastName, tags, inverseFrequency, hangIds, blurb",
});

const hangsDatabase = new Dexie("HangsDatabase") as Dexie & {
  friends: EntityTable<Hang, "id">;
};
hangsDatabase.version(1).stores({
  hangs: "++id, friendIds, date, notes",
});

export { friendsDatabase, hangsDatabase };
