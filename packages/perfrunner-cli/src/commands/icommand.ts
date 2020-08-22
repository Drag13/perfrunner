export type CommandName = '--from-console' | '--init' | '--from-config' | '_';

export interface ICommand<T> {
    readonly name: CommandName;
    readonly args: T;
    execute(): Promise<number>;
}
