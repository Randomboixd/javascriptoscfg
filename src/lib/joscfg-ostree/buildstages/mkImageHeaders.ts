import type System from "../System";

export default (image: System): string => {
    const reader = image.getReader()
    return `FROM ${reader.fullChannelBaseURI}\nCOPY etc /etc\nCOPY ublue-firstboot /usr/bin`
}