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
  loader = PIXI.loader,
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
  fireButtonContainer;
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

  for (let j = 0; j < window.innerHeight / 50; j++) {
    let leftCoords = new Text(alphabetArray[j]);

    leftCoords.position.set(0, 50 * j + 25 - coordsFontSize / 2);
    leftCoords.style = {
      fill: "white",
      fontFamily: "Teko",
      fontSize: coordsFontSize
    };
    app.stage.addChild(leftCoords);

    for (let i = 0; i < window.innerWidth / 50; i++) {
      //console.log(i, j);
      let map = new Sprite(loader.resources[graphLink].texture);
      let beacon = new Sprite(loader.resources[beaconLink].texture);
      let beaconCircle = new Sprite(loader.resources[beaconCircleLink].texture);
      let beaconDash = new Sprite(loader.resources[beaconDashLink].texture);
      map.scale.set(0.25, 0.25);
      map.x = 50 * i;
      map.y = 50 * j;
      // Opt-in to interactivity
      map.interactive = true;

      // Shows hand cursor
      map.buttonMode = true;

      // Pointers normalize touch and mouse
      map.on("pointerdown", event => onClick(map));
      app.stage.addChild(map);

      if (j === 0) {
        let leftCoords = new Text(i + 27);
        leftCoords.position.set(50 * i + 25 - coordsFontSize / 2, 0);
        leftCoords.style = {
          fill: "white",
          fontFamily: "Teko",
          fontSize: coordsFontSize
        };
        app.stage.addChild(leftCoords);
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
            app.stage.addChild(BeaconContainerElement);
            BeaconContainer.push(BeaconContainerElement);
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
            app.stage.addChild(BeaconContainerElement);
            BeaconContainer.push(BeaconContainerElement);
          }
        }
      }
    }
  }

  nextBeaconContainer = new Array(BeaconContainer.length).fill(0);
  staticCircles = new Graphics();
  app.stage.addChild(staticCircles);

  app.stage.addChild(Battleship);

  let aim0 = new Sprite(loader.resources[aimSelectLink].texture);
  aim0.x = 0;
  aim0.y = 0;
  aim0.visible = false;
  aimSelectArray.push(aim0);
  let aim1 = new Sprite(loader.resources[aimSelectLink].texture);
  aim1.x = 0;
  aim1.y = 0;
  aim1.visible = false;
  aimSelectArray.push(aim1);
  app.stage.addChild(aim0);
  app.stage.addChild(aim1);
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

  fireButtonContainer.x = Math.floor(window.innerWidth / 100) * 50 - 12.5;
  fireButtonContainer.y = Battleship.y + ship.height;
  fireButtonContainer.addChild(rectangle);
  fireButtonContainer.addChild(message);
  fireButtonContainer.interactive = true;
  // Shows hand cursor
  fireButtonContainer.buttonMode = true;
  app.stage.addChild(fireButtonContainer);

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
  app.ticker.add(delta => gameLoop(delta));
}
let staticRadius = 5,
  staticRadiusDelay = 0,
  staticAlpha = 0,
  BeaconContainerIndex = 0,
  indexDelay = 0,
  prevBeaconContainer = [];

function gameLoop(delta) {
  //console.log(yBattleship);
  //Battleship.x = Battleship.x + xBattleship;
  Battleship.y = Battleship.y + yBattleship;
  yBattleship += yBattleship / 100;
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
  if (indexDelay > 60) {
    prevBeaconContainer = nextBeaconContainer.slice(0);
    BeaconContainer.map((each, index) => {
      let value = (Math.random() * 8).toPrecision(1);
      nextBeaconContainer[index] = parseInt(value);
      if (Math.random() * 10 > 7) {
        each.children[4].text = value + "ft";
      }
    });
    indexDelay = 0;
  } else {
    BeaconContainer.map((each, index) => {
      let radius =
        prevBeaconContainer[index] +
        ((nextBeaconContainer[index] - prevBeaconContainer[index]) / 60) *
          indexDelay;
      each.children[3].alpha = radius / 10 + 0.3;
      each.children[1].alpha = radius / 10 - 0.3;
      each.children[2].alpha = radius / 10 - 0.3;
      each.children[0].clear();
      each.children[0].beginFill(0xff0000, 0.5);
      each.children[0].drawCircle(0, 0, radius);

      each.children[0].endFill();
    });
    indexDelay += 1;
  }
}
let bit = 0;
function onClick(object) {
  //console.log(aimSelectArray[0].x, object.x, aimSelectArray[0].y, object.y);
  if (aimSelectArray[0].x === object.x && aimSelectArray[0].y === object.y) {
    aimSelectArray[0].visible = false;
  } else if (
    aimSelectArray[1].x === object.x &&
    aimSelectArray[1].y === object.y
  ) {
    aimSelectArray[1].visible = false;
  } else {
    if (aimSelectArray[0].visible === false) {
      aimSelectArray[0].x = object.x;
      aimSelectArray[0].y = object.y;
      aimSelectArray[0].visible = true;
    } else {
      if (aimSelectArray[1].visible === false) {
        aimSelectArray[1].x = object.x;
        aimSelectArray[1].y = object.y;
        aimSelectArray[1].visible = true;
      } else {
        if (bit === 0) {
          aimSelectArray[0].x = object.x;
          aimSelectArray[0].y = object.y;
          aimSelectArray[0].visible = true;
          bit = 1;
        } else {
          aimSelectArray[1].x = object.x;
          aimSelectArray[1].y = object.y;
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
