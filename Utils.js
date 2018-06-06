export function truncateV(vector, max) {
  if(vector.length() > max) {
    return vector.clone().norm().multiply(new Victor(max, max));  
  } else {
    return vector;
  }
}

export function createVectorVisualisation(color, length, width) {
  const vector = new createjs.Shape();
  vector.x = 0; vector.y = 0;
  vector.arrowLine = vector.graphics.beginFill(color).drawRect(0, -1, length, width);
  vector.arrowEnd = vector.graphics.beginFill(color).drawPolyStar(length, 0, width * 2, 3, 0, 0);
  
  return vector;
}

export function setVectorVisualisation(vector, source, target, length) {
  if(length != null) {
    vector.scaleX = length / 100;
  }
  vector.x = source.x;
  vector.y = source.y;
  const angle = target.clone().subtract(source).angleDeg();
  vector.rotation = angle;
}