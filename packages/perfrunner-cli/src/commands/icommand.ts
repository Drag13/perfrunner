export type CommandName = '--from-console' | '--init' | '--from-config' | '_';

export interface ICommand {
    readonly name: CommandName;
    execute(): Promise<number>;
}
