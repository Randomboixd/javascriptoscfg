> [!WARNING]
> This project is no longer being maintained... Or atleast isn't going to be maintained for a while.
> 
> I switched to arch linux, meaning i don't have a rpm-ostree system to try everything on.
>
> It doesn't mean this doesn't work though! The project works, and builds successfully. You can go ahead and follow the instructions below and get a custom rpm-ostree image!
>
> Have fun! And remember when you create a clone of the template, you are the one essentially maintaining it now (not that you need to do a lot though)!

# Javascript OS Config

*"I want to have my operating system image created by typescript!" - Said no one*

## Purpose of this project

You found this repo! Well it's name explains what this thing does fairly well, but here is exactly what this does:

This project is for creating declarative `rpm-ostree` system images using typescript instead of having to manually write recipe files, yaml, or containerfiles yourself!

I made this project as an alternative to blue-build since i don't like yaml. Now at this point you might be saying: "Why don't just use NixOS?". But i did. i did use nix, but i'd still like to be closer to a fedora install. since gnome seems to work better there.

Also since you're writing typescript, you could do things that yaml can't. Like send network requests to get a zip file and write it to disk... All while avoiding that thing we call `/usr/bin/bash`.

Also this uses bun btw.

## Licenses.

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

If you want to see the EXACT changes. I invite you to look at the `.github/workflows/build-images.yml` file. I marked EVERY modification there. Or atleast i hope i got all.

Remember i am **NOT** a lawyer, and my knowledge in licenses is basically: "oooh mit license. wow. why not" and i am certain that i missed a little detail. Please make an issue or pull request if i did.

## Getting started

### Getting the repository.
This project is a template. You can literally get started by clicking "Use this template". Then you can create either a **private** or a **public** repository. Each has their own advantages and disadvantages. Let me list them.

**A Private Repository:**
- Requires you to make the built containers public so `rpm-ostree` can grab it. You can do so by going to *Packages > (Image name) > Package settings > Danger Zone > Change package visibility*
- Uses your account's actions quota. (*You have 2000 minutes on a free account which is roughly 13 days of build time.*)
    
    - If you are **worried** about this project using up all your quota remember these things:
        
        - This doesn't apply if your repository is **public**. Actions is **free for all** on **public** repos.

        - Each build takes around 3 minutes. But this varies depending on how many packages/files you add.

        - This project has a cron job to rebuild the image every day at **06:00 UTC**. A month has around **30 days**. Lets say our build takes **3 minutes**. If everything is right that means we use only around **90 minutes** of your precious Actions time... Of course **this varies** from amount of packages. As i said.

**A public repository:**
- Your images can be seen by **anyone** on github.
- Not only can they see it, but they can **rebase** to it.
- Actions time is **free**! Yay!

Your choice on which option you pick. I recommend going with public!

### Setting up signing

By default your containers **AREN'T** signed!

And just to scare you into signing your containers, the first Google result literally says if you don't sign a container... **you're in for a bad time**.

Let's just say we have joe. They rebase to your image, thinking it's completely legit. then KA

