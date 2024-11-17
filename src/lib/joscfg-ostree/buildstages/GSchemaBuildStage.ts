import type System from "../System";
import { execSync } from "child_process";
import path from "path";
import fs from "fs";
import type { GSchemaOptionTypes } from "../types/GSchema";
import crypto from "crypto";

export const convertFromJavascriptToGSchemaType = (val: GSchemaOptionTypes) => {
    switch (typeof val) {
        case "string":
            return val

        case "number":
            return String(Number)

        case "boolean":
            return val === true ? "true" : "false"
    }

    if (Array.isArray(val)) {
        return `['${val}']`
    }

    return "''"
}

export default (image: System) => {
    const schemas = image.gschemas

    if (schemas.length === 0) {
        return "# -- No GSchemas need to be built and added to the image! --"
    }

    const pathToTemp = path.join(process.cwd(), "temp")
    const pathToSchemas = path.join(pathToTemp, "schemas")
    const compiledTarget = path.join(pathToTemp, "schemas-target")

    try {
        fs.mkdirSync(pathToTemp, { recursive: true })
        fs.mkdirSync(pathToSchemas, { recursive: true })
        fs.mkdirSync(compiledTarget, { recursive: true })
    } catch (e) {
        console.error(`Making dirs failed: ${e}`)
        return "# -- Building GSchemas failed: Dir making failed. --"
    }

    let gschemaOverrides: string[] = []

    schemas.forEach(schema => {

        let schemaOptions: string = ""

        const schemaKeys = Object.keys(schema.options)
        schemaKeys.forEach(key => {
            const schemaOption = schema.options[key]
            schemaOptions += `${key}=${convertFromJavascriptToGSchemaType(schemaOption)}\n`
        })
        gschemaOverrides.push(`[${schema.path}]\n${schemaOptions}`)
    })

    gschemaOverrides.forEach(override => {
        const filename = `zz1-${crypto.randomBytes(32).toString('hex')}.gschema.override`

        console.log(`Saving override as ${filename}:\n${override}`)

        fs.writeFileSync(path.join(pathToSchemas, filename), override)
    })


    console.log("Compilation happens during Containerfile build... Meaning we'll hope that everything here is alright. Here be dragons!")
    return `RUN tree\nRUN glib-compile-schemas --strict --targetdir=./temp/schemas-target/ ./temp/schemas/\nCOPY ${compiledTarget}/* /usr/share/glib-2.0/schemas/`
}