#!/bin/bash

base=$(cd $(dirname $0) && pwd)
RM=$(which rm)
CP=$(which cp)
MKDIR=$(which mkdir)
SED=$(which sed)

extension() {
    dir="$base/Extension"
    $RM -rf "$dir"
    $MKDIR -p "$dir"
    $CP -rf $base/{_locales,css,icon,js,manifest.json,index.html} "$dir"
}

extension
