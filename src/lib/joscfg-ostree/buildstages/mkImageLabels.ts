import type System from "../System";

export default (image: System) => {
    const reader = image.getReader()
    return `LABEL org.opencontainers.image.title="${reader.publish.image_name}"\nLABEL org.opencontainers.image.description="${reader.publish.image_description}"\n`
}