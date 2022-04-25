'use strict';

/*
 * COPYRIGHT NOTICE
 *
 * This file is part of Reboot Menu.
 * Copyright 2022 supershadoe
 *
 * Reboot Menu is free software: you can redistribute it and/or modify it
 * under the terms of the GNU General Public License as published by the
 * Free Software Foundation, either version 3 of the License,
 * or (at your option) any later version.
 *
 * Reboot Menu is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of MERCHANTABILITY
 * or FITNESS FOR A PARTICULAR PURPOSE.
 * See the GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License along with Reboot Menu.
 * If not, see <https://www.gnu.org/licenses/>.
 *
 */

const { Gio, GObject } = imports.gi;
const this_ext = imports.misc.extensionUtils.getCurrentExtension();
const PopupMenu = imports.ui.popupMenu;
const NoAnimation = imports.ui.boxpointer.PopupAnimation.NONE;

const aggregateMenu = imports.ui.main.panel.statusArea.aggregateMenu;
const systemMenu = aggregateMenu._system;

var rebootMenu = null;

const RebootMenu = GObject.registerClass(
class RebootMenu extends PopupMenu.PopupSubMenuMenuItem {
    _init() {
        super._init(_("Restart…"), true);
        this.icon.icon_name = 'system-reboot-symbolic';

        this._systemdLoginManagerIface = this._loadLoginManagerIface();
        this._systemdLoginManager = Gio.DBusProxy.makeProxyWrapper(
            this._systemdLoginManagerIface
        );

        this._logind_proxy = new this._systemdLoginManager(
            Gio.DBus.system,
            "org.freedesktop.login1",
            "/org/freedesktop/login1"
        );

        this._logind_proxy.CanRebootToBootLoaderMenuRemote(
            (canRebootToBootLoaderMenu, unusedNeedsAuth) => {
                if (!canRebootToBootLoaderMenu) {
                    disable();
                    return null;
                }
        });

        this._addBootEntriesToMenu();
        systemMenu._restartItem.destroy();
        delete systemMenu._restartItem;
        aggregateMenu.menu.addMenuItem(this);
    }

    _addBootEntriesToMenu() {
        this._logind_proxy.BootLoaderEntries.forEach((bootEntry) => {
            let item = new PopupMenu.PopupMenuItem(bootEntry);
            item.connect('activate', () => {
                this.menu.itemActivated(NoAnimation);
                this._logind_proxy.SetRebootToBootLoaderEntryRemote(bootEntry);
                systemMenu._systemActions.activateRestart();
            });
            this.menu.addMenuItem(item);
        });
        let item = new PopupMenu.PopupMenuItem(_("Reload list of boot entries"));
        item.connect('activate', () => {
            this.menu.itemActivated(NoAnimation);
            this.menu.removeAll();
            this._addBootEntriesToMenu();
        });
        this.menu.addMenuItem(item);
    }

    _loadLoginManagerIface() {
        let uri = `file:///${this_ext.path}/org.freedesktop.login1.Manager.xml`;
        let f = Gio.File.new_for_uri(uri);

        try {
            let [ok_, bytes] = f.load_contents(null);
            return new TextDecoder().decode(bytes);
        } catch (e) {
            log("Failed to load D-Bus interface for systemd Login Manager");
        }

        return null;
    }

    destroy() {
        const bindFlags =
            GObject.BindingFlags.DEFAULT | GObject.BindingFlags.SYNC_CREATE;
        let restartItem = new PopupMenu.PopupMenuItem(_('Restart…'));
        let restartItemIndex = systemMenu._powerOffItem ?
            (systemMenu._sessionSubMenu.menu._getMenuItems()
                .indexOf(systemMenu._powerOffItem)) : 0;
        restartItem.connect('activate', () => {
            systemMenu.menu.itemActivated(NoAnimation);
            systemMenu._systemActions.activateRestart();
        });
        systemMenu._sessionSubMenu.menu.addMenuItem(restartItem, restartItemIndex);
        systemMenu._restartItem = restartItem;
        systemMenu._systemActions.bind_property(
            'can-restart', systemMenu._restartItem, 'visible', bindFlags
        );
        this._logind_proxy.SetRebootToBootLoaderEntryRemote(
            this._logind_proxy.BootLoaderEntries[0]
        );
        super.destroy();
    }
});

function enable() {
    rebootMenu = new RebootMenu();
}

function disable() {
    rebootMenu.destroy();
    rebootMenu = null;
}
