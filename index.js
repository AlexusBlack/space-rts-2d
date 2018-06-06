import AiAgent from './AiAgent.js';
import { getRandomInt } from './Utils.js';

const agentsNumber = 1;
const stage = new createjs.Stage('demoCanvas');
const targetPosition = new Victor(400, 400);
const target = new createjs.Shape();
target.x = targetPosition.x; target.y = targetPosition.y;
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

    keepAgentInBoundaries(agent);
    
    if(agent.position.distance(targetPosition) < 2*2) agent.reset();
  }
  stage.update();
  requestAnimationFrame(loop);
}

function keepAgentInBoundaries(agent) {
  if(agent.x > 640) agent.x = 0;
  if(agent.x < 0) agent.x = 640;
  if(agent.y > 480) agent.y = 0;
  if(agent.y < 0) agent.y = 480;
}

requestAnimationFrame(loop);