import Package from "../src/lib/joscfg-ostree/helpers/Package";
import writeShellScriptBin from "../src/lib/joscfg-ostree/helpers/writeShellScriptBin";
import System from "../src/lib/joscfg-ostree/System";


export const system = new System()
    .setChannel("ghcr.io/ublue-os/silverblue-main", "40")
    .setPublishedImageConfig("testimage", "The test image provided by javascriptosconfig's repo. Not for daily use.")
    .makeDerivation(d => d
        .addPackages([
            Package("fastfetch"),
            writeShellScriptBin('test', 
                `
                echo 'hello world'
                `
            )
        ])
        .applyDerivation()
    )