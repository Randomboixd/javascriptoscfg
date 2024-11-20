import type Channels from "../types/Channels";
import type LooseChannel from "../types/LooseChannel";
import crypto from "crypto";

// From stack overflow: https://stackoverflow.com/a/1349426
function randomString(length: number) {
    let result = '';
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    const charactersLength = characters.length;
    let counter = 0;
    while (counter < length) {
      result += characters.charAt(Math.floor(Math.random() * charactersLength));
      counter += 1;
    }
    return result;
}


export default (channelName: Channels, version?: string | number): LooseChannel => {
    return {
        channelRandomString: randomString(70),
        channel: channelName,
        version: version ? version : "latest"
    }
}