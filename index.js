import StageArrow from './StageArrow.js';

const stage = new createjs.Stage('demoCanvas');
const target = new createjs.Shape();
target.x = 400; target.y= 400;
target.graphics.beginFill('black').drawCircle(0,0,30);
stage.addChild(target);

const arrow = new StageArrow(stage, 0, 100);
arrow.target = new Victor(target.x, target.y);

function loop(timestamp) {
  arrow.update(timestamp);
  stage.update();
  requestAnimationFrame(loop);
}

requestAnimationFrame(loop);