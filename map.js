import { getVector, getAngle, getMinimumAnglePoint, contains } from "./point.js"
import { getPointRoutes } from "./road.js"

//function that calculates route from point A to point B on provided map
export function getRoute(pointA, pointB, sectors){
    let destination = pointA
    let assesedPoints = []
    assesedPoints.push(pointA)
    let route = []
    route.push(destination)
    let steps = 0
    while((destination.x != pointB.x || destination.y != pointB.y) && steps < 40){       
        steps += 1
        let possiblePoints = getPointRoutes(destination, sectors, assesedPoints)
        if(possiblePoints.length == 0){
            route.pop()
            destination = route[route.length - 1]
            continue
        }
        destination = getMinimumAnglePoint(destination, pointB, possiblePoints).point
        
        assesedPoints.push(destination)
        route.push(destination)
    }
    return route
}