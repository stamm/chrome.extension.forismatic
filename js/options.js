//Сохраняем опции
function save_options()
{
	localStorage['lang'] = document.getElementById("lang").value;
	localStorage['refresh'] = parseFloat(document.getElementById("refresh").value);

	//Показываем пользователю, что настройки сохранены
	var status = document.getElementById("status");
	status.innerHTML = chrome.i18n.getMessage("options_saved");
	setTimeout(function() {
		document.getElementById("status").innerHTML = "";
	}, 1750);

	//Посылаем запрос на background.html
	chrome.extension.sendMessage({do: "update"}, function(response) {
		console.log(response);
	});
}

//Восстанавливаем значения из localStorage
function restore_options()
{
	//Выставляем язык
	document.getElementById("locale_refresh").innerHTML = chrome.i18n.getMessage("refresh");
	document.getElementById("locale_minutes").innerHTML = chrome.i18n.getMessage("minutes");
	document.getElementById("locale_language").innerHTML = chrome.i18n.getMessage("language");
	document.getElementById("locale_save").value = chrome.i18n.getMessage("save");
	document.title = chrome.i18n.getMessage("options");

	//Выставляем значения
	//Можно поставить:
	//document.getElementById("lang").value = localStorage["lang"] == undefined ? 'en' : localStorage["lang"];
	//Но в background.html уже выставлены значения по-умолчанию
	document.getElementById("lang").value = localStorage["lang"];
	document.getElementById("refresh").value = localStorage["refresh"];
}


document.addEventListener('DOMContentLoaded', function () {
	restore_options();
	document.querySelector('#form').addEventListener('submit', function(event){
		save_options();
		event.preventDefault();
	});
});