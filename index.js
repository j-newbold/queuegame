let projWidth = 40;
let projMargin = 10;
let btnWidth = 40;
let btnColor = 'white';
let btnMargin = 10;

let arWidth = 5*projWidth + 6*projMargin;
let ppaHeight = 3*projWidth+4*projMargin;
let apaHeight = 5*projWidth+6*btnMargin;

let isRunning = false;
let interval = null;

var ticks = 0;
var ticksPerMo = 60;    // roughly 60f per month
var msPerTick = 17;

let apAreaLeft = 0;
let apAreaTop = ppaHeight+2*btnMargin+btnWidth;
let pauseAreaLeft = 0;
let pauseAreaTop = 60;

let fontHeight = 25;

let canvasWidth = 600;
let canvasHeight = 4*btnMargin+btnWidth+ppaHeight+apaHeight;

var ticksPerProj;
var addlHeight;
var nStart;
var pprojStart = 2;
var N;
var W;
var f;
var C;
var nOpt;
var F;
var E;
var T;
var eOpt;
var ctf;
var cOpt;
var tOpt;

var eCur;
var cCur;

var finishedProjs = 0;

var timePeriod = 12; // number of months to use when calculating throughput
var ticksToLook = ticksPerMo*timePeriod;
var curFinishes = [];


var canvas = new fabric.Canvas('c', {
    width: canvasWidth,
    height: canvasHeight,
    backgroundColor: '#00aaaa',
    selection: false,
    hoverCursor: 'default'
});

var tooltipDict = {};
let tooltipTxt = new fabric.Text("", { left: canvasWidth-200, top: 18, fontSize: fontHeight, fontFamily: 'Arial',
                                                    selectable: false, textAlign: 'right'});
canvas.add(tooltipTxt);

let labelBg = new fabric.Rect({
    left: arWidth+2*btnMargin,
    top: btnWidth+3*btnMargin,
    fill: '#d1d1d1',
    width: canvasWidth-(arWidth+4*btnMargin),
    height: canvasHeight-(btnWidth+5*btnMargin),
    selectable: false
});
canvas.add(labelBg);

let effLabel = new fabric.Text("Efficiency:",
{ left: arWidth+3*btnMargin, top: btnWidth+4*btnMargin, fontSize: fontHeight,
                                    fontFamily: 'Arial', selectable: false});

let cycLabel = new fabric.Text("Cycle Time:",
{ left: arWidth+3*btnMargin, top: btnWidth+4*btnMargin+fontHeight, fontSize: fontHeight,
                                    fontFamily: 'Arial', selectable: false});

let thrLabel = new fabric.Text("Throughput:",
{ left: arWidth+3*btnMargin, top: btnWidth+4*btnMargin+2*fontHeight, fontSize: fontHeight,
                                    fontFamily: 'Arial', selectable: false});

let compLabel = new fabric.Text("Completed Projects:",
{ left: arWidth+3*btnMargin, top: btnWidth+4*btnMargin+3*fontHeight, fontSize: fontHeight,
                                    fontFamily: 'Arial', selectable: false});

canvas.add(effLabel);
canvas.add(cycLabel);
canvas.add(thrLabel);
canvas.add(compLabel);

canvas.on('mouse:down', function(e) {
    // could add class names to button imgs somehow as better identifiers
    if (e.target && e.target._originalElement && e.target._originalElement.nodeName == 'IMG') {
        if (e.target.getSrc().slice(e.target.getSrc().length-8) == 'play.png') {
            e.target.setSrc('assets/pause.png',function(){
                canvas.requestRenderAll();
              });
            toggleSimulation();
            canvas.renderAll();
        } else if (e.target.getSrc().slice(e.target.getSrc().length-9) == 'pause.png') {
            e.target.setSrc('assets/play.png',function(){
                canvas.requestRenderAll();
              });
            toggleSimulation();
            canvas.renderAll();
        }
    }
})

canvas.on('mouse:over', function(e) {
    if (e.target) {
        if (e.target.type == 'image') {
            tooltipTxt.set('text',tooltipDict[e.target.left.toString()+e.target.top.toString()]);
            canvas.renderAll();
        }
    }
})

let apArea = new Area(apAreaLeft, apAreaTop, '#89f09a', arWidth, apaHeight, projMargin, projMargin, null, 25);

let pauseArea = new Area(pauseAreaLeft, pauseAreaTop, '#f0db89', arWidth, ppaHeight, projMargin, projMargin, apArea, 15);

let plusBtn = new gameBtn(btnWidth*3+btnMargin*4, btnMargin, "assets/plus.png", "Add a project", addlProject);
let initBtn = new gameBtn(btnMargin, btnMargin, "assets/refresh3.png", "Refresh", initialize);
let ssBtn = new gameBtn(btnWidth+btnMargin*2, btnMargin, "assets/play.png", "Start/Stop", null);
let frAdvBtn = new gameBtn(btnWidth*2+btnMargin*3, btnMargin, "assets/playpauseedit.png", "Frame Advance", incProjects);

