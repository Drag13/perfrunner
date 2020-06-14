import { IReporter } from "../iReporter";
import { writeFile } from "../../utils";

const toJson: IReporter = (outputFolder, result) => {
    return new Promise((resolve, reject) => {
        try {
            writeFile(outputFolder, 'json-reporter.json', result)
            resolve();
        } catch (error) { reject(error); }
    })
}

export { toJson }