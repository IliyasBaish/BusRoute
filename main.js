import { getRoadsSectors, getPointRoutes, getRoadSectors, updateSectorsWeights, buildRouteBySectors} from "./road.js"
import { getRoute } from "./map.js"
import { getAngle, getVector, getMinimumAnglePoint, calculateMinimumDistanceToRoute } from "./point.js"

let roads1 = [
    {start: {x: 1, y: 1}, end: {x: 3, y: 3}},
    {start: {x: 1, y: 3}, end: {x: 3, y: 1}},
    {start: {x: 2, y: 1}, end: {x: 2, y: 3}},
    {start: {x: 1, y: 2}, end: {x: 3, y: 2}}
]

let roads2 = [
    {start: {x: 1, y: 1}, end: {x: 1, y: 4}},
    {start: {x: 1, y: 1}, end: {x: 2, y: 2}},
    {start: {x: 1, y: 4}, end: {x: 3, y: 4}},
    {start: {x: 1, y: 4}, end: {x: 3, y: 4}},
    {start: {x: 3, y: 4}, end: {x: 2, y: 3}},
    {start: {x: 3, y: 4}, end: {x: 5, y: 4}},
    {start: {x: 5, y: 4}, end: {x: 3, y: 3}},
]

let roads3 = [
    {start: {x: 1, y: 1}, end: {x: 1, y: 5}},
    {start: {x: 5, y: 1}, end: {x: 5, y: 5}},
    {start: {x: 9, y: 1}, end: {x: 9, y: 5}},
    //{start: {x: 1, y: 5}, end: {x: 9, y: 5}},
    {start: {x: 1, y: 3}, end: {x: 9, y: 3}},
    //{start: {x: 1, y: 1}, end: {x: 9, y: 1}},
]

let userRoutes = [
    {start: {x: 1, y: 1}, end: {x: 9, y: 5}},
    {start: {x: 1, y: 3}, end: {x: 5, y: 5}},
    {start: {x: 9, y: 1}, end: {x: 9, y: 5}},
]

let sectors = getRoadsSectors(roads3)

for(let i in userRoutes){
    let route = getRoute(userRoutes[i].start, userRoutes[i].end, sectors)
    updateSectorsWeights(route, sectors)
}

let busRoute = buildRouteBySectors(sectors, userRoutes)

//console.log(sectors)

const canvas = document.querySelector('#canvas');
const ctx = canvas.getContext('2d');

for(let i in sectors){
    drawLine(ctx, [sectors[i].start.x*50, 500-sectors[i].start.y*50], [sectors[i].end.x*50, 500-sectors[i].end.y*50], 'black', (sectors[i].weigth+1)*5)
}

for(let i in busRoute){
    drawLine(ctx, [busRoute[i].start.x*50, 500-busRoute[i].start.y*50], [busRoute[i].end.x*50, 500-busRoute[i].end.y*50], 'red', (busRoute[i].weigth+1)*5)
}

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