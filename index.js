import AiAgent from './AiAgent.js';
import { getRandomInt } from './Utils.js';

const agentsNumber = 1;
const stage = new createjs.Stage('demoCanvas');
const target = new createjs.Shape();
target.x = 400; target.y= 400;
target.graphics.beginFill('black').drawCircle(0,0,30);
stage.addChild(target);

const agents = [];
for(let i = 0; i < agentsNumber; i++) {
  const agent = new AiAgent(stage, getRandomInt(0, 640), getRandomInt(0, 480));
  agent.target = new Victor(target.x, target.y);
  agents.push(agent);
}

function loop(timestamp) {
  for(let agent of agents) {
    agent.update(timestamp);
  }
  stage.update();
  requestAnimationFrame(loop);
}

requestAnimationFrame(loop);