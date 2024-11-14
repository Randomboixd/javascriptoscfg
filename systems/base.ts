import Package from "../src/lib/joscfg-ostree/Package";
import System from "../src/lib/joscfg-ostree/System";


export const system = new System()
    .setChannel("ghcr.io/ublue-os/silverblue-main", "40")
    .makeDerivation(d => d
        .addPackages([
            Package("fastfetch"),
        ])
        .applyDerivation()
    )