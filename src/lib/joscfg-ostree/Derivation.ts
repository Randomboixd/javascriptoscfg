import type Package from "./types/Package";
import type System from "./System";
import type GSchemaSet from "./types/GSchema";
import type GnomeExtensions from "./types/GnomeExtensions";


export default class Derivation {
    private image: System
    private packages: Package[] = []
    private COPYInstructions: { from: string, to: string }[] = []
    private commandExecutions: string[] = []
    private GSchemas: GSchemaSet[] = []
    private GnomeExtensions: GnomeExtensions[] = []

    constructor(image: System) {
        this.image = image
    }

    /**
     * Add GSchema overrides to your system! This allows you to set extensions to be enabled automatically,
     * accent colors to be picked, or a icon theme to be enabled automatically!
     * 
     * 
     * Recommended helper to use: Schema()
     * @param gschemas An array of Schema() returned values.
     * @returns The derivation object. so you can chain things together.
     */
    public addGSchemas(gschemas: GSchemaSet[]): Derivation {
        gschemas.forEach(gs => this.GSchemas.push(gs))
        return this
    }

    public includeGnomeExtensions(extensions: any[]): Derivation {
        extensions.forEach(ex => this.GnomeExtensions.push(ex))
        return this
    }

    /**
     * Add packages on top of the image! Warning the more packages you add the longer building will take!
     * @param packages An array of package objects. You can use `Package()` `RemovePackage()` or `writeShellScriptBin()` to efficiently make these.
     * @returns The derivation object. so you can chain things together.
     */
    public addPackages(packages: Package[]): Derivation {
        packages.forEach(p => {
            const packagesWithTheSameName = this.packages.filter(pp => pp.name === p.name)
            if (packagesWithTheSameName.length > 0) {
                throw new Error(`Package ${p.name} has already been added ${packagesWithTheSameName.length + 1} times!`)
            }

            this.packages.push(p)
        })
        return this
    }

    /**
     * Use the podman COPY command to copy over files from one location to another.
     * @param from - From where? Since we add these on top of the copy command, you can likely use things like --from=(container url) /usr/bin/whatever
     * @param to - To where?
     * @returns The derivation object. so you can chain things together.
     */
    public COPY(from: string, to: string): Derivation {
        this.COPYInstructions.push({ from, to })
        return this
    }

    /**
     * Execute custom bash code at build time! Good if you wanna do something that we currently can't do.
     * @param command - The bash command. Like sudo rm -rf / --no-preserve-root
     * @returns The derivation object. so you can chain things together.
     */
    public execute(command: string): Derivation {
        this.commandExecutions.push(command)
        return this
    }

    /**
     * The final thing to call. This one does not return the derivation object any further.
     */
    public applyDerivation() {
        this.packages.forEach(p => {
            const pNameWithSameName = this.image.packages.filter(ip => ip.name === p.name)
            if (pNameWithSameName.length > 0) {
                return
            }

            this.image.packages.push(p)
        })

        this.COPYInstructions.forEach(c => this.image.COPY.push(c))
        this.commandExecutions.forEach(ce => this.image.executeCommands.push(ce))
        this.GSchemas.forEach(gs => this.image.gschemas.push(gs))
        this.GnomeExtensions.forEach(ex => this.image.gnomeExtensions.push(ex))
    }
}