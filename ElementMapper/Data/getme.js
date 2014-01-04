self.port.on("showme", function (arg) {
  var textArea1 = document.getElementById('edit-box1');
  var textArea2 = document.getElementById('edit-box2');
  var addButton = document.getElementById('AddNew');
  addButton.onclick=function(){
      // Remove the newline.
      text1 = textArea1.value.replace(/(\r\n|\n|\r)/gm,"");
      text2 = textArea2.value.replace(/(\r\n|\n|\r)/gm,"");
      if(text2=="")
        self.port.emit("text-entered", text1 , text2 );
      else    
        self.port.emit("textentered", text1 , text2 );
      textArea1.value = '';
      textArea2.value = '';
  };
});