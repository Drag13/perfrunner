import FileSync from 'lowdb/adapters/FileSync';
import lowdb, { LowdbSync } from 'lowdb';

import { DbSchema, PerfRunResult } from "./scheme";
import { createFolderIfNotExists, generateReportName } from './utils';
import { PerfOptions } from '../profiler/perf-options';

class Db {
    private static _instance: Db | undefined;

    private _db: LowdbSync<DbSchema>;

    private constructor(outputFolder: string, options: PerfOptions) {
        const fileName = generateReportName({ ...options, ...options.network });
        createFolderIfNotExists(outputFolder);
        const adapter = new FileSync<DbSchema>(`${outputFolder}/${fileName}.json`);
        this._db = lowdb(adapter);
    }

    write(data: PerfRunResult, purge: boolean): void {
        const db = this._db;

        db.defaults({ profile: [], count: 0 }).write();

        if (purge) { this.purge(); }

        db.get('profile').push(data).write();
        db.update('count', n => n + 1).write();

    }

    read() {
        const db = this._db;

        db.defaults({ profile: [], count: 0 }).write();
        return db.get('profile').value();
    }

    purge() {
        this._db.get('profile').remove(() => true).write();
        this._db.update('count', _ => 0).write();
    }

    public static connect(outputFolder: string, perfRunParams: PerfOptions) {
        return this._instance == null ? (this._instance = new Db(outputFolder, perfRunParams)) : this._instance;;
    }
}

export { Db };