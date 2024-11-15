import type System from "../System";

export default (image: System) => {
    
    const COPYInstructions = image.COPY

    if (COPYInstructions.length === 0) {
        return "# -- No need to copy nothing nowhere. -- "
    }

    let copyInString: string = ""

    COPYInstructions.forEach(copy => {
        copyInString += `# Copy ${copy.from} to ${copy.to}\nCOPY ${copy.from} ${copy.to}\n`
    })

    return copyInString
}