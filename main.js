let remote
var _ = require('underscore')
window.onload = ()=>{
	const customTitlebar = require('custom-electron-titlebar');
	remote = require('electron').remote
	//console.log(remote.getGlobal('data'))
	new customTitlebar.Titlebar({
		backgroundColor: customTitlebar.Color.fromHex('#1598bf')
	});
	document.getElementById("addnew").onclick = ()=>showForm()
	document.getElementById("overlay").onclick = ()=>hideForm()
}

function showForm() {
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
}

function submitForm() {
	var object = {};
	new FormData(document.getElementById('myform')).forEach((value, key) => {object[key] = value.toString});
	var remote_data = remote.getGlobal('data').paintings
	remote_data.push(object)
	remote.getGlobal('data').paintings = remote_data
	hideForm()
	console.log(remote.getGlobal('data'))
	return false;
}