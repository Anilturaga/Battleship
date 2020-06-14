//Aliases

// Mou icons
const defaultIcon =
  "url('https://cdn.glitch.com/eb939e0e-ddd3-4d33-89f1-34204db1d01e%2FmouseIcon.png?v=1590613190407'),auto";
const hoverIcon =
  "url('https://cdn.glitch.com/eb939e0e-ddd3-4d33-89f1-34204db1d01e%2FmouseIcon.png?v=1590613190407'),auto";

const graphLink =
  "https://cdn.glitch.com/eb939e0e-ddd3-4d33-89f1-34204db1d01e%2FgraphStrip.png?v=1589484613957";
const battleshipLink =
  "https://cdn.glitch.com/eb939e0e-ddd3-4d33-89f1-34204db1d01e%2Ffinal.png?v=1590529479858";
const shipTitleLink =
  "https://cdn.glitch.com/eb939e0e-ddd3-4d33-89f1-34204db1d01e%2FshipTitle.png?v=1590626588148";
const beaconLink =
  "https://cdn.glitch.com/eb939e0e-ddd3-4d33-89f1-34204db1d01e%2FbeaconFinal.png?v=1590502672115";
const beaconCircleLink =
  "https://cdn.glitch.com/eb939e0e-ddd3-4d33-89f1-34204db1d01e%2Fimage%20(1).png?v=1590515832132";
const beaconDashLink =
  "https://cdn.glitch.com/eb939e0e-ddd3-4d33-89f1-34204db1d01e%2Fimage%20(3).png?v=1590515811210";
const missileLink =
  "https://cdn.glitch.com/eb939e0e-ddd3-4d33-89f1-34204db1d01e%2Fmissile.png?v=1590607688510";
const aimSelectLink =
  "https://cdn.glitch.com/eb939e0e-ddd3-4d33-89f1-34204db1d01e%2FaimSelect.png?v=1590613654731";
let Application = PIXI.Application,
  Container = PIXI.Container,
  loader = PIXI.Loader.shared,
  resources = PIXI.loader.resources,
  Graphics = PIXI.Graphics,
  TextureCache = PIXI.utils.TextureCache,
  Sprite = PIXI.Sprite,
  Text = PIXI.Text,
  TextStyle = PIXI.TextStyle;

//Create a Pixi Application
let app = new Application({
  width: window.innerWidth,
  height: window.innerHeight,
  antialiasing: true,
  transparent: false,
  resolution: 1
});
app.renderer.view.style.position = "absolute";
app.renderer.view.style.display = "block";
app.renderer.autoResize = true;
app.renderer.resize(window.innerWidth, window.innerHeight);
// Add custom cursor styles
app.renderer.plugins.interaction.cursorStyles.default = defaultIcon;
app.renderer.plugins.interaction.cursorStyles.pointer = hoverIcon;

//Add the canvas that Pixi automatically created for you to the HTML document
document.body.appendChild(app.view);
const alphabetArray = "QPONMLKJIHGFEDCBAZYXWVUTSR".split("");
loader
  .add([
    graphLink,
    battleshipLink,
    shipTitleLink,
    beaconLink,
    beaconCircleLink,
    beaconDashLink,
    missileLink,
    aimSelectLink
  ])
  .load(setup);
let Battleship,
  ship,
  coordsFontSize = 18,
  depthFontSize = 15,
  circle,
  xGraph,
  yGraph,
  staticCircles,
  BeaconContainer = [],
  nextBeaconContainer,
  xBattleship = 0,
  yBattleship = 0,
  aimSelectArray = [],
  shipDefaultSpeed = 0.5,
  fireButtonContainer,
  collectBeacons,
  collectMaps,
  missileContainer = [],
  missile0Text,
  missile1Text,
  beaconIndexLocation = [];
