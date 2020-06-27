import { IWithObserver } from './observer';

export function measureLCP() {
    const observer = new PerformanceObserver((entryList) => {
        const entries = entryList.getEntries();
        const lastEntry = entries[entries.length - 1];

        const w = <IWithObserver>window;
        if (w._cpo) {
            w._cpo.add(lastEntry);
        } else {
            throw Error('storage not found');
        }
    });

    observer.observe({ type: 'largest-contentful-paint', buffered: true });

    document.addEventListener('visibilitychange', () => {
        const w = window as any;

        if (document.visibilityState === 'hidden') {
            observer.takeRecords();
            observer.disconnect();
        }
    });
}
