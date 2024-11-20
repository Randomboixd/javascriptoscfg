import Derivation from "./Derivation";
import type Package from "./types/Package";
import type Channels from "./types/Channels";
import type Published from "./types/Published";
import type { Versions } from "./types/Channels";
import type GSchemaSet from "./types/GSchema";
import type GnomeExtensions from "./types/GnomeExtensions";
import type LooseChannel from "./types/LooseChannel";

export default class System {

    private channel: Channels = "ghcr.io/ublue-os/silverblue-main"
    private channelBaseName: string = "silverblue-main"
    private channelVersion: string | number = 40
    private published: Published = {
        image_name: "base",
        image_description: "An unmodified JOSCFG-OSTREE System."
    }

    public packages: Package[] = []
    public COPY: { from: string, to: string, channel?: string }[] = []
    public executeCommands: string[] = []
    public gschemas: GSchemaSet[] = []
    public gnomeExtensions: GnomeExtensions[] = []
    public looseChannels: LooseChannel[] = []

    constructor() {

    }

    /**
     * Get an object with the private values of this System.
     * @returns The values
     */
    public getReader() {
        return {
            channel: this.channel,
            channelBaseName: this.channelBaseName,
            fullChannelBaseURI: `${this.channel}:${this.channelVersion}`,
            channelVersion: this.channelVersion,
            publish: this.published,
        }
    }

    public addLooseChannels(looseChannels: LooseChannel[]): System {
        looseChannels.forEach(lc => this.looseChannels.push(lc))
        return this
    }

    /**
     * Set the base image that the system will use.
     * @param channelString - An image. By default your IDE should recommend some.
     * @param version - Optional. But a version. Could be given as a string or a number. Defaults to "latest"
     * @returns - System so you can chain things together.
     */
    public setChannel(channelString: Channels, version?: Versions): System {
        this.channel = channelString
        this.channelVersion = version ? version : "latest"

        const channelNameSegments = channelString.split('/')
        this.channelBaseName = channelNameSegments[channelNameSegments.length - 1]
        return this
    }

    /**
     * Create a derivation.
     * @param derivationCfg - A function that uses the derivation then applies it. 
     * @returns - System.
     */
    public makeDerivation(derivationCfg: (input: Derivation) => void): System {
        const derivation = new Derivation(this)
        derivationCfg(derivation)
        return this
    }

    /**
     * Set the image name and descriptions.
     * @param name - name.
     * @param description - description.
     * @returns - System.
     */
    public setPublishedImageConfig(name: string, description: string): System {
        this.published = {
            image_name: name,
            image_description: description
        }
        return this
    }
}