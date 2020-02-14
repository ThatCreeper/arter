const { ipcRenderer, remote } = require( "electron" );
var editing = false
var id = 0
window.onload = ()=>{
	const customTitlebar = require('custom-electron-titlebar');
	//console.log(remote.getGlobal('data'))
	new customTitlebar.Titlebar({
		backgroundColor: customTitlebar.Color.fromHex('#1598bf')
	});
	document.getElementById("addnew").onclick = ()=>showForm()
	document.getElementById("overlay").onclick = ()=>hideForm()
	genPaintings()
}

function showForm() {
	editing = false
	var newInnerHtml = "";
	remote.getGlobal("data").options.forEach((data)=> {
		newInnerHtml+="<input type=\""+data.type+"\" name=\""+data.name+"\" placeholder=\""+data.name+"\"/><br/>"
	})
	newInnerHtml+="<button>Add</button>"
	document.getElementById("myform").innerHTML=newInnerHtml;
	document.getElementById("overlay").style.display = "block"
	document.getElementById("newmenu").style.display = "block"
}

function hideForm() {
	document.getElementById("overlay").style.display = "none"
	document.getElementById("newmenu").style.display = "none"
	return false
}

function genPaintings() {
	var newInnerHtml = "";
	remote.getGlobal("data").paintings.forEach((data,id)=>{
		console.log(data);
		newInnerHtml+="<div class=\"panel\"><img class=\"panel-img\" src=\"file://"+data.imageLoc+"\"/><h4 style=\"color:white;\">"+data.name+"</h4><i class=\"fas fa-edit\" style=\"font-size:30px; color:white;\" onclick=\"editPainting("+id+")\"></i><div style=\"width:75px;display:inline-block;\"></div><i class=\"fas fa-trash\" style=\"font-size:30px; color:white;\" onclick=\"deletePainting("+id+")\"></i></div>";
	})
	document.getElementById("arts").innerHTML = newInnerHtml;
}

ipcRenderer.on("regen",genPaintings)

function editPainting(_id) {
	editing = true
	id = _id
	var newInnerHtml = "";
	var painting = remote.getGlobal("data").paintings[_id]
	remote.getGlobal("data").options.forEach((data)=> {
		newInnerHtml+="<input type=\""+data.type+"\" name=\""+data.name+"\" placeholder=\""+data.name+"\" value=\""+painting[data.name]+"\"/><br/>"
	})
	newInnerHtml+="<button>Edit</button><button onclick=\"hideForm()\">Close</button"
	document.getElementById("myform").innerHTML=newInnerHtml;
	document.getElementById("overlay").style.display = "block"
	document.getElementById("newmenu").style.display = "block"
}

function deletePainting(id) {
	var paintings = remote.getGlobal('data').paintings
	paintings.splice(id,1)
	ipcRenderer.send("setGlobalPaint", paintings)
	setTimeout(genPaintings, 100)
}

function submitForm() {
	var object = {};
	if(editing) oldObject = remote.getGlobal('data').paintings[id]
	new FormData(document.getElementById('myform')).forEach((value, key) => {object[key] = value});
	if(!editing) object.imageLoc = object.image.path
	if(editing) object.imageLoc = oldObject.imageLoc
	var remote_data = remote.getGlobal('data').paintings
	if(editing) {
		remote_data[id] = object
	} else {
		remote_data.push(object)
	}
	console.log(object)
	ipcRenderer.send( "setGlobalPaint", remote_data );
	hideForm()
	console.log(remote.getGlobal('data'))
	setTimeout(genPaintings, 100)
	return false;
}
