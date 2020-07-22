import { readFileSync, existsSync, mkdirSync } from 'fs';
import { join } from 'path';
import { Page } from 'puppeteer';

type TraceEvents = TraceEvent[];

export type Trace = {
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

interface ResourceFinishTraceEvent extends TraceEvent {
    args: {
        data: {
            requestId: string;
            decodedBodyLength: number;
            encodedDataLength: number;
            finishTime: number;
        };
    };
}

interface ResourceSendRequestTraceEvent extends TraceEvent {
    args: {
        data: {
            requestId: string;
            priority: string;
            requestMethod: string;
            url: string;
        };
    };
}

interface ResourceReceiveResponseTraceEven extends TraceEvent {
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
    private _page: Page | undefined;
    private _path: string | undefined;

    constructor(private readonly _outputFolder: string) {}

    start = async (page: Page) => {
        this._page = page;
        const traceName = this.generateTraceName();
        const outputTo = join(this._outputFolder, 'traces');
        this.ensureFolderCreated(outputTo);
        this._path = this.generateTracePath(outputTo, traceName);

        await page.tracing.start({ path: this._path });
    };

    stop = async (): Promise<Trace> => {
        if (this._page == null || this._path == null) {
            throw new Error('Page for tracing is null or undefined. Maybe you forget to start tracing before calling stop tracing');
        }

        await this._page.tracing.stop();

        const tracing = JSON.parse(readFileSync(this._path, { encoding: 'utf8' }));

        return tracing;
    };

    private generateTracePath = (folder: string, traceName: string): string => join(folder, traceName);

    private generateTraceName = () => `${new Date().toISOString().replace(/[:.]/g, '-')}.json`;

    private ensureFolderCreated(path: string) {
        if (!existsSync(path)) {
            mkdirSync(path);
        }
    }
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
