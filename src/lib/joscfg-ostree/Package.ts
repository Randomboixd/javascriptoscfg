import type Package from "./types/Package"

export default (name: string): Package => {
    return {
        name,
        packageType: { type: "rpm-ostree", method: "install" }
    }
}