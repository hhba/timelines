//get_data("https://spreadsheets.google.com/feeds/cells/0Av8QEY2w-qTYdE1EX0R3a04zaEVwY0ltVU1oSkxKSWc/od5/public/basic?alt=json-in-script&callback=parseRequest");
var callback = false;
function get_data(url,cb) {
  // Crear el elemenot script
  var script = document.createElement('script');
  // set the src attribute to that url
  script.setAttribute('src', url);
  // insert the script in out page
  callback = cb
  document.getElementsByTagName('head')[0].appendChild(script);
}

// Esta funcion parsea el objeto devuelto por google docs
function parseRequest(root) {
  var ret =[]
  var prev = {}
  var keys = {} 
  var feed = root.feed;
  var entries = feed.entry || [];
  for (var i = 0; i < entries.length; ++i) {
    var entry = entries[i];
    var title = entry.title.$t;
    var content = entry.content.$t;
    var column = title.replace(/[0-9]+/,"")
    var row = parseInt(title.replace(/[A-Z]+/,""))
    if (column == "A"){
      ret.push(prev)
      prev = {}
    }
    if (row == 1){
      keys[column]=content.toLowerCase()
    }else{
      prev[keys[column]] = content
    }
  }
  ret.push(prev)
  callback(ret)
}
