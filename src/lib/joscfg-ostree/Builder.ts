import buildAddPkgs from "./buildstages/buildAddPkgs";
import buildRemovePkgs from "./buildstages/buildRemovePkgs";
import Commit from "./buildstages/Commit";
import COPYStages from "./buildstages/COPYStages";
import customBuiltBinaries from "./buildstages/customBuiltBinaries";
import ExecStage from "./buildstages/ExecStage";
import GnomeExtensionBuildStage from "./buildstages/GnomeExtensionBuildStage";
import GSchemaBuildStage from "./buildstages/GSchemaBuildStage";
import LooseChannelsBuildStage from "./buildstages/LooseChannelsBuildStage";
import mkImageHeaders from "./buildstages/mkImageHeaders";
import mkImageLabels from "./buildstages/mkImageLabels";
import RepositoriesBuildStage from "./buildstages/RepositoriesBuildStage";
import type System from "./System";


/**
 * Build a Containerfile that installs a javascriptosconfig-ostree system.
 */
export default class Builder {
    private readonly image: System

    /**
     * Choose what image to build.
     * @param image - The System class of what you want to build.
     */
    constructor(image: System) {
        this.image = image
    }

    /**
     * Create the Containerfile text. And then return it's contents in a string to be written to a file.
     * @returns - Containerfile's contents
     */
    public build(): string {
        const imageHeaders = mkImageHeaders(this.image);
        const removePkgsCommand = this.image.packages.some(p => p.packageType.type === 'rpm-ostree' && p.packageType.method === "remove")
            ? `RUN ${buildRemovePkgs(this.image)} && \\`
            : 'RUN echo "No packages will be removed." && \\';
        const addPkgsCommand = this.image.packages.some(p => p.packageType.type === 'rpm-ostree' && p.packageType.method === "install")
            ? `${buildAddPkgs(this.image)}`
            : `echo "No packages will be installed."`
        
        const COPY = COPYStages(this.image)
        const customBinaries = customBuiltBinaries(this.image)
        const run = ExecStage(this.image)
        const labels = mkImageLabels(this.image)
        const schemas = GSchemaBuildStage(this.image)
        const extensions = GnomeExtensionBuildStage(this.image)
        const looseChannels = LooseChannelsBuildStage(this.image)
        const repos = RepositoriesBuildStage(this.image)

        return `${imageHeaders}\n# Add image labels\n${labels}\n# Add loose channels\n${looseChannels}\n# Copy stage\nFROM base\n${COPY}\n \n# Custom binaries stage\n${customBinaries}\n \n# Add repos\n${repos}\n \n# Install/Remove packages\n${removePkgsCommand}\n${addPkgsCommand}\n \n# Execution stage\n${run}\n \n# GSchema Stage\n${schemas} \n \n#GNOME Extension stage\n${extensions}\n \n# Commit everything\nRUN ${Commit()}\n# Goodbye!`.trim();
    }
}