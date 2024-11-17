// This file is used by the github action to read the image name, then
// set the environment variable for it. So this command simply prints out the published image name.
// defined using .setPublishedImageConfig()

import { parseArgs } from "util";
import fs from "fs";
import path from "path";
import type System from "../joscfg-ostree/System";


const { values } = parseArgs({
    args: Bun.argv,
    options: {
        fileName: {
            type: 'string'
        }
    },
    strict: true
})

if (typeof values.fileName !== "string") {
    throw new Error("No --fileName parameter passed.")
}

const pathToSystems = path.join(__dirname, "..", "..", "..")

const { system } : { system: { system: System | undefined } } = require(path.join(pathToSystems, "systems", values.fileName))

if (!system.system) {
    throw new Error("File isn't a valid system.")
}

console.log(system.system.getReader().publish.image_description)