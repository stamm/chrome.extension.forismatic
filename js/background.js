
var version = 1.4;
//Поставить дефолтные значения при первом запуске
if ( ! localStorage['refresh'])
{
	localStorage['refresh'] = 30;
}
if ( ! localStorage['lang'])
{
	//Получаем язык, используемый в браузере
	var lang = chrome.i18n.getMessage("@@ui_locale");
	if (lang == 'ru')
		localStorage['lang'] = "ru";
	else
		localStorage['lang'] = "en";
}
if ( ! localStorage['version'] || localStorage['version'] != version)
{
	if ( ! localStorage['version'])
	{
		get_db().transaction(function(tx) {
			tx.executeSql('DROP TABLE IF EXISTS quotes');
			tx.executeSql("CREATE TABLE quotes (text TEXT, author TEXT, link TEXT, timestamp REAL)", [], null);
		});
	}
	localStorage['version'] = version;
}

//Добавляем listener, для вызова со страницы опций, чтобы обновить время обновления цитат
chrome.extension.onMessage.addListener(
	function(request, sender, sendResponse) {
		//Проверка, что данные пришли со страницы опций этого же плагина и параметр do равен update
		if (sender.tab.url == chrome.extension.getURL("options.html") && request.do == "update")
		{
			//Показываем цитату
			main();

			init();
			console.log('Update refresh time from options !');
			sendResponse({status: "ok"});
		}
	}
);
//Показываем цитату при запуске
main();

init();