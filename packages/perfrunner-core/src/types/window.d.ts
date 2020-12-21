declare interface IEventStore {
    add(performanceEntry: PerformanceEntry): void;
    getEntries(): PerformanceEntry[];
}

declare interface Window {
    _cpo?: IEventStore;
}
