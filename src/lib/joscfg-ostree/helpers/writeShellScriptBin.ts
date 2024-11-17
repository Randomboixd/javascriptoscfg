import type Package from "../types/Package"
import fs from "fs";
import path from "path";
import os from "os";

export default (shellScriptName: string, contents: string): Package => {
    const pathToTemp = path.join(process.env.RUNNER_TEMP || os.tmpdir(), "shellScriptBuilds")

    try {
        fs.mkdirSync(pathToTemp)
    } catch {}
    

    fs.writeFileSync(path.join(pathToTemp, shellScriptName), contents)

    return {
        name: shellScriptName,
        packageType: { type: "binary", src: path.join(pathToTemp, shellScriptName) }
    }
}