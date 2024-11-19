import GNOME from "../src/lib/joscfg-ostree/helpers/GNOME";
import Package from "../src/lib/joscfg-ostree/helpers/Package";
import Schema from "../src/lib/joscfg-ostree/helpers/Schema";
import writeShellScriptBin from "../src/lib/joscfg-ostree/helpers/writeShellScriptBin";
import System from "../src/lib/joscfg-ostree/System";

const gnome = GNOME(47)

export const system = new System()
    .setChannel("ghcr.io/ublue-os/silverblue-main", "40")
    .setPublishedImageConfig("testimage", "The test image provided by javascriptosconfig's repo. Not for daily use.")
    .makeDerivation(d => d
        .addPackages([
            Package("fastfetch"),
            writeShellScriptBin('test', `echo 'huh'`)
        ])
        .includeGnomeExtensions([
            gnome.GetGnomeExtension("Blur my Shell")
        ])
        .addGSchemas([
            Schema("org.gnome.shell", {
                "enabled-extensions": [ "blur-my-shell@aunetx" ]
            })
        ])
        .applyDerivation()
    )