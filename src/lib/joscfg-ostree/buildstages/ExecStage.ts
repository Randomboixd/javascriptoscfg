import type System from "../System";

export default (image: System) => {
    
    const run = image.executeCommands

    if (run.length === 0) {
        return "# -- Looks like we don't need to execute anything! -- "
    }

    let commandStrings: string = ""

    run.forEach(command => {
        commandStrings += `# Execute ${command}\nRUN ${command}\n`
    })

    return commandStrings
}