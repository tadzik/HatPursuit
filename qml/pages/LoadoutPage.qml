import QtQuick 2.0
import Fakefish 0.1
import "../all.js" as Engine


Page {
    id: page
    property var engine
    property var db

    function capitalize(str) {
        return str.charAt(0).toUpperCase() + str.substr(1)
    }

    SilicaListView {
        id: listView
        anchors.fill: parent
        model: ListModel {
            id: model

            Component.onCompleted: {
                var hats = db.get_all_hats();
                for (var i = 0; i < hats.length; i++) {
                    model.append(hats[i])
                }
            }
        }

        delegate: Item {
            id: item
            width: ListView.view.width
            height: Theme.itemSizeSmall

            Row {
                id: row
                spacing: Theme.paddingLarge

                Rectangle {
                    id: rekt
                    color: "grey"
                    width: parent.parent.height
                    height: parent.parent.height

                    Component.onCompleted: {
                        var hat = engine.hats[name].createObject(rekt, {
                            primaryColor: primaryColor,
                            secondaryColor: secondaryColor,
                        });
                        hat.anchors.centerIn = rekt
                    }
                }

                Label {
                    anchors.verticalCenter: parent.verticalCenter
                    text: page.capitalize(primaryColor) + "-" + page.capitalize(secondaryColor) + " " + page.capitalize(name)
                }
            }

            MouseArea {
                anchors.fill: row
                onClicked: {
                    engine.select_hat({ name: name, primaryColor: primaryColor, secondaryColor: secondaryColor })
                    pageStack.pop()
                }
            }
        }
    }
}
