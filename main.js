import { getRoadsSectors, updateSectorsWeights, getCarRouteByUserRoute, takeSectorsPoints} from "./road.js"
import { getRoute } from "./map.js"

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

//calculate sectors of roads for bus and car maps

let car_sectors = getRoadsSectors(roads3)
let bus_sectors = getRoadsSectors(roads3)


//car map
const canvas = document.getElementById("canvas")
const ctx = canvas.getContext('2d');

//bus map
const canvas2 = document.getElementById('canvas2');
const ctx2 = canvas2.getContext('2d');

//drawing maps
drawMap(ctx, car_sectors)
drawMap(ctx2, bus_sectors)


//DRAWING FUNCTIONS START

//drawMap function gets map contects and draws sectors of roads on this map
function drawMap(context, sectors){
    context.clearRect(0, 0, 700, 400)
    for(let i in sectors){
        let color
        if(sectors[i].getWeight() == 0){
            color = "black"
            drawLine(context, [sectors[i].start.x*50, 400-sectors[i].start.y*50], [sectors[i].end.x*50, 400-sectors[i].end.y*50], color, 4)
            drawLine(context, [sectors[i].start.x*50, 400-sectors[i].start.y*50], [sectors[i].end.x*50, 400-sectors[i].end.y*50], "white", 3)
        }else if(sectors[i].getWeight() > 4){
            color = 'rgb('+(255-(sectors[i].getWeight()-3)*20)+', 0, 0)'
            drawLine(context, [sectors[i].start.x*50, 400-sectors[i].start.y*50], [sectors[i].end.x*50, 400-sectors[i].end.y*50], color, 4)
        }else{
            color = 'rgb(0, '+(255-(sectors[i].getWeight()+1)*20)+', 0)'
            drawLine(context, [sectors[i].start.x*50, 400-sectors[i].start.y*50], [sectors[i].end.x*50, 400-sectors[i].end.y*50], color, 4)
        }
        
    }
}

//function that returns map in inital state - without routes and selected points
function refreshMap(btn_group, sectors, context){
    let elements = document.getElementsByClassName(btn_group)
    for(let i = 0; i < elements.length-1; i++){
        elements[i].style.backgroundColor = "white"
        elements[i].style.borderColor = "black"
    }
    drawMap(context, sectors)
}

//function that returns bus map in inital state
function refreshbus(){
    bus_sectors = getRoadsSectors(roads3)
    drawMap(ctx2, bus_sectors)
}

//function to draw straight line from point A to point B with provided color and width
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

//function that draws route - array of points on car map
function drawRoute(route, color){
    for(let i = 0; i < route.length - 1; i++){
        if(color == "red"){
            drawLine(ctx, [route[i].x*50, 400-route[i].y*50], [route[i+1].x*50, 400-route[i+1].y*50], color, 7)
        }else if(color == "green"){
            drawLine(ctx, [route[i].x*50, 400-route[i].y*50], [route[i+1].x*50, 400-route[i+1].y*50], color, 4)
        }
    }
}

//DRAWING FUNCTIONS END


//BUTTON FUNCTIONS START

//add points to car map
addPoints()

//variable that describes what point user shoul choose on car map at this moment
let findPoint = "carStart"

//points of car and user routes' start and end
let carStart, carEnd, userStart, userEnd

//add points to bus map
addBusButtons()

//variable that describes what point user shoul choose on bus map at this moment
let busPointMode = "start"
//points bus routes' start and end
let busPointStart, busPointEnd

//refresh button
document.getElementById("busButton").onclick = refreshbus

//function that adds points of map intersection on car map
function addPoints(){
    let btn_container = document.getElementById("map-buttons-1")
    let points = takeSectorsPoints(car_sectors)
    console.log(points)
    for(let i in points){
        let button = document.createElement("button")
        button.classList.add("map-button")
        button.value = points[i].x + ' ' + points[i].y
        button.style.marginLeft = (points[i].x * 50 - 8) + "px"
        button.style.marginTop = (400 - points[i].y * 50 - 7) + "px"
        button.disabled = false
        button.addEventListener('click', function(){
            if (findPoint != null){
                getButtonPoint(button)
            }
        })
        btn_container.appendChild(button)
    }
}

