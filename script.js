window.onload = function(){
	var a = document.querySelector('a.index');
	if (a && location.host) a.setAttribute('href','../');
	Array.from(document.querySelectorAll('[title]')).map(function(a){
		var l = a.getAttribute('title');
		a.className = l>=5000 ? 'a' : l>=1000 ? 'b' : l>=500 ? 'c' : l>=100 ? 'd' : '';
	});
}