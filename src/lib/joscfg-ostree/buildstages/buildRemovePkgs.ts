import type System from "../System";

export default (image: System) => {
    
    const removedPackages = image.packages.filter(p => p.packageType.type === "rpm-ostree" && p.packageType.method === "remove")

    if (removedPackages.length === 0) {
        return "# -- No packages will be removed from the base image. --"
    }

    let removedPackagesString: string = ""
    removedPackages.forEach(p => {
        removedPackagesString += `${p.name} `
    })

    return `RUN rpm-ostree override remove ${removedPackagesString}`
}