let canvas = document.querySelector('#canvas')
let ctx = canvas.getContext('2d')
let image = new Image();
let x = 0;
let y = 0;

image.addEventListener('load', function(){
    ctx.drawImage(image, x ,y)
})
image.src = 'img.jpg'

let contrast = document.querySelector('#contrastSlider')
let saturation = document.querySelector('#saturationSlider')
let brightness = document.querySelector('#brightnessSlider')
let negative = document.querySelector('#btn')



let paint = false
canvas.addEventListener("mousedown", startPosition)
canvas.addEventListener("mouseup", finishedPosition)
canvas.addEventListener("mousemove", draw)


function startPosition(e){
    paint = true;
    draw(e)
}
function finishedPosition(){
    paint = false;
    ctx.beginPath()
}

function brushSize(){
    return parseInt(document.querySelector('#brushSize').value);
}

function getColor(){
    if(document.querySelector('#Red').checked)
    {
        ctx.strokeStyle = "red"
    }
    if(document.querySelector('#Green').checked)
    {
        ctx.strokeStyle = "green"
    }
    if(document.querySelector('#Blue').checked)
    {
        ctx.strokeStyle = "blue"
    }
    if(document.querySelector('#Black').checked)
    {
        ctx.strokeStyle = "black"
    }
}

function draw(e){
    if(!paint) return
    ctx.lineWidth=brushSize()
    ctx.lineCap = "round"
    getColor()
    let pos = canvas.getBoundingClientRect()
    ctx.lineTo(e.clientX - pos.left, e.clientY - pos.top)
    ctx.stroke()
    ctx.beginPath()
    ctx.moveTo(e.clientX - pos.left, e.clientY - pos.top)
}

function clearCanvas(){
    ctx.drawImage(image,x,y)
}

negative.addEventListener('click', function(){
    let imgData = ctx.getImageData(x,y,image.width,image.height)
    let data = imgData.data
    for (let i = 0; i < data.length; i+= 4) {
        data[i] = data[i] ^ 255
        data[i+1] = data[i+1] ^ 255
        data[i+2] = data[i+2] ^ 255
      }
      ctx.putImageData(imgData,x,y)
})


contrast.addEventListener('change', function(){
    clearCanvas();
    let imgData = ctx.getImageData(x,y, image.width, image.height)
    let data = imgData.data
    let factor = (255.0 * (parseInt(contrast.value) + 255)) / (255 * (255 - parseInt(contrast.value)));

    for (let i = 0; i < data.length; i += 4)
    {
        data[i] = factor * (data[i] - 128) + 128;
        data[i+1] = factor * (data[i+1] - 128) + 128;
        data[i+2] = factor * (data[i+2] - 128) + 128;
    }
    ctx.putImageData(imgData, x, y);
    brightness.value = 0
})

brightness.addEventListener('change', function(){
    clearCanvas();
    let imgData = ctx.getImageData(x,y, image.width, image.height)
    let data = imgData.data

    for (let i = 0; i < data.length; i+= 4) {
        data[i] += 255 * (brightness.value / 100);
        data[i+1] += 255 * (brightness.value / 100);
        data[i+2] += 255 * (brightness.value / 100);
      }
      ctx.putImageData(imgData,x,y)
      contrast.value = 0
})



