import type System from "../System";

export default (image: System) => {
    
    const COPYInstructions = image.COPY

    if (COPYInstructions.length === 0) {
        return "# -- No need to copy nothing nowhere. -- "
    }

    let copyInString: string = ""

    COPYInstructions.forEach(copy => {
        copyInString += `# Copy ${copy.channel ? '(From loose channel)': ''} ${copy.from} to ${copy.to}\nCOPY ${copy.channel ? `--from=${copy.channel} ` : ' '}${copy.from} ${copy.to}\n`
    })

    return copyInString
}