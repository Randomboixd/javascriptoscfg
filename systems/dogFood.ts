import { system as baseSystem } from "./base"
import GNOME from "../src/lib/joscfg-ostree/helpers/GNOME"
import Package from "../src/lib/joscfg-ostree/helpers/Package"

const gnome = GNOME(47)

export const system = baseSystem
    .setPublishedImageConfig("dogfood", "A copy of base, with apps installed that are found on my own system. Made to be dogfooded, because that forces me to continue.")
    .makeDerivation(d => d
        .includeGnomeExtensions([
            gnome.GetGnomeExtension("AppIndicator and KStatusNotifierItem Support"),
            gnome.GetGnomeExtension("Dash to Dock")
        ])
        .addPackages([
            Package("distrobox")
        ])
        .applyDerivation()
    )