var strings = {
  ICON_NEW_NOTE: 'new note',
  ICON_SAVE: 'save workspace',
  ICON_LOAD: 'load previous version',
  FILTER_TITLE: 'enter a regular expression to filter by',
  RSS_LINK_TITLE: 'rss feed of these notes',

  NOTE_TOOLTIP: 'double click to edit',
  UNLOAD_WARNING: 'Your notes have not been saved and you may lose some information.',

  // $1 is a number (key)
  COLOR_SWATCH_TOOLTIP: 'press $1 when not in edit mode to use this color',
  CLOSE_ICON_ALT: 'close button',
  CLOSE_ICON_TOOLTIP: 'delete this note',

  HISTORY_CREATE_NOTE: 'create note',  
  HISTORY_MOVE_NOTE: 'move note',
  HISTORY_MOVE_NOTES: 'move notes',
  HISTORY_DELETE_NOTE: 'delete note',
  HISTORY_CHANGE_NOTE_COLOR: 'change color',
  HISTORY_RESIZE_NOTE: 'resize note',
  HISTORY_EDIT_NOTE: 'edit note',
  
  HISTORY_UNDO_EMPTY: 'nothing to undo',
  HISTORY_REDO_EMPTY: 'nothing to redo',
  // $1 is the action action tooltip, $2 is the number of actions
  HISTORY_UNDO_TOOLTIP: '$1 ($2 action)',
  HISTORY_UNDO_TOOLTIPS: '$1 ($2 actions)',

  MINI_NO_NOTES: 'you have no notes',
  MINI_SHOWING_ALL: 'showing all $1 notes',
  MINI_HIDING_ALL: 'hiding all $1 notes',
  MINI_SHOWING_PARTIAL: 'showing $1 of $2 notes',

  // Used when filtering by a color
  COLOR: 'color',
  COLOR_YELLOW: 'yellow',
  COLOR_BLUE: 'blue',
  COLOR_GREEN: 'green',
  COLOR_RED: 'red',
  COLOR_ORANGE: 'orange',
  COLOR_PURPLE: 'purple',
  COLOR_WHITE: 'white',
  COLOR_GREY: 'grey',

  BOOKMARKLET_TEXT: 'This is a bookmarklet for quickly adding new notes.  Right click on the link and add it as a bookmark.  You can now quickly create a note by selecting text on any webpage and then clicking your bookmark.',
  BOOKMARKLET_NAME: 'new note',
  
  LOADVERSIONS_ABOUT: 'If you wish to load a previous version of this workspace, select the time from the list and press load.',
  LOADVERSIONS_OLDER: 'older',
  LOADVERSIONS_NEWER: 'newer',
  LOADVERSIONS_DATE_NOTE: 'all times are US Eastern Time (-0500)',
  LOADVERSIONS_INIT: 'Retrieving version history...',
  LOADVERSIONS_NONE: 'No versions found.  No notes have been saved to this workspace.',

  COLLISION_WARNING: "This workspace has been changed by someone else while you were working on it.  If you want to see what the workspace looks like now, you can <a href='$1' target='_new'>open it in a new window</a>.",
  
  SAVE_STATUS_ERROR: 'Failed to save notes.  Please make sure you have an internet connection and try again.',
  // $1 is the email address of the admin
  SAVE_SERVER_ERROR: 'Failed to save notes.  There is a problem with the server.  Please try again in a few minutes.  If the problem persists, please send an email to $1.'
};


//strings script end
/**
 * @fileoverview A few generic objects and functions used by webnote.
 */

///
/// global methods
///
var hex2dec = function(h) { return parseInt(h, 16); };
var dec2hex = function(d)
{
  var ret = d.toString(16);
  while (ret.length < 2)
    ret = '0' + ret;
  return ret;
};

var getxmlreqobj = function() {
  var xmlobj;
  try { xmlobj = new ActiveXObject("Msxml2.XMLHTTP"); }
  catch (e) {
    try { xmlobj = new XMLHttpRequest(); }
    catch (e) { alert("Your browser doesn't support xmlhttprequest.  Unable to save."); }
  }
  return xmlobj;
};

String.prototype.trim = function() {
  return this.replace(/^\s+/, '').replace(/\s+$/, '');
}

/**
 * Reduces the chance of a closure leaking memory by minimizing the scope.
 */
var hitch = function(obj, meth) {
  return function() { return meth.apply(obj, arguments); };
}

var retFalse = function() { return false; };

/**
 * modified from http://www.quirksmode.org/js/findpos.html
 * to return a Point()
 */
function findPos(obj)
{
  var cur = new Point();
  if (obj.offsetParent)
  {
    while (obj.offsetParent)
    {
      cur.x += obj.offsetLeft;
      cur.y += obj.offsetTop;
      obj = obj.offsetParent;
    }
  }
  else if (obj.x)
  {
    cur.x += obj.x;
    cur.y += obj.y;
  }
  return cur;
}

/**
 * Get the position of a mouse event relative to the event target.
 */
function findRelativeMousePos(ev) {
  var target = ev.target || ev.srcElement;
  var targetPos = findPos(target);
  var pagePos;
  if (ev.pageX || ev.pageY) {
    pagePos = new Point(ev.pageX, ev.pageY);
  } else if (ev.clientX || ev.clientY) {
    pagePos = new Point(ev.clientX + document.body.scrollLeft,
                        ev.clientY + document.body.scrollTop);
  }
    
  return pagePos.sub(targetPos);
}

///
/// generic objects
///

/**
 * Create a new Point object
 * @class A class representing two numbers, x and y.
 * @param {int} x optional parameter for x
 * @param {int} y optional parameter for y
 * @constructor
 */
function Point(x, y)
{
  /**
   * @type int
   */
  this.x = x || 0;
  /**
   * @type int
   */
  this.y = y || 0;
}
/**
 * Add two points together and return a new Point object.
 * @param {Point} rhs The point object to add.
 * @return a new point object
 * @type Point
 */
Point.prototype.add = function(rhs) { return new Point(this.x + rhs.x, this.y + rhs.y); };
/**
 * Subtract the input point from the object and return a new Point object.
 * @param {Point} rhs The point to subtract.
 * @return a new point object
 * @type Point
 */
Point.prototype.sub = function(rhs) { return new Point(this.x - rhs.x, this.y - rhs.y); };
/**
 * Divide x and y by the input value.
 * @param {int} n a number to divide by
 * @return a new point object
 * @type Point
 */
Point.prototype.div = function(n) { return new Point(this.x/n, this.y/n); };
/**
 * Make a copy of the Point object.
 * @return a new point object
 * @type Point
 */
Point.prototype.copy = function() { return new Point(this.x, this.y); };
/**
 * Determines if two points have the samve x and y values, respectively.
 * @param {Point} rhs the point to compare
 * @type boolean
 */
Point.prototype.equals = function(rhs) { return this.x == rhs.x && this.y == rhs.y; };
/**
 * A string representation of a point.
 * @return E.g., "(1, 2)"
 * @type String
 */
Point.prototype.toString = function() { return '(' + this.x + ', ' + this.y + ')'; };


/**
 * Create a new object to represent a color in HSV.
 * @class A class representing a color as HSV values.
 * @param {Color} rgb A Color object (RGB) to convert to HSV.
 * @constructor
 */
function ColorHSV(rgb)
{
  var r = rgb.r / 255.0; var g = rgb.g / 255.0; var b = rgb.b / 255.0;
  
  var min = Math.min(r, g, b); var max = Math.max(r, g, b);
  this.v = max;
  var delta = max - min;
  if (0 == max) // r == g == b == 0
  {
    this.s = 0;
    this.h = -1;
  }
  else
  {
    this.s = delta / max;
    if (r == max)
      this.h = (g - b) / delta;
    else if (g == max)
      this.h = 2 + (b - r) / delta;
    else
      this.h = 4 + (r - g) / delta;
    this.h *= 60.0;
    if (!this.h) // shades of grey have no value
      this.h = 0;
    if (this.h < 0)
      this.h += 360.0;
  }
}
/**
 * A pretty way to write out the value of a HSV point.
 * @type String
 */
ColorHSV.prototype.toString = function()
{
  return '(' + this.h + ', ' + this.s + ', ' + this.v + ')';
};
/**
 * Convert the HSV value to RGB and return a Color object.
 * @type Color
 */
ColorHSV.prototype.toColor = function()
{
  var ret = new Color('000000');
  if (0 == this.s)
  {
    ret.r = ret.g = ret.b = parseInt(this.v*255.0);
    return ret;
  }
  var h = this.h / 60.0;
  var i = Math.floor(h);
  var f = h - i;
  var p = this.v * (1.0 - this.s);
  var q = this.v * (1.0 - this.s * f);
  var t = this.v * (1.0 - this.s * (1 - f));
  switch (i)
  {
    case 0: ret.r = this.v; ret.g = t; ret.b = p; break;
    case 1: ret.r = q; ret.g = this.v; ret.b = p; break;
    case 2: ret.r = p; ret.g = this.v; ret.b = t; break;
    case 3: ret.r = p; ret.g = q; ret.b = this.v; break;
    case 4: ret.r = t; ret.g = p; ret.b = this.v; break;
    case 5: ret.r = this.v; ret.g = p; ret.b = q; break;
    default:
      noteDB('error coverting from hsv to rgb');
  }
  ret.r = parseInt(ret.r*255.0);
  ret.g = parseInt(ret.g*255.0);
  ret.b = parseInt(ret.b*255.0);
  return ret;
};
/**
 * Adjust the HSV values of the object.  Returns a reference to the same
 * object.
 * @param {int} h hue adjustment
 * @param {int} s saturation adjustment
 * @param {int} v luminance adjustment
 * @type ColorHSV
 */
ColorHSV.prototype.adj = function(h, s, v)
{
  this.h += h; this.s += s; this.v += v;
  
  if (h < 0)
    h += 360.0;
  if (h > 360)
    h -= 360.0;
  this.s = Math.min(1.0, this.s); this.s = Math.max(0.0, this.s);
  this.v = Math.min(1.0, this.v); this.v = Math.max(0.0, this.v);
  return this;
};


/**
 * Create a new object to represent a color as RGB values.
 * @class A class representing a color as RGB values.
 * @param {String} value A string representing the color.  It can be in any
 * of the following formats: rgb(##, ##, ##), #ffffff, or ffffff
 * @constructor
 */
function Color(value)
{
  // constuctor creates object from a string
  // I keep all values in decimal
  if (value.charAt(0) == 'r')
  {
    /**
     * @type int
     */
    this.r = parseInt(value.substring(4));
    var pos = value.indexOf(',');
    /**
     * @type int
     */
    this.g = parseInt(value.substring(pos+1));
    pos = value.indexOf(',', pos+1);
    /**
     * @type int
     */
    this.b = parseInt(value.substring(pos+1));
  }
  else
  {
    if (value.charAt(0) == '#')
      value = value.substring(1, 7);
    this.r = hex2dec(value.substring(0, 2));
    this.g = hex2dec(value.substring(2, 4));
    this.b = hex2dec(value.substring(4, 6));
  }
}
/**
 * Convert the object to a string of the form #ffffff
 * @type String
 */
Color.prototype.toString = function()
{
  return '#' + dec2hex(this.r) + dec2hex(this.g) + dec2hex(this.b);
};
/**
 * Adjust the HSV values of the color.  Returns a reference to the
 * object.
 * @param {float} h hue
 * @param {float} s saturation
 * @param {float} v luminance
 * @type Color
 */
Color.prototype.hsvadj = function(h, s, v)
{
  var hsv = new ColorHSV(this);
  hsv.adj(h, s, v);
  var c = hsv.toColor();
  this.r = c.r; this.g = c.g; this.b = c.b;
  return this;
};

var weekdays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
var months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
              'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
/**
 * Create a new MyDate object.
 * @class A class representing the current date and time.
 * @param {String} a string of the form "YY-MM-DD HH:mm:ss"
 * @constructor
 */
function MyDate(stddt)
{
  var tokens = stddt.split(' ');
  var dateTokens = tokens[0].split('-');
  var timeTokens = tokens[1].split(':');

  var dateobj = new Date();
  dateobj.setYear(dateTokens[0]);
  dateobj.setMonth(dateTokens[1] - 1);
  dateobj.setDate(dateTokens[2]);
  dateobj.setHours(timeTokens[0]);
  dateobj.setMinutes(timeTokens[1]);
  dateobj.setSeconds(timeTokens[2]);

  /**
   * @type Date
   */
  this.dateobj = dateobj;
  return this;
}
/**
 * Left pad a number with zeros (up to 2 digits).  For example, 4 to "04".
 * @type String
 */
MyDate.prototype.pad = function(s)
{
  while (s.toString().length < 2)
    s = '0' + s;
  return s;
};
/**
 * A pretty (well, to me at least) string representing the date.
 * For example, "Mon Jan 4, 13:42:12"
 * @type String
 */
