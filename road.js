class RoadSector {
    constructor(start, end){
        this.start = start
        this.end = end
        this.weigth = 0
    }

    increaseWeigth(weigth) {
        this.weigth += weigth
    }
}

function getPointSector(point, sectors){
    //TODO: finds sector of given point, return 2 points - end and start of sector
}