import { readFileSync } from 'fs';
import { Page } from 'puppeteer';

import { TRACE_PATH } from '../appsettings';

type TraceEvents = TraceEvent[];

type Trace = {
    traceEvents: TraceEvents
}

type TraceEventName = 'ResourceFinish' | 'ResourceSendRequest' | 'ResourceReceiveResponse';
const usedEvents: TraceEventName[] = ['ResourceFinish', 'ResourceSendRequest', 'ResourceReceiveResponse'];

export interface TraceEvent {
    cat: string,
    name: TraceEventName,
    args: {
        data?: {
            requestId: string;
        }
    }
};

export interface ResourceFinishTraceEvent extends TraceEvent {
    args: {
        data: {
            requestId: string;
            decodedBodyLength: number;
            encodedDataLength: number;
            finishTime: number
        }
    }
}

export interface ResourceSendRequestTraceEvent extends TraceEvent {
    args: {
        data: {
            requestId: string;
            priority: string;
            requestMethod: string;
            url: string;
        }
    }
}

export interface ResourceReceiveResponseTraceEven extends TraceEvent {
    args: {
        data: {
            requestId: string;
            encodedDataLength: number,
            mimeType: string,
            statusCode: number,
            timing: unknown
        }
    }
}

type TracedResourceData = {
    sendRequest?: ResourceSendRequestTraceEvent,
    receiveResponse?: ResourceReceiveResponseTraceEven
    finish?: ResourceFinishTraceEvent
}

export async function startTracing(page: Page) {
    await page.tracing.start({ categories: ['devtools.timeline'], path: TRACE_PATH })
}

export async function stopTracing(page: Page): Promise<Trace> {
    await page.tracing.stop();
    const tracing = JSON.parse(readFileSync(TRACE_PATH, { encoding: 'utf8' }));

    return tracing;
}

export function subsetTrace(trc: TraceEvents) {
    return trc.filter(x =>
        x.cat === "devtools.timeline" &&
        x.args.data != null && usedEvents.includes(x.name)
    );
}

export function extractResourceData(url: string, trace: TraceEvents): TracedResourceData {

    const sendRequest = trace.find((event) =>
        event.name === 'ResourceSendRequest' &&
        (event as ResourceSendRequestTraceEvent).args.data?.url === url
    ) as ResourceSendRequestTraceEvent;

    if (sendRequest == null) { return {}; }

    const requestId = sendRequest.args.data?.requestId;

    const receiveResponse = trace.find((event) =>
        event.name === 'ResourceReceiveResponse' &&
        event.args?.data?.requestId === requestId
    ) as ResourceReceiveResponseTraceEven;

    const finish = trace.find((event) =>
        event.name === 'ResourceFinish' &&
        event.args.data?.requestId === requestId) as ResourceFinishTraceEvent;

    return { sendRequest, receiveResponse, finish };
}

