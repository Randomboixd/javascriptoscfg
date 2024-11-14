import { system } from "./systems/base"
import Builder from "./src/lib/joscfg-ostree/Builder"
import fs from "fs";

const result = new Builder(system)
    .build()

fs.writeFileSync('Containerfile', result)