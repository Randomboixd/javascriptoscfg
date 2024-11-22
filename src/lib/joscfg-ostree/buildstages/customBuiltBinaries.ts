import type System from "../System";

export default (image: System) => {
    const packages = image.packages

    const customPkgs = packages.filter(p => p.packageType.type === 'binary')
    if (customPkgs.length === 0) {
        return "# -- Looks like we don't have custom packages! -- "
    }

    let result: string = ""
    customPkgs.forEach(p => {
        if (p.packageType.type !== "binary") return
        result += `# Copy custom binary '${p.name}' to /usr/bin\nCOPY ${p.packageType.src} /usr/local/bin/\nRUN chmod +rx /usr/local/bin/${p.name}\n`
    })
    return result
}