//Aliases
const graphLink =
  "https://cdn.glitch.com/eb939e0e-ddd3-4d33-89f1-34204db1d01e%2FgraphStrip.png?v=1589484613957";
const battleshipLink =
  "https://cdn.glitch.com/eb939e0e-ddd3-4d33-89f1-34204db1d01e%2Ffinal.png?v=1589491217614";
const shipTitleLink =
  "https://cdn.glitch.com/eb939e0e-ddd3-4d33-89f1-34204db1d01e%2Fimage%20(1).png?v=1589495178198";
const beaconLink =
  "https://cdn.glitch.com/eb939e0e-ddd3-4d33-89f1-34204db1d01e%2Fimage%20(6).png?v=1589635889012";
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
//Add the canvas that Pixi automatically created for you to the HTML document
document.body.appendChild(app.view);
const alphabetArray = "LKJIHGFEDCBAZYXWVUTSRQPONM".split("");
loader.add([graphLink, battleshipLink, shipTitleLink, beaconLink]).load(setup);
let Battleship,
  ship,
  coordsFontSize = 14,
  circle,
  xGraph,
  yGraph,
  staticCircles,
  BeaconContainer = [],
  nextBeaconContainer;
function setup() {
  for (let j = 0; j < window.innerHeight / 100; j++) {
    let leftCoords = new Text(alphabetArray[j]);

    leftCoords.position.set(0, 100 * j + 50 - coordsFontSize / 2);
    leftCoords.style = {
      fill: "white",
      fontFamily: "Arial",
      fontSize: coordsFontSize
    };
    app.stage.addChild(leftCoords);
    for (let i = 0; i < window.innerWidth / 100; i++) {
      let map = new Sprite(loader.resources[graphLink].texture);

      let beacon = new Sprite(loader.resources[beaconLink].texture);

      map.scale.set(0.5, 0.5);
      map.x = 100 * i;
      map.y = 100 * j;
      app.stage.addChild(map);
      if (j === 0) {
        let leftCoords = new Text(i + 27);

        leftCoords.position.set(100 * i + 50 - coordsFontSize / 2, 0);
        leftCoords.style = {
          fill: "white",
          fontFamily: "Arial",
          fontSize: coordsFontSize
        };
        app.stage.addChild(leftCoords);
      }
      let depth = new Text("0ft");
      depth.style = {
        fill: "white",
        fontFamily: "Arial",
        fontSize: coordsFontSize * 2
      };
      depth.scale.set(0.45, 0.45);

      if (j % 2) {
        //even row
        if (i % 2) {
          let BeaconContainerElement = new Container();
          let redCircle = new Graphics();

          beacon.anchor.x = 0.5;
          beacon.anchor.y = 0.5;
          beacon.scale.set(0.7, 0.7);
          BeaconContainerElement.x = i * 100;
          BeaconContainerElement.y = j * 100;
          beacon.x = 50;
          beacon.y = 50;
          redCircle.x = 50;
          redCircle.y = 50;
          BeaconContainerElement.addChild(redCircle);

          BeaconContainerElement.addChild(beacon);
          depth.position.set(50 - depth.width / 2, 100 - depth.height);
          BeaconContainerElement.addChild(depth);

          app.stage.addChild(BeaconContainerElement);
          BeaconContainer.push(BeaconContainerElement);
        }
      } else {
        if (i % 2) {
        } else {
          let BeaconContainerElement = new Container();
          let redCircle = new Graphics();

          beacon.anchor.x = 0.5;
          beacon.anchor.y = 0.5;
          beacon.scale.set(0.7, 0.7);
          BeaconContainerElement.x = i * 100;
          BeaconContainerElement.y = j * 100;
          beacon.x = 50;
          beacon.y = 50;
          redCircle.x = 50;
          redCircle.y = 50;
          BeaconContainerElement.addChild(redCircle);

          BeaconContainerElement.addChild(beacon);
          depth.position.set(50 - depth.width / 2, 100 - depth.height);
          BeaconContainerElement.addChild(depth);

          app.stage.addChild(BeaconContainerElement);
          BeaconContainer.push(BeaconContainerElement);
        }
      }
    }
  }

  nextBeaconContainer = new Array(BeaconContainer.length).fill(0);
  staticCircles = new Graphics();
  app.stage.addChild(staticCircles);

  xGraph = Math.floor(window.innerWidth / 100);
  yGraph = Math.floor(window.innerHeight / 100);

  ship = new Sprite(loader.resources[battleshipLink].texture);
  //console.log(window.innerWidth, window.innerHeight, yGraph);
  ship.scale.set(0.7, 0.7);
  Battleship = new Container();

  let shipTitle = new Sprite(loader.resources[shipTitleLink].texture);
  shipTitle.x = ship.x + ship.width - 7;
  //shipTitle.scale.set(0.7, 0.7);

  Battleship.addChild(ship);
  Battleship.addChild(shipTitle);
  Battleship.x = xGraph * 50 - ship.width;
  Battleship.y = yGraph * 100 - ship.height;
  app.stage.addChild(Battleship);
  app.ticker.add(delta => gameLoop(delta));
}
let staticRadius = 20,
  staticRadiusDelay = 0,
  staticAlpha = 1,
  BeaconContainerIndex = 0,
  indexDelay = 0,
  prevBeaconContainer = [];

