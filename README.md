# Reboot Menu
A GNOME shell extension to show systemd-boot boot entries in a menu to quickly reboot to another boot entry.
Useful for people who like to hide their boot menu and hate to spam Escape to make the computer show it.

Right now, the extension shows a zenity menu comprising of all the active boot entries available in systemd-boot.
On pressing OK in zenity, the extension reboots to the selected boot entry using `systemctl`.

## Compatibility and support
This extension is compatible with gnome-shell versions 40, 41 and 42 for sure and is developed on GNOME 42.

It is probably compatible with 3.38 as that's when GNOME ditched the combined Power off menu and added a separate `Restart...` menu item to Power Off menu
(based on the commit history of gnome-shell's source code).
Users are free to edit the `metadata.json` file to add 3.38 to shell-version to make it run on GNOME 3.38 but **no support will be provided for this**.
Compatibility with GNOME versions less than 40 is untested.

## How to use
- Clone this repo to ~/.local/share/gnome-shell/extensions/ and rename the folder to `reboot-menu@supershadoe.me`.
- Restart your GNOME shell by logging out and logging in again (if using Wayland) or press Alt+F2 and type `r` to restart GNOME shell (if using X11).
- Enable the extension in GNOME extensions app.

## License
This code is licensed under two different licenses - The extension code is licensed under GNU General Public License version 3.0
as the code of the extension is a derivative work of [gnome-shell](https://gitlab.gnome.org/GNOME/gnome-shell)
and the reboot-menu shell script is licensed under Apache License Version 2.0.

This may change in the future.
