export async function* iterateAsync<TData, TRes>(sequence: TData[], asyncHandler: (arg: TData, i: number) => Promise<TRes>) {
    for (let i = 0; i < sequence.length; i++) {
        const element = sequence[i];
        yield await asyncHandler(element, i);
    }
}
