import { IReporter } from './reporters/iReporter';
import { defaultJSONReporter as json } from './reporters/json';
import { defaultCSVReporter as csv } from './reporters/csv';
import { defaultHtmlReporter as html } from './reporters/html';
import { defaultMdReporter as md } from './reporters/md';

export { IReporter, json, csv, html, md };