MyDate.prototype.toString = function()
{
  var d = this.dateobj;
  return weekdays[d.getDay()] + ' ' + months[d.getMonth()] + ' ' + d.getDate()
          + ', ' + this.pad(d.getHours()) + ':' + this.pad(d.getMinutes())
          + ':' + this.pad(d.getSeconds());
};

function isEsc(s)
{
  return !( (s >= 48 && s <= 57) || (s >= 65 && s <= 90) 
            || (s >=97 && s <=122) || s == 95);
}
/**
 * myescape and myunescape are provided for safari compatability.
 * In reality, I should be using encodeURIComponent for everything, but
 * since information in the db is already in this form, we'll keep it
 * in this form.
 */
function myescape(s)
{
  var ret = "";
  for (var i = 0; i < s.length; i++)
  {
    if (isEsc(s.charCodeAt(i)))
    {
      var hex = dec2hex(s.charCodeAt(i)).toUpperCase();
      if (hex.length > 2)
        hex = 'u' + hex;
      ret += '%' + hex;
    }
    else
      ret += s[i];
  }
  return ret;
}

/**
 * myescape and myunescape are provided for safari compatability.
 * In reality, I should be using encodeURIComponent for everything, but
 * since information in the db is already in this form, we'll keep it
 * in this form.
 */
function myunescape(s)
{
  var ret = "";
  for (var i = 0; i < s.length; i++)
  {
    if ('%' == s[i])
    {
      if (s.length > i+5 && s[i+1] == 'u')
      {
        ret += String.fromCharCode(hex2dec(s.substr(i+2, i+6)));
        i += 5;
      }
      else if (s.length > i+2)
      {
        ret += String.fromCharCode(hex2dec(s.substr(i+1, i+3)));
        i += 2;
      }
    }
    else
      ret += s[i];
  }
  return ret;
}


//objects script end
//-- Google Analytics Urchin Module
//-- Copyright 2007 Google, All Rights Reserved.

//-- Urchin On Demand Settings ONLY
var _uacct="";			// set up the Urchin Account
var _userv=1;			// service mode (0=local,1=remote,2=both)

//-- UTM User Settings
var _ufsc=1;			// set client info flag (1=on|0=off)
var _udn="auto";		// (auto|none|domain) set the domain name for cookies
var _uhash="on";		// (on|off) unique domain hash for cookies
var _utimeout="1800";   	// set the inactive session timeout in seconds
var _ugifpath="/__utm.gif";	// set the web path to the __utm.gif file
var _utsp="|";			// transaction field separator
var _uflash=1;			// set flash version detect option (1=on|0=off)
var _utitle=1;			// set the document title detect option (1=on|0=off)
var _ulink=0;			// enable linker functionality (1=on|0=off)
var _uanchor=0;			// enable use of anchors for campaign (1=on|0=off)
var _utcp="/";			// the cookie path for tracking
var _usample=100;		// The sampling % of visitors to track (1-100).

//-- UTM Campaign Tracking Settings
var _uctm=1;			// set campaign tracking module (1=on|0=off)
var _ucto="15768000";		// set timeout in seconds (6 month default)
var _uccn="utm_campaign";	// name
var _ucmd="utm_medium";		// medium (cpc|cpm|link|email|organic)
var _ucsr="utm_source";		// source
var _uctr="utm_term";		// term/keyword
var _ucct="utm_content";	// content
var _ucid="utm_id";		// id number
var _ucno="utm_nooverride";	// don't override

//-- Auto/Organic Sources and Keywords
var _uOsr=new Array();
var _uOkw=new Array();
_uOsr[0]="google";	_uOkw[0]="q";
_uOsr[1]="yahoo";	_uOkw[1]="p";
_uOsr[2]="msn";		_uOkw[2]="q";
_uOsr[3]="aol";		_uOkw[3]="query";
_uOsr[4]="aol";		_uOkw[4]="encquery";
_uOsr[5]="lycos";	_uOkw[5]="query";
_uOsr[6]="ask";		_uOkw[6]="q";
_uOsr[7]="altavista";	_uOkw[7]="q";
_uOsr[8]="netscape";	_uOkw[8]="query";
_uOsr[9]="cnn";	_uOkw[9]="query";
_uOsr[10]="looksmart";	_uOkw[10]="qt";
_uOsr[11]="about";	_uOkw[11]="terms";
_uOsr[12]="mamma";	_uOkw[12]="query";
_uOsr[13]="alltheweb";	_uOkw[13]="q";
_uOsr[14]="gigablast";	_uOkw[14]="q";
_uOsr[15]="voila";	_uOkw[15]="rdata";
_uOsr[16]="virgilio";	_uOkw[16]="qs";
_uOsr[17]="live";	_uOkw[17]="q";
_uOsr[18]="baidu";	_uOkw[18]="wd";
_uOsr[19]="alice";	_uOkw[19]="qs";
_uOsr[20]="yandex";	_uOkw[20]="text";
_uOsr[21]="najdi";	_uOkw[21]="q";
_uOsr[22]="aol";	_uOkw[22]="q";
_uOsr[23]="club-internet"; _uOkw[23]="query";
_uOsr[24]="mama";	_uOkw[24]="query";
_uOsr[25]="seznam";	_uOkw[25]="q";
_uOsr[26]="search";	_uOkw[26]="q";
_uOsr[27]="wp";	_uOkw[27]="szukaj";
_uOsr[28]="onet";	_uOkw[28]="qt";
_uOsr[29]="netsprint";	_uOkw[29]="q";
_uOsr[30]="google.interia";	_uOkw[30]="q";
_uOsr[31]="szukacz";	_uOkw[31]="q";
_uOsr[32]="yam";	_uOkw[32]="k";
_uOsr[33]="pchome";	_uOkw[33]="q";
_uOsr[34]="kvasir";	_uOkw[34]="searchExpr";
_uOsr[35]="sesam";	_uOkw[35]="q";
_uOsr[36]="ozu"; _uOkw[36]="q";
_uOsr[37]="terra"; _uOkw[37]="query";
_uOsr[38]="nostrum"; _uOkw[38]="query";
_uOsr[39]="mynet"; _uOkw[39]="q";
_uOsr[40]="ekolay"; _uOkw[40]="q";
_uOsr[41]="search.ilse"; _uOkw[41]="search_for";
_uOsr[42]="bing"; _uOkw[42]="q";

//-- Auto/Organic Keywords to Ignore
var _uOno=new Array();
//_uOno[0]="urchin";
//_uOno[1]="urchin.com";
//_uOno[2]="www.urchin.com";

//-- Referral domains to Ignore
var _uRno=new Array();
//_uRno[0]=".urchin.com";

