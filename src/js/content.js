(function(){

  NTS.Content.lookup();
  NTS.Content.setupKeyboardEventHandlers();

  chrome.runtime.onMessage.addListener(function(msg) {
    console.log(msg);
    if (msg.type === "render") {
      NTS.Content.resetDom();
      NTS.Content.lookup();
    }
    return true;
  });

})();
