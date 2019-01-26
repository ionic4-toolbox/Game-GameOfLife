import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';

@Component({
    selector: 'app-game',
    templateUrl: './game.page.html',
    styleUrls: ['./game.page.scss'],
})
export class GamePage implements OnInit {

    @ViewChild('game') game_box: ElementRef;
    @ViewChild('world') world: ElementRef;
    @ViewChild('info_panel') info_panel: ElementRef;
    @ViewChild('info_generation') info_generation: ElementRef;
    @ViewChild('info_lifecell') info_lifecell: ElementRef;
    @ViewChild('info_speed') info_speed: ElementRef;

    canvas: any;
    unitSize = 2;
    columns = 180;
    lines = 120;
    drawRate = 1000 / 16;
    gridSize = 4;

    width: any;
    height: any;

    oldState = [];
    newState = [];
    useState = [];

    gameOn = false;
    counter = 0;
    lifeCell = 0;

    ctx: any;

    infoPanel: any;
    infoGeneration: any;
    infoLifeCell: any;
    infoSpeed: any;

    gameBox: any;
    gameBoxSize: {};

    constructor() {
        console.log('GamePage::constructor | ');
    }

    ngOnInit() {
        console.log('GamePage::ngOnInit |');

        /**/
        this.canvas = this.world.nativeElement;
        console.log('GamePage::ngOnInit | canvas=', this.canvas.width, this.canvas.height, this.canvas);

        this.width = this.canvas.width; // = this.unitSize * this.columns;
        this.height = this.canvas.height; // = this.unitSize * this.lines;

        this.getWorldSize();

        /**/
        this.ctx = this.canvas.getContext('2d');

        this.infoPanel = this.info_panel.nativeElement;

        this.infoPanel.style.width = this.width - 12 + 'px';
        this.infoPanel.style.width = this.width - 12 + 'px';

        this.infoGeneration = this.info_generation;
        this.infoLifeCell = this.info_lifecell;
        this.infoSpeed = this.info_speed;

        this.gameBox = this.game_box.nativeElement;
        this.gameBoxSize = {
            w: this.gameBox.clientWidth, h: this.gameBox.clientHeight
        };

        this.oldState = [];
        this.newState = [];
        this.useState = [];

        this.gameOn = false;
        this.counter = 0;
        this.lifeCell = 0;

        console.log('GamePage::ngOnInit | now start');
        this.start()
    }

    create_world() {
        console.log('GamePage::create_world | columns=', this.columns, 'lines=', this.lines);

        for (var i = 0; i < this.columns; i++) {

            this.oldState[i] = [];
            this.newState[i] = [];
            this.useState[i] = [];

            for (var j = 0; j < this.lines; j++) {

                var result = Math.random() < .075;

                this.newState[i][j] = result;
                this.oldState[i][j] = result;
                this.useState[i][j] = false;
            }
        }

        console.log('GamePage::create_world | now update');
        this.update();
        this.counter = 0;

        this.draw();
    };

    updateState(i, j) {
        let
            adyacentAlive = 0,
            iMinus = i - 1 >= 0,
            iPlus = i + 1 < this.columns,
            jMinus = j - 1 >= 0,
            jPlus = j + 1 < this.lines;

        if (iMinus && jMinus && this.oldState[i - 1][j - 1]) { adyacentAlive++ };
        if (iMinus && this.oldState[i - 1][j]) { adyacentAlive++ };
        if (iMinus && jPlus && this.oldState[i - 1][j + 1]) { adyacentAlive++ };
        if (iPlus && jMinus && this.oldState[i + 1][j - 1]) { adyacentAlive++ };

        if (iPlus && this.oldState[i + 1][j]) { adyacentAlive++ };
        if (iPlus && jPlus && this.oldState[i + 1][j + 1]) { adyacentAlive++ };
        if (jMinus && this.oldState[i][j - 1]) { adyacentAlive++ };
        if (jPlus && this.oldState[i][j + 1]) { adyacentAlive++ };

        return (this.oldState[i][j] && adyacentAlive === 2) || (this.oldState[i][j] && adyacentAlive === 3) || (!this.oldState[i][j] && adyacentAlive === 3);
    }

    update() {
        console.log('GamePage::update | ', this.columns, 'x', this.lines);

        for (var i = 0; i < this.columns; i++) {
            for (var j = 0; j < this.lines; j++) {
                this.newState[i][j] = this.updateState(i, j);
            }
        }

        for (var i = 0; i < this.newState.length; i++) {
            for (var j = 0; j < this.newState[i].length; j++) {
                this.oldState[i][j] = this.newState[i][j] ? true : false
            }
        }

        this.counter++;
        console.log('GamePage::update | counter=', this.counter);
    }

