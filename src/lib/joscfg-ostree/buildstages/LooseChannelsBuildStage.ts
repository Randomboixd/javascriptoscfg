import type System from "../System";

export default (image: System) => {
    if (image.looseChannels.length === 0) {
        return "# No loose Channels will be added."
    }

    let importedLooseChannels: string = ""

    image.looseChannels.forEach(lc => {
        importedLooseChannels += `FROM ${lc.channel}:${lc.version} AS ${lc.channelRandomString}\n`
    })

    return importedLooseChannels
}