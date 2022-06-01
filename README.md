# Reboot Menu

> [Archived]
>
> This extension works as it is but I don't have the motive to work on this anymore(more so due to less time) nor do I have the use as I don't dual boot
> much nowadays and Alt+restart is fine for once in a blue moon use.

A GNOME shell extension to show systemd-boot boot entries in GNOME's Aggregate Menu (the quick settings menu where Settings, lock, Power off are present).

Useful for people who like to hide their boot menu and hate to spam Escape to make the computer show it.
Also useful for people who can't hold Alt on Reboot dialog to go to boot menu due to stuff like no keyboard.
And for people who are lazy af.

When the extension is enabled, it removes the usual Restart button from Power Off menu and creates a new Restart menu populated with all boot entries.
On pressing on any of the boot entries, it executes a D-Bus call to set oneshot boot entry and activates the restart process(Shows restart dialog).

On disabling the extension, it undoes all the changes and adds the usual Restart button back to Power Off menu.

## Notes
- Right now, the D-Bus API for boot menu doesn't provide the casual title of the boot entry and provides only the identifiers(like 'arch.conf' or 'auto-windows').
Maybe, in the future, casual titles can be supported with the upcoming systemd update which brings json support to bootctl by which we can get text from bootctl
in a easily parsable manner. (Using sed to process raw bootctl output is pain and unelegant)

People who definitely want their casual titles and want to avoid the boot entry identifiers at all costs can use version 1 which shows a Zenity window with boot
entry and identifier. Take note of the fact that it executes a shell script which shows a zenity window which doesn't block the whole shell interface and not as
elegant as the current implementation.

- Technically, it's possible to use it with non-systemd-boot boot loaders which support the D-Bus API and implement the [boot loader specification](https://systemd.io/BOOT_LOADER_SPECIFICATION) made by systemd but I don't use other boot loaders currently nor have the time to test on them. So, if you want to use it for this
purpose, you are on your own.

## Compatibility and support
This extension is compatible with gnome-shell versions 41 and 42 for sure and is developed on GNOME 42.
No official support will be provided for other GNOME versions.

Two things which break support for older GNOME versions
- Usage of TextDecoder to interpret XML file instead of ByteArray.toString() [only > GNOME 41]
- Restart item was added to Power Off menu instead of containing in endSessionDialog used for Power Off in GNOME 3.38

So, I guess if you want to support those 2 versions you can edit and test them. Here be dragons, though.

## How to use
- Clone this repo to ~/.local/share/gnome-shell/extensions/ and rename the folder to `reboot-menu@supershadoe.me`.
- Restart your GNOME shell by logging out and logging in again (if using Wayland) or press Alt+F2 and type `r` to restart GNOME shell (if using X11).
- Enable the extension in GNOME extensions app.

## Contributing
Any bugfixes/issues/features can be reported via GitHub issues and PRs are also welcome.

## License
This program is licensed under GNU General Public License version 3.0 as it is a derivative work of [gnome-shell](https://gitlab.gnome.org/GNOME/gnome-shell).
