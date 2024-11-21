import type Package from "../types/Package"


export default (dotRepoURL: string): Package => {

    const dotRepo = new URL(dotRepoURL)
    
    if (!dotRepo.href.endsWith(".repo")) {
        throw new Error(`${dotRepoURL} isn't a valid repo (You must provide an URL to a .repo. Like a copr repo)`)
    }

    const fileNameParts = dotRepo.pathname.split("/")
    const fileName = fileNameParts[fileNameParts.length -1]

    return {
        name: fileName,
        packageType: { type: "rpm-ostree-repo", url: dotRepoURL }
    }
}