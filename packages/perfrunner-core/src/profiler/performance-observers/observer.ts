export interface IWithObserver {
    _cpo?: ICustomPerformanceObserver;
}

export interface ICustomPerformanceObserver {
    _entries: PerformanceEntry[];
    add(performanceEntry: PerformanceEntry): void;
    getEntries(): PerformanceEntry[];
}

export function setupObserversStorage() {
    const observer: ICustomPerformanceObserver = {
        _entries: [],
        add: function (entry) {
            this._entries.push(entry);
        },
        getEntries: function () {
            return this._entries;
        },
    };

    //@ts-ignore
    (<IWithObserver>window)._cpo = observer;
}
