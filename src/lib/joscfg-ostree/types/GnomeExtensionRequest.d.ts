
// Record's string seems to be the GNOME Version. and then the latest package?
export type ShellVersionMap = Record<string, {
    pk: number, // Pk for Package?
    version: number // NOT THE GNOME VERSION!
}>

type GnomeExtensionRequest = {
    uuid: string,
    name: string,
    creator: string,
    creator_url: string,
    pk: number, //PK FIRE!
    description: string,
    link: string,
    icon: string,
    screenshot: string,
    shell_version_map: ShellVersionMap,
    downloads: number,
    url: string,
    donation_urls: string[]
}

export default GnomeExtensionRequest