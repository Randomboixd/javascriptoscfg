import Package from "../src/lib/joscfg-ostree/helpers/Package";
import Schema from "../src/lib/joscfg-ostree/helpers/Schema";
import System from "../src/lib/joscfg-ostree/System";


export const system = new System()
    .setChannel("ghcr.io/ublue-os/silverblue-main", "40")
    .setPublishedImageConfig("testimage", "The test image provided by javascriptosconfig's repo. Not for daily use.")
    .makeDerivation(d => d
        .addPackages([
            Package("fastfetch"),
        ])
        .addGSchemas([
            Schema("org.gnome.shell", {
                "enabled-extensions": [ "blur-my-shell@aunetx" ] // Currently there is no way to install gnome extensions yet... I will add it though!
            })
        ])
        .applyDerivation()
    )