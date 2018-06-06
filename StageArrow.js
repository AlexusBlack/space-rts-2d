import { createVectorVisualisation, setVectorVisualisation, truncateV } from './Utils.js';

export default class StageArrow {
  constructor(stage, x, y) {
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

    this._currentVelocityVector = createVectorVisualisation('#00AA00', 100, 2);
    stage.addChild(this._currentVelocityVector);
    this._desiredVelocityVector = createVectorVisualisation('gray', 100, 2);
    stage.addChild(this._desiredVelocityVector);
    this._steeringVector = createVectorVisualisation('blue', 100, 2);
    stage.addChild(this._steeringVector);
    
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
    
    setVectorVisualisation(this._currentVelocityVector, this.position, this.position.clone().add(this.velocity), this.velocity.length());
    setVectorVisualisation(this._desiredVelocityVector, this.position, this.position.clone().add(this.desiredVelocity), this.desiredVelocity.length());
    setVectorVisualisation(this._steeringVector, this.position.clone().add(this.velocity), this.position.clone().add(this.desiredVelocity), this.steering.length() * 100);
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