
type Channels =
    | "ghcr.io/ublue-os/silverblue-main"
    | "ghcr.io/ublue-os/kinoite-main"
    | "ghcr.io/ublue-os/base-main"
    | "ghcr.io/ublue-os/sericea-main"
    | "ghcr.io/ublue-os/onyx-main"
    | "ghcr.io/ublue-os/lazurite-main"
    | ( string & {} )

export type Versions = string | number

export default Channels