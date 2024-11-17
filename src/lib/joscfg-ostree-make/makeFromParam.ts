import { parseArgs } from "util";
import Make from "./Make";

const { values } = parseArgs({
    args: Bun.argv,
    options: {
        fileName: {
            type: 'string'
        }
    },
    strict: true,
    allowPositionals: true
})

if (typeof values.fileName !== "string") {
    throw new Error("No --fileName parameter passed.")
}

Make(values.fileName)