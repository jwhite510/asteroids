# asteroids
The classic asteroids 2-D space game remade in javascript with color, explosions, and full simulation collision physics.  

# How to Play
WASD keys are used for movement. Left click fires a missile which will follow the mouse position. Right click fires a missile which goes straight.  

# Collision Physics
Each body (your ship, the missiles, asteroids) carries momentum and is accurately simulated with collision physics.  
u<sub>i</sub>: initial velocity  
v<sub>i</sub>: final velocity  
m<sub>i</sub>: mass  
## Elastic Collision
v<sub>1</sub> = [(m<sub>1</sub> - m<sub>2</sub>) / (m<sub>1</sub> + m<sub>2</sub>)]u<sub>1</sub> + [(2 m<sub>2</sub>) / (m<sub>1</sub> + m<sub>2</sub>)]u<sub>2</sub>  
v<sub>2</sub> = [(2 m<sub>1</sub>) / (m<sub>2</sub> + m<sub>1</sub>)]u<sub>1</sub>+[(m<sub>2</sub> - m<sub>1</sub>) / (m<sub>2</sub> + m<sub>1</sub>)]u<sub>2</sub>   
## Conservation of Momentum
m<sub>1</sub>u<sub>1</sub> + m<sub>2</sub>u<sub>2</sub> = m<sub>1</sub> v<sub>1</sub> + m<sub>2</sub> + v<sub>2</sub>

<img src="images/asteroids.gif" width="500" height="400">  

# Installation
To play the game, clone the repository into a your local folder and open the html file in a browser.
