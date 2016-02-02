declare module Qt {
    function createComponent(filename: string) : any;
}

declare interface Component {
    // anchors
    top:    any;
    bottom: any;
    left:   any;
    right:  any;

    // size
    width:  number;
    height: number;

    // position
    x:      number;
    y:      number;
}

declare module LocalStorage {
    function openDatabaseSync(dbname: string, dbver: string,
                              dbdesc: string, dbsize: number,
                              dbconfig: Function) : Database;

}

declare interface Database {
    transaction(func: Function);
    changeVersion(v1: string, v2: string);
}

declare interface Screen extends Component {
    // properties
    layer_hats:    number;
    layer_stripes: number;
    layer_cars:    number;

    // methods
    get_DB(): HatPursuitDB;
    mode_menu();
    mode_game();

    // qml stuff
    bottom: any;
}

declare interface Game_Score extends Component {
    //properties
    distance: number;
    text:     string;

    // methods
    getHighScore(): number;
    addScore(score: string);
}

declare var screen:      Screen;
declare var score:       Game_Score;
declare var leftBorder:  Component;
declare var rightBorder: Component;