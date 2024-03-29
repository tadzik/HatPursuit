import QtQuick 2.0
import QtQuick.LocalStorage 2.0
import Sailfish.Silica 1.0
import "all.js" as Engine

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
        property var engine

        Keys.onLeftPressed:  engine.on_left()
        Keys.onRightPressed: engine.on_right()

        function get_DB() {
            return new Engine.HatPursuitDB();
        }

        function mode_menu() {
            score.visible = false
            highScore.visible = true
            logo.visible = true
            startButton.visible = true
            loadoutButton.visible = true
            highScoresButton.visible = true
            settingsButton.visible = true
            gameOverLabel.visible = false
            gameOverHats.visible = false
        }

        function mode_game() {
            score.visible = true
            highScore.visible = true
            logo.visible = false
            startButton.visible = false
            loadoutButton.visible = false
            highScoresButton.visible = false
            settingsButton.visible = false
        }

        function mode_highscore() {
            mode_game()
            score.visible = false
            highScore.visible = false
        }

        function mode_gameover(hats) {
            mode_highscore()
            gameOverLabel.visible = true
            if (hats) {
                gameOverHats.visible = true
                gameOverHats.adjust_width()
            }
        }

        function get_hat_container() {
            return hat_container
        }

        Component.onCompleted: {
            engine = new Engine.Engine(screen)
            engine.mode_menu()
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
                bestScore = screen.get_DB().get_high_score();
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
                onClicked: screen.engine.on_left()
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
                onClicked: screen.engine.on_right()
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
            cb: function () { screen.engine.mode_game() }
        }

        MainMenuButton {
            id: gameOverLabel
            label: "Game over!"
            z: screen.layer_ui
            anchors.bottom: parent.verticalCenter
            anchors.horizontalCenter: parent.horizontalCenter
            // needed so it doesn't cover up the regular left-right buttons
            // which in this mode change the state back into mode_menu
            cb: function() { screen.engine.on_left() }
        }

        Item {
            id: gameOverHats
            anchors.top: gameOverLabel.bottom
            anchors.horizontalCenter: parent.horizontalCenter
            z: screen.layer_ui
            Text {
                id: unlockedText
                font.pixelSize: 24
                anchors.top: parent.top
                anchors.horizontalCenter: parent.horizontalCenter
                text: "You unlocked new hats!"
            }
            Flow {
                id: hat_container
                anchors.top: unlockedText.bottom
                anchors.horizontalCenter: parent.horizontalCenter
                width: unlockedText.width
                anchors.margins: 20
                spacing: 20
            }

            function adjust_width() {
                // Flow cannot arrange items centered, so we limit its width in some cases,
                // which provides a bit of a fake centering
                var cc = hat_container.children.length
                if (cc == 0) return
                var hw = hat_container.children[0].width
                hat_container.width = cc * hw + hat_container.spacing * (cc - 1)
                hat_container.width = Math.min(hat_container.width, unlockedText.width)
            }
        }

        MainMenuButton {
            id: loadoutButton
            label: "Browse hats"
            z: screen.layer_ui
            anchors.top: startButton.bottom
            anchors.horizontalCenter: parent.horizontalCenter
            cb: function() {
                if (page.status !== null) {
                    pageStack.push(Qt.resolvedUrl("pages/LoadoutPage.qml"),
                        { engine: screen.engine, db: screen.get_DB() })
                } else {
                    var comp = Qt.createComponent("pages/LoadoutPage.qml")
                    while (comp.status == Component.Loading) { } // yeah, a busyloop. Fite me irl
                    if (comp.status == Component.Error) {
                        console.log("Error loading loadout page: " + comp.errorString());
                        return;
                    }
                    var obj = comp.createObject(page, { engine: screen.engine, db: screen.get_DB() })
                    screen.enabled = false
                    obj.closed.connect(function() {
                        obj.destroy()
                        screen.enabled = true
                    })
                }
            }
        }

        MainMenuButton {
            id: highScoresButton
            label: "High Scores"
            z: screen.layer_ui
            anchors.top: loadoutButton.bottom
            anchors.horizontalCenter: parent.horizontalCenter
            cb: function() {
                screen.engine.mode_highscore()
                var comp = Qt.createComponent("HighScoresOverlay.qml")
                while (comp.status == Component.Loading) { } // yeah, a busyloop. Fite me irl
                if (comp.status == Component.Error) {
                    console.log("Error loading high scores: " + comp.errorString());
                    return;
                }
                var obj = comp.createObject(screen, { db: screen.get_DB() })
                obj.z = screen.layer_ui
                obj.closed.connect(function() {
                    obj.destroy()
                    screen.engine.mode_menu()
                })
            }
        }

        MainMenuButton {
            id: settingsButton
            label: "Settings"
            z: screen.layer_ui
            anchors.top: highScoresButton.bottom
            anchors.horizontalCenter: parent.horizontalCenter
            cb: function() {
                if (page.status !== null) {
                    pageStack.push(Qt.resolvedUrl("pages/SettingsPage.qml"), { engine: screen.engine })
                } else {
                    var comp = Qt.createComponent("pages/SettingsPage.qml")
                    while (comp.status == Component.Loading) { } // yeah, a busyloop. Fite me irl
                    if (comp.status == Component.Error) {
                        console.log("Error loading settings page: " + comp.errorString());
                        return;
                    }
                    var obj = comp.createObject(page, { engine: screen.engine })
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
            onTriggered: screen.engine.update()
        }
    }
}