let gameGraphics = new Container();
let gameState = 0;
let missileTrail = new Graphics();
let mapsArray = [];
let enemyShips;
function setup() {
  //console.log("ship coordinates",Math.floor(window.innerWidth / 100),Math.floor(window.innerHeight/50))
  xGraph = Math.floor(window.innerWidth / 50);
  yGraph = Math.floor(window.innerHeight / 50);

  ship = new Sprite(loader.resources[battleshipLink].texture);
  //console.log(Math.floor(window.innerWidth / 100));
  ship.scale.set(0.5, 0.5);
  Battleship = new Container();
  let shipTitle = new Sprite(loader.resources[shipTitleLink].texture);
  shipTitle.x = ship.width - 14;
  shipTitle.y = ship.y - 7;
  shipTitle.scale.set(0.9, 0.9);

  Battleship.addChild(ship);
  Battleship.addChild(shipTitle);
  Battleship.x = Math.floor(window.innerWidth / 100) * 50 + 15;
  // - ship.width / 2
  Battleship.y = yGraph * 50 - ship.height;
  Battleship.interactive = true;

  // this button mode will mean the hand cursor appears when you roll over the bunny with your mouse
  Battleship.buttonMode = true;
  Battleship.on("pointerdown", onBattleshipClick);
  Battleship.alpha = 0;
  collectBeacons = new Container();
  collectMaps = new Container();

  for (let j = 0; j < window.innerHeight / 50; j++) {
    let leftCoords = new Text(alphabetArray[j]);

    leftCoords.position.set(0, 50 * j + 25 - coordsFontSize / 2);
    leftCoords.style = {
      fill: "white",
      fontFamily: "Teko",
      fontSize: coordsFontSize
    };
    collectMaps.addChild(leftCoords);
    var horizontalMap = [];
    for (let i = 0; i < window.innerWidth / 50; i++) {
      //console.log(i, j);
      let map = new Sprite(loader.resources[graphLink].texture);
      let beacon = new Sprite(loader.resources[beaconLink].texture);
      let beaconCircle = new Sprite(loader.resources[beaconCircleLink].texture);
      let beaconDash = new Sprite(loader.resources[beaconDashLink].texture);
      map.scale.set(0.25, 0.25);
      map.x = 50 * i;
      map.y = 50 * j;
      map.alpha = 0;
      // Opt-in to interactivity
      map.interactive = true;

      // Shows hand cursor
      map.buttonMode = true;

      // Pointers normalize touch and mouse
      map.on("pointerdown", event => onClick(map));
      horizontalMap.push(map);
      collectMaps.addChild(map);

      if (j === 0) {
        let leftCoords = new Text(i + 27);
        leftCoords.position.set(50 * i + 25 - coordsFontSize / 2, 0);
        leftCoords.style = {
          fill: "white",
          fontFamily: "Teko",
          fontSize: coordsFontSize
        };
        collectMaps.addChild(leftCoords);
      }
      let depth = new Text("0ft");
      depth.style = {
        fill: "white",
        fontFamily: "Teko",
        fontSize: depthFontSize * 2
      };
      depth.scale.set(0.45, 0.45);
      if (
        i !== Math.floor(window.innerWidth / 100) ||
        j < Math.floor(window.innerHeight / 50) - 3
      ) {
        if (j % 2) {
          //even row
          if (i % 2) {
            let BeaconContainerElement = new Container();
            let redCircle = new Graphics();
            beaconCircle.anchor.x = 0.5;
            beaconCircle.anchor.y = 0.5;
            beaconDash.anchor.x = 0.5;
            beaconDash.anchor.y = 0.5;
            beacon.anchor.x = 0.5;
            beacon.anchor.y = 0.5;
            beacon.scale.set(0.3, 0.3);
            BeaconContainerElement.x = i * 50;
            BeaconContainerElement.y = j * 50;
            beacon.x = 25;
            beacon.y = 25;
            beaconDash.x = 25;
            beaconDash.y = 25;
            beaconCircle.x = 25;
            beaconCircle.y = 25;
            redCircle.x = 25;
            redCircle.y = 25;
            beaconCircle.scale.set(0.6, 0.6);
            beaconDash.scale.set(0.9, 0.9);
            beaconCircle.alpha = 0.3;
            beaconDash.alpha = 0.3;
            beacon.alpha = 0.7;
            BeaconContainerElement.addChild(redCircle);
            BeaconContainerElement.addChild(beaconCircle);
            BeaconContainerElement.addChild(beaconDash);
            BeaconContainerElement.addChild(beacon);
            depth.position.set(25 - depth.width / 2, 50 - depth.height);
            depth.alpha = 0.7;
            BeaconContainerElement.addChild(depth);
            BeaconContainerElement.visible = false;
            collectBeacons.addChild(BeaconContainerElement);
            BeaconContainer.push(BeaconContainerElement);
            beaconIndexLocation.push([i, j]);
          }
        } else {
          if (i % 2) {
          } else {
            let BeaconContainerElement = new Container();
            let redCircle = new Graphics();
            beaconCircle.anchor.x = 0.5;
            beaconCircle.anchor.y = 0.5;
            beaconDash.anchor.x = 0.5;
            beaconDash.anchor.y = 0.5;
            beacon.anchor.x = 0.5;
            beacon.anchor.y = 0.5;
            beacon.scale.set(0.3, 0.3);
            BeaconContainerElement.x = i * 50;
            BeaconContainerElement.y = j * 50;
            beacon.x = 25;
            beacon.y = 25;
            beaconDash.x = 25;
            beaconDash.y = 25;
            beaconCircle.x = 25;
            beaconCircle.y = 25;
            redCircle.x = 25;
            redCircle.y = 25;
            beaconCircle.scale.set(0.6, 0.6);
            beaconDash.scale.set(0.9, 0.9);
            beaconCircle.alpha = 0.3;
            beaconDash.alpha = 0.3;
            beacon.alpha = 0.7;
            beacon.alpha = 0.7;
            BeaconContainerElement.addChild(redCircle);
            BeaconContainerElement.addChild(beaconCircle);
            BeaconContainerElement.addChild(beaconDash);
            BeaconContainerElement.addChild(beacon);
            depth.position.set(25 - depth.width / 2, 50 - depth.height);
            BeaconContainerElement.addChild(depth);
            BeaconContainerElement.visible = false;
            collectBeacons.addChild(BeaconContainerElement);
            BeaconContainer.push(BeaconContainerElement);
            beaconIndexLocation.push([i, j]);
          }
        }
      }
    }
    mapsArray.push(horizontalMap);
  }
  gameGraphics.addChild(collectMaps);

  gameGraphics.addChild(collectBeacons);
  collectBeacons.children = shuffle(collectBeacons.children);
  nextBeaconContainer = new Array(BeaconContainer.length).fill(0);
  staticCircles = new Graphics();
  gameGraphics.addChild(staticCircles);

  gameGraphics.addChild(Battleship);

  let aim0 = new Sprite(loader.resources[aimSelectLink].texture);
  aim0.x = 0;
  aim0.y = 0;
  aim0.visible = false;
  aim0.anchor.x = 0.5;
  aim0.anchor.y = 0.5;
  aimSelectArray.push(aim0);
  let aim1 = new Sprite(loader.resources[aimSelectLink].texture);
  aim1.x = 0;
  aim1.y = 0;
  aim1.anchor.x = 0.5;
  aim1.anchor.y = 0.5;
  aim1.visible = false;
  aimSelectArray.push(aim1);
  gameGraphics.addChild(aim0);
  gameGraphics.addChild(aim1);
  fireButtonContainer = new Container();
  let message = new Text("FIRE");
  let rectangle = new Graphics();
  //rectangle.lineStyle(4, 0xff3300, 1);
  rectangle.beginFill(0x0c39bf);
  rectangle.drawRect(0, 0, 75, 35);
  rectangle.endFill();
  message.anchor.x = 0.5;
  message.anchor.y = 0.5;
  message.x = 75 / 2;
  message.y = 35 / 2;
  message.style = {
    fill: "#ffffff",
    fontFamily: "Teko",
    fontSize: 27
  };

  fireButtonContainer.addChild(rectangle);
  fireButtonContainer.addChild(message);
  fireButtonContainer.x = Math.floor(window.innerWidth / 100) * 50 - 12.5;
  fireButtonContainer.y = window.innerHeight - fireButtonContainer.height;
  fireButtonContainer.interactive = true;
  // Shows hand cursor
  fireButtonContainer.buttonMode = true;
  fireButtonContainer.on("pointerdown", event => onFire());
  fireButtonContainer.alpha = 0;
  gameGraphics.addChild(fireButtonContainer);
  /*line.lineStyle(1, 0xFFFFFF, 1);
line.moveTo(0, 0);
line.lineTo(80, 50);
line.x = 32;
line.y = 32;
*/

  let missileContainer0 = new Container();
  let line0 = new Graphics();
  let missile0 = new Sprite(loader.resources[missileLink].texture);
  missile0.anchor.x = 0.5;
  missile0.anchor.y = 0.5;
  missileContainer0.addChild(line0);
  missileContainer0.addChild(missile0);

  let missileContainer1 = new Container();
  let missile1 = new Sprite(loader.resources[missileLink].texture);
  missile1.anchor.x = 0.5;
  missile1.anchor.y = 0.5;
  let line1 = new Graphics();
  missileContainer1.addChild(line1);
  missileContainer1.addChild(missile1);

  missileContainer0.visible = false;
  missileContainer1.visible = false;

  gameGraphics.addChild(missileContainer0);
  gameGraphics.addChild(missileContainer1);
  missileContainer.push(missileContainer0);
  missileContainer.push(missileContainer1);
  gameGraphics.addChild(missileTrail);
  missile0Text = new Text("NaN");
  missile0Text.position.set(0, 0);
  missile0Text.style = {
    fill: "white",
    fontFamily: "Teko",
    fontSize: coordsFontSize - 2
  };
  missile0Text.visible = false;
  gameGraphics.addChild(missile0Text);
  missile1Text = new Text("NaN");
  missile1Text.position.set(0, 0);
  missile1Text.style = {
    fill: "white",
    fontFamily: "Teko",
    fontSize: coordsFontSize - 2
  };
  missile1Text.visible = false;
  gameGraphics.addChild(missile1Text);
  //gameGraphics.visible = false;
      Battleship.alpha = 1;
  
console.log(gameGraphics)
  gameGraphics.scale.x=2
      gameGraphics.scale.y=2
  
      //gameGraphics.pivot.set(Math.floor(window.innerWidth / 100) * 25+Battleship.width/4-25,window.innerHeight-Battleship.height*2)
  app.stage.addChild(gameGraphics);
  //console.log(collectMaps.children);

  let left = keyboard(37),
    up = keyboard(38),
    right = keyboard(39),
    down = keyboard(40);

  //Up
  up.press = () => {
    //console.log("press")
    yBattleship = -1 * shipDefaultSpeed;
    xBattleship = 0;
  };
  up.release = () => {
    if (!down.isDown && xBattleship === 0) {
      //yBattleship = 0;
    }
  };

  //Down
  down.press = () => {
    yBattleship = shipDefaultSpeed;
    xBattleship = 0;
  };
  down.release = () => {
    if (!up.isDown && xBattleship === 0) {
      //yBattleship = 0;
    }
  };
  gameState = 1;
  app.ticker.add(delta => gameLoop(delta));

  //console.log(beaconIndexLocation)
}
let staticRadius = 5,
  staticRadiusDelay = 0,
  staticAlpha = 0,
  BeaconContainerIndex = 0,
  indexDelay = 72,
  prevBeaconContainer = new Array(BeaconContainer.length).fill(0),
  startUpCount = 0,
  collectBeaconsArrayCount = 0,
  missile0X = 0,
  missile0Y = 0,
  missile1X = 0,
  missile1Y = 0,
  k = 0,
    pivotX = 0,pivotY = 0,
  enemyBeacon = [];
