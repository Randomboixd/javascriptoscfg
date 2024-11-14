import buildAddPkgs from "./buildstages/buildAddPkgs";
import buildRemovePkgs from "./buildstages/buildRemovePkgs";
import Commit from "./buildstages/Commit";
import mkImageHeaders from "./buildstages/mkImageHeaders";
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
            ? `${buildAddPkgs(this.image)} && \\`
            : `echo "No packages will be installed." && \\`
    
        return `${imageHeaders}\n${removePkgsCommand}\n${addPkgsCommand}\n${Commit()}`.trim();
    }
}