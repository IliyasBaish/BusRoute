class Map {
    constructor(roadSectors){
        this.roadSectors = roadSectors // {RouteSector}
        this.routes = {} // {}
    }

    createRoute(pointA, pointB){
        //TODO: return route from a to b
    }

    getBusRoute(){
        //TODO: get most optimized bus route
    }
}

class Route {
    constructor(){
        this.points = []
    }

    addPoint(point){
        this.points.push(point)
    }
}