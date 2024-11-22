import type System from "../System"

export default (image: System) => {
    
    const addedPackages = image.packages.filter(p => p.packageType.type === "rpm-ostree" && p.packageType.method === "install")

    if (addedPackages.length === 0) {
        return "# -- No packages will be installed! --"
    } 

    let addedPackagesString: string = ""
    addedPackages.forEach(p => {
        addedPackagesString += `${p.name} `
    })

    return `RUN rpm-ostree install ${addedPackagesString}`
}