import QtQuick 2.0
import QtQuick.LocalStorage 2.0
import Sailfish.Silica 1.0
import "game.js" as Engine
import "HatPursuitDB.js" as DB

Page {
    id: page
    anchors.fill: parent

    Rectangle {
        id: screen
        width: 540
        height: 960
        color: "gray"
        focus: true

        property int layer_asphalt: 100
        property int layer_stripes: 200
        property int layer_cars:    300
        property int layer_hats:    400
        property int layer_ui:      500

        Keys.onLeftPressed:  Engine.on_left()
        Keys.onRightPressed: Engine.on_right()

        function get_DB() {
            return new DB.HatPursuitDB();
        }

        function mode_menu() {
            score.visible = false
            logo.visible = true
            startButton.visible = true
            loadoutButton.visible = true
            settingsButton.visible = true
        }

        function mode_game() {
            score.visible = true
            logo.visible = false
            startButton.visible = false
            loadoutButton.visible = false
            settingsButton.visible = false
        }

        Component.onCompleted: {
            Engine.mode_menu()
        }

        Text {
            property real distance: 0

            id: score
            text: Math.floor(distance).toString()
            font.pixelSize: 25

            anchors.top: parent.top
            anchors.left: parent.left
            anchors.topMargin: 10
            anchors.leftMargin: 25
            z: screen.layer_ui

            function getHighScore() {
                return screen.get_DB().get_high_score();
            }

            function addScore(score) {
                screen.get_DB().add_score(score);
                highScore.bestScore = score
            }
        }

        Text {
            property string bestScore: '0'

            id: highScore
            text: "Top score: " + bestScore
            font.pixelSize: 25

            anchors.top: parent.top
            anchors.right: parent.right
            anchors.topMargin: 10
            anchors.rightMargin: 25
            z: screen.layer_ui

            Component.onCompleted: {
                bestScore = score.getHighScore();
            }
        }

        Rectangle {
            id: leftBorder
            width: 10
            height: 960
            color: "black"
        }

        Rectangle {
            id: rightBorder
            width: 10
            height: 960
            color: "black"

            Component.onCompleted: { x = screen.width - rightBorder.width }
        }

        Rectangle {
            id: leftHalf
            anchors.left: parent.left
            anchors.right: parent.horizontalCenter
            anchors.top: parent.top
            anchors.bottom: parent.bottom
            opacity: 0
            MouseArea {
                anchors.fill: parent
                onClicked: Engine.on_left()
            }
        }

        Rectangle {
            id: rightHalf
            anchors.left: parent.horizontalCenter
            anchors.right: parent.right
            anchors.top: parent.top
            anchors.bottom: parent.bottom
            opacity: 0
            MouseArea {
                anchors.fill: parent
                onClicked: Engine.on_right()
            }
        }

        Text {
            id: logo
            font.pixelSize: 72
            font.bold: true
            text: "HatPursuit"
            z: screen.layer_ui
            y: parent.height / 3
            anchors.horizontalCenter: parent.horizontalCenter
        }

        MainMenuButton {
            id: startButton
            label: "Start game"
            z: screen.layer_ui
            anchors.top: parent.verticalCenter
            anchors.horizontalCenter: parent.horizontalCenter
            cb: function () { Engine.mode_game() }
        }

        MainMenuButton {
            id: loadoutButton
            label: "Browse hats"
            z: screen.layer_ui
            anchors.top: startButton.bottom
            anchors.horizontalCenter: parent.horizontalCenter
            cb: function() {
                if (page.status !== null) {
                    pageStack.push(Qt.resolvedUrl("pages/LoadoutPage.qml"), { engine: Engine, db: screen.get_DB() })
                } else {
                    var comp = Qt.createComponent("pages/LoadoutPage.qml")
                    while (comp.status != Component.Ready) { } // yeah, a busyloop. Fite me irl
                    var obj = comp.createObject(page, { engine: Engine, db: screen.get_DB() })
                    screen.enabled = false
                    obj.closed.connect(function() {
                        obj.destroy()
                        screen.enabled = true
                    })
                }
            }
        }

        MainMenuButton {
            id: settingsButton
            label: "Settings"
            z: screen.layer_ui
            anchors.top: loadoutButton.bottom
            anchors.horizontalCenter: parent.horizontalCenter
            cb: function() {
                if (page.status !== null) {
                    pageStack.push(Qt.resolvedUrl("pages/SettingsPage.qml"), { engine: Engine })
                } else {
                    var comp = Qt.createComponent("pages/SettingsPage.qml")
                    while (comp.status != Component.Ready) { } // yeah, a busyloop. Fite me irl
                    var obj = comp.createObject(page, { engine: Engine })
                    screen.enabled = false
                    obj.closed.connect(function() {
                        obj.destroy()
                        screen.enabled = true
                    })
                }
            }
        }

        Timer {
            id: gameTimer
            interval: 16
            repeat: true
            running: true
            onTriggered: Engine.update()
        }
    }
}
