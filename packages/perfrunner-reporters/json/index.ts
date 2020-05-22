import fs from 'fs';
import { IReporter } from "../ireporter";

const toJson: IReporter = (to, result) => fs.writeFileSync(to, JSON.stringify(result, null, ' '), { encoding: 'utf-8' });

export { toJson }

