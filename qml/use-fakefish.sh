#!/bin/sh
sed -i 's/import Sailfish\.Silica 1\.0/import Fakefish 0.1/' \
        pages/SettingsPage.qml \
        pages/LoadoutPage.qml \
        HighScoresOverlay.qml \
        Game.qml
