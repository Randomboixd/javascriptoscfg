# Javascript OS Config

*"I want to have my operating system image created by typescript!" - Said no one*

## Purpose of this project

You found this repo! Well it's name explains what this thing does fairly well, but here is exactly what this does:

This project is for creating declarative `rpm-ostree` system images using typescript instead of having to manually write recipe files, yaml, or containerfiles yourself!

I made this project as an alternative to blue-build since i don't like yaml. Now at this point you might be saying: "Why don't just use NixOS?". But i did. i did use nix, but i'd still like to be closer to a fedora install. since gnome seems to work better there.

Also since you're writing typescript, you could do things that yaml can't. Like send network requests to get a zip file and write it to disk... All while avoiding that thing we call `/usr/bin/bash`.

Also this uses bun btw.

## Licenses.

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

### to be continued

Currently this readme is still in the making.