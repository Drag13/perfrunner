import FileSync from 'lowdb/adapters/FileSync';
import lowdb, { LowdbSync } from 'lowdb';
import { DbSchema, PerfRunResult } from './scheme';
import { debug } from '../logger';
import { ConnectionString } from './connection-string';

class Db {
    private static _instance: Db | undefined;

    private _db: LowdbSync<DbSchema>;

    private constructor(connectpionString: ConnectionString) {
        const adapter = new FileSync<DbSchema>(connectpionString);
        debug(`connecting to: ${connectpionString}`);
        this._db = lowdb(adapter);
    }

    write(data: PerfRunResult, purge?: boolean): void {
        const db = this._db;

        db.defaults({ profile: [], count: 0 }).write();

        if (purge) {
            this.purge();
        }

        db.get('profile').push(data).write();
        db.update('count', (n) => n + 1).write();
    }

    read = () => this._db.get('profile').value();

    purge() {
        debug(`clearing old data`);
        this._db
            .get('profile')
            .remove(() => true)
            .write();
        this._db.update('count', (_) => 0).write();
    }

    public static connect(connectpionString: ConnectionString) {
        //TODO: looks bad
        return this._instance == null ? (this._instance = new Db(connectpionString)) : this._instance;
    }
}

export { Db };