//function that serves button click of points on car map
function getButtonPoint(element){
    let data = element.value.split(" ")
    if(findPoint == "carStart"){
        refreshMap("map-button", car_sectors, ctx)
        carStart = {x: parseInt(data[0]), y: parseInt(data[1])}
        element.style.backgroundColor = "red"
        element.disabled = "true"
        element.style.borderColor = "red"
        findPoint = "carEnd"
        document.getElementById("car-results").innerHTML = "Chose Point where car ends the trip"
    }else if(findPoint == "carEnd"){
        carEnd = {x: parseInt(data[0]), y: parseInt(data[1])}
        element.style.backgroundColor = "red"
        element.disabled = "true"
        element.style.borderColor = "red"
        findPoint = "userStart"
        enableButtons()
        document.getElementById("car-results").innerHTML = "Chose Point from which user start the trip"
    }else if(findPoint == "userStart"){
        userStart = {x: parseInt(data[0]), y: parseInt(data[1])}
        element.style.backgroundColor = "green"
        element.disabled = "true"
        findPoint = "userEnd"
        document.getElementById("car-results").innerHTML = "Chose Point where user ends the trip"
    }else if(findPoint == "userEnd"){
        userEnd = {x: parseInt(data[0]), y: parseInt(data[1])}
        element.style.backgroundColor = "green"
        element.disabled = "true"
        findPoint = "carStart"
        carToUser()
        enableButtons()
    }
}

//function that makes all buttons of car map clickable
function enableButtons(){
    let elements = document.getElementsByClassName("map-button")
    for(let i in elements){
        if(elements[i].disabled != undefined){
            elements[i].disabled = false
        }
    }
}

//getting and drawing all points on bus map
function addBusButtons(){
    let btn_container = document.getElementById("map-buttons-2")
    let points = takeSectorsPoints(car_sectors)
    console.log(points)
    for(let i in points){
        let button = document.createElement("button")
        button.classList.add("map-button-bus")
        button.value = points[i].x + ' ' + points[i].y
        button.style.marginLeft = (points[i].x * 50 - 8) + "px"
        button.style.marginTop = (400 - points[i].y * 50 - 7) + "px"
        button.disabled = false
        button.addEventListener('click', function(){
            choseBusPoints(button)
        })
        btn_container.appendChild(button)
    }
}

//function that serves bus map button clicks
function choseBusPoints(element){
    let data = element.value.split(" ")
    if(busPointMode == "start"){
        busPointStart = {x: parseInt(data[0]), y: parseInt(data[1])}
        busPointMode = "end"
        element.style.backgroundColor = "red"
    }else if(busPointMode == "end"){
        busPointEnd = {x: parseInt(data[0]), y: parseInt(data[1])}
        busPointMode = "start"
        element.style.backgroundColor = "red"
        let route = getRoute(busPointStart, busPointEnd, bus_sectors)
        updateSectorsWeights(route, bus_sectors)
        drawMap(ctx2, bus_sectors)
        refreshMap("map-button-bus", bus_sectors, ctx2)
    }
}

//BUTTON FUNCTIONS END


//function that calculates whether there is an intersection of car and user route
function carToUser(){
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawMap(ctx, car_sectors)
    let car_start = carStart
    let car_end = carEnd
    let car_route = getRoute(car_start, car_end, car_sectors)
    let user_start = userStart
    let user_end = userEnd
    let user_route = getRoute(user_start, user_end, car_sectors)
    if(getCarRouteByUserRoute(user_route, [{route: car_route}])){
        drawRoute(car_route, "red")
        drawRoute(user_route, "green")
        document.getElementById("car-results").innerHTML = "The car can give a lift to the passenger, you can choose another starting point"
    }else{
        drawRoute(car_route, "red")
        drawRoute(user_route, "green")
        document.getElementById("car-results").innerHTML = "Sorry, the car cannot give a lift to the passenger, choose another starting point"
    }
}

