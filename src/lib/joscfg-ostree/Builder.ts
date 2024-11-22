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

const lineBreak = () => "\n"
const commentedLineBreak = (comment: string) => () => `# ${comment}\n`


const stages: ((image: System) => string)[] = [
    mkImageHeaders,
    commentedLineBreak("Add image metadata"),
    mkImageLabels,
    commentedLineBreak("Add loose channels (if any)"),
    LooseChannelsBuildStage,
    lineBreak,
    commentedLineBreak("Copy stage"),
    COPYStages,
    lineBreak,
    commentedLineBreak("Install phase"),
    customBuiltBinaries,
    lineBreak,
    RepositoriesBuildStage,
    lineBreak,
    buildRemovePkgs,
    lineBreak,
    buildAddPkgs,
    commentedLineBreak("Execution stage"),
    ExecStage,
    lineBreak,
    commentedLineBreak("Add GSchemas"),
    GSchemaBuildStage,
    commentedLineBreak("Add GNOME Extensions (if any)"),
    GnomeExtensionBuildStage,
    commentedLineBreak("Commit all changes"),
    () => { return `RUN ${Commit()}` }
]


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
        let baseString = ""
        stages.forEach(stage => {
            baseString += stage(this.image)
        })
        return baseString
    }
}