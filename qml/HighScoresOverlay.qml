import QtQuick 2.0
import Sailfish.Silica 1.0

ListView {
    id: listView
    anchors.fill: parent
    signal closed
    property var db

    delegate: Item {
        width: ListView.view.width
        height: Theme.itemSizeSmall

        Text {
            anchors.left: parent.left
            anchors.leftMargin: Theme.paddingLarge
            font.pointSize: 12
            text: no
        }

        Text {
            anchors.horizontalCenter: parent.horizontalCenter
            font.pointSize: 24
            font.weight: Font.Bold
            text: score
        }

        Text {
            anchors.right: parent.right
            anchors.rightMargin: Theme.paddingLarge
            font.pointSize: 12
            text: timestamp
        }
    }

    model: ListModel {
        Component.onCompleted: {
            var scores = db.get_high_scores(10)
            model.append({ no: "No.", score: "Score", timestamp: "Timestamp" })
            for (var i = 0; i < scores.length; i++) {
                model.append({ no: i+1 + ".", score: scores[i][0], timestamp: scores[i][1] })
            }
        }
    }

    MouseArea {
        anchors.fill: parent
        onClicked: {
            listView.closed()
        }
    }
}
