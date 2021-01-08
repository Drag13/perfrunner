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

    write(data: PerfRunResult, purge?: boolean): Promise<void> {
        const db = this._db;

        db.defaults({ profile: [], count: 0 }).write();

        if (purge) {
            this.purge();
        }

        db.get('profile').push(data).write();
        db.update('count', (n) => n + 1).write();

        return Promise.resolve(undefined);
    }

    read(url?: string): Promise<PerfRunResult[]> {
        const data = this._db.get('profile').value();
        const result = typeof url === 'string' ? data.filter((x) => x.runParams.url.toLowerCase() === url.toLowerCase()) : data;

        return Promise.resolve(result);
    }

    purge(): Promise<undefined> {
        debug(`clearing old data`);
        this._db
            .get('profile')
            .remove(() => true)
            .write();
        this._db.update('count', (_) => 0).write();

        return Promise.resolve(undefined);
    }
}

export { Db };
