export async function* iterateAsync<TData, TRes>(sequence: TData[], asyncHandler: (arg: TData, i: number) => Promise<TRes>) {
    for (let index = 0; index < sequence.length; index++) {
        const element = sequence[index];
        yield await asyncHandler(element, index);
    }
}

export async function asyncToArray<TResult>(asyncSequence: AsyncGenerator<TResult>): Promise<TResult[]> {
    const result: TResult[] = [];
    for await (const element of asyncSequence) {
        result.push(element);
    }

    return result;
}
