export function setupObserversStorage() {
    const store: IEventStore & { _entries: PerformanceEntry[] } = {
        _entries: [],
        add: function (entry) {
            this._entries.push(entry);
        },
        getEntries: function () {
            return this._entries;
        },
    };

    window._cpo = store;
}
