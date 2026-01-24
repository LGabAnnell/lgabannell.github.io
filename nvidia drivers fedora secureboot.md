To make the nvidia drivers work on fedora with secureboot follow the instructions here https://rpmfusion.org/Howto/Secure%20Boot?highlight=%28%5CbCategoryHowto%5Cb%29

Once that is done, just run `sudo dnf install akmod-nvidia`.

wait for the module to build after the install

reboot

done
