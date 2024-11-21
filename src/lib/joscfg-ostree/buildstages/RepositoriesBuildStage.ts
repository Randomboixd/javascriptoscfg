import type System from "../System";

export default (image: System) => {
    const repos = image.packages.filter(r => r.packageType.type === 'rpm-ostree-repo')

    if (repos.length === 0) {
        return "# -- Looks like we don't need to add any repos! -- "
    }

    let reposString: string = ""

    repos.forEach(command => {
        if (command.packageType.type !== "rpm-ostree-repo") return
        reposString += `# Add repo ${command.name}\nRUN wget -O /etc/yum.repos.d/${command.name} ${command.packageType.url}\n`
    })

    return reposString
}