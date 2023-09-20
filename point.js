//mathemticle functions that helps to find route for destinations point

//get vector of from point1 to point2
export function getVector(point1, point2){
    const deltaX = point2.x - point1.x;
    const deltaY = point2.y - point1.y;

    // Create and return the vector object
    const vector = { x: deltaX, y: deltaY };
    return vector;
}

//get angle between 2 vectors
export function getAngle(vector1, vector2) {
    // Calculate the dot product of the two vectors
    const dotProduct = vector1.x * vector2.x + vector1.y * vector2.y;
  
    // Calculate the magnitudes (lengths) of the vectors
    const magnitude1 = Math.sqrt(vector1.x * vector1.x + vector1.y * vector1.y);
    const magnitude2 = Math.sqrt(vector2.x * vector2.x + vector2.y * vector2.y);
  
    // Calculate the cosine of the angle between the vectors
    const cosineTheta = dotProduct / (magnitude1 * magnitude2);
  
    // Calculate the angle in radians using the arccosine function
    const radians = Math.acos(cosineTheta);
  
    // Convert radians to degrees if desired
    const degrees = radians * (180 / Math.PI);
  
    return degrees;
}

//get minimum angle between all possible ways of curent point
export function getMinimumAnglePoint(pointA, pointB, possiblePoints){
    let destinationVector = getVector(pointA, pointB)
    let min = {point: null, angle: 360}

    for(let p in possiblePoints){
        let currentVector = getVector(pointA, possiblePoints[p])
        let angle = getAngle(destinationVector, currentVector)
        if(Math.abs(angle) < min.angle){
            min = {point: possiblePoints[p], angle: Math.abs(angle)}
        }
    }

    return min
}

//check if pointlist includes point
export function contains(point, pointlist){
    for(let i in pointlist){
        if((pointlist[i].x == point.x) && (pointlist[i].y == point.y)){
            return true
        }
    }
    return false
}

export function calculateMinimumDistanceToRoute(point, route){
    let min = Infinity
    for(let i in route){
        let dist = pointToLineSegmentDistance(point, {x: route[i].start.x, y: route[i].start.y}, {x: route[i].end.x, y: route[i].end.y})
        if(min > dist){
            min = dist
        }
    }
    return min
}

function pointToLineSegmentDistance(point, segmentStart, segmentEnd) {
    // Calculate the vector from the segment start to the point
    const vector1 = {
      x: point.x - segmentStart.x,
      y: point.y - segmentStart.y
    };
  
    // Calculate the vector along the segment
    const vector2 = {
      x: segmentEnd.x - segmentStart.x,
      y: segmentEnd.y - segmentStart.y
    };
  
    // Calculate the dot product of vector1 and vector2
    const dotProduct = vector1.x * vector2.x + vector1.y * vector2.y;
  
    // Calculate the squared length of vector2
    const lengthSquared = vector2.x * vector2.x + vector2.y * vector2.y;
  
    // Calculate the parameter along the line where the closest point is
    const t = Math.max(0, Math.min(1, dotProduct / lengthSquared));
  
    // Calculate the closest point on the line segment
    const closestPoint = {
      x: segmentStart.x + t * vector2.x,
      y: segmentStart.y + t * vector2.y
    };
  
    // Calculate the distance between the closest point and the input point
    const distance = Math.sqrt(
      (point.x - closestPoint.x) ** 2 + (point.y - closestPoint.y) ** 2
    );
  
    return distance;
}

//find nearest points of 2 line segments
export function findNearestPoints(segment1Start, segment1End, segment2Start, segment2End) {
    // Calculate the distances from segment1's start and end points to segment2's start and end points
    const distances = [
      { point1: segment1Start, point2: segment2Start, distance: distance(segment1Start, segment2Start) },
      { point1: segment1Start, point2: segment2End, distance: distance(segment1Start, segment2End) },
      { point1: segment1End, point2: segment2Start, distance: distance(segment1End, segment2Start) },
      { point1: segment1End, point2: segment2End, distance: distance(segment1End, segment2End) }
    ];
  
    // Sort the distances in ascending order
    distances.sort((a, b) => a.distance - b.distance);
  
    return distances[0]
  }
  
// Calculate the Euclidean distance between two points
function distance(point1, point2) {
    const dx = point1.x - point2.x;
    const dy = point1.y - point2.y;
    return Math.sqrt(dx * dx + dy * dy);
}
  