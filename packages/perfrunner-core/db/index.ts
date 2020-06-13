import FileSync from 'lowdb/adapters/FileSync';
import lowdb, { LowdbSync } from 'lowdb';

import { DbSchema, PerfRunResult } from "./scheme";
import { generateReportName } from './utils';
import { PerfOptions } from '../profiler/perf-options';
import { debug } from '../utils/log';

class Db {
    private static _instance: Db | undefined;

    private _db: LowdbSync<DbSchema>;

    private constructor(url: URL, outputFolder: string, options: PerfOptions, testName?: string) {
        const fileName = generateReportName(url, { ...options, ...options.network });
        const fullPath = `${outputFolder}/${testName ?? fileName}.json`;
        const adapter = new FileSync<DbSchema>(fullPath);
        debug(`connecting to: ${fullPath}`);
        this._db = lowdb(adapter);
    }

    write(data: PerfRunResult, purge?: boolean): void {
        const db = this._db;

        db.defaults({ profile: [], count: 0 }).write();

        if (purge) {
            this.purge();
        }

        db.get('profile').push(data).write();
        db.update('count', n => n + 1).write();
    }

    read() {
        const db = this._db;

        db.defaults({ profile: [], count: 0 }).write();
        return db.get('profile').value();
    }

    purge() {
        debug(`clearing old data`)
        this._db.get('profile').remove(() => true).write();
        this._db.update('count', _ => 0).write();
    }

    public static connect(url: URL, outputFolder: string, perfRunParams: PerfOptions, testName?: string) {
        return this._instance == null ? (this._instance = new Db(url, outputFolder, perfRunParams, testName)) : this._instance;
    }
}

export { Db };