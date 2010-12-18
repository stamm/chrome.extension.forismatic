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
			db = get_db();
			db.transaction(function(tx1) {
				tx1.executeSql("SELECT MAX(id)+1 AS new FROM quotes", [], function(tx2, result) {
					new_id = result.rows.item(0)['new'];
					if (new_id == null)
					{
						new_id = 1;
					}
					db.transaction(function (tx2)
					{
						tx2.executeSql("INSERT INTO quotes (id, text, author, timestamp) VALUES (?, ?, ?, ?)", [new_id, text, author, new Date().getTime()]);
					});
				});
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