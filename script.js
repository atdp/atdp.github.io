window.onload = function(){
	var s = document.getElementById("search");
	if (s) s.addEventListener("search", function(e) {
    	if (s.value) window.location = 'https://github.com/search?type=Code&q=user:pch4t+'+encodeURIComponent(s.value);
	});
	Array.from(document.querySelectorAll('a')).map(function(a){
		var l = a.getAttribute('title');
		if (l) a.className = l>=5000 ? 'a' : l>=1000 ? 'b' : l>=500 ? 'c' : l>=100 ? 'd' : '';
		if (location.host == 'pchat.cf') {
			var h = a.getAttribute('href');
			if (h.slice(-5) == '.html') a.setAttribute('href',h=='../index.html'?'../':h.slice(0,-5));
		}
	});
}