cleanup:
    rm -r ./temp

testBuild sysName:
    bun src/lib/joscfg-ostree-make/makeFromParam.ts --fileName {{ sysName }}

build sysName:
    JOS_READY='true' bun src/lib/joscfg-ostree-make/makeFromParam.ts --fileName {{ sysName }}