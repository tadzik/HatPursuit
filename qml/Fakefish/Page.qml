import QtQuick 2.0
import QtQuick.Controls 1.4

Item {
    id: page
    property var status: null
    anchors.fill: parent
    default property alias _contentChildren: content.data
    signal closed

    Rectangle {
        anchors.fill: parent

        Button {
            id: closeButton
            text: "X"
            anchors.top: parent.top
            anchors.left: parent.left

            onClicked: {
                page.closed()
            }

            Component.onCompleted: {
                if (page.parent === null) {
                    // no close button on root page
                    closeButton.destroy()
                    content.anchors.top = parent.top
                }
            }
        }

        Item {
            id: content
            anchors.top: closeButton.bottom
            anchors.bottom: parent.bottom
        }
    }
}