/* var myText = new fabric.Text('hello world', { left: 100, top: 100, fontFamily: 'Arial', selectable: false });
canvas.add(myText); */

apArea.clickDest = pauseArea;

function setHTML() {
    effLabel.set('text',"Efficiency: "+Math.round(E*100)/100);
    cycLabel.set('text',"Cycle Time: "+Math.round(cCur*100)/100);
    thrLabel.set('text',"Throughput: "+Math.round(N*100/cCur)/100);
    compLabel.set('text',"Completed Projects: "+finishedProjs);
    canvas.renderAll();
}

function calcInitValues() {
    
    nStart = document.getElementById('numprojslider').value;
    N = nStart;
    W = document.getElementById('wratioinput').value;
    f = document.getElementById('frictioninput').value;
    C = document.getElementById('cycletimeinput').value;
    
    nOpt = nStart/W;
    
    F = f*W;
    if (N < nOpt) {
        E = W-F;
    } else {
        E = 1-F;
    }
    T = N/C;
    eOpt = 1-f;
    
    ctf = 0;
    if (E > 0) {
        ctf = W/(E/eOpt);
    }
    cOpt = C/ctf;
    tOpt = nOpt/cOpt;
    
    eCur = Max(1-Max(N, nOpt)*f/nOpt, 0);
    cCur;
    if (eCur > 0) {
        cCur = cOpt*(Max(N,nOpt)/nOpt)/(eCur/eOpt);
    } else {
        cCur = -1;
    }
    
    ticksPerProj = ticksPerMo * cCur;
    addlHeight = projWidth/ticksPerProj;
}


function calcPjSpeed(nIn) {
    N = nIn;
    W = N/nOpt;
    F = f*W;
    if (N < nOpt) {
        E = W-F;
    } else {
        E = 1-F;
    }
    eCur = Max(1-Max(N, nOpt)*f/nOpt, 0);
    if (eCur > 0) {
        cCur = cOpt*(Max(N,nOpt)/nOpt)/(eCur/eOpt);
    } else {
        cCur = -1;
    }
    T = N/cCur;


    ticksPerProj = ticksPerMo * cCur;
    addlHeight = projWidth/ticksPerProj;
}

function initialize() {
    calcInitValues();
    ticks = 0;
    finishedProjs = 0;
    curFinishes = [];

    let tempVar;

    for (var i=0;i<pauseArea.projectList.length;i++) {
        canvas.remove(pauseArea.projectList[i].shape);
        canvas.remove(pauseArea.projectList[i].percComplete);
    }
    for (i=0;i<apArea.projectList.length;i++) {
        tempVar = apArea.projectList[i];
        canvas.remove(tempVar.shape);
        canvas.remove(tempVar.percComplete);
    }

    pauseArea.projectList = [];
    apArea.projectList = [];

    for (var i=0;i<nStart;i++) {
        let x = new Project(apArea);
        x.percComplete.set('height', (i/nStart)*projWidth);
        x.tick = (i/nStart)*ticksPerProj;
        x.percComplete.setCoords();
        apArea.addProject(x);
    }
    for (var i=0;i<pprojStart;i++) {
        pauseArea.addProject();
    }

    calcPjSpeed(nStart);
    setHTML();
}

function toggleSimulation() {
    if (!isRunning) {
        console.log('on');
        isRunning = true;
        interval = setInterval(incProjects, msPerTick);
    } else {
        console.log('off');
        isRunning = false;
        clearInterval(interval);
    }
}

function addlProject() {
    pauseArea.addProject();
}

function incProjects() {
    calcPjSpeed(apArea.projectList.length);
    var projsToAdd = 0;
    for (var i=0;i<apArea.projectList.length;i++) {
        let tempVar = apArea.projectList[i].percComplete.get('height');
        apArea.projectList[i].percComplete.set('height', tempVar+addlHeight);
        apArea.projectList[i].percComplete.setCoords();
        if (apArea.projectList[i].percComplete.get('height') >= projWidth) {
            canvas.remove(apArea.projectList[i].percComplete);
            canvas.remove(apArea.projectList[i].shape);
            apArea.projectList[i] = null;
            projsToAdd++;
        }
    }
    apArea.projectList = apArea.projectList.filter(el => el != null);
    for (i=0;i<projsToAdd;i++) {
        if (pauseArea.projectList.length == 0) {
            apArea.addProject();
            curFinishes.push(ticks);
        } else {
            pauseArea.findMostComplete().changeArea(apArea);
            pauseArea.addProject();
        }
        finishedProjs++;
    }
    for (i=0;i<curFinishes.length;i++) {
        if (curFinishes[i] < (ticks-ticksToLook)) {
            curFinishes.splice(i, 1);
        }
    }
    setHTML();
    apArea
    canvas.renderAll();
    ticks++;
}

function render() {
    canvas.renderAll();
}

function Max(a, b) {
    if (a > b) {
      return a;
    } else
    {
      return b;
    }
}
  
initialize();