//"Главная" функция, которая будет показывать всплывающее окно с цитатой

function main()
{
	today = new Date();
	today = (today.getMonth()+1) + '-' + today.getDate();
	console.log(today);
	if (false && today == '4-1')
	{
		if (localStorage['lang'] == 'ru')
		{
			fucking_advice_ru();
		}
		else
		{
			fucking_advice_en();
		}
	}
	else
	{
		forismatic();
	}
}

function forismatic()
{
	var req = new XMLHttpRequest();
	req.onload = function () {
		var doc = req.responseText;
		if (doc) {
			//Хак, позволяющий получить json как объект
			var json = JSON.parse(doc);
			var author = json.quoteAuthor,
				text = json.quoteText,
				link = json.quoteLink;
			//Можно создать запись в логе
			// console.log(author + ' ' + text);
			//Показываем цитату
			showNotification(author, text);
			log(author, text, link);
		}
	};
	req.open("GET", "http://api.forismatic.com/api/1.0/?method=getQuote&format=json&key=" + Math.random()*1000000 + "&lang=" + localStorage['lang'], true);
	req.send(null);
}

function fucking_advice_ru()
{
	req2 = new XMLHttpRequest();
	req2.onload = function () {
		var doc2 = req2.responseText;
		if (doc2) {
			url = substr(doc2, '<div id="another"><a id="next" href="', '"');
			console.log(url);

			req3 = new XMLHttpRequest();
			req3.onload = function () {
				var doc3 = req3.responseText;
				if (doc3) {
					mes = substr(doc3, '<p id="advice">', '</p>');
					mes = mes.replace('&nbsp;', ' ');
					showNotification('', mes);
					log('', mes);
				}
			};
			req3.open("GET", url, true);
			req3.send(null);
		}
	};
	req2.open("GET", 'http://fucking-great-advice.ru/', true);
	req2.send(null);
}

function fucking_advice_en()
{
	req2 = new XMLHttpRequest();
	req2.onload = function () {
		var doc2 = req2.responseText;
		if (doc2) {
			mes = JSON.parse(doc2);
			mes = mes.new_advice;
			mes = mes.replace("<span class='bigstrike first'>", '').replace("<span class='bigstrike'>", '').replace('</span>', '');
			showNotification('', mes);
			log('', mes);
		}
	};
	req2.open("GET", 'http://goodfuckingdesignadvice.com/refresh-advice.php', true);
	req2.send(null);
}

function log(author, text, link)
{
	get_db().transaction(function(tx1) {
		tx1.executeSql(
			"INSERT INTO quotes (text, author, link, timestamp) VALUES (?, ?, ?, ?)",
			[text, author, link, new Date().getTime()]
		);
	});
}

function substr(str, startStr, endStr)
{
	start = str.indexOf(startStr) + startStr.length;
	return str.substring(start, str.indexOf(endStr, start));
}

//Хелпер для показа всплывающего окна
function showNotification(title, text)
{
	var notification = chrome.notifications.create('', {iconUrl: 'icon.png', type: 'basic', title: title, message: text}, function (notification_id) {
		window.setTimeout(function() {
			chrome.notifications.clear(notification_id);
		}, 15000);
	})	
}
//Глобальная переменная для сохранения setInterval
var interval;
//Функция для запуска, которая через выставленное время в настройках будет запускать функцию main. Также запускается при измении времени обновления
function init() {
	if ( ! localStorage['refresh'])
		return;
	window.clearInterval(interval)
	interval = window.setInterval(function() {
		main();
	}, localStorage['refresh'] * 60000);
	console.log(localStorage['refresh'] * 60000);
}

//Получить линк на базу
function get_db()
{
	return openDatabase("quotes", "1.0", "A list of quotes.", 200000);
}