import { getRoadsSectors, getPointRoutes, getRoadSectors, updateSectorsWeights, buildRouteBySectors, getCarRouteByUserRoute} from "./road.js"
import { getRoute } from "./map.js"
import { getAngle, getVector, getMinimumAnglePoint, calculateMinimumDistanceToRoute } from "./point.js"

let roads3 = [
    {start: {x: 1, y: 1}, end: {x: 1, y: 5}},
    {start: {x: 1, y: 5}, end: {x: 7, y: 7}},
    {start: {x: 4, y: 6}, end: {x: 4, y: 4}},
    {start: {x: 1, y: 3}, end: {x: 7, y: 3}},
    {start: {x: 2, y: 4}, end: {x: 6, y: 4}},
    {start: {x: 1, y: 1}, end: {x: 12, y: 1}},
    {start: {x: 4, y: 1}, end: {x: 4, y: 2}},
    {start: {x: 2, y: 2}, end: {x: 6, y: 2}},
    {start: {x: 7, y: 1}, end: {x: 7, y: 7}},
    {start: {x: 7, y: 3}, end: {x: 13, y: 5}},
    {start: {x: 12, y: 1}, end: {x: 13, y: 5}},
    {start: {x: 10, y: 4}, end: {x: 10, y: 2}},
    {start: {x: 8, y: 2}, end: {x: 10, y: 2}},
    {start: {x: 7, y: 7}, end: {x: 13, y: 7}},
    {start: {x: 13, y: 5}, end: {x: 13, y: 7}},
    {start: {x: 10, y: 7}, end: {x: 10, y: 5}},
]

let userRoutes = [
    /*{start: {x: 1, y: 1}, end: {x: 13, y: 7}},
    {start: {x: 6, y: 2}, end: {x: 10, y: 5}},
    {start: {x: 8, y: 2}, end: {x: 4, y: 4}},*/
]

let carRoutes = [
    {start: {x: 1, y: 1}, end: {x: 4, y: 4}, route: [{x: 1, y: 1}, {x: 2, y: 2}, {x: 3, y: 3}, {x: 4, y: 4}]}
]

let a = getCarRouteByUserRoute([{x: 2, y: 2}, {x: 3, y: 3}], carRoutes)

let car_sectors = getRoadsSectors(roads3)
let bus_sectors = car_sectors

for(let i in userRoutes){
    let route = getRoute(userRoutes[i].start, userRoutes[i].end, sectors)
    updateSectorsWeights(route, sectors)
}

//let busRoute = buildRouteBySectors(sectors, userRoutes)

const canvas = document.querySelector('#canvas');
const ctx = canvas.getContext('2d');

const canvas2 = document.querySelector('#canvas2');
const ctx2 = canvas2.getContext('2d');

drawMap(ctx, car_sectors)
drawMap(ctx2, car_sectors)
/*
for(let i in busRoute){
    drawLine(ctx, [busRoute[i].start.x*50, 500-busRoute[i].start.y*50], [busRoute[i].end.x*50, 500-busRoute[i].end.y*50], 'red', (busRoute[i].weigth+1)*5)
}*/

function drawLine(ctx, begin, end, stroke = 'black', width = 1) {
    if (stroke) {
        ctx.strokeStyle = stroke;
    }

    if (width) {
        ctx.lineWidth = width;
    }

    ctx.beginPath();
    ctx.moveTo(...begin);
    ctx.lineTo(...end);
    ctx.stroke();
}

function animateLine(ctx, begin, end, color, width, speed){
    let currentEnd = 0
    let x
    x = setInterval(function() {
        currentEnd += 0.1
        if(currentEnd == 1){
            clearInterval(x)
        }
        drawLine(ctx, [begin[0], 400-begin[1]], [begin[0]+((end[0]-begin[0])*currentEnd), 400-begin[1]+((end[1]-begin[1])*currentEnd)], color, width )
    }, speed)
}

function carToUser(){
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawMap(ctx, car_sectors)
    let car_start = {x: parseInt(document.getElementById("car-start-x").value), y: parseInt(document.getElementById("car-start-y").value)}
    let car_end = {x: parseInt(document.getElementById("car-end-x").value), y: parseInt(document.getElementById("car-end-y").value)}
    let car_route = getRoute(car_start, car_end, car_sectors)
    let user_start = {x: parseInt(document.getElementById("user-start-x").value), y: parseInt(document.getElementById("user-start-y").value)}
    let user_end = {x: parseInt(document.getElementById("user-end-x").value), y: parseInt(document.getElementById("user-end-y").value)}
    let user_route = getRoute(user_start, user_end, car_sectors)
    if(getCarRouteByUserRoute(user_route, [{route: car_route}])){
        drawRoute(car_route, "red")
        drawRoute(user_route, "green")
    }
}

function drawRoute(route, color){
    for(let i = 0; i < route.length - 1; i++){
        drawLine(ctx, [route[i].x*50, 400-route[i].y*50], [route[i+1].x*50, 400-route[i+1].y*50], color, 3)
    }
}

function drawMap(ctx, sectors){
    for(let i in sectors){
        let color
        if(sectors[i].getWeight() == 0){
            color = "black"
        }else{
            color = 'rgb('+((sectors[i].getWeight()+1)*50)+', 0, 0)'
        }
        drawLine(ctx, [sectors[i].start.x*50, 400-sectors[i].start.y*50], [sectors[i].end.x*50, 400-sectors[i].end.y*50], color, 3)
    }
    ctx.font = "12px Arial"
    drawLine(ctx, [1*50, 400-0*50], [13*50, 400-0*50], "black", 3)
    for(let i = 1; i < 14; i++){
        drawLine(ctx, [i*50, 400-0*50], [i*50, 400-10], "black", 3)
        ctx.fillText(i, i*50-3 , 400-11);
    }
    drawLine(ctx, [0*50, 400-1*50], [0*50, 400-7*50], "black", 3)
    for(let i = 1; i < 8; i++){
        drawLine(ctx, [0*50, 400-i*50], [10, 400-i*50], "black", 3)
        ctx.fillText(i, 11 , 400-i*50+3);
    }
    ctx.font = "16px Arial";
    ctx.fillText("X", 30 , 400-3)
    ctx.fillText("Y", 0 , 400-30);
}

function addBusRoute(){
    ctx2.clearRect(0, 0, canvas.width, canvas.height);
    let point_start = {x: parseInt(document.getElementById("point-start-x").value), y: parseInt(document.getElementById("point-start-y").value)}
    let point_end = {x: parseInt(document.getElementById("point-end-x").value), y: parseInt(document.getElementById("point-end-y").value)}
    let point_route = getRoute(point_start, point_end, bus_sectors)
    console.log(point_route)
    updateSectorsWeights(point_route, bus_sectors)
    drawMap(ctx2, bus_sectors)
}

document.getElementById("carButton").onclick = carToUser
document.getElementById("busButton").onclick = addBusRoute