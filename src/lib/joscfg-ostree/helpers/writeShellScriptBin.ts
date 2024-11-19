import type Package from "../types/Package"
import fs from "fs";
import path from "path";
import os from "os";

export default (shellScriptName: string, contents: string): Package => {
    const pathToTemp = path.join(process.cwd(), "temp")

    try {
        fs.mkdirSync(pathToTemp, { recursive: true })
    } catch (e) {
        console.error(`Making temp dir failed: ${e}`)
    }
    

    fs.writeFileSync(path.join(".", "temp", shellScriptName), "#!/bin/bash\n"+contents)

    return {
        name: shellScriptName,
        packageType: { type: "binary", src: path.join(".", "temp", shellScriptName) }
    }
}