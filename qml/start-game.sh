#!/bin/sh
export QML2_IMPORT_PATH=.
make && qmlscene --maximized main.qml
