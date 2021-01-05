import { PerfRunResult } from './perfrunresult';

export interface IStorage {
    write(data: PerfRunResult, purge?: boolean): Promise<void>;
    read(): Promise<PerfRunResult[]>;
    purge(): Promise<void>;
}