//-- **** Don't modify below this point ***
var _uff,_udh,_udt,_ubl=0,_udo="",_uu,_ufns=0,_uns=0,_ur="-",_ufno=0,_ust=0,_ubd=document,_udl=_ubd.location,_udlh="",_uwv="1.3";
var _ugifpath2="http://www.google-analytics.com/__utm.gif";
if (_udl.hash) _udlh=_udl.href.substring(_udl.href.indexOf('#'));
if (_udl.protocol=="https:") _ugifpath2="https://ssl.google-analytics.com/__utm.gif";
if (!_utcp || _utcp=="") _utcp="/";
function urchinTracker(page) {
 if (_udl.protocol=="file:") return;
 if (_uff && (!page || page=="")) return;
 var a,b,c,xx,v,z,k,x="",s="",f=0,nv=0;
 var nx=" expires="+_uNx()+";";
 var dc=_ubd.cookie;
 _udh=_uDomain();
 if (!_uVG()) return;
 _uu=Math.round(Math.random()*2147483647);
 _udt=new Date();
 _ust=Math.round(_udt.getTime()/1000);
 a=dc.indexOf("__utma="+_udh+".");
 b=dc.indexOf("__utmb="+_udh);
 c=dc.indexOf("__utmc="+_udh);
 if (_udn && _udn!="") { _udo=" domain="+_udn+";"; }
 if (_utimeout && _utimeout!="") {
  x=new Date(_udt.getTime()+(_utimeout*1000));
  x=" expires="+x.toGMTString()+";";
 }
 if (_ulink) {
  if (_uanchor && _udlh && _udlh!="") s=_udlh+"&";
  s+=_udl.search;
  if(s && s!="" && s.indexOf("__utma=")>=0) {
   if (!(_uIN(a=_uGC(s,"__utma=","&")))) a="-";
   if (!(_uIN(b=_uGC(s,"__utmb=","&")))) b="-";
   if (!(_uIN(c=_uGC(s,"__utmc=","&")))) c="-";
   v=_uGC(s,"__utmv=","&");
   z=_uGC(s,"__utmz=","&");
   k=_uGC(s,"__utmk=","&");
   xx=_uGC(s,"__utmx=","&");
   if ((k*1) != ((_uHash(a+b+c+xx+z+v)*1)+(_udh*1))) {_ubl=1;a="-";b="-";c="-";xx="-";z="-";v="-";}
   if (a!="-" && b!="-" && c!="-") f=1;
   else if(a!="-") f=2;
  }
 }
 if(f==1) {
  _ubd.cookie="__utma="+a+"; path="+_utcp+";"+nx+_udo;
  _ubd.cookie="__utmb="+b+"; path="+_utcp+";"+x+_udo;
  _ubd.cookie="__utmc="+c+"; path="+_utcp+";"+_udo;
 } else if (f==2) {
  a=_uFixA(s,"&",_ust);
  _ubd.cookie="__utma="+a+"; path="+_utcp+";"+nx+_udo;
  _ubd.cookie="__utmb="+_udh+"; path="+_utcp+";"+x+_udo;
  _ubd.cookie="__utmc="+_udh+"; path="+_utcp+";"+_udo;
  _ufns=1;
 } else if (a>=0 && b>=0 && c>=0) {
   b = _uGC(dc,"__utmb="+_udh,";");
   b = ("-" == b) ? _udh : b;  
  _ubd.cookie="__utmb="+b+"; path="+_utcp+";"+x+_udo;
 } else {
  if (a>=0) a=_uFixA(_ubd.cookie,";",_ust);
  else {
   a=_udh+"."+_uu+"."+_ust+"."+_ust+"."+_ust+".1";
   nv=1;
  }
  _ubd.cookie="__utma="+a+"; path="+_utcp+";"+nx+_udo;
  _ubd.cookie="__utmb="+_udh+"; path="+_utcp+";"+x+_udo;
  _ubd.cookie="__utmc="+_udh+"; path="+_utcp+";"+_udo;
  _ufns=1;
 }
 if (_ulink && xx && xx!="" && xx!="-") {
   xx=_uUES(xx);
   if (xx.indexOf(";")==-1) _ubd.cookie="__utmx="+xx+"; path="+_utcp+";"+nx+_udo;
 }
 if (_ulink && v && v!="" && v!="-") {
  v=_uUES(v);
  if (v.indexOf(";")==-1) _ubd.cookie="__utmv="+v+"; path="+_utcp+";"+nx+_udo;
 }
 var wc=window;
 var c=_ubd.cookie;
 if(wc && wc.gaGlobal && wc.gaGlobal.dh==_udh){
  var g=wc.gaGlobal;
  var ua=c.split("__utma="+_udh+".")[1].split(";")[0].split(".");
  if(g.sid)ua[3]=g.sid;
  if(nv>0){
   ua[2]=ua[3];
   if(g.vid){
    var v=g.vid.split(".");
    ua[0]=v[0];
    ua[1]=v[1];
   }
  }
  _ubd.cookie="__utma="+_udh+"."+ua.join(".")+"; path="+_utcp+";"+nx+_udo;
 }
 _uInfo(page);
 _ufns=0;
 _ufno=0;
 if (!page || page=="") _uff=1;
}
function _uGH() {
 var hid;
 var wc=window;
 if (wc && wc.gaGlobal && wc.gaGlobal.hid) {
  hid=wc.gaGlobal.hid;
 } else {
  hid=Math.round(Math.random()*0x7fffffff);
  if (!wc.gaGlobal) wc.gaGlobal={};
  wc.gaGlobal.hid=hid;
 }
 return hid;
}
function _uInfo(page) {
 var p,s="",dm="",pg=_udl.pathname+_udl.search;
 if (page && page!="") pg=_uES(page,1);
 _ur=_ubd.referrer;
 if (!_ur || _ur=="") { _ur="-"; }
 else {
  dm=_ubd.domain;
  if(_utcp && _utcp!="/") dm+=_utcp;
  p=_ur.indexOf(dm);
  if ((p>=0) && (p<=8)) { _ur="0"; }
  if (_ur.indexOf("[")==0 && _ur.lastIndexOf("]")==(_ur.length-1)) { _ur="-"; }
 }
 s+="&utmn="+_uu;
 if (_ufsc) s+=_uBInfo();
 if (_uctm) s+=_uCInfo();
 if (_utitle && _ubd.title && _ubd.title!="") s+="&utmdt="+_uES(_ubd.title);
 if (_udl.hostname && _udl.hostname!="") s+="&utmhn="+_uES(_udl.hostname);
 if (_usample && _usample != 100) s+="&utmsp="+_uES(_usample);
 s+="&utmhid="+_uGH();
 s+="&utmr="+_ur;
 s+="&utmp="+pg;
 if ((_userv==0 || _userv==2) && _uSP()) {
  var i=new Image(1,1);
  i.src=_ugifpath+"?"+"utmwv="+_uwv+s;
  i.onload=function() { _uVoid(); }
 }
 if ((_userv==1 || _userv==2) && _uSP()) {
  var i2=new Image(1,1);
  i2.src=_ugifpath2+"?"+"utmwv="+_uwv+s+"&utmac="+_uacct+"&utmcc="+_uGCS();
  i2.onload=function() { _uVoid(); }
 }
 return;
}
function _uVoid() { return; }
function _uCInfo() {
 if (!_ucto || _ucto=="") { _ucto="15768000"; }
 if (!_uVG()) return;
 var c="",t="-",t2="-",t3="-",o=0,cs=0,cn=0,i=0,z="-",s="";
 if (_uanchor && _udlh && _udlh!="") s=_udlh+"&";
 s+=_udl.search;
 var x=new Date(_udt.getTime()+(_ucto*1000));
 var dc=_ubd.cookie;
 x=" expires="+x.toGMTString()+";";
 if (_ulink && !_ubl) {
  z=_uUES(_uGC(s,"__utmz=","&"));
  if (z!="-" && z.indexOf(";")==-1) { _ubd.cookie="__utmz="+z+"; path="+_utcp+";"+x+_udo; return ""; }
 }
 z=dc.indexOf("__utmz="+_udh+".");
 if (z>-1) { z=_uGC(dc,"__utmz="+_udh+".",";"); }
 else { z="-"; }
 t=_uGC(s,_ucid+"=","&");
 t2=_uGC(s,_ucsr+"=","&");
 t3=_uGC(s,"gclid=","&");
 if ((t!="-" && t!="") || (t2!="-" && t2!="") || (t3!="-" && t3!="")) {
  if (t!="-" && t!="") c+="utmcid="+_uEC(t);
  if (t2!="-" && t2!="") { if (c != "") c+="|"; c+="utmcsr="+_uEC(t2); }
  if (t3!="-" && t3!="") { if (c != "") c+="|"; c+="utmgclid="+_uEC(t3); }
  t=_uGC(s,_uccn+"=","&");
  if (t!="-" && t!="") c+="|utmccn="+_uEC(t);
  else c+="|utmccn=(not+set)";
  t=_uGC(s,_ucmd+"=","&");
  if (t!="-" && t!="") c+="|utmcmd="+_uEC(t);
  else  c+="|utmcmd=(not+set)";
  t=_uGC(s,_uctr+"=","&");
  if (t!="-" && t!="") c+="|utmctr="+_uEC(t);
  else { t=_uOrg(1); if (t!="-" && t!="") c+="|utmctr="+_uEC(t); }
  t=_uGC(s,_ucct+"=","&");
  if (t!="-" && t!="") c+="|utmcct="+_uEC(t);
  t=_uGC(s,_ucno+"=","&");
  if (t=="1") o=1;
  if (z!="-" && o==1) return "";
 }
 if (c=="-" || c=="") { c=_uOrg(); if (z!="-" && _ufno==1)  return ""; }
 if (c=="-" || c=="") { if (_ufns==1)  c=_uRef(); if (z!="-" && _ufno==1)  return ""; }
 if (c=="-" || c=="") {
  if (z=="-" && _ufns==1) { c="utmccn=(direct)|utmcsr=(direct)|utmcmd=(none)"; }
  if (c=="-" || c=="") return "";
 }
 if (z!="-") {
  i=z.indexOf(".");
  if (i>-1) i=z.indexOf(".",i+1);
  if (i>-1) i=z.indexOf(".",i+1);
  if (i>-1) i=z.indexOf(".",i+1);
  t=z.substring(i+1,z.length);
  if (t.toLowerCase()==c.toLowerCase()) cs=1;
  t=z.substring(0,i);
  if ((i=t.lastIndexOf(".")) > -1) {
   t=t.substring(i+1,t.length);
   cn=(t*1);
  }
 }
 if (cs==0 || _ufns==1) {
  t=_uGC(dc,"__utma="+_udh+".",";");
  if ((i=t.lastIndexOf(".")) > 9) {
   _uns=t.substring(i+1,t.length);
   _uns=(_uns*1);
  }
  cn++;
  if (_uns==0) _uns=1;
  _ubd.cookie="__utmz="+_udh+"."+_ust+"."+_uns+"."+cn+"."+c+"; path="+_utcp+"; "+x+_udo;
 }
 if (cs==0 || _ufns==1) return "&utmcn=1";
 else return "&utmcr=1";
}
function _uRef() {
 if (_ur=="0" || _ur=="" || _ur=="-") return "";
 var i=0,h,k,n;
 if ((i=_ur.indexOf("://"))<0 || _uGCse()) return "";
 h=_ur.substring(i+3,_ur.length);
 if (h.indexOf("/") > -1) {
  k=h.substring(h.indexOf("/"),h.length);
  if (k.indexOf("?") > -1) k=k.substring(0,k.indexOf("?"));
  h=h.substring(0,h.indexOf("/"));
 }
 h=h.toLowerCase();
 n=h;
 if ((i=n.indexOf(":")) > -1) n=n.substring(0,i);
 for (var ii=0;ii<_uRno.length;ii++) {
  if ((i=n.indexOf(_uRno[ii].toLowerCase())) > -1 && n.length==(i+_uRno[ii].length)) { _ufno=1; break; }
 }
 if (h.indexOf("www.")==0) h=h.substring(4,h.length);
 return "utmccn=(referral)|utmcsr="+_uEC(h)+"|"+"utmcct="+_uEC(k)+"|utmcmd=referral";
}
function _uOrg(t) {
 if (_ur=="0" || _ur=="" || _ur=="-") return "";
 var i=0,h,k;
 if ((i=_ur.indexOf("://"))<0 || _uGCse()) return "";
 h=_ur.substring(i+3,_ur.length);
 if (h.indexOf("/") > -1) {
  h=h.substring(0,h.indexOf("/"));
 }
 for (var ii=0;ii<_uOsr.length;ii++) {
  if (h.toLowerCase().indexOf(_uOsr[ii].toLowerCase()) > -1) {
   if ((i=_ur.indexOf("?"+_uOkw[ii]+"=")) > -1 || (i=_ur.indexOf("&"+_uOkw[ii]+"=")) > -1) {
    k=_ur.substring(i+_uOkw[ii].length+2,_ur.length);
    if ((i=k.indexOf("&")) > -1) k=k.substring(0,i);
    for (var yy=0;yy<_uOno.length;yy++) {
     if (_uOno[yy].toLowerCase()==k.toLowerCase()) { _ufno=1; break; }
    }
    if (t) return _uEC(k);
    else return "utmccn=(organic)|utmcsr="+_uEC(_uOsr[ii])+"|"+"utmctr="+_uEC(k)+"|utmcmd=organic";
   }
  }
 }
 return "";
}
function _uGCse() {
 var h,p;
 h=p=_ur.split("://")[1];
 if(h.indexOf("/")>-1) {
  h=h.split("/")[0];
  p=p.substring(p.indexOf("/")+1,p.length);
 }
 if(p.indexOf("?")>-1) {
  p=p.split("?")[0];
 }
 if(h.toLowerCase().indexOf("google")>-1) {
  if(_ur.indexOf("?q=")>-1 || _ur.indexOf("&q=")>-1) {
   if (p.toLowerCase().indexOf("cse")>-1) {
    return true;
   }
  }
 }
}
function _uBInfo() {
 var sr="-",sc="-",ul="-",fl="-",cs="-",je=1;
 var n=navigator;
 if (self.screen) {
  sr=screen.width+"x"+screen.height;
  sc=screen.colorDepth+"-bit";
 } else if (self.java) {
  var j=java.awt.Toolkit.getDefaultToolkit();
  var s=j.getScreenSize();
  sr=s.width+"x"+s.height;
 }
 if (n.language) { ul=n.language.toLowerCase(); }
 else if (n.browserLanguage) { ul=n.browserLanguage.toLowerCase(); }
 je=n.javaEnabled()?1:0;
 if (_uflash) fl=_uFlash();
 if (_ubd.characterSet) cs=_uES(_ubd.characterSet);
 else if (_ubd.charset) cs=_uES(_ubd.charset);
 return "&utmcs="+cs+"&utmsr="+sr+"&utmsc="+sc+"&utmul="+ul+"&utmje="+je+"&utmfl="+fl;
}
function __utmSetTrans() {
 var e;
 if (_ubd.getElementById) e=_ubd.getElementById("utmtrans");
 else if (_ubd.utmform && _ubd.utmform.utmtrans) e=_ubd.utmform.utmtrans;
 if (!e) return;
 var l=e.value.split("UTM:");
 var i,i2,c;
 if (_userv==0 || _userv==2) i=new Array();
 if (_userv==1 || _userv==2) { i2=new Array(); c=_uGCS(); }

 for (var ii=0;ii<l.length;ii++) {
  l[ii]=_uTrim(l[ii]);
  if (l[ii].charAt(0)!='T' && l[ii].charAt(0)!='I') continue;
  var r=Math.round(Math.random()*2147483647);
  if (!_utsp || _utsp=="") _utsp="|";
  var f=l[ii].split(_utsp),s="";
  if (f[0].charAt(0)=='T') {
   s="&utmt=tran"+"&utmn="+r;
   f[1]=_uTrim(f[1]); if(f[1]&&f[1]!="") s+="&utmtid="+_uES(f[1]);
   f[2]=_uTrim(f[2]); if(f[2]&&f[2]!="") s+="&utmtst="+_uES(f[2]);
   f[3]=_uTrim(f[3]); if(f[3]&&f[3]!="") s+="&utmtto="+_uES(f[3]);
   f[4]=_uTrim(f[4]); if(f[4]&&f[4]!="") s+="&utmttx="+_uES(f[4]);
   f[5]=_uTrim(f[5]); if(f[5]&&f[5]!="") s+="&utmtsp="+_uES(f[5]);
   f[6]=_uTrim(f[6]); if(f[6]&&f[6]!="") s+="&utmtci="+_uES(f[6]);
   f[7]=_uTrim(f[7]); if(f[7]&&f[7]!="") s+="&utmtrg="+_uES(f[7]);
   f[8]=_uTrim(f[8]); if(f[8]&&f[8]!="") s+="&utmtco="+_uES(f[8]);
  } else {
   s="&utmt=item"+"&utmn="+r;
   f[1]=_uTrim(f[1]); if(f[1]&&f[1]!="") s+="&utmtid="+_uES(f[1]);
   f[2]=_uTrim(f[2]); if(f[2]&&f[2]!="") s+="&utmipc="+_uES(f[2]);
   f[3]=_uTrim(f[3]); if(f[3]&&f[3]!="") s+="&utmipn="+_uES(f[3]);
   f[4]=_uTrim(f[4]); if(f[4]&&f[4]!="") s+="&utmiva="+_uES(f[4]);
   f[5]=_uTrim(f[5]); if(f[5]&&f[5]!="") s+="&utmipr="+_uES(f[5]);
   f[6]=_uTrim(f[6]); if(f[6]&&f[6]!="") s+="&utmiqt="+_uES(f[6]);
  }
  if (_udl.hostname && _udl.hostname!="") s+="&utmhn="+_uES(_udl.hostname);
  if (_usample && _usample != 100) s+="&utmsp="+_uES(_usample);

  if ((_userv==0 || _userv==2) && _uSP()) {
   i[ii]=new Image(1,1);
   i[ii].src=_ugifpath+"?"+"utmwv="+_uwv+s;
   i[ii].onload=function() { _uVoid(); }
  }
  if ((_userv==1 || _userv==2) && _uSP()) {
   i2[ii]=new Image(1,1);
   i2[ii].src=_ugifpath2+"?"+"utmwv="+_uwv+s+"&utmac="+_uacct+"&utmcc="+c;
   i2[ii].onload=function() { _uVoid(); }
  }
 }
 return;
}
function _uFlash() {
 var f="-",n=navigator;
 if (n.plugins && n.plugins.length) {
  for (var ii=0;ii<n.plugins.length;ii++) {
   if (n.plugins[ii].name.indexOf('Shockwave Flash')!=-1) {
    f=n.plugins[ii].description.split('Shockwave Flash ')[1];
    break;
   }
  }
 } else {
  var fl;
  try {
   fl = new ActiveXObject("ShockwaveFlash.ShockwaveFlash.7");
   f = fl.GetVariable("$version");
  } catch(e) {}
  if (f == "-") {
   try {
    fl = new ActiveXObject("ShockwaveFlash.ShockwaveFlash.6");
    f = "WIN 6,0,21,0";
    fl.AllowScriptAccess = "always";
    f = fl.GetVariable("$version");
   } catch(e) {}
  }
  if (f == "-") {
   try {
    fl = new ActiveXObject("ShockwaveFlash.ShockwaveFlash");
    f = fl.GetVariable("$version");
   } catch(e) {}
  }
  if (f != "-") {
   f = f.split(" ")[1].split(",");
   f = f[0] + "." + f[1] + " r" + f[2];
  }
 }
 return f;
}
function __utmLinkerUrl(l,h) {
 var p,k,a="-",b="-",c="-",x="-",z="-",v="-";
 var dc=_ubd.cookie;
 var iq = l.indexOf("?");
 var ih = l.indexOf("#");
 var url=l;
 if (dc) {
  a=_uES(_uGC(dc,"__utma="+_udh+".",";"));
  b=_uES(_uGC(dc,"__utmb="+_udh,";"));
  c=_uES(_uGC(dc,"__utmc="+_udh,";"));
  x=_uES(_uGC(dc,"__utmx="+_udh,";"));
  z=_uES(_uGC(dc,"__utmz="+_udh+".",";"));
  v=_uES(_uGC(dc,"__utmv="+_udh+".",";"));
  k=(_uHash(a+b+c+x+z+v)*1)+(_udh*1);
  p="__utma="+a+"&__utmb="+b+"&__utmc="+c+"&__utmx="+x+"&__utmz="+z+"&__utmv="+v+"&__utmk="+k;
 }
 if (p) {
  if (h && ih>-1) return;
  if (h) { url=l+"#"+p; }
  else {
   if (iq==-1 && ih==-1) url=l+"?"+p;
   else if (ih==-1) url=l+"&"+p;
   else if (iq==-1) url=l.substring(0,ih-1)+"?"+p+l.substring(ih);
   else url=l.substring(0,ih-1)+"&"+p+l.substring(ih);
  }
 }
 return url;
}
function __utmLinker(l,h) {
 if (!_ulink || !l || l=="") return;
 _udl.href=__utmLinkerUrl(l,h);
}
function __utmLinkPost(f,h) {
 if (!_ulink || !f || !f.action) return;
 f.action=__utmLinkerUrl(f.action, h);
 return;
}
function __utmSetVar(v) {
 if (!v || v=="") return;
 if (!_udo || _udo == "") {
  _udh=_uDomain();
  if (_udn && _udn!="") { _udo=" domain="+_udn+";"; }
 }
 if (!_uVG()) return;
 var r=Math.round(Math.random() * 2147483647);
 _ubd.cookie="__utmv="+_udh+"."+_uES(v)+"; path="+_utcp+"; expires="+_uNx()+";"+_udo;
 var s="&utmt=var&utmn="+r;
 if (_usample && _usample != 100) s+="&utmsp="+_uES(_usample);
 if ((_userv==0 || _userv==2) && _uSP()) {
  var i=new Image(1,1);
  i.src=_ugifpath+"?"+"utmwv="+_uwv+s;
  i.onload=function() { _uVoid(); }
 }
 if ((_userv==1 || _userv==2) && _uSP()) {
  var i2=new Image(1,1);
  i2.src=_ugifpath2+"?"+"utmwv="+_uwv+s+"&utmac="+_uacct+"&utmcc="+_uGCS();
  i2.onload=function() { _uVoid(); }
 }
}
function _uGCS() {
 var t,c="",dc=_ubd.cookie;
 if ((t=_uGC(dc,"__utma="+_udh+".",";"))!="-") c+=_uES("__utma="+t+";+");
 if ((t=_uGC(dc,"__utmx="+_udh,";"))!="-") c+=_uES("__utmx="+t+";+");
 if ((t=_uGC(dc,"__utmz="+_udh+".",";"))!="-") c+=_uES("__utmz="+t+";+");
 if ((t=_uGC(dc,"__utmv="+_udh+".",";"))!="-") c+=_uES("__utmv="+t+";");
 if (c.charAt(c.length-1)=="+") c=c.substring(0,c.length-1);
 return c;
}
function _uGC(l,n,s) {
 if (!l || l=="" || !n || n=="" || !s || s=="") return "-";
 var i,i2,i3,c="-";
 i=l.indexOf(n);
 i3=n.indexOf("=")+1;
 if (i > -1) {
  i2=l.indexOf(s,i); if (i2 < 0) { i2=l.length; }
  c=l.substring((i+i3),i2);
 }
 return c;
}
function _uDomain() {
 if (!_udn || _udn=="" || _udn=="none") { _udn=""; return 1; }
 if (_udn=="auto") {
  var d=_ubd.domain;
  if (d.substring(0,4)=="www.") {
   d=d.substring(4,d.length);
  }
  _udn=d;
 }
 _udn = _udn.toLowerCase(); 
 if (_uhash=="off") return 1;
 return _uHash(_udn);
}
function _uHash(d) {
 if (!d || d=="") return 1;
 var h=0,g=0;
 for (var i=d.length-1;i>=0;i--) {
  var c=parseInt(d.charCodeAt(i));
  h=((h << 6) & 0xfffffff) + c + (c << 14);
  if ((g=h & 0xfe00000)!=0) h=(h ^ (g >> 21));
 }
 return h;
}
function _uFixA(c,s,t) {
 if (!c || c=="" || !s || s=="" || !t || t=="") return "-";
 var a=_uGC(c,"__utma="+_udh+".",s);
 var lt=0,i=0;
 if ((i=a.lastIndexOf(".")) > 9) {
  _uns=a.substring(i+1,a.length);
  _uns=(_uns*1)+1;
  a=a.substring(0,i);
  if ((i=a.lastIndexOf(".")) > 7) {
   lt=a.substring(i+1,a.length);
   a=a.substring(0,i);
  }
  if ((i=a.lastIndexOf(".")) > 5) {
   a=a.substring(0,i);
  }
  a+="."+lt+"."+t+"."+_uns;
 }
 return a;
}
function _uTrim(s) {
  if (!s || s=="") return "";
  while ((s.charAt(0)==' ') || (s.charAt(0)=='\n') || (s.charAt(0,1)=='\r')) s=s.substring(1,s.length);
  while ((s.charAt(s.length-1)==' ') || (s.charAt(s.length-1)=='\n') || (s.charAt(s.length-1)=='\r')) s=s.substring(0,s.length-1);
  return s;
}
function _uEC(s) {
  var n="";
  if (!s || s=="") return "";
  for (var i=0;i<s.length;i++) {if (s.charAt(i)==" ") n+="+"; else n+=s.charAt(i);}
  return n;
}
function __utmVisitorCode(f) {
 var r=0,t=0,i=0,i2=0,m=31;
 var a=_uGC(_ubd.cookie,"__utma="+_udh+".",";");
 if ((i=a.indexOf(".",0))<0) return;
 if ((i2=a.indexOf(".",i+1))>0) r=a.substring(i+1,i2); else return "";  
 if ((i=a.indexOf(".",i2+1))>0) t=a.substring(i2+1,i); else return "";  
 if (f) {
  return r;
 } else {
  var c=new Array('A','B','C','D','E','F','G','H','J','K','L','M','N','P','R','S','T','U','V','W','X','Y','Z','1','2','3','4','5','6','7','8','9');
  return c[r>>28&m]+c[r>>23&m]+c[r>>18&m]+c[r>>13&m]+"-"+c[r>>8&m]+c[r>>3&m]+c[((r&7)<<2)+(t>>30&3)]+c[t>>25&m]+c[t>>20&m]+"-"+c[t>>15&m]+c[t>>10&m]+c[t>>5&m]+c[t&m];
 }
}
function _uIN(n) {
 if (!n) return false;
 for (var i=0;i<n.length;i++) {
  var c=n.charAt(i);
  if ((c<"0" || c>"9") && (c!=".")) return false;
 }
 return true;
}
function _uES(s,u) {
 if (typeof(encodeURIComponent) == 'function') {
  if (u) return encodeURI(s);
  else return encodeURIComponent(s);
 } else {
  return escape(s);
 }
}
function _uUES(s) {
 if (typeof(decodeURIComponent) == 'function') {
  return decodeURIComponent(s);
 } else {
  return unescape(s);
 }
}
function _uVG() {
 if((_udn.indexOf("www.google.") == 0 || _udn.indexOf(".google.") == 0 || _udn.indexOf("google.") == 0) && _utcp=='/' && _udn.indexOf("google.org")==-1) {
  return false;
 }
 return true;
}
function _uSP() {
 var s=100;
 if (_usample) s=_usample;
 if(s>=100 || s<=0) return true;
 return ((__utmVisitorCode(1)%10000)<(s*100));
}
function urchinPathCopy(p){
 var d=document,nx,tx,sx,i,c,cs,t,h,o;
 cs=new Array("a","b","c","v","x","z");
 h=_uDomain(); if (_udn && _udn!="") o=" domain="+_udn+";";
 nx=_uNx()+";";
 tx=new Date(); tx.setTime(tx.getTime()+(_utimeout*1000));
 tx=tx.toGMTString()+";";
 sx=new Date(); sx.setTime(sx.getTime()+(_ucto*1000));
 sx=sx.toGMTString()+";";
 for (i=0;i<6;i++){
  t=" expires=";
  if (i==1) t+=tx; else if (i==2) t=""; else if (i==5) t+=sx; else t+=nx;
  c=_uGC(d.cookie,"__utm"+cs[i]+"="+h,";");
  if (c!="-") d.cookie="__utm"+cs[i]+"="+c+"; path="+p+";"+t+o;
 }
}
function _uCO() {
 if (!_utk || _utk=="" || _utk.length<10) return;
 var d='www.google.com';
 if (_utk.charAt(0)=='!') d='analytics.corp.google.com';
 _ubd.cookie="GASO="+_utk+"; path="+_utcp+";"+_udo;
 var sc=document.createElement('script');
 sc.type='text/javascript';
 sc.id="_gasojs";
 sc.src='https://'+d+'/analytics/reporting/overlay_js?gaso='+_utk+'&'+Math.random();
 document.getElementsByTagName('head')[0].appendChild(sc);  
}
function _uGT() {
 var h=location.hash, a;
 if (h && h!="" && h.indexOf("#gaso=")==0) {
  a=_uGC(h,"gaso=","&");
 } else {
  a=_uGC(_ubd.cookie,"GASO=",";");
 }
 return a;
}
var _utk=_uGT();
if (_utk && _utk!="" && _utk.length>10 && _utk.indexOf("=")==-1) {
 if (window.addEventListener) {
  window.addEventListener('load', _uCO, false); 
 } else if (window.attachEvent) { 
  window.attachEvent('onload', _uCO);
 }
}

