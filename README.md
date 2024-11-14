# Javascript configures your OS!

JavascriptOSConfig is a set of (currently non existent) utilities to build ostree images, and distrobox/toolbx images using
your best nightmare, Javascript! ... actually typescript sorry.

Currently everything here is a concept. While `Builder.ts` can generate a Containerfile (only a string though), i am not guaranteeing that it will make anything that works, as currently i am just going through a lot of google pages, while trying to understand what i am even doing.

## Some more examples

Let's say that we want a system that has `distrobox`, `fastfetch`, and `waydroid` installed. You would have two ways to do it:

- You can probably find someone's github repo for their own image, and fork it and modify it.
- Or you could have used blue-build which requires you to write YAML and things like that.

No hate towards these but. Both aren't the easiest to get into... This project kinda tries to simplify the process.

Ok so you want that image or what? Simply create a folder called `systems` and create a typescript file there.

Aaaaaand with this code:
```ts
import Package from "../src/lib/joscfg-ostree/Package";
import System from "../src/lib/joscfg-ostree/System";


export const system = new System()
    .setChannel("ghcr.io/ublue-os/silverblue-main", 40)
    .makeDerivation(d => d
        .addPackages([
            Package("distrobox"),
            Package("fastfetch"),
            Package("waydroid")
        ])
        .applyDerivation()
    )
```

Let me break down what's happening here.

```ts
export const system = new System()
```

This part simply exports a variable called `system`. During build, the project will look for this variable.

```ts
.setChannel("ghcr.io/ublue-os/silverblue-main", 40)
```

This part sets the "channel" of the image. Or as you may know it, the base image. The first part is required, as it's the url for the container. The second one is optional and defaults to `"latest"`. This can be a string or a number, and this is the version of the image.

In english this sets the base image to `silverblue-main` and uses version 40. This is the exact same as saying `ghcr.io/ublue-os/silverblue-main:40`!

```ts
.makeDerivation(d => d
        .addPackages([
            Package("distrobox"),
            Package("fastfetch"),
            Package("waydroid")
        ])
        .applyDerivation()
)
```

This is a lot i know but. first.

Modifications to the system are done through Derivations. It's called that because it's a difference from the usual image, and also because nix uses it and i used nixos for a long time and i think it's cool.

The .addPackages part expects an array of Package objects. We have a few helpers like `Package()` to add or `RemovePackage()` to remove.

Then finally we apply the derivation. After this, the `this` object is no longer returned so you can't modify it anymore.

You can also put derivations into seperate files, and simply import them. Just use the `Derivation` class as the type!

This is the end of the concept... and i'll try to make this project a reality.