function gameLoop(delta) {
  if (gameState == 1) {
    if (collectBeaconsArrayCount < collectBeacons.children.length - 2) {
      collectBeacons.children[collectBeaconsArrayCount].visible = true;
      collectBeacons.children[collectBeaconsArrayCount + 1].visible = true;
      collectBeaconsArrayCount += 2;
    } else if (k < Math.ceil(mapsArray[0].length / 2)) {
      for (let l = 0; l < mapsArray.length; l++) {
        mapsArray[l][k].alpha = 1;
      }
      for (let l = 0; l < mapsArray.length; l++) {
        //console.log("/", mapsArray[l][k].alpha,l,k,mapsArray.length,mapsArray[1].length);
        mapsArray[l][mapsArray[0].length - 1 - k].alpha = 1;
      }
      k += 1;
      //collectMaps.alpha+=0.05
    } else if (fireButtonContainer.alpha < 1) {
      //Battleship.alpha += 0.03;
      fireButtonContainer.alpha = fireButtonContainer.alpha+0.03;
      //console.log(parseFloat(fireButtonContainer.alpha.toPrecision(3)),fireButtonContainer.alpha-1)
      gameGraphics.scale.x-=0.03
      gameGraphics.scale.y-=0.03
      /*console.log(gameGraphics.scale.x,
      gameGraphics.scale.y
      )
      //if(fireButtonContainer.alpha<1){
      //if(fireButtonContainer.alpha===0.27 || fireButtonContainer.alpha===0.6000000000000003 || fireButtonContainer.alpha===0.9900000000000007){
      gameGraphics.pivot.set((Math.floor(window.innerWidth / 100) * 25+Battleship.width/4-25)*(1-fireButtonContainer.alpha),(window.innerHeight-Battleship.height*2)*(1-fireButtonContainer.alpha))
      //console.log(gameGraphics.pivot.x,gameGraphics.pivot.y)
      //console.log(Battleship.x,Battleship.y)
      */
    } else {
      //gameGraphics.pivot.set(0,0)
      gameGraphics.scale.x=1
      gameGraphics.scale.y=1
      console.log("Game state to 0");
      gameState = 0;
    }
  }
  //console.log(yBattleship);
  //Battleship.x = Battleship.x + xBattleship;
  Battleship.y = Battleship.y + yBattleship;
  //yBattleship += yBattleship / 100;
  if (Battleship.y < 0) {
    Battleship.y = 2;
  }
  if (Battleship.x < 0) {
    Battleship.x = 2;
  }
  if (Battleship.x > xGraph * 50) {
    Battleship.x = xGraph * 50 - 2;
  }
  if (Battleship.y > yGraph * 50 - ship.height - 2) {
    Battleship.y = yGraph * 50 - ship.height - 2;
  }
  staticCircles.clear();
  if (indexDelay > 30) {
    prevBeaconContainer = nextBeaconContainer.slice(0);
    BeaconContainer.map((each, index) => {
      if (enemyBeacon.includes(index)) {
        nextBeaconContainer[index] = 23;
        each.children[4].text = 15 + "ft";
        each.children[4].position.set(25 - each.children[4].width / 2, 50);
      } else {
        let value = (Math.random() * 8).toPrecision(1);
        nextBeaconContainer[index] = parseInt(value);
        if (Math.random() * 10 > 7) {
          each.children[4].text = value + "ft";
          each.children[4].position.set(
            25 - each.children[4].width / 2,
            50 - each.children[4].height
          );
        }
      }
    });
    indexDelay = 0;
  } else {
    BeaconContainer.map((each, index) => {
      if (enemyBeacon.includes(index)) {
        let radius =
          prevBeaconContainer[index] +
          ((nextBeaconContainer[index] - prevBeaconContainer[index]) / 30) *
            indexDelay;
        staticCircles.beginFill(0xffffff, 1 - (staticRadius - 10) / 30);
        staticCircles.drawCircle(
          beaconIndexLocation[index][0] * 50 + 25,
          beaconIndexLocation[index][1] * 50 + 25,
          staticRadius
        );
        staticCircles.beginHole();
        staticCircles.drawCircle(
          beaconIndexLocation[index][0] * 50 + 25,
          beaconIndexLocation[index][1] * 50 + 25,
          staticRadius - 2
        );

        staticCircles.endHole();
        each.children[3].alpha = 1;
        each.children[1].alpha = 1;
        each.children[2].alpha = 1;
        each.children[0].clear();
        each.children[0].beginFill(0xff0000, 0.5);
        each.children[0].drawCircle(0, 0, radius);

        each.children[0].endFill();
      } else {
        let radius =
          prevBeaconContainer[index] +
          ((nextBeaconContainer[index] - prevBeaconContainer[index]) / 30) *
            indexDelay;
        //console.log(radius)
        each.children[3].alpha = radius / 10 + 0.3;
        each.children[1].alpha = radius / 10 - 0.4;
        each.children[2].alpha = radius / 10 - 0.4;
        each.children[0].clear();
        each.children[0].beginFill(0xff0000, 0.5);
        each.children[0].drawCircle(0, 0, radius);

        each.children[0].endFill();
      }
    });
    if (staticRadius < 40) {
      staticRadius += 1;
    } else {
      if (staticRadiusDelay < 30) {
        staticRadiusDelay += 1;
      } else {
        staticRadius = 10;
        staticRadiusDelay = 0;
      }
    }
    indexDelay += 1;
  }
  missileTrail.clear();
  missile0Text.visible = false;
  missile1Text.visible = false;

  if (missileContainer[0].visible === true) {
    if (missileContainer[0].x > aimSelectArray[0].x) {
      missileContainer[0].x -= missile0X;
    } else {
      missileContainer[0].x += missile0X;
    }
    if (missileContainer[0].y > aimSelectArray[0].y) {
      missileContainer[0].y -= missile0Y;
    } else {
      missileContainer[0].y += missile0Y;
    }
    if (
      Math.abs(missileContainer[0].x - aimSelectArray[0].x) < 25 &&
      Math.abs(missileContainer[0].y - aimSelectArray[0].y) < 25
    ) {
      missileContainer[0].visible = false;
    }
    missile0Text.visible = true;
    missile0Text.text =
      Math.sqrt(
        Math.pow(missileContainer[0].x - aimSelectArray[0].x, 2) +
          Math.pow(missileContainer[0].y - aimSelectArray[0].y, 2)
      ).toPrecision(7) + "\n ata M_72";
    missile0Text.position.set(
      missileContainer[0].x + coordsFontSize,
      missileContainer[0].y - coordsFontSize
    );
    missileTrail.lineStyle(2, 0xffffff, 0.7);
    missileTrail.moveTo(
      Battleship.x + ship.width / 2,
      Battleship.y + ship.height / 4
    );
    missileTrail.lineTo(missileContainer[0].x, missileContainer[0].y);
    missileTrail.x = 0;
    missileTrail.y = 0;
  }
  if (missileContainer[1].visible === true) {
    if (missileContainer[1].x > aimSelectArray[1].x) {
      missileContainer[1].x -= missile1X;
    } else {
      missileContainer[1].x += missile1X;
    }
    if (missileContainer[1].y > aimSelectArray[1].y) {
      missileContainer[1].y -= missile1Y;
    } else {
      missileContainer[1].y += missile1Y;
    }
    if (
      Math.abs(missileContainer[1].x - aimSelectArray[1].x) < 25 &&
      Math.abs(missileContainer[1].y - aimSelectArray[1].y) < 25
    ) {
      missileContainer[1].visible = false;
    }
    missile1Text.visible = true;
    missile1Text.text =
      Math.sqrt(
        Math.pow(missileContainer[1].x - aimSelectArray[1].x, 2) +
          Math.pow(missileContainer[1].y - aimSelectArray[1].y, 2)
      ).toPrecision(7) + "\n ata M_77";
    missile1Text.position.set(
      missileContainer[1].x + coordsFontSize,
      missileContainer[1].y - coordsFontSize
    );
    missileTrail.lineStyle(2, 0xffffff, 0.7);
    missileTrail.moveTo(
      Battleship.x + ship.width / 2,
      Battleship.y + 3 * (ship.height / 4)
    );
    missileTrail.lineTo(missileContainer[1].x, missileContainer[1].y);
    missileTrail.x = 0;
    missileTrail.y = 0;
  }
}
enemyShips = new Graphics();
let enemyX, enemyY;
var enemyKey = setInterval(enemyFunction, 4000);
function enemyFunction() {
  enemyX = randomNumber(0, Math.floor(window.innerWidth / 50));
  enemyY = randomNumber(0, Math.floor(window.innerHeight / 50));
  enemyShips.clear();
  enemyShips.beginFill(0x66ccff);
  enemyShips.drawRect(0, 0, 50, 50);
  enemyShips.endFill();
  enemyShips.x = enemyX * 50;
  enemyShips.y = enemyY * 50;
  enemyShips.alpha = 0;
  var index = beaconIndexLocation.findIndex(findIndexFunc);
  enemyBeacon = [];
  if (index !== -1) {
    //console.log("yoooooooooooooooo!!!!!!!!!!!!!!!!!!!!!!!!!!!");
    enemyBeacon.push(index);
  }

  app.stage.addChild(enemyShips);
}
function findIndexFunc(each) {
  if (each[0] === enemyX && each[1] === enemyY) {
    return true;
  } else {
    return false;
  }
}

