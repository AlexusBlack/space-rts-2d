import { 
  createVectorVisualisation, 
  setVectorVisualisation, 
  getRandomInt,
  truncateV,
  toV
} from './Utils.js';

export default class AiAgent {
  constructor(stage, x, y) {
    //#region Public Fields
    this.maxVelocity = 50; // per second
    this.maxForce = 1;
    this.maxSpeed = 50;
    this.mass = 1;
    this.target = null;
    //#endregion
    
    //#region Private Fields
    this._object = null;
    this._lastTimestamp = null;
    this._startPosition = new Victor(x, y);
    this._desiredVelocity = new Victor(0, 0); // per second
    this._velocity = new Victor(50, 0); // per second
    this._steering = null;
    //#endregion

    this._object = new createjs.Shape();
    this._object.graphics.beginFill('red').drawPolyStar(0, 0, 25, 3, 0, 0);
    
    this._object.x = x;
    this._object.y = y;
    stage.addChild(this._object);
    
    this._createVisualization(stage);
  }
  
  get x() { return this._object.x; };
  set x(value) { this._object.x = value; };
  
  get y() { return this._object.y; };
  set y(value) { this._object.y = value; };
  
  get position() { return new Victor(this._object.x, this._object.y); }
  
  update(timestamp) {
    const fraction = this._getFraction(timestamp);
    
    const seekSteering = this._seek(this.target);
    this._steering = seekSteering;

    this._velocity = this._velocity.clone().add(this._steering);
    this._velocity = truncateV(this._velocity, this.maxSpeed);
    
    this.x += this._velocity.x * fraction;
    this.y += this._velocity.y * fraction;
    this._object.rotation = this._velocity.angleDeg();
    
    this._visualize(this.position, this._velocity, this._desiredVelocity, this._steering);
  }

  reset() {
    this.x = this._startPosition.x;
    this.y = this._startPosition.y;
    this._velocity = new Victor(100, 0);
  }

  jump() {
    this._startPosition = new Victor(getRandomInt(0, 640), getRandomInt(0, 480));
    this.reset();
  }

  //#region Steering behaviours
  _seek(target) {
    const desiredVelocity = target.clone().subtract(this.position).normalize().multiply(toV(this.maxVelocity));
    let steering = desiredVelocity.clone().subtract(this._velocity);
    steering = truncateV(steering, this.maxForce);
    steering.divide(new Victor(this.mass, this.mass));

    this._desiredVelocity = desiredVelocity;

    return steering;
  }
  //#endregion

  _createVisualization(stage) {
    this._currentVelocityVector = createVectorVisualisation('#00AA00', 100, 2);
    stage.addChild(this._currentVelocityVector);
    this._desiredVelocityVector = createVectorVisualisation('gray', 100, 2);
    stage.addChild(this._desiredVelocityVector);
    this._steeringVector = createVectorVisualisation('blue', 100, 2);
    stage.addChild(this._steeringVector);
  }

  _visualize(position, velocity, desiredVelocity, steering) {
    setVectorVisualisation(this._currentVelocityVector, position, position.clone().add(velocity), velocity.length());
    setVectorVisualisation(this._desiredVelocityVector, position, position.clone().add(desiredVelocity), desiredVelocity.length());
    setVectorVisualisation(this._steeringVector, position.clone().add(velocity), position.clone().add(desiredVelocity), this._steering.length() * 50);
  }
  
  _getFraction(timestamp) {
    if(this._lastTimestamp == null) this._lastTimestamp = timestamp;
    const progress = timestamp - this._lastTimestamp;
    this._lastTimestamp = timestamp;
    return progress / 1000;
  }
}