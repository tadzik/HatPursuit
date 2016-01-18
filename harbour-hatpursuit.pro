# NOTICE:
#
# Application name defined in TARGET has a corresponding QML filename.
# If name defined in TARGET is changed, the following needs to be done
# to match new name:
#   - corresponding QML filename must be changed
#   - desktop icon filename must be changed
#   - desktop filename must be changed
#   - icon definition filename in desktop file must be changed
#   - translation filenames have to be changed

# The name of your application
TARGET = harbour-hatpursuit

CONFIG += sailfishapp

SOURCES += src/harbour-hatpursuit.cpp

OTHER_FILES += qml/harbour-hatpursuit.qml \
    qml/cover/CoverPage.qml \
    qml/pages/FirstPage.qml \
    qml/pages/SecondPage.qml \
    rpm/harbour-hatpursuit.changes.in \
    rpm/harbour-hatpursuit.spec \
    rpm/harbour-hatpursuit.yaml \
    translations/*.ts \
    harbour-hatpursuit.desktop

SAILFISHAPP_ICONS = 86x86 108x108 128x128 256x256

# to disable building translations every time, comment out the
# following CONFIG line
CONFIG += sailfishapp_i18n

QT += sql

# German translation is enabled as an example. If you aren't
# planning to localize your app, remember to comment out the
# following TRANSLATIONS line. And also do not forget to
# modify the localized app name in the the .desktop file.
TRANSLATIONS += translations/harbour-hatpursuit-de.ts

DISTFILES += \
    qml/Bike.qml \
    qml/Car.qml \
    qml/Game.qml \
    qml/Stripe.qml \
    qml/game.js \
    qml/hats/Bowler.qml \
    qml/hats/TopHat.qml