function onFire() {
  if (aimSelectArray[0].visible === true) {
    missileContainer[0].visible = true;
    missileContainer[0].x = Battleship.x;
    missileContainer[0].y = Battleship.y + ship.height / 4;
    missile0X =
      Math.abs(missileContainer[0].x - aimSelectArray[0].x) /
      Math.sqrt(
        Math.pow(missileContainer[0].y - aimSelectArray[0].y, 2) +
          Math.pow(missileContainer[0].x - aimSelectArray[0].x, 2)
      );

    missile0Y =
      Math.abs(missileContainer[0].y - aimSelectArray[0].y) /
      Math.sqrt(
        Math.pow(missileContainer[0].y - aimSelectArray[0].y, 2) +
          Math.pow(missileContainer[0].x - aimSelectArray[0].x, 2)
      );
    if (missileContainer[0].y - aimSelectArray[0].y >= 0) {
      if (missileContainer[0].x - aimSelectArray[0].x >= 0) {
        missileContainer[0].children[1].rotation = Math.acos(missile0X) + 3.142;
      } else {
        missileContainer[0].children[1].rotation = Math.asin(missile0X) - 1.571;
      }
    } else {
      if (missileContainer[0].x - aimSelectArray[0].x >= 0) {
        missileContainer[0].children[1].rotation = Math.asin(missile0X) + 1.571;
      } else {
        missileContainer[0].children[1].rotation = Math.acos(missile0X);
      }
    }
    missile0X = missile0X;
    missile0Y = missile0Y;
  }
  if (aimSelectArray[1].visible === true) {
    missileContainer[1].visible = true;
    missileContainer[1].x = Battleship.x;
    missileContainer[1].y = Battleship.y + 3 * (ship.height / 4);
    missile1X =
      Math.abs(missileContainer[1].x - aimSelectArray[1].x) /
      Math.sqrt(
        Math.pow(missileContainer[1].y - aimSelectArray[1].y, 2) +
          Math.pow(missileContainer[1].x - aimSelectArray[1].x, 2)
      );

    missile1Y =
      Math.abs(missileContainer[1].y - aimSelectArray[1].y) /
      Math.sqrt(
        Math.pow(missileContainer[1].y - aimSelectArray[1].y, 2) +
          Math.pow(missileContainer[1].x - aimSelectArray[1].x, 2)
      );
    if (missileContainer[1].y - aimSelectArray[1].y >= 0) {
      if (missileContainer[1].x - aimSelectArray[1].x >= 0) {
        missileContainer[1].children[1].rotation = Math.acos(missile1X) + 3.142;
      } else {
        missileContainer[1].children[1].rotation = Math.asin(missile1X) - 1.571;
      }
    } else {
      if (missileContainer[1].x - aimSelectArray[1].x >= 0) {
        missileContainer[1].children[1].rotation = Math.asin(missile1X) + 1.571;
      } else {
        missileContainer[1].children[1].rotation = Math.acos(missile1X);
      }
    }
    missile1X = missile1X;
    missile1Y = missile1Y;
  }
}
let bit = 0;
function onClick(object) {
  missileContainer[0].visible = false;
  missileContainer[1].visible = false;
  //console.log(aimSelectArray[0].x, object.x, aimSelectArray[0].y, object.y);
  if (
    aimSelectArray[0].x === object.x + 25 &&
    aimSelectArray[0].y === object.y + 25
  ) {
    aimSelectArray[0].visible = false;
  } else if (
    aimSelectArray[1].x === object.x + 25 &&
    aimSelectArray[1].y === object.y + 25
  ) {
    aimSelectArray[1].visible = false;
  } else {
    if (aimSelectArray[0].visible === false) {
      aimSelectArray[0].x = object.x + 25;
      aimSelectArray[0].y = object.y + 25;
      aimSelectArray[0].visible = true;
    } else {
      if (aimSelectArray[1].visible === false) {
        aimSelectArray[1].x = object.x + 25;
        aimSelectArray[1].y = object.y + 25;
        aimSelectArray[1].visible = true;
      } else {
        if (bit === 0) {
          aimSelectArray[0].x = object.x + 25;
          aimSelectArray[0].y = object.y + 25;
          aimSelectArray[0].visible = true;
          bit = 1;
        } else {
          aimSelectArray[1].x = object.x + 25;
          aimSelectArray[1].y = object.y + 25;
          aimSelectArray[1].visible = true;
          bit = 0;
        }
      }
    }
  }
  //aimSelectArray[1].tint = 0x0c39bf;
}
let shipDirBit = 1;
function onBattleshipClick() {
  if (shipDirBit === 1) {
    yBattleship = -1 * shipDefaultSpeed;
    shipDirBit = -1;
  } else {
    yBattleship = shipDefaultSpeed;
    shipDirBit = 1;
  }
}
//The `keyboard` helper function
function keyboard(keyCode) {
  var key = {};
  key.code = keyCode;
  key.isDown = false;
  key.isUp = true;
  key.press = undefined;
  key.release = undefined;
  //The `downHandler`
  key.downHandler = event => {
    if (event.keyCode === key.code) {
      if (key.isUp && key.press) key.press();
      key.isDown = true;
      key.isUp = false;
    }
    event.preventDefault();
  };

  //The `upHandler`
  key.upHandler = event => {
    if (event.keyCode === key.code) {
      if (key.isDown && key.release) key.release();
      key.isDown = false;
      key.isUp = true;
    }
    event.preventDefault();
  };

  //Attach event listeners
  window.addEventListener("keydown", key.downHandler.bind(key), false);
  window.addEventListener("keyup", key.upHandler.bind(key), false);
  return key;
}
function shuffle(array) {
  var currentIndex = array.length,
    temporaryValue,
    randomIndex;

  // While there remain elements to shuffle...
  while (0 !== currentIndex) {
    // Pick a remaining element...
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex -= 1;

    // And swap it with the current element.
    temporaryValue = array[currentIndex];
    array[currentIndex] = array[randomIndex];
    array[randomIndex] = temporaryValue;
  }

  return array;
}
function hitTestRectangle(r1, r2) {
  //Define the variables we'll need to calculate
  let hit, combinedHalfWidths, combinedHalfHeights, vx, vy;

  //hit will determine whether there's a collision
  hit = false;

  //Find the center points of each sprite
  r1.centerX = r1.x + r1.width / 2;
  r1.centerY = r1.y + r1.height / 2;
  r2.centerX = r2.x + r2.width / 2;
  r2.centerY = r2.y + r2.height / 2;

  //Find the half-widths and half-heights of each sprite
  r1.halfWidth = r1.width / 2;
  r1.halfHeight = r1.height / 2;
  r2.halfWidth = r2.width / 2;
  r2.halfHeight = r2.height / 2;

  //Calculate the distance vector between the sprites
  vx = r1.centerX - r2.centerX;
  vy = r1.centerY - r2.centerY;

  //Figure out the combined half-widths and half-heights
  combinedHalfWidths = r1.halfWidth + r2.halfWidth;
  combinedHalfHeights = r1.halfHeight + r2.halfHeight;

  //Check for a collision on the x axis
  if (Math.abs(vx) < combinedHalfWidths) {
    //A collision might be occurring. Check for a collision on the y axis
    if (Math.abs(vy) < combinedHalfHeights) {
      //There's definitely a collision happening
      hit = true;
    } else {
      //There's no collision on the y axis
      hit = false;
    }
  } else {
    //There's no collision on the x axis
    hit = false;
  }

  //`hit` will be either `true` or `false`
  return hit;
}
// Function to generate random number
function randomNumber(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1)) + min;
}
//Left arrow key `press` method
/*left.press = () => {
    //Change the cat's velocity when the key is pressed
    xBattleship = -5;
    yBattleship = 0;
  };

  //Left arrow key `release` method
  left.release = () => {
    //If the left arrow has been released, and the right arrow isn't down,
    //and the cat isn't moving vertically:
    //Stop the cat
    if (!right.isDown && yBattleship === 0) {
      xBattleship = 0;
    }
  };
  //Right
  right.press = () => {
    xBattleship = 5;
    yBattleship = 0;
  };
  right.release = () => {
    if (!left.isDown && yBattleship === 0) {
      xBattleship = 0;
    }
  };
*/

