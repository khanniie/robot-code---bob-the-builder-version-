// //to do

// - check that ifs and elses are in the right place when they hit run

var CounterObj = function(count) {
    this.count = count;
}
var counter = new CounterObj(0);
var loop = false;
var endpoint;
var startpoint;
var timecounter = 1;
var times = 500;
var hangingif = false;
var hangingifendpoint = -1;
var longtime = true;
var speed = 500;
var problemlist = [];

var Blocks = function() {
    this.arr = [];
}

var Piece = function(l, layer, t, f, divid, div, height, inloop, loopid, bref, outer) {
    this.div = div;
    this.toppos = t;
    this.height = height;
    this.leftpos = l;
    this.funct = f;
    this.divid = divid;
    this.inloop = inloop;
    this.loopid = loopid;
    this.bref = bref;
    this.outer = outer;
    this.layer = layer;
}

var MoveFunct = function() {
    this.type = "movefunct";
}
var RotateLeftFunct = function() {
    this.type = "rotateleftfunct";
}
var RotateRightFunct = function() {
        this.type = "rotaterightfunct";
    }
    // var CanMoveFunct = function(direction) {
    //     this.type = "canmovefunct";
    //     this.direction = direction;
    // }
var RepeatForeverFunct = function() {
    this.type = "repeatforeverfunct";
}
var RepeatFunct = function(inputid) {
    this.type = "repeatfunct";
    this.times = -1;
    this.inputid = inputid;
}
var IfFunct = function(inputid) {
    this.type = "iffunct";
    this.inputid = inputid;
}
var ElseFunct = function() {
    this.type = "elsefunct";
}
var ElseIfFunct = function(inputid) {
    this.type = "elseiffunct";
    this.inputid = inputid;
}


var test = new Blocks();

function searchBlockArrayForDiv(arr, divname) {
    for (var i = 0; i < arr.length; i++) {
        if (arr[i].divid === divname) {
            return i;
        }
    }
    return -1;
}

var act = function(tid, p) {
    if (p.funct.type === "movefunct") {
    	longtime = true;
        bot.move();
    }
    if (p.funct.type === "rotateleftfunct") {
    	longtime = true;
        bot.rotateLeft();
    }
    if (p.funct.type === "rotaterightfunct") {
    	longtime = true;
        bot.rotateRight();
    }
    // if (p.funct.type === "canmovefunct") {
    //     if(bot.canmove(p.funct.direction))
    //         alert("good to go!");
    // }
    if (p.funct.type === "repeatforeverfunct" && p.bref.length > 0) {
    	longtime = false;
        loop = true;
        endpoint = searchBlockArrayForDiv(test.arr, p.bref[0]);
        startpoint = searchBlockArrayForDiv(test.arr, p.bref[0]);
        for (var i = 0; i < p.bref.length; i++) {
            if (searchBlockArrayForDiv(test.arr, p.bref[i]) > endpoint) {
                endpoint = searchBlockArrayForDiv(test.arr, p.bref[i]);
            }
            if (searchBlockArrayForDiv(test.arr, p.bref[i]) < startpoint) {
                startpoint = searchBlockArrayForDiv(test.arr, p.bref[i]);
            }
        }
        counter.count = startpoint - 1;
    }
    if (p.funct.type === "repeatfunct") {
    	longtime = false;
        loop = true;
        times = parseInt(document.getElementById(p.funct.inputid).value, 10);
        if (!(times > 0)) {
            alert("please enter a value into the loop!");
            endscript = true;
            return;
        }
        timecounter = 1;
        endpoint = searchBlockArrayForDiv(test.arr, p.bref[0]);
        startpoint = searchBlockArrayForDiv(test.arr, p.bref[0]);
        for (var i = 0; i < p.bref.length; i++) {
            if (searchBlockArrayForDiv(test.arr, p.bref[i]) > endpoint) {
                endpoint = searchBlockArrayForDiv(test.arr, p.bref[i]);
            }
            if (searchBlockArrayForDiv(test.arr, p.bref[i]) < startpoint) {
                startpoint = searchBlockArrayForDiv(test.arr, p.bref[i]);
            }
        }
        counter.count = startpoint - 1;
    }
    if (p.funct.type === "iffunct") {
    	longtime = false;
        var end = searchBlockArrayForDiv(test.arr, p.bref[0]);
        for (var i = 0; i < p.bref.length; i++) {
            if (searchBlockArrayForDiv(test.arr, p.bref[i]) > end) {
                end = searchBlockArrayForDiv(test.arr, p.bref[i]);
            }
        }
        var ddl = document.querySelector(".ifmenu");
        var selectedValue = ddl.options[ddl.selectedIndex].value;
        if (!bot.canmove(selectedValue, true)) {
            counter.count = end;
            hangingif = true;
            hangingifendpoint = end;
        }
        else{
        	resetIfs();
        }
    }
    if (p.funct.type === "elsefunct") {
    	longtime = false;
        if (!(hangingif)) {
            var end = searchBlockArrayForDiv(test.arr, p.bref[0]);
            for (var i = 0; i < p.bref.length; i++) {
                if (searchBlockArrayForDiv(test.arr, p.bref[i]) > end) {
                    end = searchBlockArrayForDiv(test.arr, p.bref[i]);
                }
            }
            counter.count = end;
        }
        resetIfs();
    }

    if (p.funct.type === "elseiffunct") {
    	longtime = false;
    	var end = searchBlockArrayForDiv(test.arr, p.bref[0]);
            for (var i = 0; i < p.bref.length; i++) {
                if (searchBlockArrayForDiv(test.arr, p.bref[i]) > end) {
                    end = searchBlockArrayForDiv(test.arr, p.bref[i]);
                }
            }

    	var ddl = document.querySelector(".elsemenu");
        var selectedValue = ddl.options[ddl.selectedIndex].value;
        if (!(hangingif)||!bot.canmove(selectedValue, true)) {
            counter.count = end;
            hangingifendpoint = end + 1;
        }
        else if (bot.canmove(selectedValue, true)){
        	resetIfs();
        }
    }
}

