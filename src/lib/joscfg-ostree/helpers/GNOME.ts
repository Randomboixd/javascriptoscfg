import { execSync } from "child_process"
import type GnomeExtensionRequest from "../types/GnomeExtensionRequest"
import fs from "fs";
import path from "path";

/**
 * Configure a GNOME Object. Required for us to grab the correct GNOME Extensions!
 * @param versionNumber The gnome version number. Usually its +1 every new Fedora release. Like Fedora 41 has Gnome 47, Fedora 42 will likely have Gnome 48!
 */
export default (versionNumber: number) => {
    return {
        GetGnomeExtension: (name: string, packageId?: number) => {

            if (process.env.JOS_READY !== 'true') {
                // Javascript OS Config is NOT YET ready to download Gnome extensions. Leave me alone!
                return {
                    uuid: "Nothing",
                    src: ""
                }
            }

            console.log(`Get gnome extension: ${name} with package ID ${packageId?packageId:'Unspecified.'}`)

            const pathToTemp = path.join(process.cwd(), "temp")
            const pathToGE = path.join(pathToTemp, "GE")
            const pathToGEExtract = path.join(pathToTemp, "GEEXTRACT")

            console.log("Checking directories.")
            try {
                fs.mkdirSync(pathToTemp, { recursive: true })
                fs.mkdirSync(pathToGE, { recursive: true })
                fs.mkdirSync(pathToGEExtract, { recursive: true })
            } catch (e) {
                console.error(`Making temp dir failed: ${e}`)
            }

            const nameEncoded = name.replaceAll(" ", "%20")
            console.log("Finding extensions...")
            // Terrible idea i know. But we can't do async. AFAIK
            const { extensions } = JSON.parse(execSync(`curl https://extensions.gnome.org/extension-query/?search=${nameEncoded}`).toString()) as { extensions: GnomeExtensionRequest[] }

            console.log(`Got ${extensions.length} results from the API!`)

            let extensionsFound = extensions.filter(e => e.name === name)

            if (extensionsFound.length > 1 && !packageId) {
                console.log(extensionsFound)
                throw new Error(`Request to ${name} failed as there are more extensions with the same name. Please supply a packageId (pk), that you can find in Gnome extensions. It's somewhere https://extensions.gnome.org/extension/ There!! ----->3193 <--- Here!!!! /blur-my-shell/.\nSimply append that to this Gnome Extensions call.`)
            }

            if (extensionsFound.length >= 1 && packageId) {
                extensionsFound = extensions.filter(e => e.name === name && e.pk === packageId)
            }

            const extensionListing = extensionsFound[0]

            // i am bored. let's just have weird variable names.
            const extensionVersionThingyBasicallyYes = extensionListing.shell_version_map[String(versionNumber)]

            if (!extensionVersionThingyBasicallyYes) {
                throw new Error(`This extension cannot be installed as it's designed for older (or perhaps newer, woah big reveal are you using an old fedora release) Gnome.\nAs you said your GNOME is ${versionNumber}, while this extension offers the following versions: ${Object.keys(extensionListing.shell_version_map)}\n...\nAnd no don't think you can simply set your version back. GNOME Doesn't load extensions not compatible with its own version. Or atleast not some input from the user. BUT THAT'S ON YA BUDDY!`)
            }

            

            const extensionDownloadNoVirus100percentLegit = `${extensionListing.uuid.replaceAll('@', '')}.v${extensionVersionThingyBasicallyYes.version}.shell-extension.zip`

            if (fs.existsSync(`${path.join(pathToGE, extensionDownloadNoVirus100percentLegit)}`)) {
                execSync(`rm ${pathToGE}/${extensionDownloadNoVirus100percentLegit}`)
            }

            console.log(`Downloading ${extensionDownloadNoVirus100percentLegit}`)
            const downloadResults = execSync(`curl https://extensions.gnome.org/extension-data/${extensionDownloadNoVirus100percentLegit} >> ${pathToGE}/${extensionListing.uuid}`)

            console.log(`Extracting to temp/GEEXTRACT/${extensionListing.uuid}`)
            const extractResults = execSync(`unzip -u ${pathToGE}/${extensionListing.uuid} -d ${pathToGEExtract}/${extensionListing.uuid}`)

            return {
                uuid: extensionListing.uuid,
                src: path.join(pathToGEExtract, extensionListing.uuid)
            }
        }
    }
}