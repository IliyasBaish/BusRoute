import { contains, calculateMinimumDistanceToRoute, findNearestPoints } from "./point.js";

function calculateLineSegmentIntersection(road1, road2) {
    const { x: x1, y: y1 } = road1.start;
    const { x: x2, y: y2 } = road1.end;
    const { x: x3, y: y3 } = road2.start;
    const { x: x4, y: y4 } = road2.end;
  
    const denominator = (x1 - x2) * (y3 - y4) - (y1 - y2) * (x3 - x4);
  
    if (denominator === 0) {
      // The line segments are parallel, and there is no intersection.
      return null;
    }
  
    const t = ((x1 - x3) * (y3 - y4) - (y1 - y3) * (x3 - x4)) / denominator;
    const u = -((x1 - x2) * (y1 - y3) - (y1 - y2) * (x1 - x3)) / denominator;
  
    if (t >= 0 && t <= 1 && u >= 0 && u <= 1) {
      // The line segments intersect within their bounds.
      const intersectionX = x1 + t * (x2 - x1);
      const intersectionY = y1 + t * (y2 - y1);
      return { x: intersectionX, y: intersectionY };
    }
  
    // The line segments do not intersect within their bounds.
    return null;
}

export function getRoadsSectors(roads){
    let sectors = []
    for(let i = 0; i < roads.length; i++){
        let roadSectors = getRoadSectors(roads[i], roads)
        for(let i in roadSectors){
            sectors.push(roadSectors[i])
        }     
    }
    return sectors
}

export function getPointRoutes(point, roads, exeptions = null){
    let routes = []
    for(let i in roads){
        let outPoint
        if(roads[i].start.x == point.x && roads[i].start.y == point.y){
            outPoint = roads[i].end
        }else if(roads[i].end.x == point.x && roads[i].end.y == point.y){
            outPoint = roads[i].start
        }
        if(outPoint != undefined){
            if(exeptions == null){
                routes.push(outPoint)
            }else{
                if(exeptions.length == 0){
    
                    routes.push(outPoint)
                }else{
                    if(!contains(outPoint, exeptions)){
                        routes.push(outPoint)
                    }
                }
            }
        }
    }
    return routes
}

export function getRoadSectors(road, roads){
    let sectors = []
    let points = [road.start, road.end]

    for(let i in roads){
        let intersection = calculateLineSegmentIntersection(road, roads[i])
        if(intersection != null){
            let add = true
            for(let p in points){
                if(points[p].x == intersection.x && points[p].y == intersection.y){
                    add = false
                    break
                }
            }
            if(add){
                points.push(intersection)
            }
        }
    }

    points = points.sort(
        (el1, el2) => (el1.x < el2.x) ? 1 : (el1.x > el2.x) ? -1 : (el1.y < el2.y) ? 1 : (el1.y > el2.y) ? -1 : 0)

    for(let i = 0; i < points.length-1; i++){
        sectors.push(new RoadSector({x: points[i].x, y: points[i].y}, {x: points[i+1].x, y: points[i+1].y}))
    }
    return sectors
}

class RoadSector {
    constructor(start, end){
        this.start = start
        this.end = end
        this.weigth = 0
    }

    increaseWeigth(weigth) {
        this.weigth += weigth
    }

    getWeight(){
        return this.weigth
    }
}

function getPointSector(point, segmentStart, segmentEnd) {
    const { x: px, y: py } = point;
    const { x: x1, y: y1 } = segmentStart;
    const { x: x2, y: y2 } = segmentEnd;
  
    // Check if the point is collinear with the line segment.
    const crossProduct = (py - y1) * (x2 - x1) - (px - x1) * (y2 - y1);
  
    if (Math.abs(crossProduct) > Number.EPSILON) {
      return false; // The point is not collinear with the line segment.
    }
  
    // Check if the point is within the bounds of the line segment.
    const dotProduct = (px - x1) * (x2 - x1) + (py - y1) * (y2 - y1);
    const segmentLengthSquared = (x2 - x1) * (x2 - x1) + (y2 - y1) * (y2 - y1);
  
    if (dotProduct < 0 || dotProduct > segmentLengthSquared) {
      return false; // The point is not within the bounds of the line segment.
    }
  
    return true; // The point lies on the line segment.
}

export function updateSectorsWeights(route, sectors){
    for(let i = 0; i < route.length - 1; i++){
        for(let s in sectors){
            if((sectors[s].start.x == route[i].x && sectors[s].start.y == route[i].y && sectors[s].end.x == route[i+1].x && sectors[s].end.y == route[i+1].y) || (sectors[s].end.x == route[i].x && sectors[s].end.y == route[i].y && sectors[s].start.x == route[i+1].x && sectors[s].start.y == route[i+1].y)){
                sectors[s].increaseWeigth(2)
            }
        }
    }
}

export function buildRouteBySectors(sectors, startingPoints, maxDist){
    let route =[]
    let sorted = sectors.sort((el1, el2) => (el1.getWeight() > el2.getWeight()) ? 1 : (el1.getWeight() < el2.getWeight()) ? -1 : 0)

    let max = sorted.pop()

    for(let i in sorted){
        if(sorted[i].getWeight() < max){
            break
        }else{
            route.push(sorted[i])
        }
    }

    for(let i in startingPoints){
        let dist = calculateMinimumDistanceToRoute(startingPoints[i].start, route)
        if(dist > maxDist){

        }
    }
    return route
}

function buildRoute(sectors, map){
    for(let i = 0; i < sectors.length; i++){
        for(let j = 0; j < sectors.length; j++){
            if(j == i){
                continue
            }
            console.log(findNearestPoints(sectors[i], sectors[j]))
        }
    }
}

export function getCarRouteByUserRoute(userRoute, carRoutes){
    let included = false
    let userRouteIndex = 0
    for(let i in carRoutes){
        for(let j in carRoutes[i].route){
            if(!included && carRoutes[i].route[j].x == userRoute[0].x && carRoutes[i].route[j].y == userRoute[0].y){
                included = true
                userRouteIndex = 1
            }else if(included){
                if(!(carRoutes[i].route[j].x == userRoute[userRouteIndex].x && carRoutes[i].route[j].y == userRoute[userRouteIndex].y)){
                    included = false
                    userRouteIndex = 0
                    break
                }else{
                    userRouteIndex += 1
                    if(userRouteIndex == userRoute.length){
                        console.log(carRoutes[i])
                        return carRoutes[i]
                    }
                }
            }
        }
    }
}