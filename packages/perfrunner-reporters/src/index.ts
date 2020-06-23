import { IReporter } from './reporters/iReporter';
import { toJson as json } from './reporters/json';
import { toCsv as csv } from './reporters/csv';
import { defaultReporter as html } from './reporters/default';

export { IReporter, json, csv, html };
