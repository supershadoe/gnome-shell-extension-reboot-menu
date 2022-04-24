#!/usr/bin/env sh
# vim:sw=4:ts=4:sts=4:et

# Reboot menu script
# This script displays a list of boot entries registered in systemd-boot
# Makes it easier to directly reboot to another OS (if dual or multi-booting)
# Created by supershadoe <supershadoe5[at]gmail[dot]com>
# (Skip to line 43 if you want to just see the code)

# COPYRIGHT NOTICE
# Copyright 2022 supershadoe
#
# Licensed under the Apache License, Version 2.0 (the "License");
# you may not use this file except in compliance with the License.
# You may obtain a copy of the License at
#
#     http://www.apache.org/licenses/LICENSE-2.0
#
# Unless required by applicable law or agreed to in writing, software
# distributed under the License is distributed on an "AS IS" BASIS,
# WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
# See the License for the specific language governing permissions and
# limitations under the License.

# IMPLEMENTATION DETAILS
# set -e makes the script quit on any error
# The data is just flown to other commands using pipes
# Data is fetched from bootctl -> Processed through sed -> Provided to zenity
# as arguments using xargs -> Output of zenity processed by xargs and provided
# to systemctl

# In sed, -n is used to prevent output of pattern space(the inputted data)
# The first s// substitutes the whitespaces and `title: ` with `FALSE "` to
#   keep the first row unselected in radiolist in zenity
# The second s// adds a double quote at end to close the quotes
#   Quotes were used because of boot entry names having spaces in them
# The third s// substitutes the first occurance of FALSE with TRUE
#   as I need the first option to be selected by default
# p prints the edited pattern space
# n changes the pattern space to the next line
# The fourth s// removes the whitespaces and `id: `
# Thus, in the end you get output in the form of `FALSE "entry name"\nentry-id\n`

# ACTUAL CODE
set -e
bootctl list | grep "title\|id" | \
    sed -n "
        s/[ ]*title: /FALSE \"/
        s/$/\"/
        0,/FALSE/{s/FALSE/TRUE/}
        p
        n
        s/[ ]*id: //
        p" | \
    xargs zenity --list --radiolist \
        --window-icon \
            "/usr/share/icons/Adwaita/32x32/actions/system-reboot-symbolic.symbolic.png" \
        --height 300 \
        --width 500 \
        --text "Select the boot entry to reboot to." \
        --title "Reboot Menu" \
        --column "Choice" \
        --column "Boot Entry" \
        --column "UID" \
        --print-column 3 | \
    xargs -I "{}" systemctl reboot --boot-loader-entry={}

