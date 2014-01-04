'use strict';

var contextMenu = require("sdk/context-menu"),
	self = require("self"),
	fileManager = require("./fileManager"),
	_ = require("sdk/l10n").get;
var ss = require("sdk/simple-storage");
var data = require("sdk/self").data;
var self = require("self"),fileManager = require("./fileManager"),_ = require("sdk/l10n").get;
var tabss = require("sdk/tabs");
if (!ss.storage.menu)
{    
    ss.storage.menu = [];    
    ss.storage.submenu = [];    
}

var AddNewEntity = contextMenu.Item({
  label: "Add New Entity",
  contentScript: 'self.on("click", function () {self.postMessage("newadd");});',
  onMessage: function (txt) {text_entry.show();console.log(txt);}
});

var AddNewObject = contextMenu.Item({
  label: "Add New Object",
  contentScript: 'self.on("click", function () {self.postMessage("newadd");});',
  onMessage: function (txt) {text_entry.show();console.log(txt);}
});

var entities = [];
entities.push(AddNewEntity);

for(var jj = 0 ; jj < ss.storage.menu.length ; jj++)
{
    var tmenu = contextMenu.Menu({ label: ss.storage.menu[jj], 
	items: [AddNewObject],
	context: contextMenu.SelectorContext("*"),
	contentScript: 'self.on("click", function () {var text = window.document.activeElement.outerHTML.toString();self.postMessage(text);});',
	onMessage: function (selectedText) {fileManager.writeFileToOS(fileManager.getPathToFile(), fileManager.createFileName(), ("<:::"+ss.storage.menu[jj]+">"+selectedText+"</:::"+ss.storage.menu[jj]+">")  );console.log((selectedText+" ::: "+ ss.storage.menu[jj] ));tabss.activeTab.attach({contentScript:'document.activeElement.style.backgroundColor = "#FDFF47";'});}
	});
    for(var jjj = 0 ; jjj < ss.storage.submenu[jj].length ; jjj++)
    {
        var titem =contextMenu.Item({ label: ss.storage.submenu[jj][jjj] });
        tmenu.addItem(titem);
    }
    entities.push(tmenu) ; 
}

var text_entry = require("sdk/panel").Panel({
  width: 330,
  height: 230,
  contentURL: data.url("mapper.html"),
  contentScriptFile: data.url("getme.js")
});

text_entry.on("show", function() {
  text_entry.port.emit("showme");
});

text_entry.port.on("text-entered", function (text) {
  console.log(text);
  ss.storage.menu.push(text);
  menu.addItem(contextMenu.Menu({ label: text, items: [AddNewObject]}));
  text_entry.hide();
});

text_entry.port.on("textentered", function (text1 , text2) {
  console.log(text1);
  console.log(text2);
  for(var iii = 0 ; iii < ss.storage.menu.length ; iii++)
  {
      if(ss.storage.menu[iii]==text1)
      {    
        if(!ss.storage.submenu[iii])
            ss.storage.submenu[iii] = []; 
        ss.storage.submenu[iii].push(text2);
      }
  }
   for(var iii = 0 ; iii < menu.items.length ; iii++)
  {
    if(menu.items[iii].label == text1)
    {
        menu.items[iii].addItem(contextMenu.Item({ label: text2 ,
		context: contextMenu.SelectorContext("*"),
		contentScript: 'self.on("click", function () {var text = window.document.activeElement.outerHTML.toString();self.postMessage(text);});',
		onMessage: function (selectedText) {fileManager.writeFileToOS(fileManager.getPathToFile(), fileManager.createFileName(), ("<:::"+text2+">"+selectedText+"</:::"+text2+">" ));console.log((selectedText+" ::: "+ text2 ));tabss.activeTab.attach({contentScript:'document.activeElement.style.backgroundColor = "#FDFF47";' })}
		}));
    }
  }      
  text_entry.hide();
});

var menu = contextMenu.Menu({
    label: "Map To",
    context: contextMenu.SelectorContext("*"),   
    items: entities
 });
 