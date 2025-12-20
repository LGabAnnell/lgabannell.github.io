# Configuring VSCode for linux kernel development

Add `export kernelVersion="$(uname -r)"` to `~/.profile` and `~/.bashrc`.

Install the kernel development packages to get the kernel source.

In vscode cpp configuration, use this

```
{
    "configurations": [
        {
            "name": "Linux",
            "includePath": [
                "${workspaceFolder}/**/**",
                "/usr/src/kernels/${kernelVersion}/include/",
                "/usr/src/kernels/${kernelVersion}/arch/x86/include/",
                "/usr/src/kernels/${kernelVersion}/arch/x86/include/generated/"
            ],
            "defines": [
                "KBUILD_MODNAME",
                "__KERNEL__"
            ],
            "compilerPath": "/usr/bin/clang",
            "cStandard": "c99",
            "cppStandard": "c++17",
            "intelliSenseMode": "linux-clang-x64"
        }
    ],
    "version": 4
}
```