function _uNx() {
  return (new Date((new Date()).getTime()+63072000000)).toGMTString();
}


//urchin script end/**
 * @fileoverview The Webnote specific classes.<br /><br />
 *
 * The two main classes are {@link workspace} and {@link Note}.
 *
 * {@link workspace} represents the workspace as a whole.  It contains
 * refernces to all the notes and methods for operations such as saving
 * the notes or undo-ing/redo-ing an action.
 */

// global variables
// user options
var debugOn = 0;
var notePadding = 5;
var noteBorder = 2;
var noteBorderColor = '#000';
var miniWidth = 51;
var exposeSize = "70";
var firstNotXpos = 170;
var firstNotYpos = 40;

var adminEmail, baseURI, numDates;

// TODO: make it easier for users to make custom color maps
var colorMap = {
    '#ffff30': strings.COLOR_YELLOW,
    '#8facff': strings.COLOR_BLUE,
    '#7fff70': strings.COLOR_GREEN,
    '#ff6060': strings.COLOR_RED,
    '#ffb440': strings.COLOR_ORANGE,
    '#ff6bef': strings.COLOR_PURPLE,
    '#ffffff': strings.COLOR_WHITE,
    '#b0b0b0': strings.COLOR_GREY
};
var bgColors = [];
for (var c in colorMap)
{
    bgColors.push(c);
}

// other global variables, you shouldn't change these
var BROWSER_IE_6 = 0;
var BROWSER_IE_5 = 1;
var BROWSER_SAFARI = 2;
var BROWSER_MOZILLA = 3;
var BROWSER_OPERA = 4;
var browser;

(function () { // closure away userAgent
    var userAgent = navigator.userAgent.toLowerCase();
    if (userAgent.indexOf('opera') != -1) { // opera contains msie and opera
        browser = BROWSER_OPERA;
    } else if (userAgent.indexOf('webkit') != -1) {
        browser = BROWSER_SAFARI;
    } else if (userAgent.indexOf('msie') != -1) {
        if (userAgent.indexOf('5.5') != -1 || userAgent.indexOf('5.0') != -1) {
            browser = BROWSER_IE_5;
        } else {
            browser = BROWSER_IE_6;
        }
    } else {
        browser = BROWSER_MOZILLA;
    }
})();

