import fs from "fs";
import path from "path";
import type System from "../joscfg-ostree/System";
import Builder from "../joscfg-ostree/Builder";

export default (imageFile: string) => {
    const pathToSystems = path.join(__dirname, "..", "..", "..", "systems")
    const pathToImageFile = path.join(pathToSystems, imageFile)

    const systemFile = require(pathToImageFile) as { system: System }
    if (!systemFile.system) {
        throw new Error(`${pathToImageFile} does not export a system variable. Make sure it's a new instance of System()!`)
    }

    const system = systemFile.system
    const builder = new Builder(system)
    
    const builtContainerFile = builder.build()
    
    const pathToRoot = path.join(__dirname, "..", "..", "..")
    fs.writeFileSync(path.join(pathToRoot, "Containerfile"), builtContainerFile)
}