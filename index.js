import AiAgent from './AiAgent.js';

const stage = new createjs.Stage('demoCanvas');
const target = new createjs.Shape();
target.x = 400; target.y= 400;
target.graphics.beginFill('black').drawCircle(0,0,30);
stage.addChild(target);

const agent = new AiAgent(stage, 0, 100);
agent.target = new Victor(target.x, target.y);

function loop(timestamp) {
  agent.update(timestamp);
  stage.update();
  requestAnimationFrame(loop);
}

requestAnimationFrame(loop);