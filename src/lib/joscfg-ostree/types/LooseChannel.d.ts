import type Channels from "./Channels"

type LooseChannel = {
    channelRandomString: string,
    channel: Channels,
    version: string | number
}

export default LooseChannel