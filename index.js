const stage = new createjs.Stage('demoCanvas');
const target = new createjs.Shape();
target.x = 400; target.y= 400;
target.graphics.beginFill('black').drawCircle(0,0,30);
stage.addChild(target);

const currentVelocityVector = createVectorVisualisation('#00AA00', 100, 2);
stage.addChild(currentVelocityVector);
const desiredVelocityVector = createVectorVisualisation('gray', 100, 2);
stage.addChild(desiredVelocityVector);
const steeringVector = createVectorVisualisation('blue', 100, 2);
stage.addChild(steeringVector);

class StageArrow {
  constructor(x, y) {
    this.target = new Victor(target.x, target.y);
    this.desiredVelocity = new Victor(0, 0); // per second
    this.velocity = new Victor(100, 0); // per second
    this.maxVelocity = 50; // per second
    this.maxForce = 0.3;
    this.maxSpeed = 100;
    this.mass = 1;
    
    const shape = new createjs.Shape();
    shape.graphics.beginFill('red').drawPolyStar(0, 0, 25, 3, 0, 0);
    
    shape.x = x;
    shape.y = y;
    stage.addChild(shape);
    
    this._object = shape;
    this._lastTimestamp = null;
  }
  
  get x() { return this._object.x; };
  set x(value) { this._object.x = value; };
  
  get y() { return this._object.y; };
  set y(value) { this._object.y = value; };
  
  get position() { return new Victor(this._object.x, this._object.y); }
  
  update(timestamp) {
    const fraction = this._getFraction(timestamp);
    //this._object.rotation += 1;
    
    const maxVelocity = new Victor(this.maxVelocity, this.maxVelocity);
    const maxForce = new Victor(this.maxForce, this.maxForce);
    this.desiredVelocity = this.target.clone().subtract(this.position).normalize().multiply(maxVelocity);
    this.steering = this.desiredVelocity.clone().subtract(this.velocity);
    this.steering = truncateV(this.steering, this.maxForce);
    this.steering.divide(new Victor(this.mass, this.mass));

    this.velocity = this.velocity.clone().add(this.steering);
    this.velocity = truncateV(this.velocity, this.maxSpeed);
    //this.velocity = this.desiredVelocity;
    
    this.x += this.velocity.x * fraction;
    this.y += this.velocity.y * fraction;
    this._object.rotation = this.velocity.angleDeg();
    
    if(this.x > 640) this.x = 0;
    if(this.x < 0) this.x = 640;
    if(this.y > 480) this.y = 0;
    if(this.y < 0) this.y = 480;
    
    if(this.x > 395 && this.x < 405 && this.y > 395 && this.y < 405) this.reset();
    
    setVectorVisualisation(currentVelocityVector, this.position, this.position.clone().add(this.velocity), this.velocity.length());
    setVectorVisualisation(desiredVelocityVector, this.position, this.position.clone().add(this.desiredVelocity), this.desiredVelocity.length());
    setVectorVisualisation(steeringVector, this.position.clone().add(this.velocity), this.position.clone().add(this.desiredVelocity), this.steering.length() * 100);
  }

  reset() {
    this.x = 0;
    this.y = 100;
    this.velocity = new Victor(100, 0);
  }
  
  _getFraction(timestamp) {
    if(this._lastTimestamp == null) this._lastTimestamp = timestamp;
    const progress = timestamp - this._lastTimestamp;
    this._lastTimestamp = timestamp;
    return progress / 1000;
  }
}

const arrow = new StageArrow(0, 100);

function loop(timestamp) {
  arrow.update(timestamp);
  stage.update();
  requestAnimationFrame(loop);
}

requestAnimationFrame(loop);

function truncateV(vector, max) {
  if(vector.length() > max) {
    return vector.clone().norm().multiply(new Victor(max, max));  
  } else {
    return vector;
  }
}

function createVectorVisualisation(color, length, width) {
  const vector = new createjs.Shape();
  vector.x = 0; vector.y = 0;
  vector.arrowLine = vector.graphics.beginFill(color).drawRect(0, -1, length, width);
  vector.arrowEnd = vector.graphics.beginFill(color).drawPolyStar(length, 0, width * 2, 3, 0, 0);
  
  return vector;
}

function setVectorVisualisation(vector, source, target, length) {
  if(length != null) {
    vector.scaleX = length / 100;
  }
  vector.x = source.x;
  vector.y = source.y;
  const angle = target.clone().subtract(source).angleDeg();
  vector.rotation = angle;
}