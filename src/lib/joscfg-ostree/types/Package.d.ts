
export type PackageTypes =
    | { type: "rpm-ostree", method: "install" | "remove" }
    | { type: "binary", src: string }
    | { type: "rpm-ostree-repo", url: string }

type Package = {
    name: string,
    packageType: PackageTypes
}

export default Package