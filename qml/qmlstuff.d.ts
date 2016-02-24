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

    visible: boolean;

    // methods
    destroy();
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
    mode_highscore();
    mode_gameover(hats: boolean);
    get_hat_container() : Component;

    // qml stuff
    bottom: any;
}

declare interface Game_Score extends Component {
    distance: number;
    text:     string;
}

declare interface Game_High_Score extends Component {
    bestScore: string;
    text:      string;
}

declare interface Bike extends Component {
    rotationAngle: number;
    velocity:      number;

    turn_left();
    turn_right();
    attach_hat(hat: Component);
}

declare interface Car extends Component {
    velocity: number;
}

declare interface Hat {
    name:           string;
    primaryColor:   string;
    secondaryColor: string;
}

declare interface HatComponent extends Hat, Component {
}

declare var screen:      Screen;
declare var score:       Game_Score;
declare var highScore:   Game_High_Score;
declare var leftBorder:  Component;
declare var rightBorder: Component;
