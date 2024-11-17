# Javascript configures your OS!

JavascriptOSConfig is a set of (currently non existent) utilities to build ostree images, and distrobox/toolbx images using
your best nightmare, Javascript! ... actually typescript sorry.

Currently everything here is a concept. While `Builder.ts` can generate a Containerfile (only a string though), i am not guaranteeing that it will make anything that works, as currently i am just going through a lot of google pages, while trying to understand what i am even doing.

## Licenses and things.
This project is primarily licensed under the MIT License. Portions of this codebase are derived from the ublue-os/ubuntu repository, which is licensed under the Apache License 2.0. For more information, see the `LICENSE` and `LICENSE-APACHE` files.

I am not really good at licenses though, as i am not a lawyer. if i did something wrong, make a pull request.

Here is what i changed:
1. **Changing names**:
   - Original: `push-ghcr`
   - Updated to: `makeContainers`
   - Reason: Reflects the expanded scope of the job.

2. **Scheduled Time**:
   - Original: `cron: "20 03 * * *"`
   - Updated to: `cron: "00 06 * * *"`
   - Reason: Apparently this is 20minutes after ublue images are built.

3. **Additional dependencies and things.**:
   - Added steps to install `bun` and project dependencies.

4. **Metadata changes**:
   - Removed static metadata labels in favor of dynamic values generated from `Examine-(value).ts` files.

If you want to see the EXACT changes. I invite you to look at the `.github/workflow/make-images.yml` file. I marked EVERY modification there. Or atleast i hope i got all.

Remember i am **NOT** a lawyer, and my knowledge in licenses is basically: "oooh mit license. wow. why not" and i am certain that i missed a little detail. Please make an issue or pull request if i did.

## Some more examples

Let's say that we want a system that has `distrobox`, `fastfetch`, and `waydroid` installed. You would have two ways to do it:

- You can probably find someone's github repo for their own image, and fork it and modify it.
- Or you could have used blue-build which requires you to write YAML and things like that.

No hate towards these but. Both aren't the easiest to get into... This project kinda tries to simplify the process.

Ok so you want that image or what? Simply create a folder called `systems` and create a typescript file there with these contents:
```ts
import Package from "../src/lib/joscfg-ostree/Package";
import System from "../src/lib/joscfg-ostree/System";


export const system = new System()
    .setChannel("ghcr.io/ublue-os/silverblue-main", 40)
    .setPublishedImageConfig("testimage", "The test image provided by javascriptosconfig's repo. Not for daily use.")
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
.setPublishedImageConfig("testimage", "The test image provided by javascriptosconfig's repo. Not for daily use.")
```

This configures the published image config. To be honest i don't know what this does exactly in the image, but we use up the image name and the description in some parts so i recommend you fill it out.

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

## A Derivation with custom shell scripts.

NixOS has a pretty nice thing called `pkgs.writeShellScriptBin`. Need a shell script as a package? You got it! 

Well, this tool can do the same thing... Pretty much almost the exact same.

Here take this modified file:
```ts
import Package from "../src/lib/joscfg-ostree/helpers/Package";
import writeShellScriptBin from "../src/lib/joscfg-ostree/helpers/writeShellScriptBin";
import System from "../src/lib/joscfg-ostree/System";


export const system = new System()
    .setChannel("ghcr.io/ublue-os/silverblue-main", "40")
    .setPublishedImageConfig("testimage", "The test image provided by javascriptosconfig's repo. Not for daily use.")
    .makeDerivation(d => d
        .addPackages([
            Package("fastfetch"),

            writeShellScriptBin('test', 
                `
                echo 'hello world'
                `
            )
        ])
        .applyDerivation()
    )
```

You notice that writeShellScriptBin? It works almost the same as the nix version. First parameter is the filename, second is the content.

writeShellScriptBin packages are put into `/usr/bin/` so it is available for EVERY user... So yeah do whatever you want with this.