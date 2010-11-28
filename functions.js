function subTag(txt, tag)
{
	openTag = '<' + tag + '>';
	return txt.substring(
		txt.indexOf(openTag) + openTag.length,
		txt.indexOf('</'+tag+'>')
	);
}

function main()
{
	req = new XMLHttpRequest();
	req.onload = function () {
		var doc = req.responseText;
		if (doc) {
			author = subTag(doc, 'quoteAuthor');
			text = subTag(doc, 'quoteText');
			console.log(author + ' ' + text);
			showNotification(author, text);
		}
	};
	req.open("GET", "http://api.forismatic.com/api/1.0/?method=getQuote&format=xml&key=" + Math.random()*1000000 + "&lang=" + localStorage['lang'], true);
	req.send(null);
}

function showNotification(title, text)
{
	var notification = webkitNotifications.createNotification(
		'',
		title,
		text
	);
	notification.show();
	window.setInterval(function() {
		notification.cancel();
	}, 15000);
}
var interval;
function init() {
	if ( ! localStorage['refresh'])
		return;
	window.clearInterval(interval)
	interval = window.setInterval(function() {
		main();
	}, localStorage['refresh'] * 60000);
	console.log(localStorage['refresh'] * 60000);
}