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

// Convert UTF-16 charset to UTF-8
// Reference: http://suflow.iteye.com/blog/1687396
function utf16to8(str) {
    var out, i, len, c;
    out = '';
    len = str.length;
    for(i = 0; i < len; i++) {
      c = str.charCodeAt(i);
      if ((c >= 0x0001) && (c <= 0x007F)) {
          out += str.charAt(i);
      } else if (c > 0x07FF) {
          out += String.fromCharCode(0xE0 | ((c >> 12) & 0x0F));
          out += String.fromCharCode(0x80 | ((c >>  6) & 0x3F));
          out += String.fromCharCode(0x80 | ((c >>  0) & 0x3F));
      } else {
          out += String.fromCharCode(0xC0 | ((c >>  6) & 0x1F));
          out += String.fromCharCode(0x80 | ((c >>  0) & 0x3F));
      }
    }
    return out;
}

function qr_create() {
  var text = '';
  if(storage.has(qr_text)) {
    text = storage.get(qr_text);
    $('textarea#qr-text').val(text);
  } else {
    text = $('textarea#qr-text').val();
  }
  text = utf16to8(text).trim();
  if(text.length > 1276 || text == '') {
    text = chrome.i18n.getMessage('invalid_text');
    $('textarea#qr-text').val(text);
  }
  // console.log(text)
  $('#output').empty();
  $('#output').qrcode({
    // width: 256,
    // height: 256,
    // correctLevel: 0,
    text: text
  });
  storage.remove(qr_text);
}

$(function(){
  qr_create();
});

$(document).ready(function(){
  $('#create').on('click', qr_create);
  $("#qr-text").on('change keyup paste', qr_create);
});
