import type System from "../System";

export default (image: System) => {
    
    if (image.gnomeExtensions.length === 0) {
        return "# -- No GNOME Extensions will be copied. -- #"
    }

    let copyString: string = ""

    image.gnomeExtensions.forEach(ex => {
        console.log(ex)
        copyString += `COPY ${ex.src} /usr/share/gnome-shell/extensions/\nRUN tree /usr/share/gnome-shell/extensions/\nRUN chmod -R +r /usr/share/gnome-shell/extensions/${ex.uuid}/\n`
    })

    return copyString
}