import fs from 'fs';
import { IReporter } from "../ireporter";

export const report: IReporter = (to, result) =>
    fs.writeFileSync(to, JSON.stringify(result, null, ' '), { encoding: 'utf-8' })