    draw() {
        // console.log('GamePage::draw | ');

        this.lifeCell = 0;
        this.ctx.clearRect(0, 0, this.width, this.height);

        // console.log('GamePage::draw | drawGrid()');
        this.drawGrid();

        // console.log('GamePage::draw | ', this.columns, 'x', this.lines);

        for (var i = 0; i < this.columns; i++) {
            for (var j = 0; j < this.lines; j++) {
                if (this.useState[i][j]) {
                    this.ctx.beginPath();
                    this.ctx.fillStyle = 'rgba(104,159,56,.1)'; // cell color
                    this.ctx.fillRect(i * this.unitSize, j * this.unitSize, this.unitSize, this.unitSize);
                    this.ctx.closePath();

                    // console.log('GamePage::draw | rect  =', i * this.unitSize, j * this.unitSize, this.unitSize, this.unitSize);
                };
            }
        }

        for (var i = 0; i < this.columns; i++) {
            for (var j = 0; j < this.lines; j++) {
                if (this.newState[i][j]) {

                    this.lifeCell++;
                    this.useState[i][j] = true;

                    this.ctx.beginPath();
                    this.ctx.fillStyle = 'rgba(236,64,122,1)'; // cell color
                    this.ctx.fillRect(i * this.unitSize, j * this.unitSize, this.unitSize, this.unitSize);
                    this.ctx.closePath();
                };
            }
        }

        // console.log('GamePage::draw | lifeCell = ', this.lifeCell);

    };

    start() {
        console.log('GamePage::start | init()');
        this.init();

        console.log('GamePage::start | draw()');
        this.draw();

        console.log('GamePage::start | tick()');
        this.tick(this);
        setInterval(this.tick, this.drawRate, this);
    };

    tick(self) {
        if (self.gameOn) {
            self.update();
        }

        self.infoGeneration.innerHTML = self.getGeneration();
        self.infoLifeCell.innerHTML = self.getLifeCell();
        self.infoSpeed.innerHTML = self.getSpeed();

        self.draw();
    };

    next_generation() {
        this.update();
        this.tick(this);
    }

    drawGrid() {
        const hLines = this.height / this.unitSize / this.gridSize;
        const wLines = this.width / this.unitSize / this.gridSize;

        // console.log('GamePage::drawGrid | hLine=', hLines, 'wLines=', wLines);

        for (var i = 0; i < hLines; i++) {
            this.ctx.beginPath();
            this.ctx.moveTo(0, i * this.gridSize * this.unitSize - .5);
            this.ctx.lineTo(this.width, i * this.gridSize * this.unitSize - .5);

            if (i % 5) {
                this.ctx.strokeStyle = 'rgba(66,66,66,.2)';
            } else {
                this.ctx.strokeStyle = 'rgba(66,66,66,.7)';
            }
            this.ctx.stroke();
            this.ctx.closePath();
        };

        for (var i = 0; i < wLines; i++) {
            this.ctx.beginPath();
            this.ctx.moveTo(i * this.gridSize * this.unitSize - .5, 0);
            this.ctx.lineTo(i * this.gridSize * this.unitSize - .5, this.height);

            if (i % 5) {
                this.ctx.strokeStyle = 'rgba(66,66,66,.2)';
            } else {
                this.ctx.strokeStyle = 'rgba(66,66,66,.7)';
            }
            this.ctx.stroke();
            this.ctx.closePath();
        };
    }

    addUnit(e) {
        console.log('GamePage::addUnit | e=', e);
        const x = e.offsetX;
        const y = e.offsetY;

        var i = Math.floor(x / this.unitSize);
        var j = Math.floor(y / this.unitSize);

        this.newState[i][j] = !this.newState[i][j];
        this.oldState[i][j] = !this.oldState[i][j];

        console.log('GamePage::addUnit | chnge state of cell(', i, ',', j, ') to ', this.newState[i][j]);

    }

    reset() {
        this.init();

        this.gameOn = false;
        this.counter = 0;
        this.lifeCell = 0;
    }

    init() {
        console.log('GamePage::init | ');

        for (var i = 0; i < this.columns; i++) {
            this.oldState[i] = [];
            this.newState[i] = [];
            this.useState[i] = [];

            for (var j = 0; j < this.lines; j++) {
                this.newState[i][j] = false;
                this.oldState[i][j] = false;
                this.useState[i][j] = false;
            }
        }
    }

    game_on_off() {
        this.gameOn = !this.gameOn;
        console.log('GamePage::game_on_off | gameOn=', this.gameOn);
    };

    getWorldSize() {
        const result = {
            w: this.width,
            h: this.height
        };

        // console.log('GamePage::getWorldSize | result=', result);
        return result;
    };

    getGeneration() {
        const result = this.counter;

        // console.log('GamePage::getGeneration | result=', result);
        return result;
    };

    getLifeCell() {
        const result = this.lifeCell;

        // console.log('GamePage::getLifeCell | result=', result);
        return result;
    };

    getSpeed() {
        const result = Math.round(this.drawRate);
        
        // console.log('GamePage::getSpeed | ', result);
        return result;
    };
}