import { readFileSync } from 'fs';
import { join } from 'path';
import { Page } from 'puppeteer';

type TraceEvents = TraceEvent[];

type Trace = {
    traceEvents: TraceEvents;
};

type TraceEventName = 'ResourceFinish' | 'ResourceSendRequest' | 'ResourceReceiveResponse';
const usedEvents: TraceEventName[] = ['ResourceFinish', 'ResourceSendRequest', 'ResourceReceiveResponse'];

export interface TraceEvent {
    cat: string;
    name: TraceEventName;
    args: {
        data?: {
            requestId: string;
        };
    };
}

export interface ResourceFinishTraceEvent extends TraceEvent {
    args: {
        data: {
            requestId: string;
            decodedBodyLength: number;
            encodedDataLength: number;
            finishTime: number;
        };
    };
}

export interface ResourceSendRequestTraceEvent extends TraceEvent {
    args: {
        data: {
            requestId: string;
            priority: string;
            requestMethod: string;
            url: string;
        };
    };
}

export interface ResourceReceiveResponseTraceEven extends TraceEvent {
    args: {
        data: {
            requestId: string;
            encodedDataLength: number;
            mimeType: string;
            statusCode: number;
            timing: unknown;
        };
    };
}

type TracedResourceData = {
    sendRequest?: ResourceSendRequestTraceEvent;
    receiveResponse?: ResourceReceiveResponseTraceEven;
    finish?: ResourceFinishTraceEvent;
};

export class Tracer {
    private _lastTraceName: string | undefined;
    private _page: Page | undefined;

    constructor(private readonly _outputFolder: string) {}

    start = async (page: Page) => {
        this._page = page;
        this._lastTraceName = this.generateTraceName();
        const path = this.generateTracePath();
        await page.tracing.start({ path });
    };

    stop = async (): Promise<Trace> => {
        if (this._page == null) {
            throw new Error('Page for tracing is null or undefined. Maybe you forget to start tracing before calling stop tracing');
        }

        await this._page.tracing.stop();

        const path = this.generateTracePath();
        const tracing = JSON.parse(readFileSync(path, { encoding: 'utf8' }));

        return tracing;
    };

    private generateTracePath = (): string => {
        if (this._lastTraceName == null) {
            throw new Error('Trace name is not defined.');
        }
        return join(this._outputFolder, this._lastTraceName);
    };

    private generateTraceName = () => `${new Date().toISOString().replace(/[:.]/g, '-')}.json`;
}

export function subsetTrace(trc: TraceEvents) {
    return trc.filter((x) => x.cat === 'devtools.timeline' && x.args.data != null && usedEvents.includes(x.name));
}

export function extractResourceData(url: string, trace: TraceEvents): TracedResourceData {
    const sendRequest = trace.find(
        (event) => event.name === 'ResourceSendRequest' && (event as ResourceSendRequestTraceEvent).args.data?.url === url
    ) as ResourceSendRequestTraceEvent;

    if (sendRequest == null) {
        return {};
    }

    const requestId = sendRequest.args.data?.requestId;

    const receiveResponse = trace.find(
        (event) => event.name === 'ResourceReceiveResponse' && event.args?.data?.requestId === requestId
    ) as ResourceReceiveResponseTraceEven;

    const finish = trace.find(
        (event) => event.name === 'ResourceFinish' && event.args.data?.requestId === requestId
    ) as ResourceFinishTraceEvent;

    return { sendRequest, receiveResponse, finish };
}
