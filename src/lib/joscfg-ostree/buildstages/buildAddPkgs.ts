import type System from "../System"

export default (image: System) => {
    
    const addedPackages = image.packages.filter(p => p.packageType.type === "rpm-ostree" && p.packageType.method === "install")
    let addedPackagesString: string = ""
    addedPackages.forEach(p => {
        addedPackagesString += `${p.name} `
    })

    return `rpm-ostree install ${addedPackagesString}`
}