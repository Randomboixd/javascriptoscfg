import type Package from "./types/Package";
import type System from "./System";


export default class Derivation {
    private image: System
    private packages: Package[] = []

    constructor(image: System) {
        this.image = image
    }

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

    public applyDerivation() {
        this.packages.forEach(p => {
            const pNameWithSameName = this.image.packages.filter(ip => ip.name === p.name)
            if (pNameWithSameName.length > 0) {
                return
            }

            this.image.packages.push(p)
        })
    }
}