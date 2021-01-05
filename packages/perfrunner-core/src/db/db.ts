import FileSync from 'lowdb/adapters/FileSync';
import lowdb, { LowdbSync } from 'lowdb';
import { DbSchema } from './scheme';
import { debug } from '../logger';
import { ConnectionString } from './connection-string';
import { IStorage } from '../types/storage';
import { PerfRunResult } from '../types/perfrunresult';

class Db implements IStorage {
    private _db: LowdbSync<DbSchema>;

    public constructor(connectpionString: ConnectionString) {
        const adapter = new FileSync<DbSchema>(connectpionString);
        debug(`connecting to: ${connectpionString}`);
        this._db = lowdb(adapter);
    }

    async write(data: PerfRunResult, purge?: boolean): Promise<void> {
        const db = this._db;

        db.defaults({ profile: [], count: 0 }).write();

        if (purge) {
            this.purge();
        }

        db.get('profile').push(data).write();
        db.update('count', (n) => n + 1).write();
    }

    async read() {
        const data = this._db.get('profile').value();
        return Promise.resolve(data);
    }

    async purge() {
        debug(`clearing old data`);
        this._db
            .get('profile')
            .remove(() => true)
            .write();
        this._db.update('count', (_) => 0).write();
    }
}

export { Db };
