# Welcome to Battleship Game

[Play the game here](https://jpj.now.sh).

We made this whole game only using open source tools including assets and to continue the tradition we are making the code and all related assets `open source`.

Feel free to use any and all of this repository.

**JPJ** is pretty much recreation of the iconic(not really) battle scene where they use tsunami buoys to track aliens(bad guys?) and kill them using nothing but their wits and VL-ASROC missiles (Yes, I looked it up) .

## Files

### ← README.md

Repo structure.

### ← index.html

Welcome page. Motivation and controls.

### ← indexStyle.css

Minified CSS for index page

### ← game.html

Basic tags for the game.

### ← style.css

Basic CSS like no margin and no padding.
CSS for WIN and LOSE screens.

### ← script.js

Pretty much everything is here.

We used [PixiJS](https://www.pixijs.com/) as our renderer.

setup function creates sprites for map,ship,shipTitle,Battleship,Beacons. Uses the minimap to construct the whole map background(Not my best algorithm, suggest something)

gameLoop is our ticker function.

Creates basic animations such as active status of beacons.

onClick function is called when any part of map is pressed and it triggers aim box.

onBattleshipClick function uses a bit state to invert the ship's direction everytime the Battleship sprite is clicked.
### ← scriptMin.js

Minified js for game.html

### ← assets

All assets are made using open sourced 2D tilesets.

We are using glitch's CDN for all asset distribution.

We'll rename the asset files later.

### Shout out to [Glitch](https://glitch.com/), our primary editor and [Vercel](https://vercel.com/), our hosting platform.

## Made by Anil Turaga and Ashritha Sanka.

27