![A gif of a bomb from Keep talking and nobody explodes? I think](https://media1.tenor.com/m/KEtOFTCtAFsAAAAd/bobm-jumpscare.gif)


[BOOM There goes your system, watch it crumble, feel the power.](https://www.youtube.com/watch?v=Q7HmGf81y5M) *(sorry)*

During download it was somehow tampered with by **EVIL** joe and he added a layer that actually uninstalls your entire desktop environment and replaces it with DOOM... and likely encrypts your home folder. just in case. and maybe deletes your bootloader. and replaces it with nyan cat.

"It is not so good" - *my classmate who barely knows english*

Terrible example i know. But yeah signing allows us to say nuh uh! and it's actually quite simple to do aswell!

First of all, get cosign. Use your package manager or something. Nix also works (`nix-shell -p cosign`)

Then, type in `cosign generate-key-pair`. now DO NOT set your password! Leave it empty.

Now see that cosign.key? OPEN IT RIGHT NOW AND COPY IT'S CONTENTS THEN DELETE IT IMMIDIATELY!

Now go into your github repository, go to settings, Secrets and variables, Actions, New repository secret, and create a secret called `SIGN`. Paste the contents of that key in there.

Congrats! You just set up signing! Now commit that cosign.pub and let it override mine. That's it! You're now signing containers!

### Declaring a "System"

Now when you created your clone of the template, you got one system in the systems folder, that's called `base.ts`!

It aims to demonstrate what it can do. You can delete that and follow along.

So Systems are an instance of the System class by `joscfg-ostree`. You make a new instance of them, and then apply Derivations on top of it to modify the system.

Let me get into the details.

```ts
import System from "../src/lib/joscfg-ostree/System";


export const system = new System()
   .setChannel("ghcr.io/ublue-os/silverblue-main", "41")
   .setPublishedImageConfig("my-first-image", "Hello, World!")
```

This file **exports** *([Read MDN](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/export))* a **constant** system variable *([Read MDN](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/const))* called system.

This is then grabbed by the `joscfg-ostree` Builder to make a Containerfile.

Basically, tells the builder that this is a system.

We then use the .setChannel() with the channel that we want to use. 


> [!NOTE]
> A channel in javascript os config is a image that we are building upon. Your IDE Should recommend a few ones, but you are free to base your image on top of anything!

We also use the second parameter to select 41 as the version. This is **COMPLETELY** optional. Just leave it and it will use the absolute latest version.

> [!WARNING]
> If you are going to stick with an older image, remember that Fedora supports releases for approx 13 months. And since they release a new one every 6 months, meaning if you base your release on Fedora 40 for example, you'll get package updates till Fedora 42 and one more month. Keep up with updates if possible. If you don't think you can handle this, use "latest"

Then we configure the **published image configuration**. The first parameter is the **image name**, as it's going to be published on the **GHCR** (Github Container Registry). Then the **description**, which can be mostly anything... just explain your image in a few words. That should do it!

Congratulations! You just created your own imag- oh wait... right we have to add it to our workflows.

In your IDE, find the `.github` folder, and then enter `workflows`. Open that build-images.yml file and look for something like:

```yaml
systems:
   - base.ts
```

Here is where we mention our system. Let's say we named our system's **FILENAME** to `first.ts`, we gotta add first.ts to the array. By creating a new line and adding it like `- first.ts`. Also let's remove `- base.ts` since we don't wanna build a non existent system (Recap: We just deleted it. if you remember)!

> [!CAUTION]
> Identation matters! Especially in YAML! Use tabs. It takes **5** tabs to reach systems and add a new entry!

> [!CAUTION]
> Additionally, Javascript OS Config expects systems to be in systems/ **NO MATTER WHAT.** There is no arguing with the builder! So you don't need to write a large paragraph to the system file. Just enter it's filename and call it a day!

Now we can truly create image! Add both the build-images.yml and system to git, and commit them, then push them.

Now visit github workflows, click the workflow and pray that it builds... if it did...

🎉 **YOU DID IT!** 🎉

Now you can rebase to it by running:
```bash
rpm-ostree rebase unverified-ostree-registry:ghcr.io/(Your github username)/(name of your container as defined in setPublishedImageConfig):(the version number you are using for your own image. Since this uses fedora 41, you should use 41)
```
> [!WARNING]
> If your github repository is private, then you must manually set the container package to public for `rpm-ostree` to see it.


You should have a command like this:

```bash
rpm-ostree rebase unverified-ostree-registry:ghcr.io/randomboixd/testimage:40
```

Do so and you may recieve a prompt to enter your password. do so!

and congrats! You are now running your own container... well you will once you restart.

... But we literally just copied fedora silverblue 41... ugh that's not too special.

### Deriving from the base channel using Derivations

> [!NOTE]
> While you can technically modify the lists itself in the System instance, Derivations allow you reuse parts in other configurations. It is recommended that you use Derivations.

Derivations allow you to change how your system will work. People using your derivation will recieve a result simular to your own build, of course not the exact same *(if you're looking for that though, try [NixOS instead?](https://nixos.org/))* because you might not use the same channel as the other user.

Derivations can be made by executing the `.makeDerivation()` method on a System instance, and passing in a function that executes methods of the Derivation class, then finally calls `.applyDerivation()`, closing the Derivation.

For this part, i **recommend** you read [Arrow Functions on Mozilla Web Docs](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Functions/Arrow_functions), because this may get confusing.

```ts
export const system = new System()
   .setChannel("ghcr.io/ublue-os/silverblue-main", "40")
   .setPublishedImageConfig("testimage", "The test image provided by javascriptosconfig's repo. Not for daily use.")
   .makeDerivation(d => d
      .applyDerivation()
   )
```

This? Is a derivation that does **ABSOLUTELY** Nothing. Let's make it do something!

#### Adding packages via Derivations

**Packages!** You usually **don't want to overlay** them on your system, because upgrades will take ages... But what if you could? Instead of you manually layering the packages on your system, a GH Action will do it for you, in under 5 minutes if it's a small package! Then you download it and boom the package is **THERE**!

Let's grab the example above, and say, we want ~~neofetch~~ i mean fastfetch present on our system!

```ts
export const system = new System()
   .setChannel("ghcr.io/ublue-os/silverblue-main", "40")
   .setPublishedImageConfig("testimage", "The test image provided by javascriptosconfig's repo. Not for daily use.")
   .makeDerivation(d => d
      .addPackages([
         Package("fastfetch")
      ])
      .applyDerivation()
   )
```

Before `.applyDerivation()` We added a call to `.addPackages()`, where we provided an Array containing a call to the `Package()` helper!

Under the hood, `Package()` generated an object like this:
```ts
{
   name: 'fastfetch',
   packageType: { type: "rpm-ostree", method: "install" }
}
```

You can **technically** go and replace `fastfetch` here and use that in this array, and it WOULD work, but the `Package()` helper is there for a reason. Use this to install packages if possible.

> [!TIP]
> If you base your image on an ublue image, you should also be able to install kernel modules from ublue-os/akmods. No need to look through copr! Example if you want xpadneo, you should be able to get it with the name `xpadneo-kmod-common`. For more information on what ublue builds, check out https://github.com/ublue-os/akmods!

#### Adding custom repositories

> [!WARNING]
> the `Repository()` helper, as shown here adds repos to your system from an URL that ends with .repo. This was designed for use with copr repos, and other repos that have an install command that curls a .repo file into `/etc/yum.repos.d`. **WARNING: IF YOU DON'T TRUST THE SOURCE OF THE .repo FILE THEN YOU SHOULDN'T ADD IT!**

> [!IMPORTANT]
> The `Repository()` helper cannot add custom keys. If (for example) you want to install VSCode (Which you should do in a toolbox instead), then use the .execute() method on makeDerivation, and then install the package within the .execute also.

Let's say you want **tailscale**. Usually their own repository releases packages a bit more quickly. You can use the `Repository()` helper to configure their repository, and then simply install tailscale!

Here is an example on how you would use `Repository()`

```ts
export const system = new System()
   .setChannel("ghcr.io/ublue-os/silverblue-main", "40")
   .setPublishedImageConfig("testimage", "The test image provided by javascriptosconfig's repo. Not for daily use.")
   .makeDerivation(d => d
      .addPackages([
         Repository("https://pkgs.tailscale.com/stable/fedora/39/tailscale.repo"),
         Package("tailscale")
      ])
      .applyDerivation()
   )
```

it doesn't matter where you drop a `Repository()` helper call. In the end, it's going to be added even before package installations happen. So you could even drop it at the end of the array, it will still be added!

#### Writing custom shell scripts for use globally.

> [!CAUTION]
> `writeShellScriptBin() has a weird bug that when you try to execute it, it will do nothing, but will execute if called using /usr/bin/(shellscript name)... This will likely get fixed sometime.

In `.addPackages()` we can use the `writeShellScriptBin()` helper to create a custom shell script, and make it available on the system.

Just like the NixOS version, the first parameter should be the script's name, and the last is the code. Here is an example:

```ts
export const system = new System()
   .setChannel("ghcr.io/ublue-os/silverblue-main", "40")
   .setPublishedImageConfig("testimage", "The test image provided by javascriptosconfig's repo. Not for daily use.")
   .makeDerivation(d => d
      .addPackages([
         writeShellScriptBin('helloworld', `
         echo "wassup"
         `)
      ])
      .applyDerivation()
   )
```

It's this easy!

#### End examples

You can copy files from the project directory into the container, you can preinstall custom GNOME
Extensions! You can even write GSchema overrides without even leaving typescript!

For more examples on what you can do with derivations, check your docs/ folder.

> [!WARNING]
> Since currently the project is still incomplete, and i just decided to release it to the public you may need to pull from the template repository often to recieve updates.
