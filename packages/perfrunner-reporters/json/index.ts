import fs from 'fs';
import { IReporter } from "../ireporter";

const toJson: IReporter = (to, result) => {
    return new Promise((res, rej) => {
        try {
            fs.writeFileSync(to, JSON.stringify(result, null, ' '), { encoding: 'utf-8' });
            res();
        } catch (error) {
            rej(error);
        }
    })
}

export { toJson }

