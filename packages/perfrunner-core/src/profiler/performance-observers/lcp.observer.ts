export function measureLCP() {
    const observer = new PerformanceObserver((entryList) => {
        const entries = entryList.getEntries();
        const lastEntry = entries[entries.length - 1];

        if (window._cpo) {
            window._cpo.add(lastEntry);
        } else {
            throw Error('storage not found');
        }
    });

    observer.observe({ type: 'largest-contentful-paint', buffered: true });

    document.addEventListener('visibilitychange', () => {
        if (document.visibilityState === 'hidden') {
            observer.takeRecords();
            observer.disconnect();
        }
    });
}
