import QtQuick 2.0;
import QtQuick.LocalStorage 2.0;
import "game.js" as Engine

Rectangle {
    id: screen
    width: 540
    height: 960
    color: "gray"
    focus: true

    property int layer_asphalt: 0
    property int layer_stripes: 1
    property int layer_cars:    2
    property int layer_hats:    3
    property int layer_ui:    100

    Keys.onLeftPressed:  Engine.on_left()
    Keys.onRightPressed: Engine.on_right()

    Text {
        property real distance: 0

        id: score
        text: Math.floor(distance).toString()
        font.pixelSize: 25

        anchors.top: parent.top
        anchors.left: parent.left
        anchors.topMargin: 10
        anchors.leftMargin: 25
        z: layer_ui

        Component.onCompleted: config()

        function config() {
            // move it?
            var db = LocalStorage.openDatabaseSync("QQmlHatPursuitDb", "1.0", "The HatPursuit QML SQL!", 1000000);

            db.transaction(
                function (tx) {
                    tx.executeSql('CREATE TABLE IF NOT EXISTS Score(score TEXT)');
                }
            );
        }

        function getHighScore() {
            var db = LocalStorage.openDatabaseSync("QQmlHatPursuitDb", "1.0", "The HatPursuit QML SQL!", 1000000),
                highScore;

            db.transaction(
                function (tx) {
                    var rs = tx.executeSql('SELECT * FROM Score ORDER BY score DESC');
                    highScore = rs.rows.item(0) == null ? '0' : rs.rows.item(0).score;
                }
            );
            return highScore;
        }

        function addScore(score) {
            var db = LocalStorage.openDatabaseSync("QQmlHatPursuitDb", "1.0", "The HatPursuit QML SQL!", 1000000);

            db.transaction(
                function (tx) {
                    // save only if higher?
                    tx.executeSql('INSERT INTO Score VALUES(?)', [ score == null ? '0' : score.toString() ]);
                }
            );
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
        z: layer_ui

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

    Timer {
        id: gameTimer
        interval: 16
        repeat: true
        running: true
        onTriggered: Engine.update()
    }
}
