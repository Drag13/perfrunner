import cmd from 'command-line-args';
import { definitions, ConsoleArguments } from './args';

export const parseConsole = () => <ConsoleArguments>cmd(definitions, { camelCase: true });
