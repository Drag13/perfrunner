import FileSync from 'lowdb/adapters/FileSync';
import lowdb, { LowdbSync } from 'lowdb';

import { PerfOptions } from '../profiler/perf-options';
import { createFolderIfNotExists, generateReportName } from './utils';
import { PerfRunResult } from './perf-run-result';

type DbSchema = {
    profile: PerfRunResult[],
    count: number
}

class Db {
    private _db: LowdbSync<DbSchema> | undefined;

    saveData(outputFolder: string, data: PerfRunResult): void {
        const isInitied = !!this._db;

        if (!isInitied) {
            this.init(outputFolder, data.runParams);
        }

        const db = this._db;

        if (db) {
            db.defaults({ profile: [], count: 0 }).write();
            db.get('profile').push(data).write();
            db.update('count', n => n + 1).write();
        } else {
            throw new Error('Db not found');
        }
    }

    readData(outputFolder: string, options: PerfOptions) {
        const isInitied = !!this._db;

        if (!isInitied) {
            this.init(outputFolder, options);
        }

        const db = this._db;

        if (db) {
            db.defaults({ profile: [], count: 0 }).write();
            return db.get('profile').value();
        } else {
            throw new Error('Db not found');
        }
    }

    private init(outputFolder: string, options: PerfOptions) {
        const fileName = generateReportName({ ...options, ...options.network });
        createFolderIfNotExists(outputFolder);
        const adapter = new FileSync<DbSchema>(`${outputFolder}/${fileName}.json`);
        this._db = lowdb(adapter);
    }
}

export const db = new Db();