/**
 * Create a new note object.  You shouldn't need to call this directly, use
 * {@link workspace#createNote} instead.
 * @class A class that acts as a wrapper to the actual html div that is a
 * note.  Rather than operating directly on the html object, use this
 * class instead.
 * TODO: attach these methods directly to the html objects.
 * @param {HtmlElement} note a reference to the actual note or a string that
 * is the id of the note
 * @param {workspace} p a reference to the parent workspace
 * @param {string} text the text of the note
 */
function Note(note, p, text) {
    // constructor code
    if (typeof note == 'string')
        note = get(note);
    if (!text) text = ''
    //
    /**
     * TODO: fix references to workspace with this.parent
     * @type workspace
     */
    this.parent = p;
    /**
     * Whether or not is it possible to click on a note and select it
     * @type boolean
     */
    this.selectable = true;
    /**
     * Whether or not we can double click and edit a note
     * @type boolean
     */
    this.editable = true;
    /**
     * The html id of the note
     * @type string
     */
    this.id = note.id;
    /**
     * The height and width of the note
     * @type Point
     */
    this.size = new Point(parseInt(note.style.width), parseInt(note.style.height));

    // call methods
    this.setColor(note.style.backgroundColor);
    this.setOpacity(note.style.opacity);
    this.setText(text);
    this.updateSize();
}

/**
 * User clicked on a note.
 */
Note.prototype.mouseDown = function(ev) {
    ev = ev || window.event;
    var target = ev.target || ev.srcElement;
    if (!this.selectable)
        return false;

    // alt + rt click == send to back
    // 2 is rt click in both IE and Mozilla
    if (ev.altKey && 2 == ev.button) {
        this.sendToBack();
        return false;
    }

    var lbutton = false;
    if (BROWSER_IE_6 == browser || BROWSER_IE_5 == browser) // IE button mapping (1, 2, 4)
        lbutton = 1 == ev.button;
    else // mozilla/safari 2 and w3c's button mapping (0, 1, 2)
        lbutton = 0 == ev.button;

    // only the left button should have an event
    // likewise we can disable actions by using meta or ctrl+alt
    if (!lbutton || ev.metaKey || (ev.ctrlKey && ev.altKey))
        return true;

    // Determine if we're clicking on the note or a scrollbar
    var pos = findRelativeMousePos(ev);
    var size = this.getCorrectedSize();

    if (!target.clientWidth || // no clientWidth if you click on a scrollbar in FF1.0
        (pos.x > target.clientWidth + noteBorder
                && pos.x < size.x - noteBorder) ||
        (pos.y > target.clientHeight + noteBorder
                && pos.y < size.y - noteBorder)) {
        cancelBubble(ev);
        return;
    }

    this.parent.mouse.select(this, ev);
    cancelBubble(ev);
    return false;
}

/**
 * User deselected a note (stopped dragging).
 */
Note.prototype.mouseUp = function() {
    this.parent.mouse.deselect();
}
/**
 * Note keyboard events.
 */
Note.prototype.keyDown = function(ev)
{
    // don't do anything if we're editing the note
    if (this.parent.edit == this)
        return;

    // set the color based on number
    var idx = parseInt(String.fromCharCode(ev.keyCode)) - 1;
    if (idx >= 0 && idx < bgColors.length)
        this.setColor(bgColors[idx]);
}
/**
 * Moving the mouse while over a note (changes cursor).
 */
Note.prototype.mouseMove = function(ev)
{
    ev = ev || window.event;
    var elt = get(this.id);
    if (!this.selectable)
    {
        elt.style.cursor = 'auto';
        return;
    }
    if (this.parent.mouse.selObj)
        return;

    var top = false;
    var left = false;
    var right = false;
    var bottom = false;
    var resize_cursor = '';
    var size = this.getCorrectedSize();
    var relPos = findRelativeMousePos(ev);

    if (relPos.y <= noteBorder) {
        top = true;
        resize_cursor += 'n';
    } else if (size.y - relPos.y <= noteBorder) {
        bottom = true;
        resize_cursor += 's';
    }

    if (relPos.x <= noteBorder) {
        left = true;
        resize_cursor += 'w';
    } else if (size.x - relPos.x <= noteBorder) {
        right = true;
        resize_cursor += 'e';
    }

    if (resize_cursor == '') {
        elt.style.cursor = 'move';
    } else {
        elt.style.cursor = resize_cursor + '-resize';
    }

    this.parent.mouse.notePosRel['top'] = top;
    this.parent.mouse.notePosRel['bottom'] = bottom;
    this.parent.mouse.notePosRel['left'] = left;
    this.parent.mouse.notePosRel['right'] = right;
}
/**
 * Mouse moves over a note (darken the background color).
 */
Note.prototype.mouseOver = function() {
    var elt = get(this.id);
    elt.style.background = (new Color(this.bgColor.toString())).hsvadj(0, 0, -0.1);
    this.parent.mouse.noteOver = this;
}
/**
 * Mouse leaves a note (restore original background color).
 */
Note.prototype.mouseOut = function() {
    var elt = get(this.id);
    elt.style.backgroundColor = this.bgColor.toString();
    delete this.parent.mouse.noteOver;
}
/**
 * Double-click event on a note (try to toggle edit mode).
 */
Note.prototype.mouseDblClick = function() {
    if (!this.editable)
        return;

    if (this.parent.edit == this) {
        this.parent.editOff();
        return;
    }
    this.parent.editOff();
    var pSize = this.getCorrectedSize();
    pSize.x -= 2 * (noteBorder + notePadding + 1);
    pSize.y -= 2 * (noteBorder + notePadding + 1) + 20;
    var html = "<div style='text-align:right;margin: 0 2px 1px 0;'>"

    var rangleWidth = pSize.x - 175;

    // color swatches here
    for (var c in bgColors) {
        var tooltip = strings.COLOR_SWATCH_TOOLTIP.replace('$1', parseInt(c, 10) + 1);
        html += "<div style='width: 12px;height:12px;font-size:1px;float:left;background: "
                + bgColors[c] + ";border: 1px #000 solid; margin:0 1px 1px 0;cursor:auto;' "
                + "onmousedown='workspace.notes." + this.id
                + ".setColor(\"" + bgColors[c] + "\");event.cancelBubble=true;' title='"
                + tooltip + "'></div>";
    }

    html += "<input id='opacityRange' title='Adjust opacity' value='" + this.opacity + "' onchange='workspace.notes." + this.id +
            ".adjustOpacity();' type='range' min='0.4' max='1' step='0.1' style='width:" + rangleWidth +
            "px;padding-bottom:2px;' onmousedown='event.cancelBubble=true;' onmousemove='event.cancelBubble=true;' />";

    html += "<img onclick='workspace.notes." + this.id
            + ".destroy(true);' src='http://waganote.appspot.com/close.gif' alt='" + strings.CLOSE_ICON_ALT + "'"
            + " title='" + strings.CLOSE_ICON_TOOLTIP + "'"
            + " style='cursor:auto;border:1;height:10px;width:10px;padding-bottom:8px;' />"
            + "</div><textarea wrap='virtual' id='"
            + this.id + "text' style='width:" + pSize.x
            + "px;height:" + pSize.y + "px' onmousedown='event.cancelBubble=true;' ondblclick='event.cancelBubble=true;'>"
            + this.text.replace(/>/g, '&gt;').replace(/</g, '&lt;') + '</textarea>';
    var elt = get(this.id);
    elt.innerHTML = html;
    elt.title = '';
    elt.onselectstart = null;
    elt.style.overflow = 'hidden';
    get(this.id + 'text').focus();
    this.parent.edit = this;
}

Note.prototype.adjustOpacity = function()
{
    this.setOpacity(get('opacityRange').value);
}

/**
 * Destroy the note (user clicked on the X).
 * @param {boolean} addToHistory should we add information to the undo
 * stack?
 */
Note.prototype.destroy = function(addToHistory)
{
    // if it's being edited, turn it off
    if (this.parent.edit == this)
        this.parent.editOff();

    var elt = get(this.id);

    // save undo information
    if (addToHistory)
    {
        var pos = this.getPosition();
        var ws = this.parent;
        var f = {
            title : strings.HISTORY_DELETE_NOTE,
            noteData : {
                'id' : this.id,
                'xPos' : pos.x,
                'yPos' : pos.y,
                'height' : this.size.y,
                'width' : this.size.x,
                'bgcolor' : this.bgColor.toString(),
                'zIndex' : elt.style.zIndex,
                'text' : this.text
            },
            undo : function() {
                ws.createNote(this.noteData);
            },
            redo : function() {
                ws.notes[this.noteData.id].destroy(false);
            }
        };
        this.parent.history.add(f);
    }

    // now delete the html node
    elt.parentNode.removeChild(elt);

    // remove it from the array of notes
    delete this.parent.notes[this.id];
    this.parent.numNotes--;
    this.parent.changed = true;

    this.parent.deleteNotes.push(this);
}
/**
 * Get the coordinates of the upper left corner of the note.
 * @type Point
 */
Note.prototype.getPosition = function()
{
    var ret = new Point(0, 0);
    var elt = get(this.id);
    ret = new Point(parseInt(elt.style.left), parseInt(elt.style.top));
    return ret;
}
/**
 * Get the size of the note according to the dom object (this varies on
 * browser).
 * @type Point
 */
Note.prototype.getSize = function()
{
    return new Point(this.size.x, this.size.y);
}
/**
 * Get the size of the note including border and padding.
 * @type Point
 */
Note.prototype.getCorrectedSize = function() {
    var ret = this.getSize();

    if (BROWSER_IE_5 != browser) {
        var offset = 2 * (noteBorder + notePadding);
        ret.x += offset;
        ret.y += offset;
    }
    return ret;
}

/**
 * Set the color of a note.
 * @param {string} hex the color in hex
 * @param {boolean} ignoreHistory should we add it to the history?
 * Different default values makes this inconsistent with {@link #destroy}
 */
Note.prototype.setColor = function(hex)
{
    this.bgColor = new Color(hex);

    var elt = get(this.id);
    if (this.parent.mouse.noteOver && this.parent.mouse.noteOver == this)
        elt.style.background = (new Color(this.bgColor.toString())).hsvadj(0, 0, -0.1);
    else
        elt.style.background = this.bgColor.toString();
}


Note.prototype.setOpacity = function(opa) {
    this.opacity = opa;

    var elt = get(this.id);
    elt.style.opacity = opa;
}
/**
 * Convert the text of a note to html.  We perform a simple transform of
 * newlines into <br/> and ! into headings.  Other wiki/textile like
 * transforms would happen here.
 * @type string
 */
