'use strict';

/*
 * COPYRIGHT NOTICE
 *
 * This file is part of Reboot Menu.
 * Copyright 2022 supershadoe
 *
 * Reboot Menu is free software: you can redistribute it and/or modify it
 * under the terms of the GNU General Public License as published by the Free Software Foundation,
 * either version 3 of the License, or (at your option) any later version.
 *
 * Reboot Menu is distributed in the hope that it will be useful, but WITHOUT ANY WARRANTY;
 * without even the implied warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.
 * See the GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License along with Reboot Menu.
 * If not, see <https://www.gnu.org/licenses/>.
 *
*/

// Imports
const { GLib, GObject } = imports.gi;
const PopupMenu = imports.ui.popupMenu;
const NoAnimation = imports.ui.boxpointer.PopupAnimation.NONE;

// gnome-shell objects
const systemMenu = imports.ui.main.panel.statusArea.aggregateMenu._system;
const sessionSubMenu = systemMenu._sessionSubMenu.menu;

// Constants declared by me
const this_ext = imports.misc.extensionUtils.getCurrentExtension();
const restartItemIndex = systemMenu._restartItem ?
    sessionSubMenu._getMenuItems().indexOf(systemMenu._restartItem) : 0;

function init(ext_metadata) {}

function enable() {
    systemMenu._restartItem.destroy();
    const bindFlags = GObject.BindingFlags.DEFAULT | GObject.BindingFlags.SYNC_CREATE;
    let restartItem = new PopupMenu.PopupMenuItem(_('Restart…'));
    restartItem.connect('activate', () => {
        systemMenu.menu.itemActivated(NoAnimation);
        try {
            GLib.spawn_command_line_async(`/bin/sh ${this_ext.path}/reboot-menu.sh`);
        } catch (e) {
            logError(e);
        }
    });
    sessionSubMenu.addMenuItem(restartItem, restartItemIndex);
    systemMenu._restartItem = restartItem;
    systemMenu._systemActions.bind_property(
        'can-restart', systemMenu._restartItem, 'visible', bindFlags
    );
}

function disable() {
    systemMenu._restartItem.destroy();
    // Partially copied code from gnome-shell repo for restarting device neatly
    const bindFlags = GObject.BindingFlags.DEFAULT | GObject.BindingFlags.SYNC_CREATE;
    let restartItem = new PopupMenu.PopupMenuItem(_('Restart…'));
    restartItem.connect('activate', () => {
        systemMenu.menu.itemActivated(NoAnimation);
        systemMenu._systemActions.activateRestart();
    });
    sessionSubMenu.addMenuItem(restartItem, restartItemIndex);
    systemMenu._restartItem = restartItem;
    systemMenu._systemActions.bind_property(
        'can-restart', systemMenu._restartItem, 'visible', bindFlags
    );
}
