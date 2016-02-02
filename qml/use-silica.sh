#!/bin/sh
sed -i 's/^import Fakefish 0\.1/import Sailfish.Silica 1.0/' \
        pages/SettingsPage.qml \
        pages/LoadoutPage.qml \
        Game.qml
