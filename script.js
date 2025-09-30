console.log( "来~让我康康" );
function warning_continue(){  //警告弹窗下的"继续"按钮
    console.log("登dua~郎")
	var element = document.getElementById("warning");
	element.style.display = 'none';
}
function warning_exit(){  //警告弹窗下的"关闭"按钮(可能无效)
    window.opener = null;
    window.open('', '_self').close();
}