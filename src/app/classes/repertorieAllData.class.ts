import { SafeUrl } from "@angular/platform-browser";

export class RepertoriesAllData{
    idLiveEvent : number;
    name : string;
    location : string;
    tour : string;
    date : Date;
    place : string;
    nameTag : string;
    nameBand : string;
    nameManager : string;
    setlist : SetList;
    constructor(){
        this.idLiveEvent = 0;
        this.name = "";
        this.location = "";
        this.tour = "";
        this.date = new Date();
        this.place = "";
        this.nameTag = "";
        this.nameBand = "";
        this.nameManager = "";
        this.setlist = new SetList();
    }
}

class SetList{
    idSetList : number;
    nameRepertori : string;
    sets : Set[];

    constructor(){
        this.idSetList = 0;
        this.nameRepertori = "";
        this.sets= [];
    }
}

export class Set{
    idSet : number;
    name : string;
    haveImage : boolean;
    numberSongs : number;
    songs : Song[];
    imageBlob : SafeUrl;
    constructor(){
        this.idSet = 0;
        this.name = "";
        this.haveImage = false;
        this.numberSongs = 0;
        this.songs = [];
        this.imageBlob = "";
    }
}

export class Song{
    idSong : number;
    name : string;
    artist : string;
    lyric : string;
    chordsGuitar : boolean;
    tabGuitar : boolean;
    chordsBass : boolean;
    tabBass : boolean;
    chordsPiano : boolean;
    tabPiano : boolean;
    tempo : number;

    //imagenes
    chordsGuitarBlob : SafeUrl;
    tabGuitarBlob : SafeUrl;
    chordsBassBlob : SafeUrl;
    tabBassBlob : SafeUrl;
    chordsPianoBlob : SafeUrl;
    tabPianoBlob : SafeUrl;

    constructor(){
        this.idSong = 0;
        this.name = "";
        this.artist = "";
        this.lyric = "";
        this.chordsGuitar = false;
        this.tabGuitar = false;
        this.chordsBass = false;
        this.tabBass = false;
        this.chordsPiano = false;
        this.tabPiano = false;
        this.tempo = 0;
        //imagenes
        this.chordsGuitarBlob = "";
        this.tabGuitarBlob = "";
        this.chordsBassBlob = "";
        this.tabBassBlob = "";
        this.chordsPianoBlob = "";
        this.tabPianoBlob = "";
    }
}