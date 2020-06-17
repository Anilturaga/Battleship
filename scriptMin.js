const defaultIcon="url('https://cdn.glitch.com/eb939e0e-ddd3-4d33-89f1-34204db1d01e%2FmouseIcon.png?v=1590613190407'),auto",hoverIcon="url('https://cdn.glitch.com/eb939e0e-ddd3-4d33-89f1-34204db1d01e%2FmouseIcon.png?v=1590613190407'),auto",graphLink="https://cdn.glitch.com/eb939e0e-ddd3-4d33-89f1-34204db1d01e%2FgraphStrip.png?v=1589484613957",battleshipLink="https://cdn.glitch.com/eb939e0e-ddd3-4d33-89f1-34204db1d01e%2Ffinal.png?v=1590529479858",shipTitleLink="https://cdn.glitch.com/eb939e0e-ddd3-4d33-89f1-34204db1d01e%2FshipTitle.png?v=1590626588148",beaconLink="https://cdn.glitch.com/eb939e0e-ddd3-4d33-89f1-34204db1d01e%2FbeaconFinal.png?v=1590502672115",beaconCircleLink="https://cdn.glitch.com/eb939e0e-ddd3-4d33-89f1-34204db1d01e%2Fimage%20(1).png?v=1590515832132",beaconDashLink="https://cdn.glitch.com/eb939e0e-ddd3-4d33-89f1-34204db1d01e%2Fimage%20(3).png?v=1590515811210",missileLink="https://cdn.glitch.com/eb939e0e-ddd3-4d33-89f1-34204db1d01e%2Fmissile.png?v=1590607688510",aimSelectLink="https://cdn.glitch.com/eb939e0e-ddd3-4d33-89f1-34204db1d01e%2FaimSelect.png?v=1590613654731";let Application=PIXI.Application,Container=PIXI.Container,loader=PIXI.Loader.shared,resources=PIXI.loader.resources,Graphics=PIXI.Graphics,TextureCache=PIXI.utils.TextureCache,Sprite=PIXI.Sprite,Text=PIXI.Text,TextStyle=PIXI.TextStyle,app=new Application({width:window.innerWidth,height:window.innerHeight,antialiasing:!0,transparent:!1,resolution:1});app.renderer.view.style.position="absolute",app.renderer.view.style.display="block",app.renderer.autoResize=!0,app.renderer.resize(window.innerWidth,window.innerHeight),app.renderer.plugins.interaction.cursorStyles.default=defaultIcon,app.renderer.plugins.interaction.cursorStyles.pointer=hoverIcon,document.body.appendChild(app.view);const alphabetArray="QPONMLKJIHGFEDCBAZYXWVUTSR".split("");function loadProgressHandler(){console.log("loading")}loader.add([graphLink,battleshipLink,shipTitleLink,beaconLink,beaconCircleLink,beaconDashLink,missileLink,aimSelectLink]).on("progress",loadProgressHandler).load(setup);let Battleship,ship,circle,xGraph,yGraph,staticCircles,nextBeaconContainer,fireButtonContainer,collectBeacons,collectMaps,missile0Text,missile1Text,healthBar,healthText,enemyNumber,enemyNumberText,enemyNumberTextValue,missileNumber,missileNumberText,missileNumberTextValue,enemyShips,coordsFontSize=18,depthFontSize=15,BeaconContainer=[],xBattleship=0,yBattleship=0,aimSelectArray=[],shipDefaultSpeed=.5,missileContainer=[],beaconIndexLocation=[],gameGraphics=new Container,gameState=0,missileTrail=new Graphics,mapsArray=[];function setup(){xGraph=Math.floor(window.innerWidth/50),yGraph=Math.floor(window.innerHeight/50),(ship=new Sprite(loader.resources[battleshipLink].texture)).scale.set(.5,.5),Battleship=new Container;let e=new Sprite(loader.resources[shipTitleLink].texture);e.x=ship.width-14,e.y=ship.y-7,e.scale.set(.9,.9),Battleship.addChild(ship),Battleship.addChild(e),Battleship.x=50*Math.floor(window.innerWidth/100)+15,Battleship.y=50*yGraph-ship.height,Battleship.on("pointerdown",onBattleshipClick),Battleship.alpha=0,collectBeacons=new Container,collectMaps=new Container;for(let e=0;e<window.innerHeight/50;e++){let a=new Text(alphabetArray[e]);a.position.set(0,50*e+25-coordsFontSize/2),a.style={fill:"white",fontFamily:"Teko",fontSize:coordsFontSize},collectMaps.addChild(a);var i=[];for(let a=0;a<window.innerWidth/50;a++){let t=new Sprite(loader.resources[graphLink].texture),n=new Sprite(loader.resources[beaconLink].texture),l=new Sprite(loader.resources[beaconCircleLink].texture),s=new Sprite(loader.resources[beaconDashLink].texture);if(t.scale.set(.25,.25),t.x=50*a,t.y=50*e,t.alpha=0,t.interactive=!0,t.buttonMode=!0,t.on("pointerdown",e=>onClick(t)),i.push(t),collectMaps.addChild(t),0===e){let e=new Text(a+27);e.position.set(50*a+25-coordsFontSize/2,0),e.style={fill:"white",fontFamily:"Teko",fontSize:coordsFontSize},collectMaps.addChild(e)}let r=new Text("0ft");if(r.style={fill:"white",fontFamily:"Teko",fontSize:2*depthFontSize},r.scale.set(.45,.45),a!==Math.floor(window.innerWidth/100)||e<Math.floor(window.innerHeight/50)-3)if(e%2){if(a%2){let i=new Container,t=new Graphics;l.anchor.x=.5,l.anchor.y=.5,s.anchor.x=.5,s.anchor.y=.5,n.anchor.x=.5,n.anchor.y=.5,n.scale.set(.3,.3),i.x=50*a,i.y=50*e,n.x=25,n.y=25,s.x=25,s.y=25,l.x=25,l.y=25,t.x=25,t.y=25,l.scale.set(.6,.6),s.scale.set(.9,.9),l.alpha=.3,s.alpha=.3,n.alpha=.7,i.addChild(t),i.addChild(l),i.addChild(s),i.addChild(n),r.position.set(25-r.width/2,50-r.height),r.alpha=.7,i.addChild(r),i.visible=!1,collectBeacons.addChild(i),BeaconContainer.push(i),beaconIndexLocation.push([a,e])}}else if(a%2);else{let i=new Container,t=new Graphics;l.anchor.x=.5,l.anchor.y=.5,s.anchor.x=.5,s.anchor.y=.5,n.anchor.x=.5,n.anchor.y=.5,n.scale.set(.3,.3),i.x=50*a,i.y=50*e,n.x=25,n.y=25,s.x=25,s.y=25,l.x=25,l.y=25,t.x=25,t.y=25,l.scale.set(.6,.6),s.scale.set(.9,.9),l.alpha=.3,s.alpha=.3,n.alpha=.7,n.alpha=.7,i.addChild(t),i.addChild(l),i.addChild(s),i.addChild(n),r.position.set(25-r.width/2,50-r.height),i.addChild(r),i.visible=!1,collectBeacons.addChild(i),BeaconContainer.push(i),beaconIndexLocation.push([a,e])}}mapsArray.push(i)}gameGraphics.addChild(collectMaps),gameGraphics.addChild(collectBeacons),collectBeacons.children=shuffle(collectBeacons.children),nextBeaconContainer=new Array(BeaconContainer.length).fill(0),staticCircles=new Graphics,gameGraphics.addChild(staticCircles),gameGraphics.addChild(Battleship);let a=new Sprite(loader.resources[aimSelectLink].texture);a.x=0,a.y=0,a.visible=!1,a.anchor.x=.5,a.anchor.y=.5,aimSelectArray.push(a);let t=new Sprite(loader.resources[aimSelectLink].texture);t.x=0,t.y=0,t.anchor.x=.5,t.anchor.y=.5,t.visible=!1,aimSelectArray.push(t),gameGraphics.addChild(a),gameGraphics.addChild(t),fireButtonContainer=new Container;let n=new Text("FIRE"),l=new Graphics;l.beginFill(801215),l.drawRect(0,0,75,35),l.endFill(),n.anchor.x=.5,n.anchor.y=.5,n.x=37.5,n.y=17.5,n.style={fill:"#ffffff",fontFamily:"Teko",fontSize:27},fireButtonContainer.addChild(l),fireButtonContainer.addChild(n),fireButtonContainer.x=50*Math.floor(window.innerWidth/100)-12.5,fireButtonContainer.y=window.innerHeight-fireButtonContainer.height,fireButtonContainer.interactive=!0,fireButtonContainer.buttonMode=!0,fireButtonContainer.on("pointerdown",e=>onFire()),fireButtonContainer.alpha=0,gameGraphics.addChild(fireButtonContainer),(healthBar=new Container).position.set(50*Math.floor(3*window.innerWidth/200),window.innerHeight-30),gameGraphics.addChild(healthBar);let s=new Graphics;s.beginFill(801215),s.drawRect(0,0,150,30),s.endFill(),healthBar.addChild(s);let r=new Graphics;r.beginFill(16777215),r.drawRect(4,4,142,22),r.endFill(),healthBar.addChild(r),healthBar.outer=r,healthBar.alpha=0,(healthText=new Text("HEALTH")).anchor.x=.5,healthText.anchor.y=.5,healthText.x=healthBar.x+75,healthText.y=healthBar.y+5-healthText.height/2,healthText.style={fill:"#ffffff",fontFamily:"Teko",fontSize:20},healthText.alpha=0,gameGraphics.addChild(healthText),(enemyNumber=new Graphics).lineStyle(4,801215,1),enemyNumber.beginFill(16777215),enemyNumber.drawRect(0,0,50,25),enemyNumber.endFill(),enemyNumber.x=50*Math.floor(window.innerWidth/200),enemyNumber.y=window.innerHeight-30,gameGraphics.addChild(enemyNumber),enemyNumber.alpha=0,(enemyNumberText=new Text("ENEMIES")).anchor.x=.5,enemyNumberText.anchor.y=.5,enemyNumberText.x=enemyNumber.x+enemyNumber.width/2,enemyNumberText.y=enemyNumber.y+5-enemyNumber.height/2,enemyNumberText.style={fill:"#ffffff",fontFamily:"Teko",fontSize:20},enemyNumberText.alpha=0,gameGraphics.addChild(enemyNumberText),(enemyNumberTextValue=new Text(3)).anchor.x=.5,enemyNumberTextValue.anchor.y=.5,enemyNumberTextValue.x=enemyNumber.x+enemyNumber.width/2,enemyNumberTextValue.y=enemyNumber.y+enemyNumberTextValue.height/2,enemyNumberTextValue.style={fill:"#000000",fontFamily:"Teko",fontSize:23},enemyNumberTextValue.alpha=0,gameGraphics.addChild(enemyNumberTextValue),(missileNumber=new Graphics).lineStyle(4,801215,1),missileNumber.beginFill(16777215),missileNumber.drawRect(0,0,50,25),missileNumber.endFill(),missileNumber.x=100,missileNumber.y=window.innerHeight-30,gameGraphics.addChild(missileNumber),missileNumber.alpha=0,(missileNumberText=new Text("MISSILES")).anchor.x=.5,missileNumberText.anchor.y=.5,missileNumberText.x=missileNumber.x+missileNumber.width/2,missileNumberText.y=missileNumber.y+5-missileNumber.height/2,missileNumberText.style={fill:"#ffffff",fontFamily:"Teko",fontSize:20},missileNumberText.alpha=0,gameGraphics.addChild(missileNumberText),(missileNumberTextValue=new Text("∞")).anchor.x=.5,missileNumberTextValue.anchor.y=.5,missileNumberTextValue.x=missileNumber.x+missileNumber.width/2,missileNumberTextValue.y=missileNumber.y+missileNumberTextValue.height/2,missileNumberTextValue.style={fill:"#000000",fontFamily:"Teko",fontSize:23},missileNumberTextValue.alpha=0,gameGraphics.addChild(missileNumberTextValue);let o=new Container,h=new Graphics,m=new Sprite(loader.resources[missileLink].texture);m.anchor.x=.5,m.anchor.y=.5,o.addChild(h),o.addChild(m);let c=new Container,d=new Sprite(loader.resources[missileLink].texture);d.anchor.x=.5,d.anchor.y=.5;let y=new Graphics;c.addChild(y),c.addChild(d),o.visible=!1,c.visible=!1,gameGraphics.addChild(o),gameGraphics.addChild(c),missileContainer.push(o),missileContainer.push(c),gameGraphics.addChild(missileTrail),(missile0Text=new Text("NaN")).position.set(0,0),missile0Text.style={fill:"white",fontFamily:"Teko",fontSize:coordsFontSize-2},missile0Text.visible=!1,gameGraphics.addChild(missile0Text),(missile1Text=new Text("NaN")).position.set(0,0),missile1Text.style={fill:"white",fontFamily:"Teko",fontSize:coordsFontSize-2},missile1Text.visible=!1,gameGraphics.addChild(missile1Text),Battleship.alpha=1,gameGraphics.scale.x=2,gameGraphics.scale.y=2,gameGraphics.position.set(-1*(50*Math.floor(window.innerWidth/100)+Battleship.width/2-75),-1*(50*yGraph+95)),app.stage.addChild(gameGraphics);keyboard(37);let p=keyboard(38),x=(keyboard(39),keyboard(40));keyboard(32).press=(()=>{onFire()}),p.press=(()=>{yBattleship=-1*shipDefaultSpeed,xBattleship=0}),p.release=(()=>{x.isDown}),x.press=(()=>{yBattleship=shipDefaultSpeed,xBattleship=0}),x.release=(()=>{p.isDown}),gameState=1,app.ticker.add(e=>gameLoop(e))}let staticRadius=5,staticRadiusDelay=0,staticAlpha=0,BeaconContainerIndex=0,indexDelay=72,prevBeaconContainer=new Array(BeaconContainer.length).fill(0),startUpCount=0,collectBeaconsArrayCount=0,missile0X=0,missile0Y=0,missile1X=0,missile1Y=0,k=0,pivotX=0,pivotY=0,enemyBeacon=[];function gameLoop(e){if(console.log(typeof enemyNumberTextValue.text),healthBar.outer.width<0&&(alert("You lost!"),location.reload(),app.ticker.stop()),parseInt(enemyNumberTextValue.text)<=0&&(alert("You won!"),location.reload(),app.ticker.stop()),1==gameState)if(collectBeaconsArrayCount<collectBeacons.children.length-2)collectBeacons.children[collectBeaconsArrayCount].visible=!0,collectBeacons.children[collectBeaconsArrayCount+1].visible=!0,collectBeaconsArrayCount+=2;else if(k<Math.floor(mapsArray[0].length/2)){let e=Math.floor(mapsArray[0].length/2);if(e+k<=mapsArray[0].length-1)for(let i=0;i<mapsArray.length;i++)mapsArray[i][e+k].alpha=1;if(e-k>0)for(let i=0;i<mapsArray.length;i++)mapsArray[i][e-k].alpha=1;if(e-k==1)for(let e=0;e<mapsArray.length;e++)mapsArray[e][0].alpha=1,mapsArray[e][mapsArray[e].length-1].alpha=1;gameGraphics.scale.x-=1/e,gameGraphics.scale.y-=1/e,gameGraphics.position.set(-1*(1-(2-gameGraphics.scale.x))*(50*Math.floor(window.innerWidth/100)+Battleship.width/2-75),-1*(1-(2-gameGraphics.scale.x))*(50*yGraph+95)),k+=1}else fireButtonContainer.alpha<1?(fireButtonContainer.alpha+=.03,healthBar.alpha+=.03,healthText.alpha+=.03,enemyNumber.alpha+=.03,enemyNumberText.alpha+=.03,enemyNumberTextValue.alpha+=.03,missileNumber.alpha+=.03,missileNumberText.alpha+=.03,missileNumberTextValue.alpha+=.03):(gameGraphics.position.set(0,0),gameGraphics.scale.x=1,gameGraphics.scale.y=1,console.log("Game state to 0"),gameState=0);Battleship.y=Battleship.y+yBattleship,Battleship.y<0&&(Battleship.y=2),Battleship.x<0&&(Battleship.x=2),Battleship.x>50*xGraph&&(Battleship.x=50*xGraph-2),Battleship.y>50*yGraph-ship.height-2&&(Battleship.y=50*yGraph-ship.height-2),staticCircles.clear(),indexDelay>30?(prevBeaconContainer=nextBeaconContainer.slice(0),BeaconContainer.map((e,i)=>{if(enemyBeacon.includes(i))nextBeaconContainer[i]=23,e.children[4].text="15ft",e.children[4].position.set(25-e.children[4].width/2,50);else{let a=(8*Math.random()).toPrecision(1);nextBeaconContainer[i]=parseInt(a),10*Math.random()>7&&(e.children[4].text=a+"ft",e.children[4].position.set(25-e.children[4].width/2,50-e.children[4].height))}}),indexDelay=0):(BeaconContainer.map((e,i)=>{if(enemyBeacon.includes(i)){let a=prevBeaconContainer[i]+(nextBeaconContainer[i]-prevBeaconContainer[i])/30*indexDelay;staticCircles.beginFill(16777215,1-(staticRadius-10)/30),staticCircles.drawCircle(50*beaconIndexLocation[i][0]+25,50*beaconIndexLocation[i][1]+25,staticRadius),staticCircles.beginHole(),staticCircles.drawCircle(50*beaconIndexLocation[i][0]+25,50*beaconIndexLocation[i][1]+25,staticRadius-2),staticCircles.endHole(),e.children[3].alpha=1,e.children[1].alpha=1,e.children[2].alpha=1,e.children[0].clear(),e.children[0].beginFill(16711680,.5),e.children[0].drawCircle(0,0,a),e.children[0].endFill()}else{let a=prevBeaconContainer[i]+(nextBeaconContainer[i]-prevBeaconContainer[i])/30*indexDelay;e.children[3].alpha=a/10+.3,e.children[1].alpha=a/10-.4,e.children[2].alpha=a/10-.4,e.children[0].clear(),e.children[0].beginFill(16711680,.5),e.children[0].drawCircle(0,0,a),e.children[0].endFill()}}),staticRadius<40?staticRadius+=1:staticRadiusDelay<30?staticRadiusDelay+=1:(staticRadius=10,staticRadiusDelay=0),indexDelay+=1),missileTrail.clear(),missile0Text.visible=!1,missile1Text.visible=!1,!0===missileContainer[0].visible&&(missileContainer[0].x>aimSelectArray[0].x?missileContainer[0].x-=missile0X:missileContainer[0].x+=missile0X,missileContainer[0].y>aimSelectArray[0].y?missileContainer[0].y-=missile0Y:missileContainer[0].y+=missile0Y,Math.abs(missileContainer[0].x-aimSelectArray[0].x)<15&&Math.abs(missileContainer[0].y-aimSelectArray[0].y)<15&&(aimSelectArray[0].x===enemyShips.x+25&&aimSelectArray[0].y===enemyShips.y+25&&(enemyNumberTextValue.text=enemyNumberTextValue.text-1,alert("That's a hit!"),enemyFuncStatus=0),missileContainer[0].visible=!1),missile0Text.visible=!0,missile0Text.text=Math.sqrt(Math.pow(missileContainer[0].x-aimSelectArray[0].x,2)+Math.pow(missileContainer[0].y-aimSelectArray[0].y,2)).toPrecision(7)+"\n ata M_72",missile0Text.position.set(missileContainer[0].x+coordsFontSize,missileContainer[0].y-coordsFontSize),missileTrail.lineStyle(2,16777215,.7),missileTrail.moveTo(Battleship.x+ship.width/2,Battleship.y+ship.height/4),missileTrail.lineTo(missileContainer[0].x,missileContainer[0].y),missileTrail.x=0,missileTrail.y=0),!0===missileContainer[1].visible&&(missileContainer[1].x>aimSelectArray[1].x?missileContainer[1].x-=missile1X:missileContainer[1].x+=missile1X,missileContainer[1].y>aimSelectArray[1].y?missileContainer[1].y-=missile1Y:missileContainer[1].y+=missile1Y,Math.abs(missileContainer[1].x-aimSelectArray[1].x)<15&&Math.abs(missileContainer[1].y-aimSelectArray[1].y)<15&&(aimSelectArray[1].x===enemyShips.x+25&&aimSelectArray[1].y===enemyShips.y+25&&(enemyNumberTextValue.text=enemyNumberTextValue.text-1,alert("That's a hit!"),enemyFuncStatus=0),missileContainer[1].visible=!1),missile1Text.visible=!0,missile1Text.text=Math.sqrt(Math.pow(missileContainer[1].x-aimSelectArray[1].x,2)+Math.pow(missileContainer[1].y-aimSelectArray[1].y,2)).toPrecision(7)+"\n ata M_77",missile1Text.position.set(missileContainer[1].x+coordsFontSize,missileContainer[1].y-coordsFontSize),missileTrail.lineStyle(2,16777215,.7),missileTrail.moveTo(Battleship.x+ship.width/2,Battleship.y+ship.height/4*3),missileTrail.lineTo(missileContainer[1].x,missileContainer[1].y),missileTrail.x=0,missileTrail.y=0)}enemyShips=new Graphics;var enemyFuncStatus=0;let enemyX,enemyY;var enemyKey=setInterval(enemyFunction,4e3);function enemyFunction(){var e=enemyX,i=enemyY,a=Math.floor(window.innerWidth/100),t=Math.floor(Battleship.y/50);if(console.log(enemyX,enemyY,a,t),0===enemyFuncStatus){for(var n=-1;-1===n;)enemyX=randomNumber(Math.floor(3*window.innerWidth/200),Math.floor(window.innerWidth/50)),enemyY=randomNumber(0,Math.floor(window.innerHeight/200)),n=beaconIndexLocation.findIndex(findIndexFunc);(enemyBeacon=[]).push(n),enemyShips.clear(),enemyShips.beginFill(6737151),enemyShips.drawRect(0,0,50,50),enemyShips.endFill(),enemyShips.x=50*enemyX,enemyShips.y=50*enemyY,enemyShips.alpha=0,enemyFuncStatus=1,app.stage.addChild(enemyShips)}else{var l=Math.random();if(Math.abs(enemyX-a)<3){if(enemyX===a&&(enemyY===t||enemyY===t+1||enemyY===t+20))return enemyNumberTextValue.text=enemyNumberTextValue.text-1,alert("Enemy hit you!"),healthBar.outer.width-=50,void(enemyFuncStatus=0);enemyX-a>0?enemyX-=1:enemyX-a<0&&(enemyX+=1),enemyY-t>0?enemyY-=1:enemyY-t<0&&(enemyY+=1);n=beaconIndexLocation.findIndex(findIndexFunc);enemyBeacon=[],-1!==n&&enemyBeacon.push(n),enemyFuncStatus+=1,enemyShips.clear(),enemyShips.beginFill(6737151),enemyShips.drawRect(0,0,50,50),enemyShips.endFill(),enemyShips.x=50*enemyX,enemyShips.y=50*enemyY,enemyShips.alpha=0}else{if(l<=.7){enemyX-a>=0?enemyX-=1:enemyX+=1,enemyY-t>0?enemyY-=1:enemyY+=1;n=beaconIndexLocation.findIndex(findIndexFunc);enemyBeacon=[],-1!==n&&enemyBeacon.push(n)}else{enemyX-a>=0?enemyX+=1:enemyX-=1,enemyY-t>0?enemyY-=1:enemyY+=1;n=beaconIndexLocation.findIndex(findIndexFunc);enemyBeacon=[],-1!==n&&enemyBeacon.push(n)}enemyFuncStatus+=1,(enemyX<0||enemyX>Math.floor(window.innerWidth/50))&&(enemyX=e),(enemyY<0||enemyY>Math.floor(window.innerHeight/50))&&(enemyY=i),enemyShips.clear(),enemyShips.beginFill(6737151),enemyShips.drawRect(0,0,50,50),enemyShips.endFill(),enemyShips.x=50*enemyX,enemyShips.y=50*enemyY,enemyShips.alpha=0}}}function findIndexFunc(e){return e[0]===enemyX&&e[1]===enemyY}function onFire(){!1===missileContainer[0].visible&&!0===aimSelectArray[0].visible&&(missileContainer[0].visible=!0,missileContainer[0].x=Battleship.x,missileContainer[0].y=Battleship.y+ship.height/4,missile0X=Math.abs(missileContainer[0].x-aimSelectArray[0].x)/Math.sqrt(Math.pow(missileContainer[0].y-aimSelectArray[0].y,2)+Math.pow(missileContainer[0].x-aimSelectArray[0].x,2)),missile0Y=Math.abs(missileContainer[0].y-aimSelectArray[0].y)/Math.sqrt(Math.pow(missileContainer[0].y-aimSelectArray[0].y,2)+Math.pow(missileContainer[0].x-aimSelectArray[0].x,2)),missileContainer[0].y-aimSelectArray[0].y>=0?missileContainer[0].x-aimSelectArray[0].x>=0?missileContainer[0].children[1].rotation=Math.acos(missile0X)+3.142:missileContainer[0].children[1].rotation=Math.asin(missile0X)-1.571:missileContainer[0].x-aimSelectArray[0].x>=0?missileContainer[0].children[1].rotation=Math.asin(missile0X)+1.571:missileContainer[0].children[1].rotation=Math.acos(missile0X),missile0X*=2,missile0Y*=2),!1===missileContainer[1].visible&&!0===aimSelectArray[1].visible&&(missileContainer[1].visible=!0,missileContainer[1].x=Battleship.x,missileContainer[1].y=Battleship.y+ship.height/4*3,missile1X=Math.abs(missileContainer[1].x-aimSelectArray[1].x)/Math.sqrt(Math.pow(missileContainer[1].y-aimSelectArray[1].y,2)+Math.pow(missileContainer[1].x-aimSelectArray[1].x,2)),missile1Y=Math.abs(missileContainer[1].y-aimSelectArray[1].y)/Math.sqrt(Math.pow(missileContainer[1].y-aimSelectArray[1].y,2)+Math.pow(missileContainer[1].x-aimSelectArray[1].x,2)),missileContainer[1].y-aimSelectArray[1].y>=0?missileContainer[1].x-aimSelectArray[1].x>=0?missileContainer[1].children[1].rotation=Math.acos(missile1X)+3.142:missileContainer[1].children[1].rotation=Math.asin(missile1X)-1.571:missileContainer[1].x-aimSelectArray[1].x>=0?missileContainer[1].children[1].rotation=Math.asin(missile1X)+1.571:missileContainer[1].children[1].rotation=Math.acos(missile1X),missile1X*=2,missile1Y*=2)}let bit=0;function onClick(e){aimSelectArray[0].x===e.x+25&&aimSelectArray[0].y===e.y+25?!1===missileContainer[0].visible&&(aimSelectArray[0].visible=!1,aimSelectArray[0].x=0,aimSelectArray[0].y=0):aimSelectArray[1].x===e.x+25&&aimSelectArray[1].y===e.y+25?!1===missileContainer[1].visible&&(aimSelectArray[1].visible=!1,aimSelectArray[1].x=0,aimSelectArray[1].y=0):!1===aimSelectArray[0].visible?(aimSelectArray[0].x=e.x+25,aimSelectArray[0].y=e.y+25,aimSelectArray[0].visible=!0):!1===aimSelectArray[1].visible?(aimSelectArray[1].x=e.x+25,aimSelectArray[1].y=e.y+25,aimSelectArray[1].visible=!0):(!0===missileContainer[0].visible&&(bit=1),!0===missileContainer[1].visible&&(bit=0),0===bit?!1===missileContainer[0].visible&&(aimSelectArray[0].x=e.x+25,aimSelectArray[0].y=e.y+25,aimSelectArray[0].visible=!0,bit=1):!1===missileContainer[1].visible&&(aimSelectArray[1].x=e.x+25,aimSelectArray[1].y=e.y+25,aimSelectArray[1].visible=!0,bit=0))}let shipDirBit=1;function onBattleshipClick(){1===shipDirBit?(yBattleship=-1*shipDefaultSpeed,shipDirBit=-1):(yBattleship=shipDefaultSpeed,shipDirBit=1)}function keyboard(e){var i={};return i.code=e,i.isDown=!1,i.isUp=!0,i.press=void 0,i.release=void 0,i.downHandler=(e=>{e.keyCode===i.code&&(i.isUp&&i.press&&i.press(),i.isDown=!0,i.isUp=!1),e.preventDefault()}),i.upHandler=(e=>{e.keyCode===i.code&&(i.isDown&&i.release&&i.release(),i.isDown=!1,i.isUp=!0),e.preventDefault()}),window.addEventListener("keydown",i.downHandler.bind(i),!1),window.addEventListener("keyup",i.upHandler.bind(i),!1),i}function shuffle(e){for(var i,a,t=e.length;0!==t;)a=Math.floor(Math.random()*t),i=e[t-=1],e[t]=e[a],e[a]=i;return e}function hitTestRectangle(e,i){let a,t,n,l,s;return a=!1,e.centerX=e.x+e.width/2,e.centerY=e.y+e.height/2,i.centerX=i.x+i.width/2,i.centerY=i.y+i.height/2,e.halfWidth=e.width/2,e.halfHeight=e.height/2,i.halfWidth=i.width/2,i.halfHeight=i.height/2,l=e.centerX-i.centerX,s=e.centerY-i.centerY,t=e.halfWidth+i.halfWidth,n=e.halfHeight+i.halfHeight,a=Math.abs(l)<t&&Math.abs(s)<n}function randomNumber(e,i){return e=Math.ceil(e),i=Math.floor(i),Math.floor(Math.random()*(i-e+1))+e}