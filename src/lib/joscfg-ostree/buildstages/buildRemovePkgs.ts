import type System from "../System";

export default (image: System) => {
    
    const removedPackages = image.packages.filter(p => p.packageType.type === "rpm-ostree" && p.packageType.method === "remove")
    let removedPackagesString: string = ""
    removedPackages.forEach(p => {
        removedPackagesString += `${p.name} `
    })

    return `rpm-ostree override remove ${removedPackagesString}`
}