//"Главная" функция, которая будет показывать всплывающее окно с цитатой
function main()
{
	req = new XMLHttpRequest();
	req.onload = function () {
		var doc = req.responseText;
		if (doc) {
			//Хак, позволяющий получить json как объект
			var json = eval('(' + doc + ')');
			author = json.quoteAuthor;
			text = json.quoteText;
			link = json.quoteLink;
			//Можно создать запись в логе
			console.log(author + ' ' + text);
			//Показываем цитату
			showNotification(author, text);
			get_db().transaction(function(tx1) {
				tx1.executeSql("INSERT INTO quotes (text, author, timestamp) VALUES (?, ?, ?)", [text, author, new Date().getTime()]);
			});
		}
	};
	req.open("GET", "http://api.forismatic.com/api/1.0/?method=getQuote&format=json&key=" + Math.random()*1000000 + "&lang=" + localStorage['lang'], true);
	req.send(null);
}

//Хелпер для показа всплывающего окна
function showNotification(title, text)
{
	var notification = webkitNotifications.createNotification(
		'',
		title,
		text
	);
	notification.show();
	//Убираем окно через 15 секунд
	window.setInterval(function() {
		notification.cancel();
	}, 15000);
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