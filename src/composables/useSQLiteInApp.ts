
import { capSQLiteResult, capSQLiteSet, SQLiteDBConnection } from '@capacitor-community/sqlite';
import { Result, useSQLite } from 'vue-sqlite-hook/dist';
import { getCurrentInstance } from 'vue';

export function useSQLiteInApp() {
  const {createConnection, isDatabase, retrieveConnection, retrieveAllConnections} = useSQLite();
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
    const result = await db.execute(dbStructure);
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

  const closeDb = async function() {
    if (db instanceof SQLiteDBConnection) {
      result = await db.close();
      console.log(result);
    }
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