/*
An alternative to hollow circles(seems to suffer rendering issues on android)
staticCircles.lineStyle(1, 0xffffff);
staticCircles.drawCircle(i * 100, j * 100, staticRadius); // drawCircle(x, y, radius)
staticCircles.endFill();
*/

/*if (staticAlpha < 1) {
    staticRadiusDelay = 0;
    for (let j = 0; j < yGraph; j++) {
      for (let i = 0; i < xGraph; i++) {
        
        if (j % 2) {
          //even row
          if (i % 2) {
            staticCircles.beginFill(0xffffff, staticAlpha);
            staticCircles.drawCircle(
              i * 50 + 25,
              j * 50 + 25,
              staticRadius - 2
            );
            staticCircles.beginHole();
            staticCircles.drawCircle(
              i * 50 + 25,
              j * 50 + 25,
              staticRadius - 3
            );
            staticCircles.endHole();
            staticCircles.beginFill(0xffffff, staticAlpha - 0.1);

            staticCircles.drawCircle(
              i * 50 + 25,
              j * 50 + 25,
              staticRadius + 4
            );
            staticCircles.beginHole();
            staticCircles.drawCircle(
              i * 50 + 25,
              j * 50 + 25,
              staticRadius + 3
            );
            staticCircles.endHole();
            staticCircles.beginFill(0xffffff, staticAlpha - 0.18);

            staticCircles.drawCircle(
              i * 50 + 25,
              j * 50 + 25,
              staticRadius + 9
            );
            staticCircles.beginHole();
            staticCircles.drawCircle(
              i * 50 + 25,
              j * 50 + 25,
              staticRadius + 8
            );
            staticCircles.endHole();
            staticCircles.endFill();
            //BeaconContainer.map(each=>{console.log(each)})
          }
        } else {
          if (i % 2) {
          } else {
            staticCircles.beginFill(0xffffff, staticAlpha);
            staticCircles.drawCircle(
              i * 50 + 25,
              j * 50 + 25,
              staticRadius - 2
            );
            staticCircles.beginHole();
            staticCircles.drawCircle(
              i * 50 + 25,
              j * 50 + 25,
              staticRadius - 3
            );
            staticCircles.endHole();

            staticCircles.drawCircle(
              i * 50 + 25,
              j * 50 + 25,
              staticRadius + 4
            );
            staticCircles.beginHole();
            staticCircles.drawCircle(
              i * 50 + 25,
              j * 50 + 25,
              staticRadius + 3
            );
            staticCircles.endHole();

            staticCircles.drawCircle(
              i * 50 + 25,
              j * 50 + 25,
              staticRadius + 9
            );
            staticCircles.beginHole();
            staticCircles.drawCircle(
              i * 50 + 25,
              j * 50 + 25,
              staticRadius + 8
            );
            staticCircles.endHole();
            staticCircles.endFill();
          }
        }
      }
    }
    //staticRadius += 0.3;
    staticAlpha += 0.0375;
  } else {
    staticRadius = 15;
    staticAlpha = 0;
  }*/
