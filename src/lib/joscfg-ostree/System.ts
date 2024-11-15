import Derivation from "./Derivation";
import type Package from "./types/Package";
import type Channels from "./types/Channels";
import type Published from "./types/Published";
import type { Versions } from "./types/Channels";

export default class System {

    private channel: Channels = "ghcr.io/ublue-os/silverblue-main"
    private channelBaseName: string = "silverblue-main"
    private channelVersion: string | number = 40
    private published: Published = {
        image_name: "base",
        image_description: "An unmodified JOSCFG-OSTREE System."
    }

    public packages: Package[] = []
    public COPY: { from: string, to: string }[] = []
    public executeCommands: string[] = []

    constructor() {

    }

    public getReader() {
        return {
            channel: this.channel,
            channelBaseName: this.channelBaseName,
            fullChannelBaseURI: `${this.channel}:${this.channelVersion}`,
            channelVersion: this.channelVersion,
            publish: this.published,
        }
    }

    public setChannel(channelString: Channels, version?: Versions): System {
        this.channel = channelString
        this.channelVersion = version ? version : "latest"

        const channelNameSegments = channelString.split('/')
        this.channelBaseName = channelNameSegments[channelNameSegments.length - 1]
        return this
    }

    public makeDerivation(derivationCfg: (input: Derivation) => void): System {
        const derivation = new Derivation(this)
        derivationCfg(derivation)
        return this
    }

    public setPublishedImageConfig(name: string, description: string): System {
        this.published = {
            image_name: name,
            image_description: description
        }
        return this
    }
}