Note.prototype.getHTML = function() // wikification
{
    var sCopy = this.text.replace(/\n/g, "<br />\n");
    sCopy = sCopy.replace(/\\<br \/>\n/g, "\n");

    // Turn URLs into links
    try {
        sCopy = sCopy.replace(/\s((http|ftp)(:\/\/[-a-zA-Z0-9%.~:_\/]+[a-zA-Z\/])([?&]([-a-zA-Z0-9%.~:_]+)=([-a-zA-Z0-9%.~:_])+)*(#([-a-zA-Z0-9%.~:_]+)?)?)/g,
                '<a href="$1">$1</a>');
    } catch (e) {
    }
    var lines = sCopy.split('\n');
    for (var i = 0; i < lines.length; i++) {
        if (lines[i].length > 0) {
            // handle headings
            switch (lines[i].charAt(0)) {
                case '!': // headings
                    var c = 0;
                    while ('!' == lines[i].charAt(c))
                        c++;
                    lines[i] = lines[i].substring(c);
                    c = Math.min(c, 3); // h3 is the biggest
                    c = 4 - c;
                    lines[i] = '<h' + c + '>' + lines[i] + '</h' + c + '>';
                    break;
                default:
                // lines[i] = lines[i] + '<br />';
            }
        }
    }
    return lines.join('');
}
/**
 * Change the text of a note.
 * @param {string} str the text for the note.
 */
Note.prototype.setText = function(str)
{
    // convert characters from 160-255 to html codepoints (this provides
    // Safari compatability
    var chars = [];
    var i;
    for (i = 0; i < str.length; i++)
    {
        var c = str.charCodeAt(i);
        if (c >= 160 && c <= 255)
            chars.push("&#" + c + ";");
        else
            chars.push(str.charAt(i));
    }
    str = chars.join('');

    if (str != this.text)
    {
        this.parent.changed = true;
        this.text = str;
    }
    var elt = get(this.id);
    elt.innerHTML = this.getHTML();

    // make images undraggable
    var imgs = elt.getElementsByTagName('img');
    for (i = 0; i < imgs.length; i++) {
        if (BROWSER_IE_6 == browser || BROWSER_IE_5 == browser) {
            imgs[i].unselectable = 'on';
        } else {
            imgs[i].onmousedown = retFalse;
        }
    }

    elt.title = strings.NOTE_TOOLTIP;
    //  get('m' + this.id).title = str;
}
/**
 * We keep track of the size of the note internally; this method updates
 * that value.
 */
Note.prototype.updateSize = function()
{
    var elt = get(this.id);
    this.size.x = parseInt(elt.style.width);
    this.size.y = parseInt(elt.style.height);
}
/**
 * Disable a note (can't be moved or edited).
 */
Note.prototype.disable = function()
{
    this.selectable = this.editable = false;
    var elt = get(this.id);
    elt.title = '';
}
/**
 * Enable a note (can be moved and edited).
 */
Note.prototype.enable = function()
{
    this.selectable = this.editable = true;
    var elt = get(this.id);
    elt.title = strings.NOTE_TOOLTIP;
}
/**
 * When a note is selected from the mini note toolbar, we bring it to the
 * front and flash the background.
 */
Note.prototype.select = function()
{
    this.parent.reZOrder(this.id);
    var self = this;
    var elt = get(this.id);
    elt.style.backgroundColor = (new Color(this.bgColor.toString()))
            .hsvadj(0, 0, -0.1);
    // make a new layer with the name
    var d = document.createElement('div');
    d.innerHTML = this.id;
    d.style.position = 'absolute';
    d.style.top = (parseInt(elt.style.top) + 5) + 'px';
    d.style.left = (parseInt(elt.style.left) + 5) + 'px';
    d.style.zIndex = 1000;
    d.style.backgroundColor = '#fff';
    d.style.padding = '4px';
    d.style.opacity = 0.4;
    //  get('content').appendChild(d);

    setTimeout(function() {
        elt.style.backgroundColor = self.bgColor.toString();
        d.parentNode.removeChild(d);
    }, 500);
}
/**
 * Send a note to the back of the workspace.
 */
Note.prototype.sendToBack = function()
{
    var elt = get(this.id);
    elt.style.zIndex = 0;
    this.parent.reZOrder();
}
/**
 * Move the note relative to its current position.
 * @param {Point} delta a point object
 */
Note.prototype.move = function(delta) {
    var newpos = this.getPosition().add(delta);
    var elt = get(this.id);
    elt.style.left = newpos.x + 'px';
    elt.style.top = newpos.y + 'px';
}

/**
 * Determine which note is above which other note.  Used when re-stacking
 * notes.  Returns -1 if a is below b, +1 if a is above b, and 0 if they
 * have the same z value.
 * @param {Note} a
 * @param {Note} b
 * @type int
 */
function cmpNotesZ(a, b)
{
    var av = parseInt(get(a.id).style.zIndex);
    var bv = parseInt(get(b.id).style.zIndex);
    if (av < bv)
        return -1;
    if (av > bv)
        return 1;
    return 0;
}

//
// Mouse objects
//

/**
 * @class A class that tracks the mouse position and handles mouse events.
 * @constructor
 */
var Mouse =
{
    /**
     * When resizing a note, this determines which edges need to be moved and
     * which edges remain fixed.  It is a dictionary from string -> boolean
     * where the string is either 'top, 'right', 'bottom' or 'left' and true
     * means the edge is moving.
     * @see Note#mouseMove
     * @type dictionary
     */
    notePosRel : {},
    /**
     * The current location of the mouse.  We initialize it to a dummy value
     * because object.js probably hasn't loaded yet (and Point is undefined).
     * It actually gets set in {@link GLOBALS#init}
     * @type Point
     */
    curPos : 0,

    /**
     * Update the mouse position and resize/move notes if necessary.
     * @param {int} x x position
     * @param {int} y y position
     */
    update : function(x, y)
    {
        this.curPos.x = x;
        this.curPos.y = y;

        // if something is selected
        if (this.selObj)
            this.selObj.update(this);
    },
    /**
     * Select a note either for dragging or for resizing.
     * @param {Note} note the selected note
     * @param {event} ev the javascript event object
     */
    select : function(note, ev) {
        if (this.selObj) // something already selected
            return;

        if (get(note.id).style.cursor != "move"){
            this.selObj = new SelectedObjectResize(note, this.notePosRel);
        }else
        {
            if (ev.altKey)
            {
                this.selObj = new SelectedObjectResize(note,
                {'top': false, 'bottom':true, 'left':false, 'right':true});
            }
            else if (ev.ctrlKey)
                this.selObj = new SelectedObjectDrag(note, true)
            else
                this.selObj = new SelectedObjectDrag(note, false);
        }
        this.downPos = this.curPos.copy();

        // move the selected item to the top
        workspace.reZOrder(note.id);
    },
    /**
     * Release selected notes.
     */
    deselect : function()
    {
        if (this.selObj)
        {
            this.selObj.deselect();
            delete this.selObj;
        }
    }
};


/**
 * Create a new Dragging object.
 * @class A class that contains information about note(s) that is being
 * dragged.
 * @see Mouse#select
 * @param {Note} note a reference to the note being dragged
 * @param {boolean} isGroup are we dragging all notes of the same color?
 * @constructor
 */
function SelectedObjectDrag(note, isGroup)
{
    /**
     * The note(s) being dragged.
     * @type Array
     */
    this.notes = [];

    // if ctrl is down, move all the notes of the same color
    if (isGroup)
    {
        for (var n in workspace.notes)
        {
            if (workspace.notes[n].bgColor.toString() == note.bgColor.toString())
            {
                this.notes.push({ 'id' : workspace.notes[n].id,
                    'pos' : workspace.notes[n].getPosition() });
            }
        }
    }
    else // single note move
        this.notes.push({ 'id' : note.id, 'pos' : note.getPosition() });

    // set the border color of the notes that are being moved
    var elt;
    //  for (n in this.notes)
    for (var n = 0; n < this.notes.length; n++)
    {
        elt = get(this.notes[n].id);
        elt.style.border = noteBorder + 'px #980000 solid';
    }
}
/**
 * Update the position of note(s) when the user moves the mouse.
 * @param {Mouse} md a reference to the parent mouse object
 */
SelectedObjectDrag.prototype.update = function(md)
{
    var offset = md.curPos.sub(md.downPos);
    var elt;
    //  for (n in this.notes) {
    for (var n = 0; n < this.notes.length; n++) {
        elt = get(this.notes[n].id);
        var newPos = this.notes[n].pos.add(offset);
        elt.style.left = newPos.x + 'px';
        elt.style.top = newPos.y + 'px';
        if (BROWSER_MOZILLA == browser) {
            // this is a hack to force ffx to resize the content div
            var c = get('content');
            var d = document.createElement('span');
            c.appendChild(d);
            c.removeChild(d);
        }
    }
};
/**
 * When we drop a note, we need to reset the colors of borders and add
 * information to the undo stack.
 */
SelectedObjectDrag.prototype.deselect = function()
{
    // check to see if we moved the object(s). if we did, add
    // information to the undo stack.
    var md = workspace.mouse;
    var offset = md.curPos.sub(md.downPos);
    if (!offset.equals(new Point(0, 0)))
    {
        var f = {
            title : ((this.notes.length == 1) ? strings.HISTORY_MOVE_NOTE
                    : strings.HISTORY_MOVE_NOTES),
            notes : this.notes,
            off : offset,
            undo : function()
            {
                var elt;
                for (n in this.notes)
                {
                    elt = get(this.notes[n].id);
                    pos = this.notes[n].pos;
                    elt.style.left = pos.x + 'px';
                    elt.style.top = pos.y + 'px';
                }
            },
            redo : function()
            {
                var elt;
                for (n in this.notes)
                {
                    elt = get(this.notes[n].id);
                    pos = this.notes[n].pos.add(this.off);
                    elt.style.left = pos.x + 'px';
                    elt.style.top = pos.y + 'px';
                }
            }
        };

        workspace.history.add(f);
    }
    // reset the border color to black
    var elt;
    //  for (var n in this.notes)
    for (var i = 0; i < this.notes.length; i++)
    {
        elt = get(this.notes[i].id);
        elt.style.border = noteBorder + 'px ' + noteBorderColor + ' solid';
    }
};


// inheritance might be useful here
/**
 * Create a new Resizing object.
 * @class A class that contains information about a note being resized.
 * @see Mouse#select
 * @param {Note} note a reference to the note being dragged
 * @param {dictionary} pnotePosRel which edges are being resized? It is
 * a dictionary from string -> boolean where the string is either
 * 'top, 'right', 'bottom' or 'left' and true means the edge is moving.
 * @constructor
 */
function SelectedObjectResize(note, pnotePosRel)
{
    /**
     * The note being resized
     * @type Note
     */
    this.note = note;
    /**
     * The original size of the note
     * @type Point
     */
    this.size = note.getSize();
    /**
     * The original position of the note
     * @type Point
     */
    this.pos = note.getPosition();
    /**
     * The edges being moved.
     * @type dictionary
     */
    this.edges = pnotePosRel;
}
/**
 * Update the size of the note when the user moves the mouse.
 * @param {Mouse} md a reference to the parent Mouse object
 */
SelectedObjectResize.prototype.update = function(md)
{
    var elt = get(this.note.id);

    // this depends on which edge they grabbed
    var minSize = 10;
    var offset = md.curPos.sub(md.downPos);
    if (this.edges['top'])
    {
        if (this.size.y - offset.y > minSize)
        {
            elt.style.top = (this.pos.y + offset.y) + 'px';
            elt.style.height = (this.size.y - offset.y) + 'px';
        }
    }
    else if (this.edges['bottom'])
        elt.style.height = Math.max(this.size.y + offset.y, minSize) + 'px';

    if (this.edges['left'])
    {
        if (this.size.x - offset.x > minSize)
        {
            elt.style.left = (this.pos.x + offset.x) + 'px';
            elt.style.width = (this.size.x - offset.x) + 'px';
        }
    }
    else if (this.edges['right'])
        elt.style.width = Math.max(this.size.x + offset.x, minSize) + 'px';

    if (this.note.parent.edit == this.note)
    {
        var edit = get(this.note.id + 'text');
        var pSize = this.note.getCorrectedSize();
        pSize.x -= 2 * (noteBorder + notePadding + 1);
        pSize.y -= 2 * (noteBorder + notePadding + 1) + 16;
        edit.style.height = Math.max(pSize.y, 10) + 'px';
        edit.style.width = Math.max(pSize.x, 10) + 'px';
    }

//    get('opacityRange').style.width = (parseInt(elt.style.width) - 175) + 'px';

    this.note.updateSize();
};
/**
 * Add information to the undo stack when the user stops resizing.
 */
SelectedObjectResize.prototype.deselect = function()
{
    // add information to the undo stack if the item was resized
    var curSize = this.note.getSize();

    if (!this.size.equals(curSize))
    {
        var f = {
            title : strings.HISTORY_RESIZE_NOTE,
            usize : this.size,
            upos : this.pos,
            rsize : curSize,
            rpos : this.note.getPosition(),
            id : this.note.id,
            undo : function()
            {
                this.set(this.usize, this.upos);
            },
            redo : function()
            {
                this.set(this.rsize, this.rpos);
            },
            set : function(size, pos)
            {
                var elt = get(this.id);
                elt.style.top = pos.y + 'px';
                elt.style.left = pos.x + 'px';
                elt.style.height = size.y + 'px';
                elt.style.width = size.x + 'px';
                workspace.notes[this.id].updateSize();
            }
        };
        workspace.history.add(f);
    }
};


/**
 * @class A class that maintains the undo/redo stacks.
 */
var History =
{
    /**
     * The number of items to keep in the undo stack.
     * @type int
     */
    maxSize : 40,
    /**
     * @type Array
     */
    undoStack : [], // each item in the array is an object
    /**
     * @type Array
     */
    redoStack : [], // with methods called undo and redo

    /**
     * Add an event to the undo stack.  This clears the redo stack.
     * @param {function} funcPtr a closure that when called will
     * undo the last action
     */
    add : function(funcPtr)
    {
        this.redoStack = [];
        this.undoStack.push(funcPtr);
        if (this.undoStack.length > this.maxSize)
            this.undoStack.shift();
        this.updateTitles();
    },
    /**
     * Undo the last action and move an item from the undo stack to the
     * redo stack.
     */
    undo : function()
    {
        if (this.undoStack.length > 0)
        {
            var f = this.undoStack.pop();
            this.redoStack.push(f);
            f.undo();
            this.updateTitles();
        }
    },
    /**
     * Redo the last undo action.  Moves the action back to the undo stack.
     */
    redo : function()
    {
        if (this.redoStack.length > 0)
        {
            var f = this.redoStack.pop();
            this.undoStack.push(f);
            f.redo();
            this.updateTitles();
        }
    },
    /**
     * Update the tool tips on the undo and redo icons.
     */
    updateTitles : function()
    {
        var elt = get('undoImg');

        if (elt == null) {
            return;
        }

        if (0 == this.undoStack.length)
        {
            elt.title = strings.HISTORY_UNDO_EMPTY;
            elt.className = 'controlsDisabled';
            elt = get('saveImg');
            elt.className = 'controlsDisabled';
        }
        else
        {
            var tooltip = this.undoStack.length == 1 ? strings.HISTORY_UNDO_TOOLTIP
                    : strings.HISTORY_UNDO_TOOLTIPS;
            //      elt.title = tooltip.replace("$1", this.undoStack[this.undoStack.length-1].title)
            //                         .replace("$2", this.undoStack.length);
            elt.className = 'controls';
            elt = get('saveImg');
            elt.className = 'controls';
        }
        elt = get('redoImg');
        if (0 == this.redoStack.length)
        {
            elt.title = strings.HISTORY_REDO_EMPTY;
            elt.className = 'controlsDisabled';
        }
        else
        {
            var tooltip = this.redoStack.length == 1 ? strings.HISTORY_UNDO_TOOLTIP
                    : strings.HISTORY_UNDO_TOOLTIPS;
            elt.title = tooltip.replace("$1", this.redoStack[this.redoStack.length - 1].title)
                    .replace("$2", this.redoStack.length);
            elt.className = 'controls';
        }
    }
};

//
/**
 * @class A generator class that returns the position of the next new note.
 */
var NotePos =
{
    /**
     * @type int
     */
    x : firstNotXpos,
    /**
     * @type int
     */
    y : firstNotYpos,
    /**
     * Compute the position of a new note given the size of the note.
     * @param {int} w the width of the new note
     * @param {int} h the height of the new note
     * @type Point
     */
    nextPos : function(w, h) {
        var ret = new Point(this.x, this.y);

        this.x += 20;
        this.y += 20;
        var s = getPageSize();

        if (this.x + w > s.x || this.y + h > s.y) {
            this.x = 40;
            this.y = 40;
        }

        return ret;
    }
};


/**
 * @class A class that represents the workspace.  This includes maintaining
 * information about the notes and undo/redo information.
 */
var workspace =
{
    /**
     * A dictionary of all the notes.
     * @type dictionary
     */
    notes : {},

    freshNotes : [],

    deleteNotes: [],

    baseZIndex : 900,

    db: {},
    /**
     * When creating new notes, we sometimes need to assign a random name to
     * it.  The first random note is note0, the second is note1, etc.
     * @type int
     */
    nextNoteNum : 0,
    /**
     * Number of notes on the workspace.  We keep this as a separate variable
     * since there's no way to determine the size of a dictionary.
     * @type int
     */
    numNotes : 0,
    /**
     * The last time that we loaded this workspace (used to check for update
     * collision).
     * @type int
     */
    loadedTime : 0,
    /**
     * Have we changed the workspace?
     * @type boolean
     */
    changed : false,
    /**
     * The note we are editing.
     * @type Note
     */
    edit : '',
    /**
     * The name of the workspace.
     * @type string
     */
    name : '',

    /**
     * @type History
     */
    history : History,
    /**
     * @type NotePos
     */
    notePos : NotePos,
    /**
     * @type Mouse
     */
    mouse : Mouse,
    /**
     * Mouse down position on the document.
     * @type Point
     */
    mouseDown : null,
    /**
     * Should keyboard shortcuts work?
     * @type boolean
     */
    shortcuts : true,
    /**
     * The id of the note on top.
     * @type string
     */
    topId: '',
    /**
     * How frequently we check for changes.
     */
    updateInterval: 1000 * 60 * 10,

    /**
     * Create a new note. Any of the parameter values may be left blank
     * and default values will be used.
     * @param {dictionary} note a dictionary with any of the following keys:
     * note['id'] = the name of the note<br />
     * note['xPos'] = the x position of the note<br />
     * note['yPos'] = the y position of the note<br />
     * note['height'] = the height of the note<br />
     * note['width'] = the width of the note<br />
     * note['bgcolor'] = the background color of the note (hex)<br />
     * note['zIndex'] = the stacking position of the note<br />
     * note['text'] = the text value of the note<br />
     */
    createNote : function(note, skipFilter) {
        if (!note)
            note = {};

        var isNewNote = false
        if (!('id' in note)) {
            isNewNote = true;
            note.id = "note" + this.nextNoteNum;

            // a new note is being made, save information to the undo stack
            var self = this;
            var f = {
                title : strings.HISTORY_CREATE_NOTE,
                nnn : this.nextNoteNum,
                id : note.id,
                pos : new Point(this.notePos.x, this.notePos.y),
                undo : function()
                {
                    self.notes[this.id].destroy(); // don't add to history
                    self.nextNoteNum = this.nnn;
                },
                redo : function()
                {
                    self.createNote({'id': this.id, 'xPos' : this.pos.x,
                        'yPos' : this.pos.y});
                    self.nextNoteNum++;
                }
            };

            //      this.history.add(f);

            this.nextNoteNum++;
        }

        // don't create a layer if it already exists, just move it to the top
        if (get(note.id))
        {
            this.reZOrder(note.id);
            return note;
        }

        if (!('height' in note) || note.height == null) note.height = 150;
        if (!('width' in note) || note.width == null) note.width = 250;
        
        var pos;
        if (!('xPos' in note) || !('yPos' in note)) {
            pos = this.notePos.nextPos(note.width, note.height);
            //      var content = get('content');
            pos.x += parseInt(document.body.scrollLeft);
            pos.y += parseInt(document.body.scrollTop);
        }
        if (!('xPos' in note)) note.xPos = pos.x;
        if (!('yPos' in note)) note.yPos = pos.y;

        if (!('bgcolor' in note)) note.bgcolor = bgColors[0].toString();

        if (!('text' in note) || note.text == null) note.text = '';
        if (!('opacity' in note)) note.opacity = '0.9';


        // disable editing of a different note
        this.editOff();

        var newDiv = document.createElement('div');
        newDiv.className = 'wagaNote';
        newDiv.id = note.id;

        document.body.insertBefore(newDiv, document.body.firstChild);

        var elt = get(note.id);
        elt.style.backgroundColor = note.bgcolor;
        elt.style.width = note.width + 'px';
        elt.style.height = note.height + 'px';
        elt.style.left = note.xPos + 'px';
        elt.style.top = note.yPos + 'px';
        elt.style.padding = notePadding + 'px';
        elt.style.position = 'absolute';
        elt.style.border = noteBorder + 'px ' + noteBorderColor + ' solid';
        elt.style.resize = 'both';

        elt.style.opacity = note.opacity;


        if (!('zIndex' in note)) {
            this.reZOrder();
            elt.style.zIndex = this.baseZIndex + this.numNotes + 1;
            this.topId = note.id;
        } else {
            elt.style.zIndex = note.zIndex;
            var topElt = get(this.topId);
            if (topElt) {
                if (parseInt(note.zIndex) > parseInt(topElt.style.zIndex)) {
                    this.topId = note.id;
                }
            } else {
                this.topId = note.id;
            }
        }
        this.numNotes++;
        var nNote = new Note(elt, this, note.text);
        this.notes[nNote.id] = nNote;

        newDiv.onmouseover = hitch(nNote, nNote.mouseOver);
        newDiv.onmouseout = hitch(nNote, nNote.mouseOut);
        newDiv.onmousedown = hitch(nNote, nNote.mouseDown);
        newDiv.onmouseup = hitch(nNote, nNote.mouseUp);
        newDiv.onmousemove = hitch(nNote, nNote.mouseMove);
        newDiv.ondblclick = hitch(nNote, nNote.mouseDblClick);
        newDiv.onselectstart = retFalse;
        newDiv.title = strings.NOTE_TOOLTIP;

        return nNote;
    },

    destroyAllNotes : function() {
//        for (var i = 0; i < this.nextNoteNum; i++) {
//            var note = workspace.notes['note' + i];
//            if(note != null) note.destroy();
//        }

        for ( var note in workspace.notes) {
            workspace.notes[note].destroy();
        }

        this.freshNotes = [];
        this.deleteNotes = [];
    },
    /**
     * Mouse up action on the workspace.
     */
    mouseUp : function() {
        if (this.mouse.selObj) {
            this.mouse.selObj.deselect();
            delete this.mouse.selObj;
        }
        // stop dragging the document
        this.mouseDown = null;
    },

    docMove : function(x, y) {
        if (this.mouseDown) {
            var offX = this.mouseDown.x - x;
            var offY = this.mouseDown.y - y;
            //      var content = get('content');
            //      content.scrollTop += offY;
            //      content.scrollLeft += offX;
            this.mouseDown.x = x;
            this.mouseDown.y = y;
        }
    },

    /**
     * If we are editing any note, stop editing.
     */
    editOff : function()
    {
        if (this.edit)
        {
            var textbox = get(this.edit.id + 'text');
            textbox.parentNode.onselectstart = retFalse;
            if (BROWSER_SAFARI != browser) {
                textbox.parentNode.style.overflow = 'auto';
            }

            // check to see if the text changed.  add to the
            // undo stack if it did.
            if (textbox.value != this.edit.text)
            {
                var f = {
                    title : strings.HISTORY_EDIT_NOTE,
                    utext : this.edit.text,
                    rtext : textbox.value,
                    note : this.edit,
                    undo : function()
                    {
                        this.note.setText(this.utext);
                    },
                    redo : function()
                    {
                        this.note.setText(this.rtext);
                    }
                };
                this.history.add(f);
            }

            this.edit.setText(textbox.value);
            this.edit = '';
        }
    },
    /**
     * Resort the notes and place topNoteID in front.
     * @param {string} topNoteID the name of the note to bring to the front.
     */
    reZOrder : function(topNoteID) {
        if (this.notes) {
            // it's not possible to sort an associative array
            // so we copy it into a regular array first
            var nArray = [];
            var i = 0;
            for (var nid in this.notes) {
                nArray[i] = this.notes[nid];
                ++i;
            }

            nArray.sort(cmpNotesZ);

            // set zIndex based on order
            var found = 0;
            for (i = 0; i < nArray.length; ++i) {
                if (nArray[i].id == topNoteID) {
                    found = 1;
                    get(nArray[i].id).style.zIndex = this.baseZIndex + this.numNotes;
                    this.topId = nArray[i].id;
                } else {
                    get(nArray[i].id).style.zIndex = this.baseZIndex + i + 1 - found;
                }
            }
        }
    },

    /**
     * This function acts as an "Expose`" like feature for the notes
     * It sets all of the notes to relative positioning and then grabs
     * the relative location, sets its "top" and "left" properties then
     * resets the positioning to absolute. -sph
     *
     * original patch submitted by Sean Hannan
     *
     * This isn't quite ready for release.
     */
    expose : function() {
        var n, style;
        for (n in this.notes) { //loop through the notes
            var note = this.notes[n];
            var elt = get(note.id);  // get the div
            style = elt.style; //get the note's style

            // save old values
            note.lastX = style.left;
            note.lastY = style.top;
            note.lastWidth = style.width;
            note.lastHeight = style.height;

            //Set the styles so that the notes nicely tile
            style.position = 'relative';
            style.margin = '5px';
            style.left = '';
            style.top = '';
            style.cssFloat = 'left';
            style.styleFloat = 'left';
            style.display = '';
            style.width = parseInt(exposeSize / 100.0 * parseInt(style.width)) + 'px';
            style.height = parseInt(exposeSize / 100.0 * parseInt(style.height)) + 'px';
            style.fontSize = exposeSize + '%';

            //get and set the position of the div
            var pos = findPos(elt);
            style.left = pos.x + 'px';
            style.top = pos.y + 'px';
        }
        //loop through again to make it absolute.
        for (n in this.notes) {
            style = get(this.notes[n].id).style;
            style.position = 'absolute';
            style.cssFloat = 'none';
            style.styleFloat = 'none';
            style.margin = '';
        }
    },

    _expose : function() {
        for (var n in this.notes) {  //loop through notes
            var note = this.notes[n];
            var style = get(note.id).style; //get the Div

            // restore values
            style.top = note.lastY;
            style.left = note.lastX;
            style.width = note.lastWidth;
            style.height = note.lastHeight;
            style.fontSize = '100%';
        }
    },

    /**
     * Get the next (or previous) note relative to the top note.
     * @param {int} diff The offset from the top note (positive mean
     * below and negative mean up from the bottom note).
     */
    selectNote : function(diff)
    {
        var max = -1;
        var maxNote;
        var noteArr = [];
        // determine which note is on top
        for (var n in this.notes)
        {
            var cur = parseInt(get(this.notes[n].id).style.zIndex);
            if (cur > max)
            {
                max = cur;
                maxNote = noteArr.length;
            }
            noteArr.push(this.notes[n]);
        }
        noteArr[ (maxNote + diff + noteArr.length) % noteArr.length ].select();
    }
};

///
/// global methods
///

/**
 * Initialize the workspace.
 */
function init()
{
    // preload the close image
    var closeImg = new Image();
    closeImg.src = 'http://waganote.appspot.com/close.gif';

    workspace.mouse.curPos = new Point();
    document.onmousemove = docMouseMove;
    document.onkeydown = docKeyDown;

    document.onmousedown = docMouseDown;
    document.onmouseup = docMouseUp;

    /**
     * When the user navigates away, if there are changes, give the user a
     * chance to cancel.
     */
    window.onbeforeunload = winBeforeUnload;

    // periodically check for updates (every 10 minutes)
    //    window.setTimeout(workspace.checkUpdated, workspace.updateInterval);
}

function cancelBubble(e) {
    e = e || window.event;
    e.cancelBubble = true;
}
// absolute mouse positions; modified from:
// http://www.web-wise-wizard.com/javascript-tutorials/javascript-mouse-event-handlers.html
function docMouseMove(e) {
    e = e || window.event;
    var x, y;
    if (!e.pageX && !e.pageY) { // IE
        x = e.x + document.body.scrollLeft;
        y = e.y + document.body.scrollTop;
    } else {
        x = e.pageX;
        y = e.pageY;
    }
    var xx = e.clientX;
    var yy = e.clientY;
    workspace.mouse.update(x, y);
    workspace.docMove(x, y);
}

/**
 * If the user clicks on the background, turn off note editing and start dragging
 */
function docMouseDown(e) {
    workspace.editOff();

    // force a position update
    docMouseMove(e);
    var curPos = workspace.mouse.curPos.copy();
    // get rel pos
    // make sure we're not on a scrollbar
    var content = document.body;
    if (curPos.x < content.clientWidth && curPos.y < content.clientHeight) {
        workspace.mouseDown = workspace.mouse.curPos.copy();
    }
}

/**
 * @see workspace#mouseUp
 */
function docMouseUp(e) {
    workspace.mouseUp(e);
}

function docKeyDown(ev) {
    // the keydown event only seems to be a document event so we
    // can't put the event on the div layer.  Instead, events
    // need to be passed to the note that is being hovered over.
    if (!ev) ev = window.event;

    var key = String.fromCharCode(ev.keyCode);
    if (workspace.shortcuts && !workspace.edit) {
        // blah, I should turn this into a map
        var n;
        if ('P' == key && ev.altKey) {
            var note = workspace.createNote();
            note.mouseDblClick();
        } else if ('S' == key && ev.altKey) {
            workspace.save();
        } else if (37 == ev.keyCode) { // left
            n = workspace.notes[workspace.topId];
            if (n) n.move(new Point(-8, 0));
        } else if (38 == ev.keyCode) { // up
            n = workspace.notes[workspace.topId];
            if (n) n.move(new Point(0, -8));
        } else if (39 == ev.keyCode) { // right
            n = workspace.notes[workspace.topId];
            if (n) n.move(new Point(8, 0));
        } else if (40 == ev.keyCode) { // down
            n = workspace.notes[workspace.topId];
            if (n) n.move(new Point(0, 8));
        } else if ('O' == key && ev.altKey) {
            n = workspace.notes[workspace.topId];
            n.mouseDblClick();
        } else if ('N' == key) {
            if (ev.altKey) {
                workspace.createNote();
            } else {
                workspace.selectNote(1);
            }
        } else if ('P' == key) {
            workspace.selectNote(-1);
        } else if ('B' == key) {
            workspace.createNote({
                'text': strings.BOOKMARKLET_TEXT
                        + "\n<a href=\"javascript:var d=document;var e=encodeURIComponent;if(d.getSelection)txt=d.getSelection();if(d.selection)txt=d.selection.createRange().text;location.href='" + baseURI + "load.py?name="
                        + escape(escape(escape(workspace.name))) + "&via='+e(location.href)+'&nn='+e(txt);\">"
                        + strings.BOOKMARKLET_NAME + "</a>"});
        } else { // forward to note
            n = workspace.notes[workspace.topId];
            n.keyDown(ev);
        }
    } else if (workspace.shortcuts) { // in edit mode
        if (27 == ev.keyCode) { // Esc
            workspace.editOff();
        } else if ('D' == key && ev.altKey) {
            n = workspace.notes[workspace.topId];
            n.destroy(true);
            ev.preventDefault();
        } else { // forward to note
            n = workspace.notes[workspace.topId];
            n.keyDown(ev);
        }
    }
}

/**
 * Give the user a chance to save workspace.
 */
function winBeforeUnload() {
    if (workspace.changed && workspace.name != "Sample Workspace") {
        return strings.UNLOAD_WARNING;
    }
}

/**
 * Get the size of the browser.
 * @type Point
 */
function getPageSize() {
    var ret;
    if (BROWSER_IE_5 == browser) {
        ret = new Point(document.body.clientWidth, document.body.clientHeight);
    } else if (BROWSER_IE_6 == browser) {
        ret = new Point(document.documentElement.clientWidth,
                document.documentElement.clientHeight);
    } else {
        ret = new Point(window.innerWidth, window.innerHeight);
    }
    return ret;
}

/**
 * Get a reference to an html object given the id.
 * @param {string} id id of the object
 * @type {HtmlElement}
 */
function get(id) {
    return document.getElementById(id);
}


init();


Array.prototype.contains = function (element) {
    for (var i = 0; i < this.length; i++) {
        if (this[i] == element) {
            return true;
        }
    }
};

Array.prototype.menus = function (otherArray) {
    menusArray = [];
    for (var i = 0; i < this.length; i++) {
        if (otherArray.contains(this[i]))
            continue;
        menusArray.push(this[i]);
    }

    return menusArray;
};

String.format = function(src){
    if (arguments.length == 0) return null;
    var args = Array.prototype.slice.call(arguments, 1);
    return src.replace(/\{(\d+)\}/g, function(m, i){
        return args[i];
    });
};

//waga script end(function() {

    if (!window.WN) {
        window['WN'] = {}
    }

    function forTest() {
        return false;
    }

    window['WN']['forTest'] = forTest;


    var noteDB = openDatabase('mydb', '1.0', 'my first database', 2 * 1024 * 1024);

    function prepareDB() {
        noteDB.transaction(function(tx) {
            var isExisting = false;
            tx.executeSql(String.format('select * from sqlite_master where name = "notes"'), [], function(tx, results) {
                if (results.rows.length > 0) {
                    return;
                }

                createTable(tx);
            });
        });
    }

    function createTable(tx) {
        var notesTableSql = 'create table notes (id, url, bgcolor, opacity, xPos, yPos, width, height, text)';

        tx.executeSql(notesTableSql, [], function(tx) {
            console.log('create table notes successfully!');
        }, errorHandler);
    }

    var handleError = function(tx, error) {
        console.error(String.format("!!: {0}", error.message));
    }

    var dummySqlCallback = function(tx, result) {

    }

    function addNote() {
        var newNote = workspace.createNote();
        workspace.freshNotes.push(newNote);
    }

    window['WN']['addNote'] = addNote;

    var errorHandler = function(tx, error) {
        console.log("!!" + error.message);
    };

    function getLargestId(resultRows) {
        var largestId = 0;
        for (var i = 0; i < resultRows.length; i++) {
            var id = parseInt(resultRows.item(i).id.replace(/note/g, ''));
            if (id > largestId)
                largestId = id;
        }

        return largestId;
    }
    window['WN']['getLargestId'] = getLargestId;


    function pointNextPosIfFirstPosHasOneNote(resultRows) {
        for (var i = 0; i < resultRows.length; i++) {
            var note = resultRows.item(i);
            if (!('xPos' in note && 'yPos' in note)) continue;
            if (note.xPos == firstNotXpos && note.yPos == firstNotYpos) {
                workspace.notePos.nextPos();
                break;
            }
        }
    }
    window.WN.pointNextPosIfFirstPosHasOneNote = pointNextPosIfFirstPosHasOneNote;

    function loadAndCreateAllNotes(resultRows) {
        for (var i = 0; i < resultRows.length; i++) {
            var note = resultRows.item(i);
            console.log('Load note that id is: ' + note.id);
            var eNote = workspace.createNote(note);
            workspace.notes[eNote.id] = eNote;
        }
    }
    window.WN.loadAndCreateAllNotes = loadAndCreateAllNotes;


    function loadNotes() {
        noteDB.transaction(function (tx) {
            tx.executeSql('select * from notes where url = ?', [document.location], function(tx, results) {
                var resultRows = results.rows;

                loadAndCreateAllNotes(resultRows);
                pointNextPosIfFirstPosHasOneNote(resultRows);
                workspace.nextNoteNum = getLargestId(resultRows) + 1;
            }, errorHandler);
        });
    }

    function saveLocalDB() {
        noteDB.transaction(function (tx) {
            var notes = getUpdateNotes();
            for (var i = 0; i < notes.length; i++) {
                updateNote(notes[i], tx);
            }

            for (var i = 0; i < workspace.freshNotes.length; i++) {
                var tmpNote = workspace.freshNotes[i];
                saveNote(tmpNote, tx);
            }

            workspace.freshNotes = [];

            for (var i = 0; i < workspace.deleteNotes.length; i++) {
                deleteNote(workspace.deleteNotes[i], tx);
            }

            workspace.deleteNotes = [];

            alert('save successfully!');
        });
    }

    function getUpdateNotes() {
        var shouldUpdateNotes = [];
        for (var index = 0; index < workspace.nextNoteNum; index++) {
            var note = workspace.notes['note' + index];

            if (note == null)
                continue;

            if (workspace.freshNotes.contains(note))
                continue;

            if (workspace.deleteNotes.contains(note))
                continue;

            shouldUpdateNotes.push(note);
        }

        return shouldUpdateNotes;
    }

    function deleteNote(note, tx) {
        console.log('delete sql: ' + String.format('delete from notes where id = "{0}"', note.id));
        tx.executeSql('delete from notes where id = ?', [note.id], dummySqlCallback, errorHandler);
    }

    window.WN.deleteNote = deleteNote;

    function saveNote(tmpNote, tx) {
        var template = 'insert into notes (id, xPos, yPos, width, height, text, url, bgcolor, opacity) ' +
                       'values ("{0}", "{1}", "{2}", "{3}", "{4}", "{5}", "{6}", "{7}", "{8}")';
        var sql = String.format(template,
                tmpNote.id,
                'getPosition' in tmpNote && tmpNote.getPosition().x,
                'getPosition' in tmpNote && tmpNote.getPosition().y,
                'getSize' in tmpNote && tmpNote.getSize().x,
                'getSize' in tmpNote && tmpNote.getSize().y,
                tmpNote.text,
                document.location,
                'bgColor' in tmpNote && tmpNote.bgColor.toString(),
                tmpNote.opacity);
        console.log('insert sql: ' + sql)
        tx.executeSql(sql, [], dummySqlCallback, errorHandler);
    }

    window.WN.saveNote = saveNote;

    function updateNote(tmpNote, tx) {
        var template = 'update notes set xPos="{0}", yPos="{1}", width="{2}", height="{3}", text="{4}", ' +
                       'bgcolor="{5}", opacity="{6}" where id="{7}"'
        var sql = String.format(template,
                tmpNote.getPosition().x,
                tmpNote.getPosition().y,
                tmpNote.getSize().x,
                tmpNote.getSize().y,
                tmpNote.text,
                tmpNote.bgColor.toString(),
                tmpNote.opacity,
                tmpNote.id);
        console.log('update sql: ' + sql)
        tx.executeSql(sql, [], dummySqlCallback, errorHandler);
    }

    window.WN.updateNote = updateNote;

    function clearTable() {
        noteDB.transaction(function (tx) {
            tx.executeSql('delete from notes', [], function(tx, result) {
                console.log("clear all the data in table notes.");
                workspace.destroyAllNotes();
            }, errorHandler);
        });
    }

    window.WN.clearTable = clearTable;

    //    window['WN']['clearTable'] = clearTable;

    //    global call

        prepareDB();
        loadNotes();

        var menuDivWaga = document.createElement('div');
        menuDivWaga.id = 'menuDivWaga';
        document.body.insertBefore(menuDivWaga, document.body.firstChild);

        var menuUlWaga = document.createElement('ul');
        menuDivWaga.appendChild(menuUlWaga);

        var addLiWaga = document.createElement('li');
        var addButtonWaga = document.createElement('input');
        addButtonWaga.type = 'button';
        addButtonWaga.id = 'addNote';
        addButtonWaga.value = 'Add Note';
        addButtonWaga.onclick = addNote;
        addLiWaga.appendChild(addButtonWaga);

        var saveLiWaga = document.createElement('li');
        var saveButtonWaga = document.createElement('input');
        saveButtonWaga.type = 'button';
        saveButtonWaga.id = 'saveNote';
        saveButtonWaga.value = 'Save Notes';
        saveButtonWaga.onclick = saveLocalDB;
        saveLiWaga.appendChild(saveButtonWaga);

        var clearLiWaga = document.createElement('li');
        var clearButtonWaga = document.createElement('input');
        clearButtonWaga.type = 'button';
        clearButtonWaga.id = 'clearNotes';
        clearButtonWaga.value = 'Clear Notes';
        clearButtonWaga.onclick = clearTable;
        clearLiWaga.appendChild(clearButtonWaga);

        menuUlWaga.appendChild(addLiWaga);
        menuUlWaga.appendChild(saveLiWaga);
        menuUlWaga.appendChild(clearLiWaga);

})();    


//wagadb script end




