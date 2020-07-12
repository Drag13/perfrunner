export interface IWithObserver {
    _cpo?: IEventStore;
}

export interface IEventStore {
    _entries: PerformanceEntry[];
    add(performanceEntry: PerformanceEntry): void;
    getEntries(): PerformanceEntry[];
}

export function setupObserversStorage() {
    const store: IEventStore = {
        _entries: [],
        add: function (entry) {
            this._entries.push(entry);
        },
        getEntries: function () {
            return this._entries;
        },
    };

    //@ts-ignore
    (<IWithObserver>window)._cpo = store;
}
