import { system as baseSystem } from "./base"
import GNOME from "../src/lib/joscfg-ostree/helpers/GNOME"
import Package from "../src/lib/joscfg-ostree/helpers/Package"
import LooseChannel from "../src/lib/joscfg-ostree/helpers/LooseChannel"
import Repository from "../src/lib/joscfg-ostree/helpers/Repository"

const gnome = GNOME(46)

const themeChannel = LooseChannel("ghcr.io/randomboixd/os-thingy", 40)

export const system = baseSystem
    .setPublishedImageConfig("dogfood", "A copy of base, with apps installed that are found on my own system. Made to be dogfooded, because that forces me to continue.")
    .addLooseChannels([ themeChannel ])
    .makeDerivation(d => d
        .LOOSECOPY(themeChannel, "/usr/share/icons/McMojave-circle", "/usr/share/icons/McMojave-circle")
        .applyDerivation()
    )
    .makeDerivation(d => d
        .includeGnomeExtensions([
            gnome.GetGnomeExtension("AppIndicator and KStatusNotifierItem Support"),
            gnome.GetGnomeExtension("Dash to Dock"),
            gnome.GetGnomeExtension("System Monitor", 6807)
        ])
        .addPackages([
            Repository("https://copr.fedorainfracloud.org/coprs/tmsp/xpadneo/repo/fedora-40/tmsp-xpadneo-fedora-40.repo"),
            Package("distrobox"),
            Package("xpadneo")
        ])
        .applyDerivation()
    )