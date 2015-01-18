var storage = {
  get: (function(key) {
    return JSON.parse(localStorage.getItem(key));
  }),

  set: (function(key, value) {
    value = JSON.stringify(value);
    localStorage.setItem(key, value);
    // var data = {};
    // data[key] = value;
    // chrome.storage.sync.set(data);
  }),

  has: (function(key) {
    if(localStorage.hasOwnProperty(key)) {
      return true;
    } else {
      return false;
    }
  }),

  remove: (function(key) {
    if(localStorage.hasOwnProperty(key)) {
      localStorage.removeItem(key);
      // chrome.storage.sync.remove(key);
    }
  }),
};

var qr_text = 'qr.text';

// Set up context menus and sync data at install time.
chrome.runtime.onInstalled.addListener(function() {
  // chrome.storage.sync.get(null, function(items){
  //   // Sync data to local storage
  //   for(var item in items) {
  //     localStorage.setItem(item, items[item]);
  //   }

    // Set context menus
    var options = {
      'page': 'option.page_menu',
      'selection': 'option.selection_menu',
      'link': 'option.link_menu',
      'image': 'option.image_menu',
      'audio': 'option.audio_menu',
      'video': 'option.video_menu'
    }
    for(var key in options) {
      var option = options[key];
      if(!storage.has(option)) {
        storage.set(option, true);
      }
      // Only set the specified conext menus
      if(storage.get(option)) {
        var title = 'QRCode for this ' + key;
        if(key == 'selection') {
          title = "QRCode for '%s'";
        }
        chrome.contextMenus.create({
          'title': title,
          'contexts': [key],
          'id': option
        });
      }
    }
  // });
});

chrome.browserAction.onClicked.addListener(function(tab) {
  storage.set(qr_text, tab['url']);
  chrome.tabs.create({url: 'index.html', index: tab['index'] + 1});
});

chrome.contextMenus.onClicked.addListener(function(info, tab) {
  var id = info['menuItemId'];
  if(id == 'option.page_menu') {
    storage.set(qr_text, info['pageUrl']);
  } else if(id == 'option.selection_menu') {
    storage.set(qr_text, info['selectionText']);
  } else if(id == 'option.link_menu') {
    storage.set(qr_text, info['linkUrl']);
  } else if(id == 'option.image_menu') {
    storage.set(qr_text, info['srcUrl']);
  } else {
    storage.set(qr_text, info['pageUrl']);
  }
  chrome.tabs.create({url: 'index.html', index: tab['index'] + 1});
})