function gameLoop(delta) {
  staticCircles.clear();
  if (indexDelay > 60) {
    prevBeaconContainer = nextBeaconContainer.slice(0);
    BeaconContainer.map((each, index) => {
      let value = (Math.random() * 3.5 + 1).toPrecision(2);
      nextBeaconContainer[index] = parseInt(value);

      each.children[2].text = value + "ft";
    });
    indexDelay = 0;
  } else {
    BeaconContainer.map((each, index) => {
      let radius =
        prevBeaconContainer[index] +
        ((nextBeaconContainer[index] - prevBeaconContainer[index]) / 60) *
          indexDelay;

      each.children[0].clear();
      each.children[0].beginFill(0xff0000, 0.5);
      each.children[0].drawCircle(0, 0, radius * 2);

      each.children[0].endFill();
    });
    indexDelay += 1;
  }
  if (staticRadius < 40) {
    staticRadiusDelay = 0;
    for (let j = 0; j < yGraph; j++) {
      for (let i = 0; i < xGraph; i++) {
        /*
        An alternative to hollow circles(seems to suffer rendering issues on android)
        staticCircles.lineStyle(1, 0xffffff);
        staticCircles.drawCircle(i * 100, j * 100, staticRadius); // drawCircle(x, y, radius)
        staticCircles.endFill();
        */
        if (j % 2) {
          //even row
          if (i % 2) {
            staticCircles.beginFill(0xffffff, staticAlpha);
            staticCircles.drawCircle(i * 100 + 50, j * 100 + 50, staticRadius);
            staticCircles.beginHole();
            staticCircles.drawCircle(
              i * 100 + 50,
              j * 100 + 50,
              staticRadius - 1
            );
            staticCircles.endHole();
            staticCircles.endFill();
            //BeaconContainer.map(each=>{console.log(each)})
          }
        } else {
          if (i % 2) {
          } else {
            staticCircles.beginFill(0xffffff, staticAlpha);
            staticCircles.drawCircle(i * 100 + 50, j * 100 + 50, staticRadius);
            staticCircles.beginHole();
            staticCircles.drawCircle(
              i * 100 + 50,
              j * 100 + 50,
              staticRadius - 1
            );
            staticCircles.endHole();
            staticCircles.endFill();
          }
        }
      }
    }
    staticRadius += 0.3;
    staticAlpha -= 0.015;
  } else {
    if (staticRadiusDelay > 40) {
      staticRadius = 20;
      staticAlpha = 1;
    } else {
      staticRadiusDelay += 1;
    }
  }
}
