import QtQuick 2.0
import Sailfish.Silica 1.0
import "../all.js" as Engine

Page {
    id: page
    property var engine

    SilicaFlickable {
        anchors.fill: parent
        contentHeight: column.height
        Column {
            id: column
            width: page.width
            PageHeader {
                title: "Settings"
            }

            TextSwitch {
                text: "Hat autopickup"
                checked: page.engine.hat_autopickup

                onCheckedChanged: {
                    page.engine.hat_autopickup = checked;
                    page.engine.write_settings();
                }
            }
        }
    }
}
