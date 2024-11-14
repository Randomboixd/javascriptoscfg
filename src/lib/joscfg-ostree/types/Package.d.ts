
export type PackageTypes =
    | { type: "rpm-ostree", method: "install" | "remove" }
    | { type: "binary", src: string }

type Package = {
    name: string,
    packageType: PackageTypes
}

export default Package