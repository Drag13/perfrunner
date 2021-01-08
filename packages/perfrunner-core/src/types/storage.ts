import { PerfRunResult } from './perfrunresult';

export interface IStorage {
    write(data: PerfRunResult, purge?: boolean): Promise<void>;
    read(url: string): Promise<PerfRunResult[]>;
    read(): Promise<PerfRunResult[]>;
    purge(): Promise<void>;
}
