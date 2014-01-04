var count = new Object() ;
var resp ; 
function getCount()
{
var xhr = new XMLHttpRequest();
xhr.open("GET", ("https://zmail.zoho.com/mail/home.do"), true);
xhr.onreadystatechange = function() {
  if (xhr.readyState == 4 &&  xhr.responseText.indexOf('inboxCount') != -1) {
	chrome.browserAction.setIcon({path:"on.png"});
    console.log(xhr.responseText);
	resp = xhr.responseText;
    var pos = resp.search('totalUnread:');
	count.text = resp.substring(pos+12,pos+15).split(',')[0];
    console.log(resp.substring(pos+12,pos+15).split(','));
    chrome.browserAction.setBadgeText(count);
	if(count.text != '0' &&  localStorage.shown == 'false' )
	{show();localStorage.shown = true ;}
	console.log(count);
  }
  else	{
	chrome.browserAction.setIcon({path:"off.png"});
	chrome.browserAction.setBadgeText({text:""});
	}
}
xhr.send();
}

localStorage.shown = false;
getCount();

chrome.alarms.create('watchdog',{periodInMinutes:1})
chrome.alarms.onAlarm.addListener(onalarm)
function onalarm(alarm) {
  if (alarm && alarm.name == 'watchdog') {
	getCount();
	} 
  } 
  
 function setFocus()
 {
 console.log('Going to inbox...');
  chrome.tabs.getAllInWindow(undefined, function(tabs) {
    for (var i = 0, tab; tab = tabs[i]; i++) {
      if (tab.url && tab.url=="https://mail.zoho.com/biz/index.do") {
        chrome.tabs.update(tab.id, {selected: true});
        startRequest({scheduleRequest:false, showLoadingAnimation:false});
        return;
      }
    }
    chrome.tabs.create({url: "https://mail.zoho.com/biz/index.do" });  

	});
 }
 
 
 chrome.browserAction.onClicked.addListener(setFocus);

function show() {
 if (window.webkitNotifications && localStorage.isActivated) {
 var notification = webkitNotifications.createNotification(
  'mail.png', 
  'Zoho Mail', 
  'You have unread mail ! '
);
  notification.show();
  notification.onclose = function(){localStorage.shown = false;};
  notification.onclick = function(){setFocus();localStorage.shown = false;};
}
}


if (!localStorage.isInitialized) {
  localStorage.isActivated = true;   
  localStorage.isInitialized = true;
  localStorage.shown = false;
}