function resetIfs(){
		hangingifendpoint = -1;
        hangingif = false;
}

function compileActions() {
	 var problemlist = checker();
    var finallist = "";
    if(problemlist.length > 0){
    	for(var b = 0; b < problemlist.length; b++){
    		finallist += problemlist[b] + "   //   ";
    	}
    	alert(finallist);
    	return;
    }

    times = 500;
    timecounter = 1;
    endscript = false;
    counter.count = 0;
    startpoint = 0;
    //console.log(test.arr);
    endpoint = test.arr.length - 1;
    var tid = setTimeout(mycode, 200);

    

    function mycode() {
        // if(hangingifendpoint != counter.count){
        // 	hangingif = false;
        // }
        if (counter.count > endpoint || endscript) {
            clearTimeout(tid);
        } else if (counter.count <= endpoint) {
        	console.log(counter.count);
            act(tid, test.arr[counter.count]);
            counter.count++;

            if (timecounter >= times) {
                times = 500; 
                loop = false;
                endpoint = test.arr.length - 1;
            }
            if (loop && counter.count > endpoint) {
                counter.count = startpoint;
                timecounter++;
            }
            if(longtime){
            	tid = setTimeout(mycode, speed);
            }
            else{
            	tid = setTimeout(mycode, 0);
            }
            
        }

    }
}

function stopActions() {
    //counter.count = 0;
    forever = false;
    endscript = true;
}


function checker(){
	var waitingif = false;
	problemlist = [];

	for(var i = 0; i < test.arr.length; i++){
		var pie = test.arr[i];
		if(pie.outer && pie.bref.length < 1){
			var problem = "Empty loop or if/else statement at block # " + (i+1); 
			problemlist.push(problem);
		}
		if (pie.funct.type === "repeatfunct") {
        var checktimes = parseInt(document.getElementById(pie.funct.inputid).value, 10);
        if (!(checktimes > 0)) {
            var problem = "No value entered for the repeat loop at block # " + (i+1); 
			problemlist.push(problem);
        }
	}}
	for(var i = 0; i < test.arr.length; i++){
		var pie = test.arr[i];

		if(!waitingif && (pie.funct.type === "elsefunct" || pie.funct === "elseiffunct")){
			var problem = "Else statement at block # " + (i+1) + " should be directly below if statement"; 
			problemlist.push(problem);
		}
		if(pie.funct.type === "iffunct" || pie.funct.type === "elseiffunct"){
			waitingif = true;
			}
        else{
        	waitingif = false;
        }
        if(pie.outer && pie.bref.length > 0){
        	i = searchBlockArrayForDiv(test.arr, pie.bref[0]);
        	for (var j = 0; j < pie.bref.length; j++) {
            if (searchBlockArrayForDiv(test.arr, pie.bref[j]) > i) {
                i = searchBlockArrayForDiv(test.arr, pie.bref[j]);
            }
        }
        }
		}
	return problemlist;
}
