// Copyright (C) 2014, Martin Kolman
// https://github.com/M4rtinK/universal-components/blob/master/LICENSE


import QtQuick 2.0
import QtQuick.Controls 1.2

Item {
    id: container

    height: label.height
    width : parent.width

    property alias text: label.text
    property alias checked: switcher.checked

    Label {
        id: label
        anchors {
            top: parent.top
            left: parent.left
            right: switcher.left
        }
    }

    Switch {
        id: switcher
        anchors {
            right: parent.right
            verticalCenter: parent.verticalCenter
        }
    }
}
