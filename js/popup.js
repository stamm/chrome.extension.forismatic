//length = localStorage['quotes'].length;
//document.getElementById("body").innerHTML = length;
//document.getElementById("body").innerHTML = '333'
/*for(i=length; i>0 && i >= length-20 ; i--)
{
	alert(localStorage['quotes'][i][1]);
}*/
get_db().transaction(function(tx) {
	tx.executeSql("SELECT * FROM quotes ORDER BY rowid DESC LIMIT 4", [], function(tx, result) {
		for(var i = 0; i < result.rows.length; i++) {
			var link = result.rows.item(i)['link'];
			var textToSocial = (result.rows.item(i)['author'] ? result.rows.item(i)['author'] + ": " : '') + result.rows.item(i)['text'];
			var twitterText = textToSocial;
			if (twitterText.length > 140)
			{
				twitterText = twitterText.substring(0, 140 - link.length - 1) + '…' + link;
			}
			var social = ' <a target="_blank" title="' + chrome.i18n.getMessage('writeInVkontakte') + '" href="http://vkontakte.ru/share.php?url=' + link + '&title=' + textToSocial + '"><img src="https://vk.com/images/favicon_vk_2x.ico?3" alt="Vkontakte" class="icon grayscale"/></a>&nbsp;<a target="_blank" title="' + chrome.i18n.getMessage('writeInTwitter') + '" href="http://twitter.com/home?status=' + encodeURIComponent(twitterText) + '"><img src="https://abs.twimg.com/favicons/favicon.ico" alt="Twitter" class="icon grayscale" /></a>&nbsp;<a target="_blank" title="' + chrome.i18n.getMessage('writeInFacebook') + '" href="http://www.facebook.com/sharer.php?u=' + encodeURIComponent(link) + '&t=' + encodeURIComponent(textToSocial) + '"><img src="https://fbstatic-a.akamaihd.net/rsrc.php/yl/r/H3nktOa7ZMg.ico" alt="Facebook" class="icon grayscale" /></a>';
			var text = '';
			text += result.rows.item(i)['author'] ? '<b>' + result.rows.item(i)['author'] + '</b><br/>' : '';
			text += result.rows.item(i)['text'];
			text += (i != result.rows.length-1) ?
				social + '<hr style="background:black; height:1px; border: none;"/>'
				: social;
			document.getElementById("body").innerHTML += text;
		}
	}, null)
});

window.addEventListener('load', function() {
	_gaq.push(['_trackEvent', 'popup', 'show', 'lang', localStorage['lang']]);
}, false )
