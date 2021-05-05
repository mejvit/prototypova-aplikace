
import { SQLiteDBConnection } from '@capacitor-community/sqlite';
import { Result, useSQLite } from 'vue-sqlite-hook/dist';
export function useSQLiteInApp() {
  const {createConnection, isDatabase, retrieveConnection } = useSQLite();
  const dbName = "mojezaznamy";
  let result: Result;
  let db: Result | SQLiteDBConnection | null;


  const createDbSchema = async function(db: SQLiteDBConnection) {
    db.open();
      const dbStructure = `
        CREATE TABLE IF NOT EXISTS records (
          id INTEGER PRIMARY KEY NOT NULL,
          name TEXT,
          number INTEGER,
          date TEXT,
          description TEXT
        );
        PRAGMA user_version = 1;
        `;      
    result = await db.execute(dbStructure);
  };

  const getDbInstance = async function(): Promise<SQLiteDBConnection> {
    result = await isDatabase(dbName);

    db = await retrieveConnection(dbName);
    if (db === null) {
      db = await createConnection(dbName, true, "secret", 1);      
    }
    if (db instanceof SQLiteDBConnection) {
      await createDbSchema(db);
    }
    else {
      throw new Error("Error during db init");            
    }
    
    result = await db.isDBOpen();
    if (!result.result) {
      result = await db.open();
    }
    return db;
  }

  return {
    getDbInstance
  }
}

export interface DbRecord {
  id?: number;
  name: string;
  number?: number;
  date?: string;
  description?: string;
}