import type Package from "../types/Package"
import fs from "fs";
import path from "path";
import os from "os";

export default (shellScriptName: string, contents: string): Package => {
    const pathToTemp = path.join(process.env.RUNNER_TEMP || os.tmpdir(), "javascriptoscfg")

    try {
        fs.mkdirSync(pathToTemp, { recursive: true })
    } catch (e) {
        console.error(`Making temp dir failed: ${e}`)
    }
    

    fs.writeFileSync(path.join(pathToTemp, shellScriptName), contents)

    return {
        name: shellScriptName,
        packageType: { type: "binary", src: path.join(pathToTemp, shellScriptName) }
    }
}