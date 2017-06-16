function betterpopup(mylink, windowname, options) {
	if (!window.focus) {
		return true;
	}
	if (typeof (mylink) == "string") {
		href = mylink;
	}
	else {
		href = mylink.href;
	}
	window.open(href, windowname, options);
	return false;
}
﻿/**
* author Remy Sharp
* url http://remysharp.com/tag/marquee
* jquery.marquee.js
*/

jQueryReady(function () {
	(function ($) {
		$.fn.marquee = function (klass) {
			var newMarquee = [],
				last = this.length;

			// works out the left or right hand reset position, based on scroll
			// behavior, current direction and new direction
			function getReset(newDir, marqueeRedux, marqueeState) {
				var behavior = marqueeState.behavior, width = marqueeState.width, dir = marqueeState.dir;
				var r = 0;
				if (behavior == 'alternate') {
					r = newDir == 1 ? marqueeRedux[marqueeState.widthAxis] - (width * 2) : width;
				} else if (behavior == 'slide') {
					if (newDir == -1) {
						r = dir == -1 ? marqueeRedux[marqueeState.widthAxis] : width;
					} else {
						r = dir == -1 ? marqueeRedux[marqueeState.widthAxis] - (width * 2) : 0;
					}
				} else {
					r = newDir == -1 ? marqueeRedux[marqueeState.widthAxis] : 0;
				}
				return r;
			}

			// single "thread" animation
			function animateMarquee() {
				var i = newMarquee.length,
					marqueeRedux = null,
					$marqueeRedux = null,
					marqueeState = {},
					newMarqueeList = [],
					hitedge = false;

				while (i--) {
					marqueeRedux = newMarquee[i];
					$marqueeRedux = $(marqueeRedux);
					marqueeState = $marqueeRedux.data('marqueeState');

					if ($marqueeRedux.data('paused') !== true) {
						// TODO read scrollamount, dir, behavior, loops and last from data
						marqueeRedux[marqueeState.axis] += (marqueeState.scrollamount * marqueeState.dir);

						// only true if it's hit the end
						hitedge = marqueeState.dir == -1 ? marqueeRedux[marqueeState.axis] <= getReset(marqueeState.dir * -1, marqueeRedux, marqueeState) : marqueeRedux[marqueeState.axis] >= getReset(marqueeState.dir * -1, marqueeRedux, marqueeState);

						if ((marqueeState.behavior == 'scroll' && marqueeState.last == marqueeRedux[marqueeState.axis]) || (marqueeState.behavior == 'alternate' && hitedge && marqueeState.last != -1) || (marqueeState.behavior == 'slide' && hitedge && marqueeState.last != -1)) {
							if (marqueeState.behavior == 'alternate') {
								marqueeState.dir *= -1; // flip
							}
							marqueeState.last = -1;

							$marqueeRedux.trigger('stop');

							marqueeState.loops--;
							if (marqueeState.loops === 0) {
								if (marqueeState.behavior != 'slide') {
									marqueeRedux[marqueeState.axis] = getReset(marqueeState.dir, marqueeRedux, marqueeState);
								} else {
									// corrects the position
									marqueeRedux[marqueeState.axis] = getReset(marqueeState.dir * -1, marqueeRedux, marqueeState);
								}

								$marqueeRedux.trigger('end');
							} else {
								// keep this marquee going
								newMarqueeList.push(marqueeRedux);
								$marqueeRedux.trigger('start');
								marqueeRedux[marqueeState.axis] = getReset(marqueeState.dir, marqueeRedux, marqueeState);
							}
						} else {
							newMarqueeList.push(marqueeRedux);
						}
						marqueeState.last = marqueeRedux[marqueeState.axis];

						// store updated state only if we ran an animation
						$marqueeRedux.data('marqueeState', marqueeState);
					} else {
						// even though it's paused, keep it in the list
						newMarqueeList.push(marqueeRedux);
					}
				}

				newMarquee = newMarqueeList;

				if (newMarquee.length) {
					setTimeout(animateMarquee, 25);
				}
			}

			// TODO consider whether using .html() in the wrapping process could lead to loosing predefined events...
			this.each(function (i) {
				var $marquee = $(this),
				    width = $marquee.attr('width') || $marquee.width(),
				    height = $marquee.attr('height') || $marquee.height();
				// NOTE: library patch because height can be zero and it's not recalculated
				if (height < 18) height = 18;
				var $marqueeRedux = $marquee.after('<div ' + (klass ? 'class="' + klass + '" ' : '') + 'style="display: block-inline; width: ' + width + 'px; height: ' + height + 'px; overflow: hidden;"><div style="float: left; white-space: nowrap;">' + $marquee.html() + '</div></div>').next(),
				marqueeRedux = $marqueeRedux.get(0),
				hitedge = 0,
				direction = ($marquee.attr('direction') || 'left').toLowerCase(),
				marqueeState = {
					dir: /down|right/.test(direction) ? -1 : 1,
					axis: /left|right/.test(direction) ? 'scrollLeft' : 'scrollTop',
					widthAxis: /left|right/.test(direction) ? 'scrollWidth' : 'scrollHeight',
					last: -1,
					loops: $marquee.attr('loop') || -1,
					scrollamount: $marquee.attr('scrollamount') || this.scrollAmount || 2,
					behavior: ($marquee.attr('behavior') || 'scroll').toLowerCase(),
					width: /left|right/.test(direction) ? width : height
				};

				// corrects a bug in Firefox - the default loops for slide is -1
				if ($marquee.attr('loop') == -1 && marqueeState.behavior == 'slide') {
					marqueeState.loops = 1;
				}

				$marquee.remove();

				// add padding
				if (/left|right/.test(direction)) {
					$marqueeRedux.find('> div').css('padding', '0 ' + width + 'px');
				} else {
					$marqueeRedux.find('> div').css('padding', height + 'px 0');
				}

				// events
				$marqueeRedux.bind('stop', function () {
					$marqueeRedux.data('paused', true);
				}).bind('pause', function () {
					$marqueeRedux.data('paused', true);
				}).bind('start', function () {
					$marqueeRedux.data('paused', false);
				}).bind('unpause', function () {
					$marqueeRedux.data('paused', false);
				}).data('marqueeState', marqueeState); // finally: store the state

				// todo - rerender event allowing us to do an ajax hit and redraw the marquee

				newMarquee.push(marqueeRedux);

				marqueeRedux[marqueeState.axis] = getReset(marqueeState.dir, marqueeRedux, marqueeState);
				$marqueeRedux.trigger('start');

				// on the very last marquee, trigger the animation
				if (i + 1 == last) {
					animateMarquee();
				}
			});

			return $(newMarquee);
		};
	} (jQuery));
});/** 
 * jquery.numberformatter - Formatting/Parsing Numbers in jQuery
 * Written by Michael Abernethy (mike@abernethysoft.com)
 *
 * Dual licensed under the MIT (MIT-LICENSE.txt)
 * and GPL (GPL-LICENSE.txt) licenses.
 *
 * Date: 2/6/08
 *
 * @author Michael Abernethy
 * @version 1.1.2
 *
 * many thanks to advweb.nanasi.jp for his bug fixes
 *
 * This plugin can be used to format numbers as text and parse text as Numbers
 * Because we live in an international world, we cannot assume that everyone
 * uses "," to divide thousands, and "." as a decimal point.
 *
 * The format() function will take the text within any selector by calling
 * text() or val() on them, getting the String, and applying the specified format to it.
 * It will return the jQuery object
 *
 * The parse() function will take the text within any selector by calling text()
 * or val() on them, turning the String into a Number, and returning these
 * values in a Number array.
 * It WILL BREAK the jQuery chain, and return an Array of Numbers.
 *
 * The syntax for the formatting is:
 * 0 = Digit
 * # = Digit, zero shows as absent
 * . = Decimal separator
 * - = Negative sign
 * , = Grouping Separator
 * % = Percent (multiplies the number by 100)
 * For example, a format of "#,###.00" and text of 4500.20 will
 * display as "4.500,20" with a locale of "de", and "4,500.20" with a locale of "us"
 *
 *
 * As of now, the only acceptable locales are 
 * United States -> "us"
 * Arab Emirates -> "ae"
 * Egypt -> "eg"
 * Israel -> "il"
 * Japan -> "jp"
 * South Korea -> "kr"
 * Thailand -> "th"
 * China -> "cn"
 * Hong Kong -> "hk"
 * Taiwan -> "tw"
 * Australia -> "au"
 * Canada -> "ca"
 * Great Britain -> "gb"
 * India -> "in"
 * Germany -> "de"
 * Vietnam -> "vn"
 * Spain -> "es"
 * Denmark -> "dk"
 * Austria -> "at"
 * Greece -> "gr"
 * Brazil -> "br"
 * Czech -> "cz"
 * France  -> "fr"
 * Finland -> "fi"
 * Russia -> "ru"
 * Sweden -> "se"
 * Switzerland -> "ch"
 * 
 * TODO
 * Separate positive and negative patterns separated by a ":" (e.g. use (#,###) for accounting)
 * More options may come in the future (currency)
 **/
jQueryReady(function() {
	(function(jQuery) {

		function FormatData(dec, group, neg) {
			this.dec = dec;
			this.group = group;
			this.neg = neg;
		};

		function formatCodes(locale) {

			// default values
			var dec = ".";
			var group = ",";
			var neg = "-";

			if (locale == "us" ||
             locale == "ae" ||
             locale == "eg" ||
             locale == "il" ||
             locale == "jp" ||
             locale == "sk" ||
             locale == "th" ||
             locale == "cn" ||
             locale == "hk" ||
             locale == "tw" ||
             locale == "au" ||
             locale == "ca" ||
             locale == "gb" ||
             locale == "in"
            ) {
				dec = ".";
				group = ",";
			}

			else if (locale == "de" ||
             locale == "vn" ||
             locale == "es" ||
             locale == "dk" ||
             locale == "at" ||
             locale == "gr" ||
             locale == "br"
            ) {
				dec = ",";
				group = ".";
			}
			else if (locale == "cz" ||
              locale == "fr" ||
             locale == "fi" ||
             locale == "ru" ||
             locale == "se"
            ) {
				group = " ";
				dec = ",";
			}
			else if (locale == "ch") {
				group = "'";
				dec = ".";
			}

			return new FormatData(dec, group, neg);

		};

		jQuery.formatNumber = function(number, options) {
			var options = jQuery.extend({}, jQuery.fn.parse.defaults, options);
			var formatData = formatCodes(options.locale.toLowerCase());

			var dec = formatData.dec;
			var group = formatData.group;
			var neg = formatData.neg;

			var numString = new String(number);
			numString = numString.replace(".", dec).replace("-", neg);
			return numString;
		};

		jQuery.fn.parse = function(options) {

			var options = jQuery.extend({}, jQuery.fn.parse.defaults, options);

			var formatData = formatCodes(options.locale.toLowerCase());

			var dec = formatData.dec;
			var group = formatData.group;
			var neg = formatData.neg;

			var valid = "1234567890.-";

			var array = [];
			this.each(function() {

				var text = new String(jQuery(this).text());
				if (jQuery(this).is(":input"))
					text = new String(jQuery(this).val());

				// now we need to convert it into a number
				while (text.indexOf(group) > -1)
					text = text.replace(group, '');
				text = text.replace(dec, ".").replace(neg, "-");
				var validText = "";
				var hasPercent = false;
				if (text.charAt(text.length - 1) == "%")
					hasPercent = true;
				for (var i = 0; i < text.length; i++) {
					if (valid.indexOf(text.charAt(i)) > -1)
						validText = validText + text.charAt(i);
				}
				var number = new Number(validText);
				if (hasPercent) {
					number = number / 100;
					number = number.toFixed(validText.length - 1);
				}
				array.push(number);
			});

			return array;
		};

		jQuery.fn.format = function(options) {

			var options = jQuery.extend({}, jQuery.fn.format.defaults, options);

			var formatData = formatCodes(options.locale.toLowerCase());

			var dec = formatData.dec;
			var group = formatData.group;
			var neg = formatData.neg;

			var validFormat = "0#-,.";

			return this.each(function() {

				var text = new String(jQuery(this).text());
				if (jQuery(this).is(":input"))
					text = new String(jQuery(this).val());

				// strip all the invalid characters at the beginning and the end
				// of the format, and we'll stick them back on at the end
				// make a special case for the negative sign "-" though, so 
				// we can have formats like -$23.32
				var prefix = "";
				var negativeInFront = false;
				for (var i = 0; i < options.format.length; i++) {
					if (validFormat.indexOf(options.format.charAt(i)) == -1)
						prefix = prefix + options.format.charAt(i);
					else if (i == 0 && options.format.charAt(i) == '-') {
						negativeInFront = true;
						continue;
					}
					else
						break;
				}
				var suffix = "";
				for (var i = options.format.length - 1; i >= 0; i--) {
					if (validFormat.indexOf(options.format.charAt(i)) == -1)
						suffix = options.format.charAt(i) + suffix;
					else
						break;
				}

				options.format = options.format.substring(prefix.length);
				options.format = options.format.substring(0, options.format.length - suffix.length);


				// now we need to convert it into a number
				while (text.indexOf(group) > -1)
					text = text.replace(group, '');
				var number = new Number(text.replace(dec, ".").replace(neg, "-"));

				// special case for percentages
				if (suffix == "%")
					number = number * 100;

				var returnString = "";

				var decimalValue = number % 1;
				if (options.format.indexOf(".") > -1) {
					var decimalPortion = dec;
					var decimalFormat = options.format.substring(options.format.lastIndexOf(".") + 1);
					var decimalString = new String(decimalValue.toFixed(decimalFormat.length));
					decimalString = decimalString.substring(decimalString.lastIndexOf(".") + 1);
					for (var i = 0; i < decimalFormat.length; i++) {
						if (decimalFormat.charAt(i) == '#' && decimalString.charAt(i) != '0') {
							decimalPortion += decimalString.charAt(i);
							continue;
						}
						else if (decimalFormat.charAt(i) == '#' && decimalString.charAt(i) == '0') {
							var notParsed = decimalString.substring(i);
							if (notParsed.match('[1-9]')) {
								decimalPortion += decimalString.charAt(i);
								continue;
							}
							else {
								break;
							}
						}
						else if (decimalFormat.charAt(i) == "0") {
							decimalPortion += decimalString.charAt(i);
						}
					}
					returnString += decimalPortion
				}
				else
					number = Math.round(number);

				var ones = Math.floor(number);
				if (number < 0)
					ones = Math.ceil(number);

				var onePortion = "";
				if (ones == 0) {
					onePortion = "0";
				}
				else {
					// find how many digits are in the group
					var onesFormat = "";
					if (options.format.indexOf(".") == -1)
						onesFormat = options.format;
					else
						onesFormat = options.format.substring(0, options.format.indexOf("."));
					var oneText = new String(Math.abs(ones));
					var groupLength = 9999;
					if (onesFormat.lastIndexOf(",") != -1)
						groupLength = onesFormat.length - onesFormat.lastIndexOf(",") - 1;
					var groupCount = 0;
					for (var i = oneText.length - 1; i > -1; i--) {
						onePortion = oneText.charAt(i) + onePortion;

						groupCount++;

						if (groupCount == groupLength && i != 0) {
							onePortion = group + onePortion;
							groupCount = 0;
						}

					}
				}
				returnString = onePortion + returnString;

				// handle special case where negative is in front of the invalid
				// characters
				if (number < 0 && negativeInFront && prefix.length > 0) {
					prefix = neg + prefix;
				}
				else if (number < 0) {
					returnString = neg + returnString;
				}

				if (!options.decimalSeparatorAlwaysShown) {
					if (returnString.lastIndexOf(dec) == returnString.length - 1) {
						returnString = returnString.substring(0, returnString.length - 1);
					}
				}
				returnString = prefix + returnString + suffix;

				if (jQuery(this).is(":input"))
					jQuery(this).val(returnString);
				else
					jQuery(this).text(returnString);

			});
		};

		jQuery.fn.parse.defaults = {
			locale: "us",
			decimalSeparatorAlwaysShown: false
		};

		jQuery.fn.format.defaults = {
			format: "#,###.00",
			locale: "us",
			decimalSeparatorAlwaysShown: false
		};


	})(jQuery);
});﻿/*
* JQuery URL Parser plugin, v2.2.1
* Developed and maintanined by Mark Perkins, mark@allmarkedup.com
* Source repository: https://github.com/allmarkedup/jQuery-URL-Parser
* Licensed under an MIT-style license. See https://github.com/allmarkedup/jQuery-URL-Parser/blob/master/LICENSE for details.
*/

; (function (factory) {
	if (typeof define === 'function' && define.amd) {
		// AMD available; use anonymous module
		if (typeof jQuery !== 'undefined') {
			define(['jquery'], factory);
		} else {
			define([], factory);
		}
	} else {
		// No AMD available; mutate global vars
		if (typeof jQuery !== 'undefined') {
			factory(jQuery);
		} else {
			factory();
		}
	}
})(function ($, undefined) {

	var tag2attr = {
		a: 'href',
		img: 'src',
		form: 'action',
		base: 'href',
		script: 'src',
		iframe: 'src',
		link: 'href'
	},

key = ['source', 'protocol', 'authority', 'userInfo', 'user', 'password', 'host', 'port', 'relative', 'path', 'directory', 'file', 'query', 'fragment'], // keys available to query

aliases = { 'anchor': 'fragment' }, // aliases for backwards compatability

parser = {
	strict: /^(?:([^:\/?#]+):)?(?:\/\/((?:(([^:@]*):?([^:@]*))?@)?([^:\/?#]*)(?::(\d*))?))?((((?:[^?#\/]*\/)*)([^?#]*))(?:\?([^#]*))?(?:#(.*))?)/, //less intuitive, more accurate to the specs
	loose: /^(?:(?![^:@]+:[^:@\/]*@)([^:\/?#.]+):)?(?:\/\/)?((?:(([^:@]*):?([^:@]*))?@)?([^:\/?#]*)(?::(\d*))?)(((\/(?:[^?#](?![^?#\/]*\.[^?#\/.]+(?:[?#]|$)))*\/?)?([^?#\/]*))(?:\?([^#]*))?(?:#(.*))?)/ // more intuitive, fails on relative paths and deviates from specs
},

toString = Object.prototype.toString,

isint = /^[0-9]+$/;

	function parseUri(url, strictMode) {
		var str = decodeURI(url),
res = parser[strictMode || false ? 'strict' : 'loose'].exec(str),
uri = { attr: {}, param: {}, seg: {} },
i = 14;

		while (i--) {
			uri.attr[key[i]] = res[i] || '';
		}

		// build query and fragment parameters
		uri.param['query'] = parseString(uri.attr['query']);
		uri.param['fragment'] = parseString(uri.attr['fragment']);

		// split path and fragement into segments
		uri.seg['path'] = uri.attr.path.replace(/^\/+|\/+$/g, '').split('/');
		uri.seg['fragment'] = uri.attr.fragment.replace(/^\/+|\/+$/g, '').split('/');

		// compile a 'base' domain attribute
		uri.attr['base'] = uri.attr.host ? (uri.attr.protocol ? uri.attr.protocol + '://' + uri.attr.host : uri.attr.host) + (uri.attr.port ? ':' + uri.attr.port : '') : '';

		return uri;
	};

	function getAttrName(elm) {
		var tn = elm.tagName;
		if (typeof tn !== 'undefined') return tag2attr[tn.toLowerCase()];
		return tn;
	}

	function promote(parent, key) {
		if (parent[key].length == 0) return parent[key] = {};
		var t = {};
		for (var i in parent[key]) t[i] = parent[key][i];
		parent[key] = t;
		return t;
	}

	function parse(parts, parent, key, val) {
		var part = parts.shift();
		if (!part) {
			if (isArray(parent[key])) {
				parent[key].push(val);
			} else if ('object' == typeof parent[key]) {
				parent[key] = val;
			} else if ('undefined' == typeof parent[key]) {
				parent[key] = val;
			} else {
				parent[key] = [parent[key], val];
			}
		} else {
			var obj = parent[key] = parent[key] || [];
			if (']' == part) {
				if (isArray(obj)) {
					if ('' != val) obj.push(val);
				} else if ('object' == typeof obj) {
					obj[keys(obj).length] = val;
				} else {
					obj = parent[key] = [parent[key], val];
				}
			} else if (~part.indexOf(']')) {
				part = part.substr(0, part.length - 1);
				if (!isint.test(part) && isArray(obj)) obj = promote(parent, key);
				parse(parts, obj, part, val);
				// key
			} else {
				if (!isint.test(part) && isArray(obj)) obj = promote(parent, key);
				parse(parts, obj, part, val);
			}
		}
	}

	function merge(parent, key, val) {
		if (~key.indexOf(']')) {
			var parts = key.split('['),
len = parts.length,
last = len - 1;
			parse(parts, parent, 'base', val);
		} else {
			if (!isint.test(key) && isArray(parent.base)) {
				var t = {};
				for (var k in parent.base) t[k] = parent.base[k];
				parent.base = t;
			}
			set(parent.base, key, val);
		}
		return parent;
	}

	function parseString(str) {
		return reduce(String(str).split(/&|;/), function (ret, pair) {
			try {
				pair = decodeURIComponent(pair.replace(/\+/g, ' '));
			} catch (e) {
				// ignore
			}
			var eql = pair.indexOf('='),
brace = lastBraceInKey(pair),
key = pair.substr(0, brace || eql),
val = pair.substr(brace || eql, pair.length),
val = val.substr(val.indexOf('=') + 1, val.length);

			if ('' == key) key = pair, val = '';

			return merge(ret, key, val);
		}, { base: {} }).base;
	}

	function set(obj, key, val) {
		var v = obj[key];
		if (undefined === v) {
			obj[key] = val;
		} else if (isArray(v)) {
			v.push(val);
		} else {
			obj[key] = [v, val];
		}
	}

	function lastBraceInKey(str) {
		var len = str.length,
brace, c;
		for (var i = 0; i < len; ++i) {
			c = str[i];
			if (']' == c) brace = false;
			if ('[' == c) brace = true;
			if ('=' == c && !brace) return i;
		}
	}

	function reduce(obj, accumulator) {
		var i = 0,
l = obj.length >> 0,
curr = arguments[2];
		while (i < l) {
			if (i in obj) curr = accumulator.call(undefined, curr, obj[i], i, obj);
			++i;
		}
		return curr;
	}

	function isArray(vArg) {
		return Object.prototype.toString.call(vArg) === "[object Array]";
	}

	function keys(obj) {
		var keys = [];
		for (prop in obj) {
			if (obj.hasOwnProperty(prop)) keys.push(prop);
		}
		return keys;
	}

	function purl(url, strictMode) {
		if (arguments.length === 1 && url === true) {
			strictMode = true;
			url = undefined;
		}
		strictMode = strictMode || false;
		url = url || window.location.toString();

		return {

			data: parseUri(url, strictMode),

			// get various attributes from the URI
			attr: function (attr) {
				attr = aliases[attr] || attr;
				return typeof attr !== 'undefined' ? this.data.attr[attr] : this.data.attr;
			},

			// return query string parameters
			param: function (param) {
				return typeof param !== 'undefined' ? this.data.param.query[param] : this.data.param.query;
			},

			// return fragment parameters
			fparam: function (param) {
				return typeof param !== 'undefined' ? this.data.param.fragment[param] : this.data.param.fragment;
			},

			// return path segments
			segment: function (seg) {
				if (typeof seg === 'undefined') {
					return this.data.seg.path;
				} else {
					seg = seg < 0 ? this.data.seg.path.length + seg : seg - 1; // negative segments count from the end
					return this.data.seg.path[seg];
				}
			},

			// return fragment segments
			fsegment: function (seg) {
				if (typeof seg === 'undefined') {
					return this.data.seg.fragment;
				} else {
					seg = seg < 0 ? this.data.seg.fragment.length + seg : seg - 1; // negative segments count from the end
					return this.data.seg.fragment[seg];
				}
			}

		};

	};

	/*if (typeof $ !== 'undefined') {

		$.fn.url = function (strictMode) {
			var url = '';
			if (this.length) {
				url = $(this).attr(getAttrName(this[0])) || '';
			}
			return purl(url, strictMode);
		};

		$.url = purl;

	} else {
		window.purl = purl;
	}*/
	window.purl = purl;

});﻿/*
* jQuery JSON Plugin
* version: 2.1 (2009-08-14)
*
* This document is licensed as free software under the terms of the
* MIT License: http://www.opensource.org/licenses/mit-license.php
*
* Brantley Harris wrote this plugin. It is based somewhat on the JSON.org 
* website's http://www.json.org/json2.js, which proclaims:
* "NO WARRANTY EXPRESSED OR IMPLIED. USE AT YOUR OWN RISK.", a sentiment that
* I uphold.
*
* It is also influenced heavily by MochiKit's serializeJSON, which is 
* copyrighted 2005 by Bob Ippolito.
*/

jQueryReady(function () {
	(function ($) {
		/** jQuery.toJSON( json-serializble )
		Converts the given argument into a JSON respresentation.

		If an object has a "toJSON" function, that will be used to get the representation.
		Non-integer/string keys are skipped in the object, as are keys that point to a function.

		json-serializble:
		The *thing* to be converted.
		**/
		$.toJSON = function (o) {
			if (typeof (JSON) == 'object' && JSON.stringify)
				return JSON.stringify(o);

			var type = typeof (o);

			if (o === null)
				return "null";

			if (type == "undefined")
				return undefined;

			if (type == "number" || type == "boolean")
				return o + "";

			if (type == "string")
				return $.quoteString(o);

			if (type == 'object') {
				if (typeof o.toJSON == "function")
					return $.toJSON(o.toJSON());

				if (o.constructor === Date) {
					var month = o.getUTCMonth() + 1;
					if (month < 10) month = '0' + month;

					var day = o.getUTCDate();
					if (day < 10) day = '0' + day;

					var year = o.getUTCFullYear();

					var hours = o.getUTCHours();
					if (hours < 10) hours = '0' + hours;

					var minutes = o.getUTCMinutes();
					if (minutes < 10) minutes = '0' + minutes;

					var seconds = o.getUTCSeconds();
					if (seconds < 10) seconds = '0' + seconds;

					var milli = o.getUTCMilliseconds();
					if (milli < 100) milli = '0' + milli;
					if (milli < 10) milli = '0' + milli;

					return '"' + year + '-' + month + '-' + day + 'T' +
								 hours + ':' + minutes + ':' + seconds +
								 '.' + milli + 'Z"';
				}

				if (o.constructor === Array) {
					var ret = [];
					for (var i = 0; i < o.length; i++)
						ret.push($.toJSON(o[i]) || "null");

					return "[" + ret.join(",") + "]";
				}

				var pairs = [];
				for (var k in o) {
					var name;
					var type = typeof k;

					if (type == "number")
						name = '"' + k + '"';
					else if (type == "string")
						name = $.quoteString(k);
					else
						continue;  //skip non-string or number keys

					if (typeof o[k] == "function")
						continue;  //skip pairs where the value is a function.

					var val = $.toJSON(o[k]);

					pairs.push(name + ":" + val);
				}

				return "{" + pairs.join(", ") + "}";
			}
		};

		/** jQuery.evalJSON(src)
		Evaluates a given piece of json source.
		**/
		$.evalJSON = function (src) {
			if (typeof (JSON) == 'object' && JSON.parse)
				return JSON.parse(src);
			return eval("(" + src + ")");
		};

		/** jQuery.secureEvalJSON(src)
		Evals JSON in a way that is *more* secure.
		**/
		$.secureEvalJSON = function (src) {
			if (typeof (JSON) == 'object' && JSON.parse)
				return JSON.parse(src);

			var filtered = src;
			filtered = filtered.replace(/\\["\\\/bfnrtu]/g, '@');
			filtered = filtered.replace(/"[^"\\\n\r]*"|true|false|null|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?/g, ']');
			filtered = filtered.replace(/(?:^|:|,)(?:\s*\[)+/g, '');

			if (/^[\],:{}\s]*$/.test(filtered))
				return eval("(" + src + ")");
			else
				throw new SyntaxError("Error parsing JSON, source is not valid.");
		};

		/** jQuery.quoteString(string)
		Returns a string-repr of a string, escaping quotes intelligently.  
		Mostly a support function for toJSON.
	    
		Examples:
		>>> jQuery.quoteString("apple")
		"apple"
	        
		>>> jQuery.quoteString('"Where are we going?", she asked.')
		"\"Where are we going?\", she asked."
		**/
		$.quoteString = function (string) {
			if (string.match(_escapeable)) {
				return '"' + string.replace(_escapeable, function (a) {
					var c = _meta[a];
					if (typeof c === 'string') return c;
					c = a.charCodeAt();
					return '\\u00' + Math.floor(c / 16).toString(16) + (c % 16).toString(16);
				}) + '"';
			}
			return '"' + string + '"';
		};

		var _escapeable = /["\\\x00-\x1f\x7f-\x9f]/g;

		var _meta = {
			'\b': '\\b',
			'\t': '\\t',
			'\n': '\\n',
			'\f': '\\f',
			'\r': '\\r',
			'"': '\\"',
			'\\': '\\\\'
		};
	})(jQuery);
});
//-----------------------------------------------------------------------
// Part of the LINQ to JavaScript (JSLINQ) v2.10 Project - http://jslinq.codeplex.com
// Copyright (C) 2009 Chris Pietschmann (http://pietschsoft.com). All rights reserved.
// This project is licensed under the Microsoft Reciprocal License (Ms-RL)
// This license can be found here: http://jslinq.codeplex.com/license
//-----------------------------------------------------------------------
(function() {
	JSLINQ = window.JSLINQ = function(dataItems) {
		return new JSLINQ.fn.init(dataItems);
	};
	JSLINQ.fn = JSLINQ.prototype = {
	    init: function (dataItems) {
	        if (!$.isArray(dataItems)) { // JL: added to avoid item undefined errors. This is custom code
	            this.items = [];
	        } else {
	            this.items = dataItems;
	        }
	    },

		// The current version of JSLINQ being used
		jslinq: "2.20", // JL: 2.10. My changes make it 2.20

		ToArray: function() { return this.items; },
		Where: function(clause) {
			var item;
			var newArray = new Array();

			// The clause was passed in as a Method that return a Boolean
			for (var index = 0; index < this.items.length; index++) {
				if (clause(this.items[index], index)) {
					newArray[newArray.length] = this.items[index];
				}
			}
			return new JSLINQ(newArray);
		},
		Select: function(clause) {
			var item;
			var newArray = new Array();

			// The clause was passed in as a Method that returns a Value
			for (var i = 0; i < this.items.length; i++) {
				if (clause(this.items[i])) {
					newArray[newArray.length] = clause(this.items[i]);
				}
			}
			return new JSLINQ(newArray);
		},
		OrderBy: function(clause) {
			var tempArray = new Array();
			for (var i = 0; i < this.items.length; i++) {
				tempArray[tempArray.length] = this.items[i];
			}
			return new JSLINQ(
            tempArray.sort(function(a, b) {
            	var x = clause(a);
            	var y = clause(b);
            	return ((x < y) ? -1 : ((x > y) ? 1 : 0));
            })
        );
		},
		OrderByDescending: function(clause) {
			var tempArray = new Array();
			for (var i = 0; i < this.items.length; i++) {
				tempArray[tempArray.length] = this.items[i];
			}
			return new JSLINQ(
            tempArray.sort(function(a, b) {
            	var x = clause(b);
            	var y = clause(a);
            	return ((x < y) ? -1 : ((x > y) ? 1 : 0));
            })
        );
		},
		SelectMany: function(clause) {
			var r = new Array();
			for (var i = 0; i < this.items.length; i++) {
				r = r.concat(clause(this.items[i]));
			}
			return new JSLINQ(r);
		},
		Count: function(clause) {
			if (clause == null) {
				return this.items.length;
			}
			else {
				return this.Where(clause).items.length;
			}
		},
		Distinct: function(clause) {
			var item;
			var dict = new Object();
			var retVal = new Array();
			for (var i = 0; i < this.items.length; i++) {
				item = clause(this.items[i]);
				// TODO - This doens't correctly compare Objects. Need to fix this
				if (dict[item] == null) {
					dict[item] = true;
					retVal[retVal.length] = item;
				}
			}
			dict = null;
			return new JSLINQ(retVal);
		},
		Any: function(clause) {
			for (var index = 0; index < this.items.length; index++) {
				if (clause(this.items[index], index)) { return true; }
			}
			return false;
		},
		All: function(clause) {
			for (var index = 0; index < this.items.length; index++) {
				if (!clause(this.items[index], index)) { return false; }
			}
			return true;
		},
		Reverse: function() {
			var retVal = new Array();
			for (var index = this.items.length - 1; index > -1; index--) {
				retVal[retVal.length] = this.items[index];
			}
			return new JSLINQ(retVal);
		},
		First: function(clause) {
			if (clause != null) {
				return this.Where(clause).First();
			}
			else {
				// If no clause was specified, then return the First element in the Array
				if (this.items.length > 0) {
					return this.items[0];
				}
				else {
					return null;
				}
			}
		},
		Last: function(clause) {
			if (clause != null) {
				return this.Where(clause).Last();
			}
			else {
				// If no clause was specified, then return the First element in the Array
				if (this.items.length > 0) {
					return this.items[this.items.length - 1];
				}
				else {
					return null;
				}
			}
		},
		ElementAt: function(index) {
			return this.items[index];
		},
		Concat: function(array) {
			var arr = array.items || array;
			return new JSLINQ(this.items.concat(arr));
		},
		Intersect: function(secondArray, clause) {
			var clauseMethod;
			if (clause != undefined) {
				clauseMethod = clause;
			} else {
				clauseMethod = function(item, index, item2, index2) { return item == item2; };
			}

			var sa = secondArray.items || secondArray;

			var result = new Array();
			for (var a = 0; a < this.items.length; a++) {
				for (var b = 0; b < sa.length; b++) {
					if (clauseMethod(this.items[a], a, sa[b], b)) {
						result[result.length] = this.items[a];
					}
				}
			}
			return new JSLINQ(result);
		},
		DefaultIfEmpty: function(defaultValue) {
			if (this.items.length == 0) {
				return defaultValue;
			}
			return this;
		},
		ElementAtOrDefault: function(index, defaultValue) {
			if (index >= 0 && index < this.items.length) {
				return this.items[index];
			}
			return defaultValue;
		},
		FirstOrDefault: function(defaultValue) {
			return this.First() || defaultValue;
		},
		LastOrDefault: function(defaultValue) {
			return this.Last() || defaultValue;
		}
	};
	JSLINQ.fn.init.prototype = JSLINQ.fn;
})();﻿/// <reference path="~/Scripts/docs/jquery-1.7.1-vsdoc.js" />
/// <reference path="~/Scripts/lines/lines.js" />

LINES.ajax = (function () {

	return {
		
		timedAjaxCall: function(ajaxParams) {
			var deferred = $.Deferred();
		
			//START: Action StopWatch
			var actionTimer = new LINES.stopWatch2();
			actionTimer.startstop();
		 
			$.ajax(ajaxParams)
				.done(function (json) {
					//STOP: Action StopWatch & Log
					actionTimer.startstop();
					LINES.utils.logNetworkCall(actionTimer.Getms(), ajaxParams.url, false);
					deferred.resolve(json);

				}).fail(function (xhr, textStatus, thrownError) {
					// call failed due to invalid or timed out session
					if (xhr.status == 419) {
						LINES.reloadPage("timedAjaxCall, failed due to invalid session");
						return true;
					}
					//STOP: Action StopWatch & Log
					actionTimer.startstop();
					LINES.utils.logNetworkCall(actionTimer.Getms(), ajaxParams.url, true);

					if (thrownError == undefined) {
						thrownError = "";
					}

					var ignoreError = false;
					var errorMessage = xhr.status + " " + textStatus + " " + xhr.statusText + " " + thrownError + " " + ajaxParams.url;
					
					// do not log parsererror
					if (textStatus == "parsererror") {
						// uncomment to see response JSON. I commented this out because it's too much data to log.
						//if (xhr.responseText != undefined) {
						//	errorMessage += " " + xhr.responseText;
						//}
						ignoreError = true;
					} else {
						LINES.logError(errorMessage, true, xhr.status);
					}
					LINES.utils.log('lines.ajax', ignoreError + " " + errorMessage);
					

					var error = new Error(errorMessage);
					error.status = xhr.status;
					error.ignoreError = ignoreError;
					deferred.reject(error);
				});

			return deferred.promise();
		},
		
		post: function () {
			var args = $.makeArray(arguments);
			var url = args.shift();
			var dataType = args.shift();
			var data = args.shift();
			var contentType = args.shift();

			if (dataType == undefined) {
				dataType = 'text';
			}

			if (data == undefined) {
				data = "test=test"; // workaround for browser bug, post cannot be empty
			}

			if (contentType) {
				return this.timedAjaxCall({
					type: "POST",
					url: url,
					data: data,
					dataType: dataType,
					contentType: contentType
				});
			} else {
				return this.timedAjaxCall({
					type: "POST",
					url: url,
					data: data,
					dataType: dataType
				});
			}
		},

		getLines: function() {

			var deferred = $.Deferred();

			try {

				var args = $.makeArray(arguments);
				var sportName = args.shift();
				var eventFilterName = args.shift();
				var selectedBuySellLevels = args.shift();
				var selectedLeagueIds = args.shift();
				var enablePushStateUpdate = args.shift();

				if (enablePushStateUpdate == undefined) {
					enablePushStateUpdate = true;
				}

				LINES.state.cleanQueues();

				var url = LINES.routing.getLinesUrl(sportName, eventFilterName);

				var data = {
					buySellLevels: $.toJSON(selectedBuySellLevels)
				};

				var idsJson = null;

				if (selectedLeagueIds != null && !$.isEmptyObject(selectedLeagueIds)) {
					idsJson = $.toJSON(selectedLeagueIds);
					data.selectedLeagueIds = idsJson;
				}

				this.timedAjaxCall({
					type: "GET",
					url: url,
					data: data,
					dataType: 'json'
				}).done(function(linesContainerJson) {

					if (history.pushState && enablePushStateUpdate) {
						history.replaceState(null, window.title, LINES.routing.getBetUrl(sportName, eventFilterName, idsJson));
					}

					deferred.resolve(linesContainerJson);

				}).fail(function(err) {
					deferred.reject(err);
				});
			} catch (e) {
				deferred.reject(e);
			}

			return deferred.promise();
		},

		getUpdates: function (marketType) {
			var selectedTime = LINES.state.selectedTime;
			if ($("#lines_area").find('#lc_isParlay').val() == "True") {
				selectedTime = LINES.state.selectedTimeForParlays;
			}

				var href = LINES.routing.getUpdatesUrl(
					marketType,
					LINES.state.selectedEventFilterId, 
					LINES.state.selectedPeriodNumber,
					selectedTime);

				return this.post(href, 'json', {
					selectedLeagueIds: $.toJSON(LINES.state.selectedLeagueIds),
					buySellLevels: $.toJSON(LINES.state.selectedBuySellLevels)
				});
		},
		
		getBalance: function () {
			
			var href = LINES.config.virtualDirectory + "Asia/CustomerBalance?customerId=" + LINES.state.customerId;

			return this.timedAjaxCall({
				type: "GET",
				url: href,
				dataType: 'text'
			});
		},

		getBetMenu: function() {

			var url = LINES.routing.getBetMenuUrl();

			return this.timedAjaxCall({
				type: "GET",
				url: url,
				data: { expandedSportId: LINES.state.expandedSportId },
				dataType: 'text'
			});
		},
		
		placeBet: function (dataString) {
			
			var href = LINES.config.virtualDirectory + "BetTicket/PlaceBet";
			return this.post(href, 'json', dataString);
		},

		betStatus: function (ticketId) {
			var dataString = JSON.stringify({ TicketIds: [ticketId] } );
			var href = LINES.config.virtualDirectory + "Ticket/BetStatus/";
			var contentType = "application/json; charset=utf-8";
			return this.post(href, 'json', dataString, contentType);
		},

		session: {
			postSelectLines: function () {

				var url = LINES.config.virtualDirectory + "AsiaSession/SelectLines";

				return $.ajax({
					type: "POST",
					url: url,
					data: {
						selectedEventFilterId: LINES.state.selectedEventFilterId,
						selectedPeriodNumber: LINES.state.selectedPeriodNumber,
						selectedTime: LINES.state.selectedTime,
						selectedTimeForParlays: LINES.state.selectedTimeForParlays,
						selectedLineViewType: LINES.state.selectedLineViewType,
						selectedLeagueIds: $.toJSON(LINES.state.selectedLeagueIds)
					},
					dataType: 'text'
				}).fail(function (xhr, textStatus, thrownError) {
					if (thrownError == undefined) {
						thrownError = "";
					}

					LINES.logError(xhr.status + " " + textStatus + " " + xhr.statusText + " " + thrownError + " " + url, true, xhr.status);
				});
			},

			postBuySellLevels: function (leagueId, selectedBuySellLevel) {

				var url = LINES.config.virtualDirectory + "AsiaSession/SelectBuySellLevel";

				return $.ajax({
					type: "POST",
					url: url,
					data: {
						leagueId: leagueId,
						buySellLevel: selectedBuySellLevel
					},
					dataType: 'text'
				}).fail(function (xhr, textStatus, thrownError) {
					if (thrownError == undefined) {
						thrownError = "";
					}

					LINES.logError(xhr.status + " " + textStatus + " " + xhr.statusText + " " + thrownError + " " + url, true, xhr.status);
				});
			},

			postSelectLeagues: function(formData) {
				var okUrl = LINES.config.virtualDirectory + "AsiaSession/SelectLeagues/";

				return $.ajax({
					type: "POST",
					data: formData,
					url: okUrl,
					dataType: 'text'
				}).fail(function (xhr, textStatus, thrownError) {
					if (thrownError == undefined) {
						thrownError = "";
					}

					LINES.logError(xhr.status + " " + textStatus + " " + xhr.statusText + " " + thrownError + " " + okUrl, true, xhr.status);
				});
			}
		}
	};
})();﻿/// <reference path="~/Scripts/docs/jquery-1.7.1-vsdoc.js" />

LINES.helpers.alternateLines = {
	enhancedInit: function () {
		var altLines = $("#AlternateLines");
		altLines.on("click", ".close", function () {
			return LINES.helpers.alternateLines.close();
		});

		// alternate lines prices
		altLines.on("click", "a.wLnk", function () { LINES.helpers.Event.clickPriceDiv($(this).parent()); return false; });
		altLines.on("dblclick", "a.wLnk", function () { return false; });
		altLines.on("click", "td.price", function () { LINES.helpers.Event.clickPriceDiv(this); });

		var alternateLinesUrl = LINES.utils.getParameterByName("alternateLines", window.location.hash);
		if (alternateLinesUrl) LINES.helpers.alternateLines.openRefresh(alternateLinesUrl);
	},

	isOpen: function () {
		return !($('#AlternateLines').hasClass('hidden'));
	},

	closeHtml: function () {
		LINES.utils.dropParameterFromHashTag("alternateLines");
		$('#AlternateLines').addClass("hidden");
		$("#AlternateLines").html('');
	},

	close: function () {
		try {
		    LINES.helpers.alternateLines.closeHtml();
			return false;
		}
		catch (err) {
			LINES.logError(err);
			return true;
		}
	},

	open: function (clickedLink) {
		try {
			clickedLink = $(clickedLink).find('a');
			if (clickedLink.exists()) {
				LINES.utils.showLoadingDiv(clickedLink.parent(), "small", "left");
				var href = clickedLink.attr("href");

				LINES.helpers.alternateLines.updateHashTag(href);

			    LINES.ajax.post(href)
			        .done(function(responseHtml) {
			            LINES.utils.hideLoadingDiv();
			            $('#AlternateLines').html(responseHtml);
			            LINES.helpers.alternateLines.position(clickedLink, false);
			        }).fail(function (e) {
			            LINES.utils.hideLoadingDiv();
			            $('#AlternateLines').html($('#errorMessage').html());
			            LINES.helpers.alternateLines.position(clickedLink, false);
			        });
			}
			return false;
		}
		catch (err) {
			LINES.logError(err);
			return true;
		}
	},

	openRefresh: function (theUrl) {
		LINES.helpers.alternateLines.updateHashTag(theUrl);

		LINES.ajax.post(theUrl)
           .done(function (responseHtml) {
               LINES.utils.hideLoadingDiv();
               $('#AlternateLines').html(responseHtml);
               LINES.helpers.alternateLines.positionRefresh(theUrl);
           }).fail(function (e) {
               LINES.utils.hideLoadingDiv();
               $('#AlternateLines').html($('#errorMessage').html());
               LINES.helpers.alternateLines.positionRefresh(theUrl);
           });
	},

	updateHashTag: function (theUrl) {
		LINES.utils.addParameterToHashTag("alternateLines", theUrl);
	},

	positionRefresh: function (theUrl) {
		var altLines = $('#AlternateLines');
		var uniqEventId = altLines.find("#AltLinesUniqueEventId").html();
		if (uniqEventId == undefined) {
			var routeArray = theUrl.split("/");
			var market = routeArray[routeArray.length - 4];
			var buySellLevel = routeArray[routeArray.length - 5];
			var eventId = routeArray[routeArray.length - 6];
			uniqEventId = market + "_" + eventId + "_" + buySellLevel;
		}
		LINES.helpers.alternateLines.position($("#" + uniqEventId + " td.alt a"), true);
	},

	position: function (clickedLink, isOnload) {

		var altLines = $('#AlternateLines');

		if (isOnload) {
			altLines.addClass('hidden');
		}

		altLines.css("position", "absolute");
		var linkOffset = 0;
		if (clickedLink.offset() != null) {
			linkOffset = clickedLink.offset();
		}
		var linesArea = $("#lines_area");
		var diff = 8;
		var headerOffset = linesArea.offset();
		var headerOffsetTop = 0;
		if (headerOffset != null) {
			headerOffsetTop = headerOffset.top;
		}

		var top = linkOffset.top - headerOffsetTop - diff + linesArea.scrollTop() + clickedLink.parent().height();

		altLines.css("top", top);
		altLines.css("right", 3);
		altLines.removeClass("hidden");
	}
};


﻿/// <reference path="~/Scripts/docs/jquery-1.7.1-vsdoc.js" />

LINES.helpers.customerBalance = {
    //static methods
    enhancedInit: function () {
        $('#CustomerBalance').on("click", "#AvailableBalance", function () {
            if ($('#ExpandedBalance').css("display") == "none") {
                LINES.helpers.customerBalance.open();
            }
            else {
                LINES.helpers.customerBalance.close();
            }
            return false;
        });

        $('#CustomerBalance').on('click', ".refresh", function () {
			try {
				LINES.helpers.customerBalance.refresh();
			} catch (e) {
				LINES.logError(e, true);
			}
            
            return false;
        });

        $('#CustomerBalance').on('click', ".retry", function () {
            LINES.helpers.customerBalance.refresh("none");
            return false;
        });

        LINES.helpers.customerBalance.refresh("none");
    },

    countDown: function () {
        LINES.state.timerCountDownCustomerBalanceClose--;
        if (LINES.state.timerCountDownCustomerBalanceClose == 0) {
            LINES.helpers.customerBalance.close();
        }
        LINES.state.timerCountDownCustomerBalance--;
        if (LINES.state.timerCountDownCustomerBalance == 0) {
            LINES.helpers.customerBalance.refresh();
        }
    },

    open: function () {
        $('#CustomerBalance .expand').addClass('Over');
        $('#ExpandedBalance').slideDown();
        LINES.state.timerCountDownCustomerBalanceClose = LINES.config.timerLimitCustomerBalanceClose;
    },

    close: function () {
        $('#CustomerBalance .expand').removeClass('Over');
        $('#ExpandedBalance').slideUp();
    },

    refresh: function (expandedCssDisplayValue) {
    	var customerBalance = $('#CustomerBalance');
    	if (LINES.utils != null && $.isFunction(LINES.utils.showLoadingDiv)) {
			if ($('#CustomerBalance .expand').attr('class') == 'Over') {
				LINES.utils.showLoadingDiv(customerBalance, "medium", "center", true);
			} else {
				LINES.utils.showLoadingDiv(customerBalance, "small", "center", true);
			}
    	}

        LINES.ajax.getBalance()
            .done(function (result) {
            try {
                var displayValue = (expandedCssDisplayValue != undefined) ? expandedCssDisplayValue : $('#ExpandedBalance').css("display");
                customerBalance.html(result).find("#ExpandedBalance").css("display", displayValue);
                if (displayValue == "block" && !$('#CustomerBalance .expand').hasClass("Over")) {
                    $('#CustomerBalance .expand').addClass("Over");
                }
                LINES.state.timerCountDownCustomerBalance = LINES.config.timerLimitCustomerBalance;
            } catch(err) {
                LINES.logError(err);
            }
        }).fail(function(err) {
            LINES.state.timerCountDownCustomerBalance = LINES.config.timerLimitCustomerBalance * 2;
            if (!($("#ExpandedBalance").exists())) {
                $('#CustomerBalance').html($('#errorMessageSlim').html());
            }
        }).always(function () {
            LINES.utils.hideLoadingDiv("CustomerBalance");
        });
    }
}﻿/// <reference path="~/Scripts/docs/jquery-1.7.1-vsdoc.js" />
/// <reference path="~/Scripts/lines/lines.js" />

LINES.helpers.betMenu = {
	enhancedInit: function () {
		var betMenu = $('#MenuContent');
		betMenu.on("click", ".sportLink", function () { return LINES.helpers.betMenu.clickSport($(this)); });
		betMenu.on('click', '.filterLink', function () {

		    LINES.utils.popups.closeAll();

			$('#lines').on('click', ".retry", function () {
			    LINES.helpers.betMenu.retry();
				return false;
			});

			return LINES.helpers.betMenu.clickEventFilter($(this));
		});

		var menuUrl = LINES.utils.getParameterByName("sport", location.hash);

		if (menuUrl) {
			LINES.helpers.tabs.hashConfig.sport.hashValue = menuUrl;
		}

		var state = LINES.routing.getStateFromMenuUrl(location.href);
		var eventFilterName = state.eventFilter;

		LINES.state.urlParams.eventFilterName = eventFilterName;

		if (history.pushState) {

			var sportName = state.sport;
			var leagueIds = LINES.utils.getParameterByName("selectedLeagueIds", location.search);

			if (leagueIds != null) {

				// if we can decode the league ids check if it is a valid json. If not skip it from the url
				if (decodeURIComponent != undefined) {
					leagueIds = decodeURIComponent(leagueIds);
					try {
						$.parseJSON(leagueIds);
					} catch (err) {
						leagueIds = null;
					}
				}
			}

			var correctUrl = LINES.routing.getBetUrl(sportName, eventFilterName, leagueIds);

			history.replaceState(null, window.title, correctUrl);
		}
	},

	retry: function () {
		var clickedLink = $(".selectedFilter").find('.filterLink').attr('href');
		var params = LINES.helpers.betMenu.getRequestParams(clickedLink);
		LINES.state.selectedEventFilterName = params.eventFilterName;
		LINES.helpers.betMenu.loadLines(params.sportName, params.eventFilterName);
		return false;
	},

	clickSport: function (clickedLink) {

		this.progress.hide();

		try {
			if (!clickedLink.parent().hasClass('selectedSport') && !this.state.isLoading()) {
				LINES.state.expandedSportId = clickedLink.parent().attr('id').split("_")[1];
				var betMenu = $('#MenuContent');
				// change selected sport in CSS
				betMenu.find('ul.sportList li.selectedSport').removeClass('selectedSport');
				clickedLink.parent().addClass('selectedSport');
				// slide filter list up and down
				betMenu.find('.sportLink').parent().find('.filterList').slideUp('slow');
				clickedLink.parent().find('.filterList').slideDown('slow');
			}
			return false;
		} catch (err) {
			LINES.logError(err);
			return true;
		}
	},

	state: (function () {
		var that = this;

		this.isLoading = null;
		this.isCancelled = null;
		this.isRendering = null;

		function getSetValue(name, value) {
			if (value === undefined) {
				return that[name] === true;
			}

			that[name] = value === true;

			return that[name];
		}

		return {
			isLoading: function () {
				var value = getSetValue("isLoading", arguments[0]);

				if (value) {
					that.isRendering = false;
				}

				return getSetValue("isLoading", arguments[0]);
			},

			isCancelled: function () {
				var value = getSetValue("isCancelled", arguments[0]);
				return value;
			},

			isRendering: function () {
				var value = getSetValue("isRendering", arguments[0]);
				that.isLoading = false;

				if (!value) {
					that.isCancelled = false;
				}

				return value;
			},

			done: function () {
				that.isLoading = false;
				that.isCancelled = false;
				that.isRendering = false;
			}
		};
	})(),

	progress: (function () {

		return {
			show: function () {

				this.hide();

				if (LINES.helpers.betMenu.lastClickedLink != null) {
					LINES.utils.showLoadingDiv($(LINES.helpers.betMenu.lastClickedLink).parent(), "small", "left", true, "betMenu", -23);
				}
			},

			hide: function () {
				LINES.utils.hideLoadingDiv("betMenu");
			}
		};

	})(),

	lastClickedLink: null,

	getEventCount: function (clickedLink) {
		var parent = clickedLink.parent();
		var cntElement = parent.find("span");

		if (cntElement == null || !cntElement.exists()) {
			return null;
		}

		var cnt = parseInt(cntElement.text().replace("(", "").replace(")", ""), 10);

		if (isNaN(cnt)) {
			return null;
		}

		return cnt;
	},

	isFullPageLoadRequired: function () {
		var r = LINES.features.OldBrowsersFullRefresh === true && LINES.utils.isIE7or8();
		return r;
	},

	clickEventFilter: function (clickedLink) {

		if (this.isFullPageLoadRequired()) {
			return true;
		}

		// dont let user click twice on link
		if (clickedLink.parent().hasClass('selectedFilter') || this.state.isLoading()) {
		    LINES.state.enableInfiniteScroll = true;
			return false;
		}

		this.lastClickedLink = clickedLink;

		try {

			var params = LINES.helpers.betMenu.getRequestParams(clickedLink.attr("href"));
			var sportId = clickedLink.attr('id').split("_")[1];

			LINES.state.selectedEventFilterName = params.eventFilterName;

			if (LINES.state.selectedSportId != null && sportId != LINES.state.selectedSportId) {
				LINES.state.selectedPeriodNumber = null; // reset period
				LINES.state.selectedTime = LINES.enums.linesTimeSelection.AllDates; // reset time
				LINES.state.selectedTimeForParlays = LINES.enums.parlayLinesTimeSelection.AllDates; // reset time for parlays
			}

			LINES.state.selectedSportId = sportId;
			LINES.state.selectedEventFilterId = clickedLink.attr('id').split("_")[2];

			var betMenu = $('#MenuContent');
			betMenu.find('li.selectedFilter').removeClass('selectedFilter');
			clickedLink.parent().addClass('selectedFilter');

			LINES.helpers.betMenu.loadLines(params.sportName, params.eventFilterName);

			LINES.state.enableInfiniteScroll = true;

			return false;
		} catch (err) {
			LINES.logError(err);
			return true;
		}
	},

	refresh: function () {
		if (LINES.state.selectedEventFilterId == null) {
			return;
		}

		LINES.ajax.getBetMenu()
	        .done(function (result) {
	        	if (result != "") {
	        		$('#MenuContent').html(result);
	        	}

	        	LINES.state.timerCountDownBetMenuRefresh = LINES.config.timerLimitBetMenuRefresh;
	        }).fail(function (err) {
	        	LINES.state.timerCountDownBetMenuRefresh = (LINES.config.timerLimitBetMenuRefresh * 2);
	        	LINES.utils.hideLoadingDiv("betMenu");
	        });
	},

	countDown: function () {
		LINES.state.timerCountDownBetMenuRefresh--;
		if (LINES.state.timerCountDownBetMenuRefresh == 0) {
			LINES.helpers.betMenu.refresh();
		}
	},

	getRequestParams: function (url) {
		var state = LINES.routing.getStateFromMenuUrl(url);
		return { "sportName": state.sport, "eventFilterName": state.eventFilter };
	},

	onError: function (err) {
		LINES.utils.log('lines.betmenu', "onError " + err.ignoreError + " " + err.message);
		LINES.logError(err);
		LINES.utils.hideLoadingDiv("betMenu");
		$('#lines').html($('#errorMessageSlim').html());
	},

	getMenuLinkFromHash: function () {
		var id = null;
		var betMenu = $('#MenuContent');
		var sportHash = LINES.utils.getParameterByName("sport", window.location.hash);
		// hash could be tampered with we need to check it's defined
		if (sportHash != undefined && sportHash != "") {
			var parts = LINES.routing.getStateFromMenuUrl(sportHash);
			betMenu.find("a.filterLink").each(function (_, e) {
				if (e.href.indexOf(parts.sport + "/" + parts.eventFilter) != -1) {
					id = e.id;
					return false;
				}
				return true;
			});
		}

		return id;
	},

	getLinesPromise: function (sportName, eventFilterName, selectedBuySellLevels, selectedLeagueIds, enablePushStateUpdate) {

		var that = this;

		LINES.state.cleanQueues();
		if (enablePushStateUpdate == undefined) {
			enablePushStateUpdate = true;
		}

		if (this.state.isLoading()) {
			this.state.isCancelled(true);
		} else {
			this.state.isLoading(true);
		}

		var deferred = $.Deferred();

		this.progress.show();

		var url = LINES.routing.getLinesUrl(sportName, eventFilterName);
		LINES.helpers.tabs.activateTabWithHash("sport", url);

		// you can increase the sleep if you want to test quick click events
		LINES.utils.sleep(0).done(function () {

			LINES.ajax.getLines(
                sportName,
                eventFilterName,
                selectedBuySellLevels,
                selectedLeagueIds,
				enablePushStateUpdate)
                .done(function (linesContainerJson) {
                	LINES.utils.log('lines.betmenu', "getLinesPromise done");
                	try {
                		if (that.state.isCancelled()) {
                			linesContainerJson = null;
                		}

                		deferred.resolve(linesContainerJson);

                		var isOpen = LINES.utils.popups.anyOpen(LINES.utils.popups.hoverPopups);
                		LINES.utils.popups.closeAllExcept(LINES.utils.popups.hoverPopups);

                		if (isOpen) {
                			LINES.utils.hideLines();
                		} else {
                			LINES.utils.showLines();
                		}

                		that.state.isLoading(false);
                		that.progress.hide();

                		// TODO: delete this code if no bugs reported, the hash isn't reliable for keeping the menu up to date
                		// We need this for quick filter selections
                		//var newId = that.getMenuLinkFromHash();
                		//if (newId != null && that.lastClickedLink != null && newId !== that.lastClickedLink.attr('id')) {
                		//	that.lastClickedLink.parent().removeClass('selectedFilter');
                		//	var e = $("#" + newId);
                		//	e.parent().addClass('selectedFilter');
                		//	that.lastClickedLink = e;
                		//}
                	}
                	catch (err) {
                		LINES.utils.log('lines.betmenu', "getLinesPromise catch");
                		LINES.logError(err);
                	}

                }).fail(function (err) {
                	LINES.utils.log('lines.betmenu', "getLinesPromise fail " + err.ignoreError + " " + err.message);
                	err.message = "LINES.ajax.getLines.fail: " + err.message;
                	that.onError(err);
                	deferred.reject(err);
                	that.state.isLoading(false);
                	that.progress.hide();
                });

			LINES.ajax.session.postSelectLines();
		});

		return deferred.promise();
	},

	loadLines: function () {

		var args = $.makeArray(arguments);

		var sportName = args.shift();
		var eventFilterName = args.shift();
		var refresh = args.shift();
		var forceUpdate = args.shift();
		forceUpdate = forceUpdate === undefined ? false : forceUpdate;

		refresh = refresh === undefined ? this.isFullPageLoadRequired() : refresh;

		if (refresh) {

			var resource = LINES.routing.getBetUrl(sportName, eventFilterName, $.toJSON(LINES.state.selectedLeagueIds));

			if (resource.charAt(0) == '/') {
				resource = resource.substring(1);
			}

			var redirectUrl = LINES.config.virtualDirectory + resource;
			window.location.href = redirectUrl;

			return LINES.utils.toEmptyPromise();
		} else {
			// Suspend lines refresh, new lines are loading
			for (var marketType in LINES.enums.marketType) {
				var refreshButton = new LINES.helpers.Market.RefreshButton(marketType);
				refreshButton.suspend(15000); // max 15 secs
			}
		}


		var deferred = $.Deferred();
		var that = this;

		this.getLinesPromise(sportName, eventFilterName, LINES.state.selectedBuySellLevels, LINES.state.selectedLeagueIds)
            .done(function (linesContainerJson) {

            	if (linesContainerJson == null) {
            		LINES.helpers.betMenu.state.done();
            		deferred.resolve();
            		return;
            	}

            	try {

            		// reset timers
            		for (var mType in LINES.enums.marketType) {
            			LINES.state.timerCountDownMarketRefresh[mType] = LINES.config.timerLimitMarketRefresh[mType];
            		}

            		// set url params
            		LINES.state.urlParams.sportName = sportName;
            		LINES.state.urlParams.eventFilterName = eventFilterName;

            		that.state.isRendering(true);

            		$(window).scrollTop(0);//reset scroll bar

            		LINES.helpers.Sport.processLinesContainer(linesContainerJson, null, forceUpdate)
	                    .done(function () {
	                    	deferred.resolve();
	                    }).fail(function (e) {
	                    	that.onError(e);
	                    	deferred.reject(e);
	                    }).always(function () {
	                    	LINES.helpers.betMenu.state.done();

	                    	var isOpen = LINES.utils.popups.anyOpen(LINES.utils.popups.hoverPopups);
	                    	LINES.utils.popups.closeAllExcept(LINES.utils.popups.hoverPopups);

	                    	if (isOpen) {
	                    		LINES.utils.hideLines();
	                    	}

	                    	// Set OddsFormat visibility
	                    	if (linesContainerJson.IsAllowedToChangeOdds === true) {
	                    		$('#oddsFormat').removeProp("disabled");
	                    	}
		                    
	                        //hide more games link if all games loaded
	                    	if (LINES.state.allLeaguesVisible) {
	                    	    LINES.helpers.Sport.hideLoadMoreGames();
	                    	}

		            });

            	} catch (err) {
            		err.message = "LINES.ajax.getLines.done: " + err.message;

            		that.onError(err);
            		deferred.reject(err);
            	}
            });
            
		return deferred.promise();
	}
};


﻿/// <reference path="~/Scripts/docs/jquery-1.7.1-vsdoc.js" />

// *** BINDER ***
LINES.binders.betTicket = {

	confirmTicketSubmit: function () {
		try {
			if (!$("#betTicketSubmitContainer").hasClass('hidden')) {
				var stake = $("#PendingTicket_TicketItem_StakeAmount");
				var stakeAmount = stake.parse();
				if (stakeAmount <= 0) {
					//Incorrect stake amount entered
					alert(LINES.state.translationsStore["Please enter a wager amount."]);
					stake.focus();
					return false;
				}
				else {
					if ($("#ticketPlaced").val() == "false" && confirm(LINES.state.translationsStore["BetTicketConfirm_Default"])) {
						LINES.helpers.betTicket.submitTicket();
					}
				}
			}
			return false;
		}
		catch (err) {
			LINES.helpers.betTicket.onError(err);
			return true;
		}
	},

	setMaxPayout: function (event) {
		var price = new Number($("#ticketFormPrice").val());
		var stake = $("#PendingTicket_TicketItem_StakeAmount");
		var lineType = $("#betTicketLineType").val();
		var oddsType = $("#oddsEntry").val().toLowerCase();
		var stakeAmount = stake.parse();

		if (isNaN(stakeAmount) && stake.val() != '') {
			stake.val('');
			alert(LINES.state.translationsStore["only numbers allowed"]);
			return false;
		}
		if ((isNaN(stakeAmount) || stakeAmount.valueOf() <= 0) && event.type == "focusout") {
			stake.val('');
			return false;
		}

		var winAmount = 0;
		var riskAmount = 0;

		// malay, indonesian and hong kong format moneylines are sent in decimal format
		if ((oddsType == "malay" || oddsType == "indonesian" || oddsType == "hongkong") && lineType == "moneyline") {
			oddsType = "decimal";
		}

		if ($("input[name=riskwin]:checked").val() == "w") {
			// Stake is the Win amount for a Negative price for American, Malay or Indonesian odds or the customer selected Win
			winAmount = stakeAmount;
			riskAmount = LINES.helpers.betTicket.calculateRiskFromWin(winAmount, oddsType, price);
		}
		else {
			// Stake is the Risk amount for a Positive price for all odds types or the customer selected Risk
			riskAmount = stakeAmount;
			winAmount = LINES.helpers.betTicket.calculateWinFromRisk(riskAmount, oddsType, price);
		}

		LINES.helpers.betTicket.calculateMaxPayout(riskAmount, winAmount);
	},

	clearBetTicket: function () {
		LINES.helpers.betTicket.showEmptyTicket();
		var postUrl = $("#ticketClear").attr("href");
		$.ajax({
			url: postUrl,
			context: document.body,
			error: function () {
				// show the ticket
				$("#ticketWagers").removeClass('hidden');
				$("#emptyBetTicket").addClass('hidden');
			}
		});
		return false;
	},

	toggleTicketRefresh: function () {
		// Don't allow the refresh to be disabled if the current ticket is offline (submit is hidden)
		if (LINES.state.betTicketTimerEnabled && !$("#betTicketSubmitContainer").hasClass('hidden')) {
			LINES.state.betTicketTimerEnabled = false;
			$("#ticketRefresh").find('span').html(LINES.state.translationsStore["refresh"]);
		}
		else {
			LINES.state.betTicketTimerEnabled = true;
		}
	}
};

// *** BET TICKET HELPER ***
LINES.helpers.betTicket = {
	enhancedInit: function () {
		
		var clickedLink = LINES.utils.getParameterByName("line", window.location.hash);
		
		if (clickedLink != null) {
			this.addToTicket(clickedLink, true, false);
		}

		$("#ticketClear").on('click', function () { LINES.utils.dropParameterFromHashTag("line"); });

		$("#TicketContent").on('click', "a.removeLink", function (event) { event.preventDefault(); LINES.binders.betTicket.clearBetTicket(); });
		$('#ticketRefresh').on('click', function () { LINES.binders.betTicket.toggleTicketRefresh(); return false; });
		$('#ticketRefresh').on('dblclick', function () { return false; });
		$("#risk").on('click', function () { LINES.helpers.betTicket.showRiskMinAndMax(); });
		$("#win").on('click', function () { LINES.helpers.betTicket.showWinMinAndMax(); });
		$("#chkBetMaximum").on('click', function () { LINES.helpers.betTicket.showMaximumBet(true); });
		$("#risk").on('click', function () { $('#ticketWagers #isRisk').val('True'); LINES.helpers.betTicket.showMaximumBet(); });
		$("#win").on('click', function () { $('#ticketWagers #isRisk').val('False'); LINES.helpers.betTicket.showMaximumBet(); });
		// NOTE: event code reference for JS (do not use normal ASCII reference)
		// http://www.webonweboff.com/tips/js/event_key_codes.aspx
		$("#PendingTicket_TicketItem_StakeAmount").on('keydown', function (event) {
			// Manually bind the enter key to submit the bet ticket for IE
			if ($.browser.msie && event.keyCode == 13) {
				return LINES.binders.betTicket.confirmTicketSubmit();
			}

			// Allow only these special characters
			if (event.keyCode == 46 // (delete)
				|| event.keyCode == 8 // (backspace)
				|| event.keyCode == 13 // (enter)
				|| event.keyCode == 110 // .
				|| event.keyCode == 188 // ,
				|| event.keyCode == 190 // .
				) {
				// let it happen, don't do anything
			}
			else {
				// Ensure that it is a number and stop the keypress
				if ((event.keyCode < 48 || event.keyCode > 57) // outside of 0-9 (aka 48-57)
					&& (event.keyCode < 96 || event.keyCode > 105)) { // outside of 0-9 (aka NUMLOCK 96-105)
					event.preventDefault();
				}
			}
		});

		// RegEx to clean the input value then set the max payout
		$("#PendingTicket_TicketItem_StakeAmount").on('keyup', function (event) {
			var stakeInput = $("#PendingTicket_TicketItem_StakeAmount");
			stakeInput.val(stakeInput.val().replace(/[^0-9$.,']/g, ''));
			LINES.binders.betTicket.setMaxPayout(event);
			if (event.keyCode != 13) {
				var chkBetMaximum = $('#chkBetMaximum');
				if (chkBetMaximum.is(':checked')) {
					chkBetMaximum.attr('checked', false);
					LINES.helpers.betTicket.showMaximumBet(true);
				}
			}
		});
		$("#PendingTicket_TicketItem_StakeAmount").on('blur', function (event) {
			// Only format the stake if the ticket is not in the process of refreshing
			if (!LINES.state.betTicketIsRefreshing) {
				if (!isNaN($(this).val().replace(/[^0-9$.']/g, ''))) { // remove commas then check if it's a number
					$(this).format({ format: "#,##0.00" });
					LINES.binders.betTicket.setMaxPayout(event);
				}
				else {
					$(this).val(''); // clear value
				}
			}
		});

		$("#PendingTicket").on('submit', function () {
			return LINES.binders.betTicket.confirmTicketSubmit();
		});

		$("#ticketWagers").addClass("enhance");
		$("#BetTicketSubmitButton").addClass("hidden");
		$("#BetTicketSubmitLink").removeClass("hidden");
		$("#BetTicketSubmitLink").on('click', function () { return LINES.binders.betTicket.confirmTicketSubmit(); });
	},

	countDown: function () {
		if (LINES.state.lastClickedLink != '') return;

		var ticketRefresh = $("#ticketRefresh");
		var ticketIsVisible = !($("#ticketWagers").hasClass('hidden') || $("#TicketContent").hasClass('hidden'));
		if (LINES.state.betTicketTimerEnabled && ticketRefresh.attr("href") != "/" && ticketIsVisible) {
			LINES.state.timerCountDownTicketRefresh--;
			if (LINES.state.timerCountDownTicketRefresh == 0) {
				LINES.helpers.betTicket.refreshBetTicket("#ticketRefresh");
			}
			else if (LINES.state.timerCountDownTicketRefresh > 0) {
				ticketRefresh.find('span').html(LINES.state.translationsStore["refresh"] + "&nbsp;" + LINES.state.timerCountDownTicketRefresh);
			}
		} else {
			LINES.state.timerCountDownTicketRefresh = $("#ticketItem").hasClass("live") ? LINES.config.timerLimitLiveTicketRefresh : LINES.config.timerLimitTicketRefresh;
		}
	},

	calculateRiskFromWin: function (winAmount, oddsType, price) {
		var riskAmount = 0;
		switch (oddsType) {
			case "american":
				if (price < 0) {
					riskAmount = (winAmount / 100 * price * -1);
				}
				else if (price != 0) {
					riskAmount = (winAmount / price * 100);
				}
				break;
			case "decimal":
				riskAmount = winAmount / (price - 1);
				break;
			case "hongkong":
				riskAmount = winAmount / price;
				break;
			case "malay":
			case "indonesian":
				if (price < 0) {
					riskAmount = winAmount * -(price);
				}
				else if (price != 0) {
					riskAmount = winAmount / price;
				}
				break;
			default:
				// Do nothing, if the odds type can't be matched don't calculate the risk
		}
		return riskAmount.toFixed(4);
	},

	calculateWinFromRisk: function (riskAmount, oddsType, price) {
		var winAmount = 0;
		switch (oddsType) {
			case "american":
				if (price < 0) {
					winAmount = (riskAmount / price * -100);
				}
				else {
					winAmount = (riskAmount / 100 * price);
				}
				break;
			case "decimal":
				winAmount = riskAmount * (price - 1);
				break;
			case "hongkong":
				winAmount = riskAmount * price;
				break;
			case "malay":
			case "indonesian":
				if (price < 0) {
					winAmount = riskAmount / -(price);
				}
				else if (price != 0) {
					winAmount = riskAmount * price;
				}
				break;
			default:
				// Do nothing, if the odds type can't be matched don't calculate the win
		}
		return winAmount.toFixed(4);
	},

	refreshBetTicket: function (anchor) {
		try {
			if ($(anchor).attr("href") != "") {
				//LINES.state.betTicketIsRefreshing = true;
				$("#ticketRefresh").find('span').html(LINES.state.translationsStore["Please Wait"]);
				LINES.helpers.betTicket.addToTicket($(anchor).attr("href"), true);
			}
			return false;
		}
		catch (err) {
			LINES.helpers.betTicket.onError(err);
			return true;
		}
	},

	submitTicket: function () {
		$("#ticketPlaced").val("true");
		var pitcher1 = $("#PendingTicket_TicketItem_Team1PitcherChecked").prop('checked');
		var pitcher2 = $("#PendingTicket_TicketItem_Team2PitcherChecked").prop('checked');
		var pitchers = "";

		if (pitcher1 && !$("#PendingTicket_TicketItem_Team1PitcherChecked").hasClass('hidden')) {
			pitchers += "&PendingTicket_TicketItem_Team1PitcherChecked=true";
		}
		if (pitcher2 && !$("#PendingTicket_TicketItem_Team2PitcherChecked").hasClass('hidden')) {
			pitchers += "&PendingTicket_TicketItem_Team2PitcherChecked=true";
		}
		var dataString = $("#PendingTicket").serialize() + pitchers;
		LINES.utils.showLoadingDiv($("#ticketWagers"), "medium", "center", true);
		
		LINES.ajax.placeBet(dataString, 'json')
			.done(function (ticketContainer) {
			    LINES.helpers.betTicket.processTicketSubmitJson(ticketContainer);
			    dataLayer.push({ 'event': 'betslip.SubmitBet' }); // GTM Tracking
		}).fail(function(err) {
			LINES.utils.hideLoadingDiv("ticketWagers");
			$("#ticketPlaced").val("false");
			LINES.helpers.betTicket.onError(err);
		});
		
		return false;
	},

	processTicketSubmitJson: function (ticketJson) {
		LINES.utils.hideLoadingDiv("ticketWagers");
		$("#ticketPlaced").val("false");
		if (ticketJson != null && !ticketJson.IsAccepted) {
			try {
				if (!ticketJson.IsEmpty && ticketJson.Notification.Message != "") {

					$("#ticketItem").removeClass('live').removeClass('today').removeClass('early').addClass(ticketJson.TicketItem.MarketId.toLowerCase());
					$("#ticketFormattedPrice").removeClass("highlight").removeClass("neg");
					$("#ticketFormattedLine").removeClass("highlight");
					$("#betTicketScoreContainer").removeClass("highlight");

					if (ticketJson.TicketItem.EventLine.Line != '') {
						$("#ticketFormattedLine").text(ticketJson.TicketItem.EventLine.FormattedLine);
					}
					if (ticketJson.TicketItem.EventLine.Price != '' && ticketJson.TicketItem.EventLine.Price != 0) {
						$("#ticketFormLineId").val(ticketJson.TicketItem.LineId);
						$("#ticketFormBuySellId").val(ticketJson.TicketItem.BuySellId);
						$("#ticketFormPrice").val(ticketJson.TicketItem.EventLine.Price); // Update the price in case it has changed
						$("#ticketFormFormattedPrice").val(ticketJson.TicketItem.EventLine.FormattedPrice);
						$("#ticketFormattedPrice").text(ticketJson.TicketItem.EventLine.FormattedPrice);
						$("#ticketFormBallPercent").val(ticketJson.TicketItem.BallPercent);
						$('#PendingTicket_TicketItem_StakeAmount').trigger('blur'); // Recalculate the max payout

						LINES.helpers.betTicket.checkPriceChange(ticketJson, false);

						if (ticketJson.TicketItem.EventLine.Price < 0) {
							$("#ticketFormattedPrice").addClass("neg");
						}
						else {
							$("#ticketFormattedPrice").removeClass("neg");
						}
					}
					// Update the maximums first in case they've changed since they need to be up to date
					//	in case the wager was above the maximum
					if (ticketJson.TicketItem.MinRisk != "" && ticketJson.TicketItem.MinRisk != 0) {
						$("#ticketFormMinRisk").val(ticketJson.TicketItem.MinRisk);
						$("#ticketFormMinRiskAmount").val(ticketJson.TicketItem.MinRiskAmount);
						$("#ticketMinRisk").text(ticketJson.TicketItem.MinRisk);
					}
					if (ticketJson.TicketItem.MaxRisk != "") {
						$("#ticketFormMaxRisk").val(ticketJson.TicketItem.MaxRisk);
						$("#ticketFormMaxRiskAmount").val(ticketJson.TicketItem.MaxRiskAmount);
						$("#ticketMaxRisk").text(ticketJson.TicketItem.MaxRisk);
					}
					if (ticketJson.TicketItem.MinWin != "" && ticketJson.TicketItem.MinWin != 0) {
						$("#ticketFormMinWin").val(ticketJson.TicketItem.MinWin);
						$("#ticketFormMinWinAmount").val(ticketJson.TicketItem.MinWinAmount);
						$("#ticketMinWin").text(ticketJson.TicketItem.MinWin);
					}
					if (ticketJson.TicketItem.MaxWin != "") {
						$("#ticketFormMaxWin").val(ticketJson.TicketItem.MaxWin);
						$("#ticketFormMaxWinAmount").val(ticketJson.TicketItem.MaxWinAmount);
						$("#ticketMaxWin").text(ticketJson.TicketItem.MaxWin);
					}
					if (ticketJson.TicketItem.RiskOrWin == LINES.enums.ticketRiskOrWin.Risk) {
						LINES.helpers.betTicket.showRiskMinAndMax();
					} else {
						LINES.helpers.betTicket.showWinMinAndMax();
					}

					//BetMaximum
					LINES.helpers.betTicket.showMaximumBet(false);

					if (ticketJson.Notification.Type == LINES.enums.ticketNotificationType.BelowMinimumWagerAmount) {
						LINES.helpers.betTicket.checkMinimumWager(ticketJson.Notification.Message, (ticketJson.TicketItem.RiskOrWin == LINES.enums.ticketRiskOrWin.Risk));
					}
					if (ticketJson.Notification.Type == LINES.enums.ticketNotificationType.AboveMaximumWagerAmount ||
						ticketJson.Notification.Type == LINES.enums.ticketNotificationType.TotalLossLimitReached ||
						ticketJson.Notification.Type == LINES.enums.ticketNotificationType.TotalRiskLimitReached) {
						LINES.helpers.betTicket.checkMaximumWager(ticketJson.Notification.Message, (ticketJson.TicketItem.RiskOrWin == LINES.enums.ticketRiskOrWin.Risk));
					}

					if (ticketJson.Notification.Type != LINES.enums.ticketNotificationType.PriceChanged &&
						ticketJson.Notification.Type != LINES.enums.ticketNotificationType.PercentChanged &&
						ticketJson.Notification.Type != LINES.enums.ticketNotificationType.PriceAndPercentChanged &&
						ticketJson.Notification.Type != LINES.enums.ticketNotificationType.AboveMaximumWagerAmount &&
						ticketJson.Notification.Type != LINES.enums.ticketNotificationType.BelowMinimumWagerAmount && 
						ticketJson.Notification.Type != LINES.enums.ticketNotificationType.TotalLossLimitReached &&
						ticketJson.Notification.Type != LINES.enums.ticketNotificationType.TotalRiskLimitReached
						) {
						// only display the error alert if it hasn't already been handled
						$('#PendingTicket_TicketItem_StakeAmount').focus();
						alert(ticketJson.Notification.Message);
					}
					LINES.state.timerCountDownCustomerBalance = 2; // Trigger balance refresh
				}
				else if (ticketJson.Error.Message != "") {
					LINES.helpers.betTicket.showEmptyTicket(ticketJson.Error.Message);
				}
			}
			catch (err) {
				LINES.helpers.betTicket.onError(err);
			}
			return false;
		}
		else {
			// upport for live pending
			if (ticketJson.IsWaiting) {
				alert(ticketJson.Notification.Message);
				LINES.utils.showLoadingDiv($("#ticketWagers"), "medium", "center", true);
				// trigger call to poll for status update
				setTimeout(function() { LINES.helpers.betTicket.checkBetStatus(ticketJson.BetTicketId, 0); }, 1500);
				return false;
			}

			if (ticketJson.Notification.Message != "") {
				alert(ticketJson.Notification.Message); // Show accepted confirmation message
				LINES.helpers.tabs.selectTab(LINES.enums.tab.Pending);
			}
			
			LINES.utils.dropParameterFromHashTag("line");

			LINES.helpers.betTicket.showEmptyTicket();

			LINES.state.timerCountDownCustomerBalance = 3; // Trigger balance refresh
			if (ticketJson != null && ticketJson.TicketItem.InDangerZone) {
				LINES.state.pendingListHasWagers = true; // Auto switch to bet list if the pending list comes back empty
				LINES.helpers.tabs.selectTab(LINES.enums.tab.Pending);
			}
			else {
				LINES.helpers.tabs.selectTab(LINES.enums.tab.Wager);
			}
			return false;
		}
	},

	addToTicket: function() {

		var deferred = $.Deferred();
		
		LINES.state.betTicketIsRefreshing = true;

		var clickedLink = arguments[0];
		
		if (clickedLink == null || clickedLink == "") {
			deferred.resolve();
			return deferred.promise();
		}
		
		var isRefresh = arguments[1];
		var hashRefresh = true;

		if (arguments.length > 2) {
			hashRefresh = arguments[2];
		}

		try {
			$("#ticketRefresh").attr("href", clickedLink);
			$("#ticketPlaced").val("false");
			LINES.state.riskAmount = 0;
			LINES.state.winAmount = 0;

			LINES.helpers.tabs.activateTabWithHash("line", clickedLink, hashRefresh);

			if (isRefresh) {

				var pitcher1 = $("#PendingTicket_TicketItem_Team1PitcherChecked").prop('checked');
				var pitcher2 = $("#PendingTicket_TicketItem_Team2PitcherChecked").prop('checked');

				if (pitcher1) {
					clickedLink = clickedLink + "&pitcher1=t";
				} else {
					clickedLink = clickedLink + "&pitcher1=f";
				}
				if (pitcher2) {
					clickedLink = clickedLink + "&pitcher2=t";
				} else {
					clickedLink = clickedLink + "&pitcher2=f";
				}

				clickedLink = clickedLink + "&riskwin=" + $("input[name=riskwin]:checked").val();

				if ($("#PendingTicket_AcceptBetterLines").is(":checked")) {
					clickedLink = clickedLink + "&betterodds=t";
				}
			}

			var restartTimer = function () {

				if (LINES.state.betTicketIsRefreshing) {
				}

				var marketType = $("#ticketFormMarketId").val();
				
				// Ensure the timer starts at the right number when a ticket is added
				if (marketType == LINES.enums.marketType.Live) {
					LINES.state.timerCountDownTicketRefresh = LINES.config.timerLimitLiveTicketRefresh;
				} else {
					LINES.state.timerCountDownTicketRefresh = LINES.config.timerLimitTicketRefresh;
				}
			};

			var stickPleaseWait = function () {
				//$("#ticketRefresh").find('span').html(LINES.state.translationsStore["refresh"]);

				var isWaiting = LINES.state.translationsStore["Please Wait"] == $("#ticketRefresh").find('span').html();

				if (isWaiting) {
					LINES.utils.log("lines.betticket", "Ticket refresh [ABORT] ");
					restartTimer();
					stickPleaseWait = null;

					if (LINES.state.betTicketIsRefreshing) {
						LINES.state.betTicketIsRefreshing = false;
						LINES.utils.hideLoadingDiv("ticketWagers");
					}
				}

			};

			LINES.utils.log("lines.betticket", "Ticket refresh [START] " + stickPleaseWait);

			LINES.ajax.post(clickedLink, 'json').done(	           
				function(ticketContainer) {
					try {
						if (!isRefresh && LINES.state.lastClickedLink == clickedLink) {
								LINES.state.lastClickedLink = "";
								LINES.helpers.betTicket.processPendingTicketJson(ticketContainer, isRefresh);
								LINES.utils.hideLoadingDiv("emptyBetTicket");
								LINES.utils.hideLoadingDiv("ticketWagers");
								restartTimer();
						} else if (isRefresh && LINES.state.lastClickedLink == '') {//only refresh when there are no incoming requests
							LINES.helpers.betTicket.processPendingTicketJson(ticketContainer, isRefresh);
							LINES.utils.hideLoadingDiv("emptyBetTicket");
							LINES.utils.hideLoadingDiv("ticketWagers");
						} 
						   
						$("#PendingTicket_TicketItem_StakeAmount").focus();
						
						//LINES.state.betTicketIsRefreshing = false;
						//LINES.utils.hideLoadingDiv("ticketWagers");

						deferred.resolve();

					} catch(e) {
						deferred.reject(e);
					}

				}).fail(function(err) {
					deferred.reject(err);
					
				});
		}
		catch (e) {
			deferred.reject(e);
			
		}
		
		var promise = deferred.promise();

		promise.fail(function (ee) {
		   LINES.helpers.betTicket.onError(ee);

			try {

				restartTimer();
				LINES.betTicket.helpers.showEmptyTicket($('#errorMessageSlim').html());

				$('#emptyBetTicket .retry').click(function () {
					LINES.helpers.betTicket.addToTicket(clickedLink, isRefresh);
					return false;
				});
				LINES.helpers.tabs.selectTab(LINES.enums.tab.Ticket);
				
			} catch (err) {
			   LINES.helpers.betTicket.onError(err);
			}
		});

		promise.always(function () {
			if (LINES.state.betTicketIsRefreshing) {
				LINES.state.betTicketIsRefreshing = false;
			}

			LINES.utils.log("lines.betticket", "Ticket refresh [END]");

			if (unstickPleaseWait != null) {
				clearTimeout(unstickPleaseWait);
			}
		});

		return false;
	},

	processPendingTicketJson: function (ticketJsonContainer, isRefresh) {
		if (ticketJsonContainer == null) {
			return;
		}
		var ticketJson = ticketJsonContainer.PendingTicket;

		try {
			if (!isRefresh) {
				LINES.helpers.tabs.selectTab(LINES.enums.tab.Ticket);

			} else {
				if (ticketJson.TicketItem.ShowListedPitcherChanged) {
					alert(LINES.state.translationsStore["Error_ListedPitchersSelectionError"]);
				}
			}

			$("#ticketItem").removeClass('live');
			$("#ticketItem").removeClass('today');
			$("#ticketItem").removeClass('early');

			if (ticketJson.Error.Message != "") {
				LINES.betTicket.helpers.showEmptyTicket(ticketJson.Error.Message);

				LINES.utils.warn('lines.betticket', 'ticketJson.Error: ' + ticketJson.TicketItem.EventId + ":" + ticketJson.Error.Message);
			}
			else {
				$("#betTicketNotification").addClass('hidden');
				$("#betTicketNotAccepted").addClass("hidden");
				$("#betTicketItemContainer").removeClass('hidden');
				$("#betTicketSubmitContainer").removeClass('hidden');
				$("#betTicketSummary").removeClass('hidden');
				$("#betTicketPickContainer").removeClass('hidden');
				$("#ticketItem").addClass(ticketJson.TicketItem.MarketId.toLowerCase());
				$("#ticketFormattedPrice").removeClass("highlight").removeClass("neg");
				$("#ticketFormattedLine").removeClass("highlight");
				$("#betTicketScoreContainer").removeClass("highlight");

				$("#ticketWagers").removeClass('hidden');
				$("#emptyBetTicket").addClass('hidden');

				if (ticketJson.TicketItem.EventStatus != LINES.enums.bettingEventStatus.Offline || !isRefresh) {
					$("#ticketRefresh").attr("href", LINES.config.virtualDirectory + ticketJson.RefreshLink);
					$("#betTicketSport").text(ticketJson.TicketItem.Sport);
					$("#betTicketLeague").text(ticketJson.TicketItem.League);
					$("#betTicketDate").text(ticketJson.TicketItem.StartDate);
					$("#betTicketLineDesc").text(ticketJson.TicketItem.LineDescription);
					$("#ticketFormattedLine").text(ticketJson.TicketItem.EventLine.FormattedLine);
					$("#ticketFormattedPrice").text(ticketJson.TicketItem.EventLine.FormattedPrice);
					if (ticketJson.TicketItem.EventLine.Price < 0) {
						$("#ticketFormattedPrice").addClass("neg");
					}
					else {
						$("#ticketFormattedPrice").removeClass("neg");
					}

					$("#ticketFormSource").val(ticketJson.TicketSource);
					$("#ticketFormUniqueId").val(ticketJson.UniqueId);
					$("#ticketFormBallPercent").val(ticketJson.TicketItem.BallPercent);
					$("#ticketFormBetType").val(ticketJson.TicketItem.BetType);
					$("#ticketFormBuySellId").val(ticketJson.TicketItem.BuySellId);
					$("#ticketFormBuySellLevel").val(ticketJson.TicketItem.BuySellLevel);
					$("#ticketFormDisplayPick").val(ticketJson.TicketItem.DisplayPick);
					$("#ticketFormEventId").val(ticketJson.TicketItem.EventId);
					$("#ticketFormFormattedPick").val(ticketJson.TicketItem.EventLine.FormattedPick);
					$("#ticketFormPrice").val(ticketJson.TicketItem.EventLine.Price);
					$("#ticketFormFormattedPrice").val(ticketJson.TicketItem.EventLine.FormattedPrice);
					$("#ticketFormLine").val(ticketJson.TicketItem.EventLine.Line);
					$("#ticketFormFormattedLine").val(ticketJson.TicketItem.EventLine.FormattedLine);
					$("#ticketFormEventStatus").val(ticketJson.TicketItem.EventStatus);
					$("#ticketFormLeague").val(ticketJson.TicketItem.League);
					$("#ticketFormLeagueId").val(ticketJson.TicketItem.LeagueId);
					$("#ticketFormLineDescription").val(ticketJson.TicketItem.LineDescription);
					$("#ticketFormLineId").val(ticketJson.TicketItem.LineId);
					$("#ticketFormLineTypeLabel").val(ticketJson.TicketItem.LineTypeLabel);
					$("#ticketFormMarketId").val(ticketJson.TicketItem.MarketId);
					$("#ticketFormMaxRisk").val(ticketJson.TicketItem.MaxRisk);
					$("#ticketFormMaxRiskAmount").val(ticketJson.TicketItem.MaxRiskAmount);
					$("#ticketFormMinRisk").val(ticketJson.TicketItem.MinRisk);
					$("#ticketFormMinRiskAmount").val(ticketJson.TicketItem.MinRiskAmount);
					$("#ticketFormMaxWin").val(ticketJson.TicketItem.MaxWin);
					$("#ticketFormMaxWinAmount").val(ticketJson.TicketItem.MaxWinAmount);
					$("#ticketFormMinWin").val(ticketJson.TicketItem.MinWin);
					$("#ticketFormMinWinAmount").val(ticketJson.TicketItem.MinWinAmount);
					$("#ticketFormOverUnder").val(ticketJson.TicketItem.OverUnder);
					$("#ticketFormPeriod").val(ticketJson.TicketItem.Period);
					$("#ticketFormPeriodDescription").val(ticketJson.TicketItem.PeriodDescription);
					$("#ticketFormPick").val(ticketJson.TicketItem.Pick);
					$("#ticketFormSport").val(ticketJson.TicketItem.Sport);
					$("#ticketFormSportId").val(ticketJson.TicketItem.SportId);
					$("#ticketFormSportType").val(ticketJson.TicketItem.SportType);
					$("#ticketFormStartDate").val(ticketJson.TicketItem.StartDate);
					$("#ticketFormTeam1FavoriteCss").val(ticketJson.TicketItem.Team1FavoriteCss);
					$("#ticketFormTeam1Id").val(ticketJson.TicketItem.Team1Id);
					$("#ticketFormTeam1Name").val(ticketJson.TicketItem.Team1Name);
					$("#ticketFormTeam1Pitcher").val(ticketJson.TicketItem.Team1Pitcher);
					$("#ticketFormTeam1RedCards").val(ticketJson.TicketItem.Team1RedCards);
					$("#ticketFormTeam1Score").val(ticketJson.TicketItem.Team1Score);
					$("#ticketFormTeam2FavoriteCss").val(ticketJson.TicketItem.Team2FavoriteCss);
					$("#ticketFormTeam2Id").val(ticketJson.TicketItem.Team2Id);
					$("#ticketFormTeam2Name").val(ticketJson.TicketItem.Team2Name);
					$("#ticketFormTeam2Pitcher").val(ticketJson.TicketItem.Team2Pitcher);
					$("#ticketFormTeam2RedCards").val(ticketJson.TicketItem.Team2RedCards);
					$("#ticketFormTeam2Score").val(ticketJson.TicketItem.Team2Score);

					$("#ticketMinRisk").text(ticketJson.TicketItem.MinRisk);
					$("#ticketMaxRisk").text(ticketJson.TicketItem.MaxRisk);
					$("#ticketMinWin").text(ticketJson.TicketItem.MinWin);
					$("#ticketMaxWin").text(ticketJson.TicketItem.MaxWin);

					$("span.betCurrency").text(ticketJsonContainer.CurrencyCode);

					//var risk = $('#risk').attr('checked');
					//if (risk == 'checked') {
					if (ticketJson.TicketItem.RiskOrWin == LINES.enums.ticketRiskOrWin.Risk) {
						LINES.helpers.betTicket.showRiskMinAndMax();
					} else {
						LINES.helpers.betTicket.showWinMinAndMax();
					}

					// Ensure the timer starts at the right number when a ticket is added
					LINES.state.timerCountDownTicketRefresh = (ticketJson.TicketItem.MarketId == LINES.enums.marketType.Live) ? LINES.config.timerLimitLiveTicketRefresh : LINES.config.timerLimitTicketRefresh;

					if (ticketJson.TicketItem.Team1FavoriteCss != "" && !$("#betTicketTeam1Container").hasClass('fav')) {
						$("#betTicketTeam1Container").addClass('fav');
					}
					else if (ticketJson.TicketItem.Team1FavoriteCss == "" && $("#betTicketTeam1Container").hasClass('fav')) {
						$("#betTicketTeam1Container").removeClass('fav');
					}

					if (ticketJson.TicketItem.Team2FavoriteCss != "" && !$("#betTicketTeam2Container").hasClass('fav')) {
						$("#betTicketTeam2Container").addClass('fav');
					}
					else if (ticketJson.TicketItem.Team2FavoriteCss == "" && $("#betTicketTeam2Container").hasClass('fav')) {
						$("#betTicketTeam2Container").removeClass('fav');
					}

					$("#betTicketTeam1").html(LINES.utils.insertSoftHyphens(unescape(ticketJson.TicketItem.Team1Name), 5));
					if (ticketJson.TicketItem.Team1Pitcher != null && ticketJson.TicketItem.Team1Pitcher != "") {
						$("#betTicketTeam1Pitcher").text(unescape(ticketJson.TicketItem.Team1Pitcher));
						if ($("#betTicketTeam1PitcherContainer").hasClass('hidden')) {
							$("#betTicketTeam1PitcherContainer").removeClass('hidden');
						}
					}
					else {
						if (!$("#betTicketTeam1PitcherContainer").hasClass('hidden')) {
							$("#betTicketTeam1PitcherContainer").addClass('hidden');
						}
					}
					$("#PendingTicket_TicketItem_Team1PitcherChecked").prop("checked", ticketJson.TicketItem.Team1PitcherChecked);
					$("#betTicketTeam2").html(LINES.utils.insertSoftHyphens(unescape(ticketJson.TicketItem.Team2Name), 5));
					if (ticketJson.TicketItem.Team2Pitcher != null && ticketJson.TicketItem.Team2Pitcher != "") {
						$("#betTicketTeam2Pitcher").text(unescape(ticketJson.TicketItem.Team2Pitcher));
						if ($("#betTicketTeam2PitcherContainer").hasClass('hidden')) {
							$("#betTicketTeam2PitcherContainer").removeClass('hidden');
						}
					}
					else {
						if (!$("#betTicketTeam2PitcherContainer").hasClass('hidden')) {
							$("#betTicketTeam2PitcherContainer").addClass('hidden');
						}
					}
					$("#PendingTicket_TicketItem_Team2PitcherChecked").prop("checked", ticketJson.TicketItem.Team2PitcherChecked);
					$("#ticketFormattedPick").html(unescape(ticketJson.TicketItem.EventLine.FormattedPick));
					$("#betTicketLineType").val(LINES.enums.lineTypeName[ticketJson.TicketItem.BetType].toLowerCase());
					$("#betTicketLineTypeLabel").text(ticketJson.TicketItem.LineTypeLabel);

					// Hide the pick if it's a Team Total line
					if (!ticketJson.TicketItem.DisplayPick) {
						$("#betTicketPickContainer").addClass('hidden');
					}

					if (ticketJson.TicketItem.BetType == LINES.enums.lineType.Moneyline) {
						$("#betTicketLineTypeContainer").addClass('hidden');
						$("#PendingTicket_TicketItem_Team1PitcherChecked").removeClass('hidden');
						$("#PendingTicket_TicketItem_Team2PitcherChecked").removeClass('hidden');
					}
					else {
						$("#betTicketLineTypeContainer").removeClass('hidden');
						if (!$("#PendingTicket_TicketItem_Team1PitcherChecked").hasClass('hidden')) {
							$("#PendingTicket_TicketItem_Team1PitcherChecked").addClass('hidden');
						}
						if (!$("#PendingTicket_TicketItem_Team2PitcherChecked").hasClass('hidden')) {
							$("#PendingTicket_TicketItem_Team2PitcherChecked").addClass('hidden');
						}
					}

					if (LINES.config.listedPitchersToggle == true) {
						if (ticketJson.TicketItem.ListedPitchersVisibility) {
							$("#PendingTicket_TicketItem_Team1PitcherChecked").removeClass('hidden');
							$("#PendingTicket_TicketItem_Team2PitcherChecked").removeClass('hidden');

						} else {
							$("#PendingTicket_TicketItem_Team1PitcherChecked").addClass('hidden');
							$("#PendingTicket_TicketItem_Team2PitcherChecked").addClass('hidden');
						}
					}

					if (ticketJson.TicketItem.EventStatus != LINES.enums.bettingEventStatus.Offline &&
						!(ticketJson.TicketItem.Team1Score == null) && !(ticketJson.TicketItem.Team2Score == null)
						&& ticketJson.TicketItem.BetType != LINES.enums.lineType.Moneyline) {
						if (isRefresh != null && isRefresh &&
							(($("#betTicketTeam1Score").text() * 1) != ticketJson.TicketItem.Team1Score ||
								($("#betTicketTeam2Score").text() * 1) != ticketJson.TicketItem.Team2Score)) {
							$("#betTicketScoreContainer").addClass("highlight");
						}
						$("#betTicketTeam1Score").text(ticketJson.TicketItem.Team1Score);
						$("#betTicketTeam2Score").text(ticketJson.TicketItem.Team2Score);
						$("#betTicketScoreContainer").removeClass("hidden");
					}
					else if (!$("#betTicketScoreContainer").hasClass("hidden")) {
						$("#betTicketScoreContainer").addClass("hidden");
					}

					$("#betTicketOverUnder").text(ticketJson.TicketItem.OverUnder);

					$("#InDangerZone").val(ticketJson.TicketItem.InDangerZone);
					// Only reset the values on an add, this method could be called as a refresh
					if (isRefresh != null && isRefresh) {
						$('#PendingTicket_TicketItem_StakeAmount').trigger('blur'); // Recalculate the max payout
					}
					else {
						$("#PendingTicket_TicketItem_StakeAmount").val('');
						$("#ticketMaxPayout").text('');
					}

					//BetMaximum
					$('#chkBetMaximum').attr('checked', ticketJson.BetMaximum);
					LINES.helpers.betTicket.showMaximumBet(false);

					LINES.helpers.betTicket.checkPriceChange(ticketJson, isRefresh);
				}
			}
		}
		catch (err) {
		   LINES.helpers.betTicket.onError(err);
		}
	},

	checkMinimumWager: function (message, isStakeRisk) {
		var minBet;
		if (!isStakeRisk) {
			minBet = new Number($("#ticketFormMinWinAmount").val());
		} else {
			minBet = new Number($("#ticketFormMinRiskAmount").val());
		}
		var risk = $("#PendingTicket_TicketItem_StakeAmount");
		risk.val(minBet);
		risk.format({ format: "#,##0.00" });
		risk.trigger('blur'); // Recalculate the win amount
		risk.focus();
		alert(message);
		return true;
	},

	checkMaximumWager: function (message, isStakeRisk) {
		var maxBet;
		if (!isStakeRisk) {
			maxBet = new Number($("#ticketFormMaxWinAmount").val());
		} else {
			maxBet = new Number($("#ticketFormMaxRiskAmount").val());
		}
		var risk = $("#PendingTicket_TicketItem_StakeAmount");
		risk.val(maxBet);
		risk.format({ format: "#,##0.00" });
		risk.trigger('blur'); // Recalculate the win amount
		risk.focus();
		alert(message);
		return true;
	},

	callbackToggleTicketInfo: function (divClicked) {
		$(divClicked).parent().siblings('.addInfo').is(":visible") ? $(divClicked).children().html(LINES.state.translationsStore["full details"]) : $(divClicked).children().html(LINES.state.translationsStore["less details"]);
	},

	calculateMaxPayout: function (riskAmount, winAmount) {
		var maxPayout = new Number(riskAmount) + new Number(winAmount);
		maxPayout = (Math.floor(maxPayout * 100) / 100).toFixed(2);

		if (maxPayout > 0) {
			$("#ticketMaxPayout").text(maxPayout).format({ format: "#,##0.00" });
		}
		else {
			$("#ticketMaxPayout").text("");
		}
	},

	checkPriceChange: function (ticketJson, isRefresh) {
		if (ticketJson.Notification.Type == LINES.enums.ticketNotificationType.PriceChanged
		|| ticketJson.Notification.Type == LINES.enums.ticketNotificationType.PercentChanged
		|| ticketJson.Notification.Type == LINES.enums.ticketNotificationType.PriceAndPercentChanged) {
			$("#ticketRefresh").attr("href", LINES.config.virtualDirectory + ticketJson.RefreshLink);
			switch (ticketJson.Notification.Type) {
				case LINES.enums.ticketNotificationType.PriceChanged:
					$("#ticketFormattedPrice").addClass("highlight");
					break;
				case LINES.enums.ticketNotificationType.PercentChanged:
					$("#ticketFormattedLine").addClass("highlight");
					break;
				case LINES.enums.ticketNotificationType.PriceAndPercentChanged:
					$("#ticketFormattedLine").addClass("highlight");
					$("#ticketFormattedPrice").addClass("highlight");
					break;
				default:
					// Do nothing, 
			}
			if (isRefresh == null || !isRefresh) {
				alert(ticketJson.Notification.Message);
			}
		}
	},

	showRiskMinAndMax: function () {
		var ticketSummary = $('#betTicketSummary');
		ticketSummary.find('.minrisk').removeClass('hidden');
		ticketSummary.find('.maxrisk').removeClass('hidden');
		ticketSummary.find('.minwin').addClass('hidden');
		ticketSummary.find('.maxwin').addClass('hidden');
		$('#risk').attr('checked', true);
		$('#ticketWagers #isRisk').val('True');
		var blur = jQuery.Event("blur");
		LINES.binders.betTicket.setMaxPayout(blur);
	},

	showWinMinAndMax: function () {
		var ticketSummary = $('#betTicketSummary');
		ticketSummary.find('.minrisk').addClass('hidden');
		ticketSummary.find('.maxrisk').addClass('hidden');
		ticketSummary.find('.minwin').removeClass('hidden');
		ticketSummary.find('.maxwin').removeClass('hidden');
		$('#win').attr('checked', true);
		$('#ticketWagers #isRisk').val('False');
		var blur = jQuery.Event("blur");
		LINES.binders.betTicket.setMaxPayout(blur);
	},

	showMaximumBet: function (sw) {
		var ischecked = $('#chkBetMaximum').is(':checked');
		var stake = $('#PendingTicket_TicketItem_StakeAmount');
		if (ischecked) {
			var ticketSummary = $('#betTicketSummary');
			if ($('#ticketWagers #isRisk').val() == 'True') {
				stake.val(ticketSummary.find('#ticketMaxRisk').html());
				LINES.helpers.betTicket.showRiskMinAndMax();
			} else {
				stake.val(ticketSummary.find('#ticketMaxWin').html());
				LINES.helpers.betTicket.showWinMinAndMax();
			}
		}

		if (sw) {
			//call one way action
			$.ajax({
				type: "POST",
				data: "isChecked=" + ischecked,
				url: LINES.config.virtualDirectory + "AsiaSession/SelectBetMaximum"
			});
		}
	},

	showEmptyTicket: function (message) {
		var emptyTicket = $("#emptyBetTicket");
		if (!message || message == "") {
			message = LINES.state.translationsStore["BetTicketNote2"];
		}
		$("#betTicketNotification").addClass('hidden');
		$("#ticketWagers").addClass('hidden');
		emptyTicket.find(".message").html(message);
		emptyTicket.removeClass('hidden');
		return false;
	},

	checkBetStatus: function (ticketId, count) {
		LINES.ajax.betStatus(ticketId)
			.done(function (response) {
				LINES.helpers.betTicket.processBetStatus(response, ticketId, count);
			}).fail(function (err) {
				LINES.utils.hideLoadingDiv("ticketWagers");
				$("#ticketPlaced").val("false");
				LINES.helpers.betTicket.onError(err);
			});

		return false;
	},

	processBetStatus: function (response, ticketId, count) {
		var maxRetries = 15;

		if (response != undefined && response.Bets != undefined && count < maxRetries &&
			response.Bets[ticketId].Status == LINES.enums.betStatus.Waiting) {
			count++;
			setTimeout(function() { LINES.helpers.betTicket.checkBetStatus(ticketId, count); }, 1500);
		} else if (response != undefined && response.Bets != undefined && 
			(response.Bets[ticketId].Status == LINES.enums.betStatus.Accepted ||
			response.Bets[ticketId].Status == LINES.enums.betStatus.Rejected)) {

			alert(response.Bets[ticketId].Message);
			LINES.helpers.betTicket.showEmptyTicket();
			if (response.Bets[ticketId].Status == LINES.enums.betStatus.Accepted) {
				LINES.helpers.tabs.selectTab(LINES.enums.tab.Wager);
			}

			LINES.utils.hideLoadingDiv("ticketWagers");
		} else {
			// TODO: Show error message, bet was not decided in a reasonable time
			LINES.helpers.betTicket.showEmptyTicket();
			LINES.utils.hideLoadingDiv("ticketWagers");
		}

		return false;
	}
};

LINES.helpers.betTicket.onError = function (err) {
	LINES.logError(err);
	LINES.utils.error("lines.betticket", err);
};
﻿/// <reference path="~/Scripts/docs/jquery-1.7.1-vsdoc.js" />
/// <reference path="~/Scripts/lines/lines.js" />
/// <reference path="~/Scripts/lines/jquery.purl.js" />

// *** EVENT ***
LINES.helpers.Event = function (sportId, leagueId, uniqueEventId, isNewLeague, sportName, isUpdate, cssViewType) {
	this.oddsFormat = LINES.state.oddsFormat;
	this.sportId = sportId;
	this.leagueId = leagueId;
	this.cssViewType = cssViewType;
	this.isUpdate = isUpdate;
	this.uniqueEventId = uniqueEventId;
	var idPieces = LINES.helpers.Event.getUniqueEventIdPieces(uniqueEventId);
	this.marketType = idPieces.marketType;
	this.uniqueLeagueId = LINES.helpers.League.getUniqueLeagueId(this.marketType, sportId, leagueId);
	this.eventHtmlHelper = new LINES.helpers.EventHtml(this.sportId, this.leagueId, this.uniqueEventId, isNewLeague, sportName, cssViewType);
};

// object methods
LINES.helpers.Event.prototype.exists = function () {
	return this.eventHtmlHelper.exists();
};

LINES.helpers.Event.prototype.removeEvent = function () {
	LINES.helpers.EventHtml.removeEvent(this.uniqueEventId);
};

LINES.helpers.Event.prototype.getStartTime = function () {
	return this.eventHtmlHelper.getStartTime();
};

LINES.helpers.Event.prototype.getRotationNumber = function () {
	return this.eventHtmlHelper.getRotationNumber();
};

LINES.helpers.Event.prototype.updateRow = function (eventJson) {
	this.eventHtmlHelper.highlightScoreChange(eventJson.DispDate)
		.setStartTime(eventJson.DispDate, eventJson.Date)
		.setAlternateLineNumber(eventJson.Alt)
		.setTeams(eventJson.TmH, eventJson.TmA)
		.setRotationNumber(eventJson.Rot);

	var oldWagerDataMap = this.eventHtmlHelper.getWagerDataMap();
	var newWagerDataMap = eventJson.WagerMap;
	var domElement = this.eventHtmlHelper.domElements.rows[0].domElement;

	if (this.cssViewType == LINES.enums.cssViewType.Moneyline) {
		for (var position = 0; position <= 1; position++) {
			var index = position * 3;
			var oldLink = $(oldWagerDataMap[index]).attr("href");
			var newLink = $(newWagerDataMap[index]).attr("href");

			if (oldLink != newLink) {
				domElement.find(".pos" + position + ".Handicap").html(newWagerDataMap[index]);
				if (this.isUpdate) {
					domElement.find(".pos" + position + ".Handicap").removeClass("nochange").addClass("highlight");
				}
				else if (!domElement.find(".pos" + position + ".Handicap").hasClass("nochange")) {
					// make sure no change is on Moneyline Home if element does not exist
					domElement.find(".pos" + position + ".Handicap").addClass("nochange");
				}
			}
			else {
				// remove highlight
				var element = domElement.find(".pos" + position + ".Handicap");
				element.removeClass("highlight").addClass("nochange");
			}

			// loop draw/away 
			for (var tee = 1; tee <= 2; tee++) {
				oldLink = $(oldWagerDataMap[index + tee]).attr("href");
				newLink = $(newWagerDataMap[index + tee]).attr("href");

				if (oldLink != newLink) {
					var element = domElement.find(".pos" + position + ".T" + tee);
					element.html(newWagerDataMap[index + tee]);
					if (this.isUpdate) {
						element.removeClass("nochange").addClass("highlight");
					}
					// remove highlight
					else {
						element.removeClass("highlight").addClass("nochange");
					}
				}
				else {
					// remove highlight
					var element = domElement.find(".pos" + position + ".T" + tee);
					element.removeClass("highlight").addClass("nochange");
				}
			}
		}
	}
	else if (this.cssViewType == LINES.enums.cssViewType.Double) {
		var oldSpreadWagerDataMap = this.eventHtmlHelper.getSpreadWagerDataMap();
		var newSpreadWagerDataMap = eventJson.SpWagerMap;
		var oldTotalWagerDataMap = this.eventHtmlHelper.getTotalWagerDataMap();
		var newTotalWagerDataMap = eventJson.TotWagerMap;
		var positionMax = 2;
		this.eventHtmlHelper.setDraw(eventJson.TmD);

		for (var position = 0; position < positionMax; position++) {
			var index = position * 3;

			var hasDraw = (eventJson.TmD != "");
			// Update the Moneylines
			for (var tCount = 0; tCount <= 3; tCount++) {
				var oldLink = $(oldWagerDataMap[index + tCount]).attr("href");
				var newLink = $(newWagerDataMap[index + tCount]).attr("href");
				var newHtml = newWagerDataMap[index + tCount];
				var updateElement = domElement.find(".moneyline .pos" + position + ".T" + tCount);

				this.updateMoneylineLink(oldLink, newLink, newHtml, updateElement, this.isUpdate, hasDraw);
			}
			if (!hasDraw) {
				domElement.find(".moneyline .pos" + position + ".T0").addClass("hidden"); // hide draw div
			}
			else {
				domElement.find(".moneyline .pos" + position + ".T0").removeClass("hidden"); // show draw div
			}

			// Check if there's a total line
			if (newTotalWagerDataMap == undefined || newTotalWagerDataMap[index] == "") {
				domElement.find(".total .pos" + position + ".ou").addClass("hidden"); // hide over under label
			}
			else {
				domElement.find(".total .pos" + position + ".ou").removeClass("hidden"); // show over under label
			}

			var spreadIndexOffset = (position * 4);
			var spreadHandicap = domElement.find(".spread .pos" + position + ".Handicap");
			// check if handicap (aka condition) has changed
			var spreadHighlightHome = this.updateHandicap(oldSpreadWagerDataMap[spreadIndexOffset], newSpreadWagerDataMap[spreadIndexOffset], spreadHandicap.eq(0), this.isUpdate);
			var spreadHighlightAway = this.updateHandicap(oldSpreadWagerDataMap[spreadIndexOffset + 2], newSpreadWagerDataMap[spreadIndexOffset + 2], spreadHandicap.eq(1), this.isUpdate);
			var spreadHighlight = (spreadHighlightHome || spreadHighlightAway);

			// home/away spread
			var spreadIndex = spreadIndexOffset + 1;
			var oldSpreadLink = $(oldSpreadWagerDataMap[spreadIndex]).attr("href");
			var newSpreadLink = $(newSpreadWagerDataMap[spreadIndex]).attr("href");
			var newSpreadPrice = $(newSpreadWagerDataMap[spreadIndex]);
			var spreadPrice = domElement.find(".spread .pos" + position + ".T1");
			this.updatePrice(oldSpreadLink, newSpreadLink, newSpreadPrice, spreadPrice, spreadHighlight, this.isUpdate);

			spreadIndex = spreadIndexOffset + 3;
			oldSpreadLink = $(oldSpreadWagerDataMap[spreadIndex]).attr("href");
			newSpreadLink = $(newSpreadWagerDataMap[spreadIndex]).attr("href");
			newSpreadPrice = $(newSpreadWagerDataMap[spreadIndex]);
			spreadPrice = domElement.find(".spread .pos" + position + ".T3");
			this.updatePrice(oldSpreadLink, newSpreadLink, newSpreadPrice, spreadPrice, spreadHighlight, this.isUpdate);

			var totalHandicap = domElement.find(".total .pos" + position + ".Handicap");
			// check if total (aka condition) has changed
			var totalHighlight = this.updateHandicap(oldTotalWagerDataMap[index], newTotalWagerDataMap[index], totalHandicap, this.isUpdate);

			// loop home/away spread or over/under total
			for (var tee = 1; tee <= 2; tee++) {
				var oldTotalLink = $(oldTotalWagerDataMap[index + tee]).attr("href");
				var newTotalLink = $(newTotalWagerDataMap[index + tee]).attr("href");
				var newTotalPrice = $(newTotalWagerDataMap[index + tee]);
				var totalPrice = domElement.find(".total .pos" + position + ".T" + tee);
				this.updatePrice(oldTotalLink, newTotalLink, newTotalPrice, totalPrice, totalHighlight, this.isUpdate);
			}
		}
	}
	else if (this.cssViewType == LINES.enums.cssViewType.Taiwan) {
		var oldTwTotalWagerDataMap = this.eventHtmlHelper.getTwTotalWagerDataMap();
		var newTwTotalWagerDataMap = eventJson.TwTotWagerMap;
		var oldTwSpreadWagerDataMap = this.eventHtmlHelper.getTwSpreadWagerDataMap();
		var newTwSpreadWagerDataMap = eventJson.TwSpWagerMap;
		var oldSpreadWagerDataMap = this.eventHtmlHelper.getSpreadWagerDataMap();
		var newSpreadWagerDataMap = eventJson.SpWagerMap;

		var twSpreadHandicap = domElement.find(".twspread .pos0" + ".Handicap");
		// check if handicap/total (aka condition) has changed
		var twSpreadHighlightHome = this.updateTwHandicap(oldTwSpreadWagerDataMap[0], newTwSpreadWagerDataMap[0], twSpreadHandicap.eq(0), this.isUpdate);
		var twSpreadHighlightAway = this.updateTwHandicap(oldTwSpreadWagerDataMap[2], newTwSpreadWagerDataMap[2], twSpreadHandicap.eq(1), this.isUpdate);
		var twSpreadHighlight = (twSpreadHighlightHome || twSpreadHighlightAway);

		this.eventHtmlHelper.setDraw(eventJson.TmD);
		var spreadHandicap = domElement.find(".spread .pos0" + ".Handicap");
		// check if handicap/total (aka condition) has changed
		var spreadHighlightHome = this.updateHandicap(oldSpreadWagerDataMap[0], newSpreadWagerDataMap[0], spreadHandicap.eq(0), this.isUpdate);
		var spreadHighlightAway = this.updateHandicap(oldSpreadWagerDataMap[2], newSpreadWagerDataMap[2], spreadHandicap.eq(1), this.isUpdate);
		var spreadHighlight = (spreadHighlightHome || spreadHighlightAway);

		// Check if there's a total line
		if (newTwTotalWagerDataMap[0] == "") {
			domElement.find(".twtotal .pos0" + ".ou").addClass("hidden"); // hide over under label
		}
		else {
			domElement.find(".twtotal .pos0" + ".ou").removeClass("hidden"); // show over under label
		}
		var totalHandicap = domElement.find(".twtotal .pos0" + ".Handicap");
		// check if handicap/total (aka condition) has changed
		var totalHighlightOver = this.updateHandicap(oldTwTotalWagerDataMap[0], newTwTotalWagerDataMap[0], totalHandicap.eq(0), this.isUpdate);
		var totalHighlightUnder = this.updateHandicap(oldTwTotalWagerDataMap[2], newTwTotalWagerDataMap[2], totalHandicap.eq(1), this.isUpdate);
		var totalHighlight = (totalHighlightOver || totalHighlightUnder);

		// loop home/away spread or over/under total
		for (var tee = 1; tee <= 3; tee = tee + 2) {

			var oldTwSpreadLink = $(oldTwSpreadWagerDataMap[tee]).attr("href");
			var newTwSpreadLink = $(newTwSpreadWagerDataMap[tee]).attr("href");
			var newTwSpreadPrice = $(newTwSpreadWagerDataMap[tee]);
			var twSpreadPrice = domElement.find(".twspread .pos0" + ".T" + tee);
			this.updateTwPrice(oldTwSpreadLink, newTwSpreadLink, newTwSpreadPrice, twSpreadPrice, twSpreadHighlight, this.isUpdate);

			var oldTotalLink = $(oldTwTotalWagerDataMap[tee]).attr("href");
			var newTotalLink = $(newTwTotalWagerDataMap[tee]).attr("href");
			var newTotalPrice = $(newTwTotalWagerDataMap[tee]);
			var totalPrice = domElement.find(".twtotal .pos0" + ".T" + tee);
			this.updatePrice(oldTotalLink, newTotalLink, newTotalPrice, totalPrice, totalHighlight, this.isUpdate);

			var oldSpreadLink = $(oldSpreadWagerDataMap[tee]).attr("href");
			var newSpreadLink = $(newSpreadWagerDataMap[tee]).attr("href");
			var newSpreadPrice = $(newSpreadWagerDataMap[tee]);
			var spreadPrice = domElement.find(".spread .pos0" + ".T" + tee);
			this.updatePrice(oldSpreadLink, newSpreadLink, newSpreadPrice, spreadPrice, spreadHighlight, this.isUpdate);
		}

		var hasDraw = (eventJson.TmD != "");
		// Update the Moneylines
		for (var tCount = 0; tCount < 3; tCount++) {
			var oldLink = $(oldWagerDataMap[tCount]).attr("href");
			var newLink = $(newWagerDataMap[tCount]).attr("href");
			var newHtml = newWagerDataMap[tCount];
			var updateElement = domElement.find(".moneyline .pos0" + ".T" + tCount);

			this.updateMoneylineLink(oldLink, newLink, newHtml, updateElement, this.isUpdate, hasDraw);
		}
		if (!hasDraw) {
			domElement.find(".moneyline .pos0" + ".T0").addClass("hidden"); // hide draw div
		}
		else {
			domElement.find(".moneyline .pos0" + ".T0").removeClass("hidden"); // show draw div
		}

	}
	// NOT MONEYLINE
	else {
		var positionMax = (this.cssViewType == LINES.enums.cssViewType.Single) ? 4 : 2;
		for (var position = 0; position < positionMax; position++) {
			var doHighlight = false;
			var index = position * 3;

			// check if handicap/total (aka condition) has changed
			if (oldWagerDataMap[index] != newWagerDataMap[index]) {
				var element = domElement.find(".pos" + position + ".Handicap");
				// this is necessary when moving from moneyline to another wager type
				element.removeClass("highlight").removeClass("nochange");
				element.html(newWagerDataMap[index]);
				doHighlight = (this.isUpdate) ? true : false; // highlight when handicap is changed
			}
			// remove highlight
			else {
				var element = domElement.find(".pos" + position + ".Handicap");
				element.removeClass("highlight").addClass("nochange");
			}

			// loop home/away or over/under
			for (var tee = 1; tee <= 2; tee++) {
				var oldLink = $(oldWagerDataMap[index + tee]).attr("href");
				var newLink = $(newWagerDataMap[index + tee]).attr("href");

				var newPrice = $(newWagerDataMap[index + tee]).html();
				// if data is changed OR handicap is changed the change price link
				if (oldLink != newLink || doHighlight) {
					var element = domElement.find(".pos" + position + ".T" + tee);
					element.html(newWagerDataMap[index + tee]);

					if (this.isUpdate && newPrice != "&nbsp;") {
						element.removeClass("nochange").addClass("highlight");
					}
					else if (this.isUpdate && newPrice == "&nbsp;") {
						element.removeClass("highlight").addClass("nochange");
					}
					// remove highlight
					else if (!this.isUpdate && element.hasClass("highlight")) {
						element.removeClass("highlight").addClass("nochange");
					}
				}
				// handicap changed so highlight price OR highlight new game on an update
				else if ((doHighlight && this.exists())
					|| (!this.exists() && this.isUpdate && newPrice != "&nbsp;")) {
					domElement.find(".pos" + position + ".T" + tee).removeClass("nochange").addClass("highlight");
				}
				// remove highlight
				else {
					var element = domElement.find(".pos" + position + ".T" + tee);
					element.removeClass("highlight").addClass("nochange");
				}
			}
		}
	}

	return { "domElements": this.eventHtmlHelper.domElements };
};


LINES.helpers.Event.prototype.updateMoneylineLink = function (oldLink, newLink, newHtml, element, isUpdate, hasDraw) {
	if (oldLink != newLink) {
		element.html(newHtml);
		if (isUpdate) {
			if (!LINES.helpers.Event.isEmptyLink(oldLink) && !LINES.helpers.Event.isEmptyLink(newLink)) {
				var oldPriceLine = LINES.helpers.Event.getPriceLineFromHref(oldLink);
				var newPriceLine = LINES.helpers.Event.getPriceLineFromHref(newLink);
				LINES.helpers.Event.lineChangeDirection(oldPriceLine, newPriceLine, hasDraw);
				if (newPriceLine.direction == LINES.enums.lineChangeDirection.Better) {
					element.addClass("better").removeClass("worse");
				}
				else if (newPriceLine.direction == LINES.enums.lineChangeDirection.Worse) {
					element.addClass("worse").removeClass("better");
				}
			}
			if (!LINES.helpers.Event.isEmptyLink(newLink)) {
				element.removeClass("nochange").addClass("highlight");
			}
			else {
				element.removeClass("highlight").addClass("nochange");
			}
		}
		else {
			element.removeClass("highlight").removeClass("better").removeClass("worse").addClass("nochange");
		}
	}
	else {
		// remove highlight
		element.removeClass("highlight").removeClass("better").removeClass("worse").addClass("nochange");
	}
};


LINES.helpers.Event.prototype.updateHandicap = function (oldHdp, newHdp, handicapElement, isUpdate) {
	var doHighlight = false;
	if (oldHdp != newHdp) {
		// this is necessary when moving from moneyline to another wager type
		handicapElement.removeClass("highlight").removeClass("nochange");
		handicapElement.html(newHdp);
		doHighlight = (isUpdate && (newHdp != "&nbsp;" && $.trim(newHdp) != "")) ? true : false; // highlight when handicap is changed but not if it changed to blank
	}
	// remove highlight
	else {
		handicapElement.removeClass("highlight").addClass("nochange");
	}
	return doHighlight;
};

LINES.helpers.Event.prototype.updateTwHandicap = function (oldHdp, newHdp, handicapElement, isUpdate) {
	var doHighlight = false;
	if (oldHdp != newHdp) {
		// this is necessary when moving from moneyline to another wager type
		handicapElement.removeClass("highlight").removeClass("nochange");
		handicapElement.html(newHdp);
		doHighlight = (isUpdate && (newHdp != "&nbsp;" && $.trim(newHdp) != "")) ? true : false; // highlight when handicap is changed but not if it changed to blank
		if (doHighlight) {
			// For Taiwanese Spread highlight the handicap since it also contains the Percent
			handicapElement.addClass("highlight");
		}
	}
	// remove highlight
	else {
		handicapElement.removeClass("highlight").addClass("nochange");
	}
	return doHighlight;
};

LINES.helpers.Event.prototype.updatePrice = function (oldLink, newLink, newPrice, priceElement, doHighlight, isUpdate) {
	// if data is changed OR handicap is changed then change price link
	if (oldLink != newLink || doHighlight) {
		priceElement.html(newPrice);
		if (isUpdate && (newPrice.html() != "&nbsp;" && $.trim(newPrice.html()) != "")) {
			if (!LINES.helpers.Event.isEmptyLink(oldLink) && !LINES.helpers.Event.isEmptyLink(newLink)) {
				var oldPriceLine = LINES.helpers.Event.getPriceLineFromHref(oldLink);
				var newPriceLine = LINES.helpers.Event.getPriceLineFromHref(newLink);
				LINES.helpers.Event.lineChangeDirection(oldPriceLine, newPriceLine, false);
				if (newPriceLine.direction == LINES.enums.lineChangeDirection.Better) {
					priceElement.addClass("better").removeClass("worse");
				}
				else if (newPriceLine.direction == LINES.enums.lineChangeDirection.Worse) {
					priceElement.addClass("worse").removeClass("better");
				}
			}
			priceElement.removeClass("nochange").addClass("highlight");
		}
		// remove highlight
		else if (!isUpdate) {
			priceElement.removeClass("highlight").removeClass("better").removeClass("worse").addClass("nochange");
		}
		// remove highlight
		else if (newPrice.html() == "&nbsp;" || $.trim(newPrice.html()) == "") {
			priceElement.removeClass("highlight").removeClass("better").removeClass("worse").addClass("nochange");
		}
	}
	// handicap changed so highlight price OR highlight new game on an update
	else if ((doHighlight && this.exists())
		|| (!this.exists() && isUpdate && !LINES.helpers.Event.isEmptyLink(newLink))) {
		priceElement.removeClass("nochange").addClass("highlight");
	}
	// remove highlight
	else {
		priceElement.removeClass("highlight").removeClass("better").removeClass("worse").addClass("nochange");
	}
};

LINES.helpers.Event.prototype.updateTwPrice = function (oldLink, newLink, newPrice, priceElement, doHighlight, isUpdate) {
	// if data is changed OR handicap is changed then change price link
	if (oldLink != newLink || doHighlight) {
		priceElement.html(newPrice);
		if (isUpdate && (newPrice.html() != "&nbsp;" && $.trim(newPrice.html()) != "")) {
			if (!LINES.helpers.Event.isEmptyLink(oldLink) && !LINES.helpers.Event.isEmptyLink(newLink)) {
				var oldPriceLine = LINES.helpers.Event.getPriceLineFromHref(oldLink);
				var newPriceLine = LINES.helpers.Event.getPriceLineFromHref(newLink);
				LINES.helpers.Event.lineChangeDirection(oldPriceLine, newPriceLine, false);
				var oldPercent = parseInt(purl(oldLink).param('bp'));
				var newPercent = parseInt(purl(newLink).param('bp'));
				var percentChange = LINES.enums.lineChangeDirection.NoChange;
				if (oldPercent != newPercent) {
					if (oldPercent < newPercent) {
						percentChange = LINES.enums.lineChangeDirection.Better;
					}
					else {
						percentChange = LINES.enums.lineChangeDirection.Worse;
					}
				}

				if ((newPriceLine.direction == LINES.enums.lineChangeDirection.Better && percentChange == LINES.enums.lineChangeDirection.Better) ||
					(newPriceLine.direction == LINES.enums.lineChangeDirection.NoChange && percentChange == LINES.enums.lineChangeDirection.Better) ||
					(newPriceLine.direction == LINES.enums.lineChangeDirection.Better && percentChange == LINES.enums.lineChangeDirection.NoChange)) {
					priceElement.addClass("better").removeClass("worse");
				}
				else if (newPriceLine.direction == LINES.enums.lineChangeDirection.Worse || percentChange == LINES.enums.lineChangeDirection.Worse) {
					priceElement.addClass("worse").removeClass("better");
				}
			}
			priceElement.removeClass("nochange").addClass("highlight");
		}
		// remove highlight
		else if (!isUpdate) {
			priceElement.removeClass("highlight").removeClass("better").removeClass("worse").addClass("nochange");
		}
		// remove highlight
		else if (newPrice.html() == "&nbsp;" || $.trim(newPrice.html()) == "") {
			priceElement.removeClass("highlight").removeClass("better").removeClass("worse").addClass("nochange");
		}
	}
	// handicap changed so highlight price OR highlight new game on an update
	else if ((doHighlight && this.exists())
		|| (!this.exists() && isUpdate && !LINES.helpers.Event.isEmptyLink(newLink))) {
		priceElement.removeClass("nochange").addClass("highlight");
	}
	// remove highlight
	else {
		priceElement.removeClass("highlight").removeClass("better").removeClass("worse").addClass("nochange");
	}
};






// static methods
LINES.helpers.Event.enhancedInit = function () {
	var linesArea = $("#lines_area");
	// lines binders simple/single
	linesArea.on("click", "td.pos0", function () {
		LINES.helpers.Event.clickPriceDiv(this);
	});
	linesArea.on("click", "td.pos1", function () {
		LINES.helpers.Event.clickPriceDiv(this);
	});
	linesArea.on("click", "td.pos2", function () {
		LINES.helpers.Event.clickPriceDiv(this);
	});
	linesArea.on("click", "td.pos3", function () {
		LINES.helpers.Event.clickPriceDiv(this);
	});

	//double line
	linesArea.on("click", "div.pos0", function () {
		LINES.helpers.Event.clickPriceDiv(this);
	});
	linesArea.on("click", "div.pos1", function () {
		LINES.helpers.Event.clickPriceDiv(this);
	});


	linesArea.on("click dblclick", "a.wLnk", function (event) { event.preventDefault(); });
	linesArea.on('click dblclick', "a.pLnk", function (event) { event.preventDefault(); });
	// alt lines binders
	linesArea.on("click", "td.alt", function () {
		LINES.helpers.selectLeagues.closeHtml(); return LINES.helpers.alternateLines.open(this);
	});
	linesArea.on("click dblclick", "td.alt a", function (event) {
		event.preventDefault();
	});
};

LINES.helpers.Event.getUniqueEventIdPieces = function (uniqueEventId) {
	if (uniqueEventId == undefined || typeof uniqueEventId != 'string') throw "Event.getUniqueEventIdPieces: uniqueEventId is undefined or not a string.";
	var idArray = uniqueEventId.split("_");
	var marketType = idArray[0];
	var eventId = idArray[1];
	var buySellLevel = idArray[2];
	return { "marketType": marketType, "eventId": eventId, "buySellLevel": buySellLevel };
};

LINES.helpers.Event.getUniqueEventId = function (marketType, eventId, buySellLevel) {
	return marketType + "_" + eventId + "_" + buySellLevel;
};

LINES.helpers.Event.updateEventNoChange = function (marketType, eventId, cssViewType) {
	var linePositionMax = 2;
	switch (cssViewType) {
		case LINES.enums.cssViewType.Single:
			linePositionMax = 4;
			break;
		case LINES.enums.cssViewType.Taiwan:
			linePositionMax = 1;
			break;
		default:
			// Already set to default value
			break;
	}

    var id = marketType + "_" + eventId;

	// only if we did not previously mark this event as no change
    if (LINES.state.nochangeStore.hasId(marketType, id)) {
        return;
    }

    var rowId = "." + id + "-Row";
    var eventDOM = $(rowId).get();
    if (!$(eventDOM).exists()) {
        return;
    }
    
    $.each(eventDOM, function (index, currentEvent) {
        var eventElement = $(currentEvent);

        eventElement.children(":first").removeClass("highlight");
        for (var linePosition = 0; linePosition < linePositionMax; linePosition++) {
            
            var priceElement = eventElement.find(".pos" + linePosition + ".T1");
            priceElement.removeClass("highlight").addClass("nochange");
            priceElement = eventElement.find(".pos" + linePosition + ".T2");
            priceElement.removeClass("highlight").addClass("nochange");

            if (cssViewType != LINES.enums.cssViewType.Double && cssViewType != LINES.enums.cssViewType.Taiwan) {
                continue;
            }
            
            priceElement = eventElement.find(".pos" + linePosition + ".T0");
            priceElement.removeClass("highlight").addClass("nochange");

            priceElement = eventElement.find(".pos" + linePosition + ".T3");
            priceElement.removeClass("highlight").addClass("nochange");
        }

        if (cssViewType != LINES.enums.cssViewType.Moneyline) {
            return;
        }

        // handle case where Moneyline Home is shown where normally the Handicap is shown
        var moneyline = eventElement.find(".pos0.Handicap");
        if (moneyline.find('a').exists()) {
            moneyline.removeClass("highlight").addClass("nochange");
        }
        moneyline = eventElement.find(".pos1.Handicap");
        if (moneyline.find('a').exists()) {
            moneyline.removeClass("highlight").addClass("nochange");
        }
    });

    // store in state that this eventId was set to no change
    //  so we dont have to do DOM operations for each consecutive no change
    LINES.state.nochangeStore.add(marketType, marketType + "_" + eventId);
};

LINES.helpers.Event.clickPriceDiv = function (div) {
	try {
		var anchor = $(div).find('a');
		if ($(anchor).exists()) {
			if ($(anchor).hasClass("pLnk")) {
				LINES.helpers.tabs.selectTab(LINES.enums.tab.Ticket);
				PSPARLAYTICKET.addLeg($(anchor).attr("href"));
			    LINES.utils.dropParameterFromHashTag('line');
				return false;
			}

			var href = $(anchor).attr("href");
			if (href != undefined) {
				var lastChar = href.substr(href.length - 1, 1);
				if (href != "" && href != "#" && lastChar != "#") {
					if($("#parlayTicketContainer").html() != '') {
					    PSPARLAYTICKET.clear();
					}; 
					//$("#ticketWagers").removeClass('hidden');
				    //$("#emptyBetTicket").addClass('hidden');
					LINES.state.lastClickedLink = $(anchor).attr("href");
					LINES.helpers.tabs.selectTab(LINES.enums.tab.Ticket);
					if (!$("#ticketWagers").hasClass("hidden")) {
					    LINES.utils.hideLoadingDiv("emptyBetTicket");
					    LINES.utils.showLoadingDiv($("#ticketWagers"), "medium", "center", true);
					} else {
					    LINES.utils.hideLoadingDiv("ticketWagers");
					    LINES.utils.showLoadingDiv($("#emptyBetTicket"), "medium", "center", true);
					}
					
					LINES.helpers.betTicket.addToTicket($(anchor).attr("href"));
				}
			}
		}
		return false;
	}
	catch (err) {
		LINES.utils.hideLoadingDiv("ticketWagers");
		LINES.logError(err);
		return true;
	}
};

LINES.helpers.Event.isEmptyLink = function (href) {
	return (href == undefined || href.substr(href.length - 1, 1) == "#") ? true : false;
};

LINES.helpers.Event.getPriceLineFromHref = function (href) {
	//https://members.pinnaclesports.com/Sportsbook/Bet/Add/383880552/0/0/0/-1/2.3?line=-0.75
	//https://members.pinnaclesports.com/Sportsbook/ParlayTicket/AddLeg/383880552/0/0/0/-1/2.28?line=-0.75
	var parseToken = "Bet/Add/";
	var indexBetAdd = href.indexOf(parseToken);

	if (indexBetAdd == -1) {
		parseToken = "ParlayTicket/AddLeg/";
		indexBetAdd = href.indexOf(parseToken);
	}

	href = href.substr(indexBetAdd + parseToken.length);
	var pieces = href.split("/");
	// {EventId}/{PeriodNumber}/{Pick}/{BetType}/{BuySellLevel}/{Price}
	var line;
	var priceIndex = 5;

	if (pieces[priceIndex].indexOf("&") > 0) {
		line = pieces[priceIndex].substring(pieces[priceIndex].indexOf("line=") + 5, pieces[priceIndex].indexOf("&"));
	} else {
		line = pieces[priceIndex].substr(pieces[priceIndex].indexOf("line=") + 5);
	}
	var price = pieces[priceIndex].substr(0, pieces[priceIndex].indexOf("?"));
	var lineType = pieces[priceIndex - 2];
	var priceDto = new LINES.dto.PriceLine(line, price, lineType);

	return priceDto;
};

LINES.helpers.Event.lineChangeDirection = function (oldPriceLine, newPriceLine, hasDraw) {
	var direction = LINES.enums.lineChangeDirection.NoChange;
	var numericAdjustment = 1;
	// malay odds format needs to be multiplied by -1 to get the correct line direction.
	// 3-way moneylines are sent in decimal format so do not multiply by -1 in that case
	if (LINES.state.oddsFormat == LINES.enums.oddsFormat.Malay && !(newPriceLine.lineType == LINES.enums.lineType.Moneyline && hasDraw)) {
		if (!(oldPriceLine.price < 0 && newPriceLine.price < 0) && !(oldPriceLine.price > 0 && newPriceLine.price > 0)) {
			numericAdjustment = -1;	
		}
	}

	var oldPrice = oldPriceLine.price * numericAdjustment;
	var newPrice = newPriceLine.price * numericAdjustment;
	if (newPriceLine.lineType == LINES.enums.lineType.Moneyline) {
		if (oldPrice != newPrice) {
			if (oldPrice < newPrice) {
				direction = LINES.enums.lineChangeDirection.Better;
			}
			else if (oldPrice > newPrice) {
				direction = LINES.enums.lineChangeDirection.Worse;
			}
			else {
				direction = LINES.enums.lineChangeDirection.Highlight;
			}
		}
	}
	else if (oldPriceLine.line == newPriceLine.line) {
		if (oldPrice < newPrice) {
			direction = LINES.enums.lineChangeDirection.Better;
		}
		else if (oldPrice > newPrice) {
			direction = LINES.enums.lineChangeDirection.Worse;
		}
	}
	else {
		direction = LINES.enums.lineChangeDirection.Highlight;
	}

	newPriceLine.direction = direction;
	return newPriceLine;
};

LINES.helpers.EventHtml = function (sportId, leagueId, uniqueEventId, isNewLeague, sportName, cssViewType) {
	//this.eventStore = LINES.state.eventStore;
	this.template = LINES.state.template;
	this.sportId = sportId;
	this.sportName = sportName;
	this.leagueId = leagueId;
	this.cssViewType = cssViewType;
	this.isNewLeague = isNewLeague;
	this.uniqueEventId = uniqueEventId;
	var idPieces = LINES.helpers.Event.getUniqueEventIdPieces(uniqueEventId);
	this.marketType = idPieces.marketType;
	this.changeStatus;
	this.buySellLevel = idPieces.buySellLevel;

	this.domElements = {
		rows: {},
		isAttachedToDOM: false
	};
	var eventHtmlHelper = this;

	// if the uniqueEventId for this LINES.helpers.EventHtml exists in the global event store
	// then return that object to save time
	//var cachedEvent = this.eventStore[uniqueEventId];
	//if (cachedEvent != undefined) {
	//	cachedEvent.isNewLeague = false;
	//	return cachedEvent;
	//}


	this.eventToHtml = function () {
		var rows;
		if (this.cssViewType == LINES.enums.cssViewType.Single) {
			if (this.template.singleEventRows != undefined) {
				rows = this.template.singleEventRows;
			} 
			else {
				// template is output with no ids, use classes instead.
				var leagueTable = $("#templateDiv").find('.sportContainer .MarketContainer .LeagueContainer').clone();
				var rowsTemp = leagueTable.find('tr:gt(0)');

				var teamId = rowsTemp.find('.teamId');
				if (teamId != undefined && teamId.html() != undefined) {
					teamId.html(teamId.html().replace('-vs-', '<br/>'));
				}

			    var handicap = $(rowsTemp.find(".pos0.Handicap").first().clone()).removeClass("pos0").addClass("pos2");
				var team1 = $(rowsTemp.find(".pos0.T1").first().clone()).removeClass("pos0").addClass("pos2");
				var team2 = $(rowsTemp.find(".pos0.T2").first().clone()).removeClass("pos0").addClass("pos2");
				rowsTemp.find(".alt").before(handicap);
				rowsTemp.find(".alt").before(team1);
				rowsTemp.find(".alt").before(team2);

				handicap = $(rowsTemp.find(".pos1.Handicap").first().clone()).removeClass("pos1").addClass("pos3");
				team1 = $(rowsTemp.find(".pos1.T1").first().clone()).removeClass("pos1").addClass("pos3");
				team2 = $(rowsTemp.find(".pos1.T2").first().clone()).removeClass("pos1").addClass("pos3");
				rowsTemp.find(".alt").before(handicap);
				rowsTemp.find(".alt").before(team1);
				rowsTemp.find(".alt").before(team2);

				rows = rowsTemp.get();
				this.template.singleEventRows = rows;
			}
		} 
		else if (this.cssViewType == LINES.enums.cssViewType.Moneyline) {
			if (this.template.moneylineEventRows != undefined) {
				rows = this.template.moneylineEventRows;
			} 
			else {
				// template is output with no ids, use classes instead.
				var leagueTable = $("#templateDiv").find('.sportContainer .MarketContainer .LeagueContainer').clone();
				var rowsTemp = leagueTable.find('tr:gt(0)');
				rowsTemp.find(".pos1.Handicap").html(LINES.helpers.EventHtml.emptyLink());
				rowsTemp.find(".pos1.T1").html(LINES.helpers.EventHtml.emptyLink());
				rowsTemp.find(".pos1.T2").html(LINES.helpers.EventHtml.emptyLink());
				rows = rowsTemp.get();
				this.template.moneylineEventRows = rows;
			}
		} 
		else if (this.cssViewType == LINES.enums.cssViewType.Double) {
			if (this.template.doubleEventRows != undefined) {
				rows = this.template.doubleEventRows;
			} 
			else {
				// template is output with no ids, use classes instead.
				rows = $("#doubleLineTemplate").clone().find('tr').get();
				this.template.doubleEventRows = rows;
			}
		}
		else if (this.cssViewType == LINES.enums.cssViewType.Taiwan) {
			if (this.template.taiwanEventRows != undefined) {
				rows = this.template.taiwanEventRows;
			}
			else {
				// template is output with no ids, use classes instead.
				rows = $("#taiwanLineTemplate").clone().find('tr').get();
				this.template.taiwanEventRows = rows;
			}
		} 
		else {
			if (this.template.eventRows != undefined) {
				rows = this.template.eventRows;
			} 
			else {
				// template is output with no ids, use classes instead.
				var leagueTable = $("#templateDiv").find('.sportContainer .MarketContainer .LeagueContainer').clone();
				rows = leagueTable.find('tr:gt(0)').get();
				this.template.eventRows = rows;
			}
		}


		var rowCloneArray = [];
		var resultArray = [];
		// change the id of the row and divs
		rowCloneArray[0] = $($(rows[0]).clone());
		var idPieces = LINES.helpers.Event.getUniqueEventIdPieces(this.uniqueEventId);
		rowCloneArray[0].attr("id", this.uniqueEventId).addClass(idPieces.marketType + "_" + idPieces.eventId + "-Row");
		resultArray.push(rowCloneArray[0].get());

		return $(resultArray);
	};


	var initEvent = function () {
		var elements = [];

		var row = $("#" + eventHtmlHelper.uniqueEventId);
		if (row.length < 1) {
			elements = eventHtmlHelper.eventToHtml();
		} else {
			elements.push(row.get());
			elements = $(elements);
		}

		// cache events
		//eventHtmlHelper.eventStore[eventHtmlHelper.uniqueEventId] = eventHtmlHelper;

		return elements;
	} ();

	this.domElements.isAttachedToDOM = $("#" + eventHtmlHelper.uniqueEventId).exists();
	// make each DOM element a jQuery object here, so we don't have to keep initializing jQuery objects for them later
	for (var elemCounter = 0; elemCounter < initEvent.length; elemCounter++) {
		// isAttachedToDOM is only used by Simple View
		this.domElements.rows[elemCounter] = { domElement: $(initEvent[elemCounter]) };
	}
};


// object methods
LINES.helpers.EventHtml.prototype.exists = function () {
	return LINES.helpers.EventHtml.doesEventExist(this.uniqueEventId);
};

LINES.helpers.EventHtml.prototype.setStartTime = function (startTime, hiddenStartTime) {
	if (startTime != null && startTime != "") {
		this.domElements.rows[0].domElement.find(".sTime").html(startTime);
		this.domElements.rows[0].domElement.find(".hTime").html(hiddenStartTime);
	}
	return this;
};

LINES.helpers.EventHtml.prototype.highlightScoreChange = function (scoreWithLabel) {
	/// This should be called before any functions/methods that modify the score
	/// because it needs to check the existing score in order to see if it has 
	/// changed
	if (scoreWithLabel != null && scoreWithLabel != "" && this.marketType == "Live") {
		var newScoreLine = scoreWithLabel.substr(scoreWithLabel.indexOf(">")).replace("&#8209;", "");
		newScoreLine = newScoreLine.replace("‑", "");
		var oldScoreLine = this.domElements.rows[0].domElement.find(".sTime").html();
		if (oldScoreLine != undefined) {
			oldScoreLine = oldScoreLine.substr(oldScoreLine.indexOf(">")).replace("&#8209;", "");
			oldScoreLine = oldScoreLine.replace("‑", "");
			if (oldScoreLine != "" && newScoreLine != "" && oldScoreLine != newScoreLine) {
				this.domElements.rows[0].domElement.children(":first").addClass("highlight");
			} else if (oldScoreLine != "") {
				this.domElements.rows[0].domElement.children(":first").removeClass("highlight");
			}
		}
	}
	return this;
};

LINES.helpers.EventHtml.prototype.getStartTime = function () {
	return this.domElements.rows[0].domElement.find(".hTime").html();
};

LINES.helpers.EventHtml.prototype.setTeams = function (teamHome, teamAway) {
	///	<summary>
	///	set team names and favorite indication
	///	</summary>
	///	<returns type="LINES.helpers.EventHtml" />
	///	<param name="teamHome" type="Object">
	///		.Fc .Txt .Ex
	///	</param>
	///	<param name="teamAway" type="Object">
	///		.Fc .Txt .Ex
	///	</param>

	for (var side in LINES.enums.homeAway) {
		var team = (side == LINES.enums.homeAway.Home) ? teamHome : teamAway;
		var newTeamExtraStr;
	    if (team.Pd != '') {
	        team.Pd = ' (' + team.Pd + ')';}
		var newTeamTitleStr = team.Txt + team.Pd;
		if (team.Ex == null || team.Ex == "") {
			newTeamExtraStr = "";
		}
		else if (team.Ex == "1") {
			newTeamExtraStr = " <span class='extra1'></span>";
		}
		else if (!isNaN(team.Ex)) {
			newTeamExtraStr = " <span class='extra2'></span>";
		}
		else {
			newTeamExtraStr = " " + team.Ex;
			newTeamTitleStr += " " + team.Ex;
		}
		var newTeamStr = team.Txt + team.Pd + newTeamExtraStr;
		var oldTeamStr = this.getTeamId(side);
		var element = this.domElements.rows[0].domElement.find(".teamId ." + side);
		if (newTeamStr != oldTeamStr) {
			element.html(newTeamStr);
			element.attr("title", newTeamTitleStr);
		}

		if (team.Fc == "fav") {
			// we dont have the class so add it
			if (!element.hasClass("fav")) {
				element.addClass("fav");
			}
		}
		else if (team.Fc == "") {
			// we have the class so remove it
			if (element.hasClass("fav")) {
				element.removeClass("fav");
			}
		}
	}

	return this;
};

LINES.helpers.EventHtml.prototype.setDraw = function (teamDraw) {
	///	<summary>
	///	set Draw for Double line row
	///	</summary>
	///	<returns type="LINES.helpers.EventHtml" />
	///	<param name="teamDraw" type="string"></param>

	var drawElement = this.domElements.rows[0].domElement.find(".teamId .Draw");
	if (teamDraw != "") {
		drawElement.html(teamDraw).removeClass("hidden");
	}
	else {
		drawElement.addClass("hidden");
	}
	return this;
};

LINES.helpers.EventHtml.prototype.getTeamId = function (teamFlag) {
	var teamId = this.domElements.rows[0].domElement.find(".teamId ." + teamFlag).html();
	return teamId;
};

LINES.helpers.EventHtml.prototype.htmlArrayBuilder = function (domElement) {

    if (domElement == undefined) {
        domElement = this.domElements.rows[0].domElement;
    }

    return (function (e) {
        var result = [];
        var that = this;
        this.domElement = e;
        this.add = function() {
            $.each(arguments, function(_, selector) {
                result.push(that.domElement.find(selector).html());
            });

            return that;
        };

        this.result = function() {
            return result;
        };

        return this;
    })(domElement);
},

LINES.helpers.EventHtml.prototype.getWagerDataMap = function () {

    var builder = this.htmlArrayBuilder();

	if (this.cssViewType == LINES.enums.cssViewType.Double) {
	    builder.add(".moneyline .pos0.Draw",
	        ".moneyline .pos0.Home",
	        ".moneyline .pos0.Away",
	        ".moneyline .pos1.Draw",
	        ".moneyline .pos1.Home",
	        ".moneyline .pos1.Away");
	}
	else if (this.cssViewType == LINES.enums.cssViewType.Taiwan) {
	    builder.add(".moneyline .pos0.Draw",
	        ".moneyline .pos0.Home",
	        ".moneyline .pos0.Away");
	}
	else {
	    builder.add(".pos0.Handicap",
	        ".pos0.Home", 
	        ".pos0.Away", 
	        ".pos1.Handicap",
	        ".pos1.Over",
	        ".pos1.Under");
	    
		if (this.cssViewType == LINES.enums.cssViewType.Single) {
		    builder.add(".pos2.Handicap",
		        ".pos2.Home",
		        ".pos2.Away",
		        ".pos3.Handicap",
		        ".pos3.Over",
		        ".pos3.Under");
		}
	}
	return builder.result();
};

LINES.helpers.EventHtml.prototype.getSpreadWagerDataMap = function () {
    var builder = this.htmlArrayBuilder();
    
    builder.add(".spread .pos0.T0", 
        ".spread .pos0.T1",
        ".spread .pos0.T2",
        ".spread .pos0.T3");
    
	if (this.cssViewType == LINES.enums.cssViewType.Double) {
	    builder.add(".spread .pos1.T0",
	        ".spread .pos1.T1",
	        ".spread .pos1.T2",
	        ".spread .pos1.T3");
	}
    
	return builder.result();
};

LINES.helpers.EventHtml.prototype.getTotalWagerDataMap = function () {
    
    var builder = this.htmlArrayBuilder();

    builder.add(".total .pos0.Handicap",
        ".total .pos0.Over",
        ".total .pos0.Under",
        ".total .pos1.Handicap",
        ".total .pos1.Over",
        ".total .pos1.Under");
    
	return builder.result();
};

LINES.helpers.EventHtml.prototype.getTwSpreadWagerDataMap = function () {
    
    var builder = this.htmlArrayBuilder();

    builder.add(".twspread .pos0.T0",
        ".twspread .pos0.T1",
        ".twspread .pos0.T2",
        ".twspread .pos0.T3");
    
	return builder.result();
};

LINES.helpers.EventHtml.prototype.getTwTotalWagerDataMap = function () {
    
    var builder = this.htmlArrayBuilder();

    builder.add(".twtotal .pos0.Handicap.T0",
        ".twtotal .pos0.Over",
        ".twtotal .pos0.Handicap.T2",
        ".twtotal .pos0.Under");
    
	return builder.result();
};

/*
LINES.helpers.EventHtml.prototype.getWagerDataMap = function () {
	var result = [];
	var domElement = this.domElements.rows[0].domElement;
	if (this.cssViewType == LINES.enums.cssViewType.Double) {
		result.push(domElement.find(".moneyline .pos0.Draw").html());
		result.push(domElement.find(".moneyline .pos0.Home").html());
		result.push(domElement.find(".moneyline .pos0.Away").html());
		result.push(domElement.find(".moneyline .pos1.Draw").html());
		result.push(domElement.find(".moneyline .pos1.Home").html());
		result.push(domElement.find(".moneyline .pos1.Away").html());
	}
	else if (this.cssViewType == LINES.enums.cssViewType.Taiwan) {
		result.push(domElement.find(".moneyline .pos0.Draw").html());
		result.push(domElement.find(".moneyline .pos0.Home").html());
		result.push(domElement.find(".moneyline .pos0.Away").html());
	}
	else {
		result.push(domElement.find(".pos0.Handicap").html());
		result.push(domElement.find(".pos0.Home").html());
		result.push(domElement.find(".pos0.Away").html());
		result.push(domElement.find(".pos1.Handicap").html());
		result.push(domElement.find(".pos1.Over").html());
		result.push(domElement.find(".pos1.Under").html());
		if (this.cssViewType == LINES.enums.cssViewType.Single) {
			result.push(domElement.find(".pos2.Handicap").html());
			result.push(domElement.find(".pos2.Home").html());
			result.push(domElement.find(".pos2.Away").html());
			result.push(domElement.find(".pos3.Handicap").html());
			result.push(domElement.find(".pos3.Over").html());
			result.push(domElement.find(".pos3.Under").html());
		}
	}
	return result;
};

LINES.helpers.EventHtml.prototype.getSpreadWagerDataMap = function () {
	var result = [];
	var domElement = this.domElements.rows[0].domElement;
	result.push(domElement.find(".spread .pos0.T0").html());
	result.push(domElement.find(".spread .pos0.T1").html());
	result.push(domElement.find(".spread .pos0.T2").html());
	result.push(domElement.find(".spread .pos0.T3").html());
	if (this.cssViewType == LINES.enums.cssViewType.Double) {
		result.push(domElement.find(".spread .pos1.T0").html());
		result.push(domElement.find(".spread .pos1.T1").html());
		result.push(domElement.find(".spread .pos1.T2").html());
		result.push(domElement.find(".spread .pos1.T3").html());
	}
	return result;
};

LINES.helpers.EventHtml.prototype.getTotalWagerDataMap = function () {
	var result = [];
	var domElement = this.domElements.rows[0].domElement;
	result.push(domElement.find(".total .pos0.Handicap").html());
	result.push(domElement.find(".total .pos0.Over").html());
	result.push(domElement.find(".total .pos0.Under").html());
	result.push(domElement.find(".total .pos1.Handicap").html());
	result.push(domElement.find(".total .pos1.Over").html());
	result.push(domElement.find(".total .pos1.Under").html());
	return result;
};

LINES.helpers.EventHtml.prototype.getTwSpreadWagerDataMap = function () {
	var result = [];
	var domElement = this.domElements.rows[0].domElement;
	result.push(domElement.find(".twspread .pos0.T0").html());
	result.push(domElement.find(".twspread .pos0.T1").html());
	result.push(domElement.find(".twspread .pos0.T2").html());
	result.push(domElement.find(".twspread .pos0.T3").html());
	return result;
};

LINES.helpers.EventHtml.prototype.getTwTotalWagerDataMap = function () {
	var result = [];
	var domElement = this.domElements.rows[0].domElement;
	result.push(domElement.find(".twtotal .pos0.Handicap.T0").html());
	result.push(domElement.find(".twtotal .pos0.Over").html());
	result.push(domElement.find(".twtotal .pos0.Handicap.T2").html());
	result.push(domElement.find(".twtotal .pos0.Under").html());
	return result;
};

*/

LINES.helpers.EventHtml.prototype.setAlternateLineNumber = function (link) {
	$.each(this.domElements.rows, function (index, row) {
		row.domElement.find(".alt").html(link);
	});

	return this;
};

LINES.helpers.EventHtml.prototype.setRotationNumber = function (rotationNumber) {
	var oldRotationNumber = this.getRotationNumber();
	if (rotationNumber != oldRotationNumber) {
		this.domElements.rows[0].domElement.find(".rot").html(rotationNumber);
	}
	return this;
};

LINES.helpers.EventHtml.prototype.getRotationNumber = function () {
	return this.domElements.rows[0].domElement.find(".rot").html();
};






// static methods
LINES.helpers.EventHtml.doesEventExist = function (uniqueEventId) {
	if (document.getElementById(uniqueEventId)) {
		return true;
	}
	return false;
};

LINES.helpers.EventHtml.removeEvent = function (uniqueEventId) {
	$("#" + uniqueEventId).remove();
	//delete LINES.state.eventStore[uniqueEventId];
	var idPieces = LINES.helpers.Event.getUniqueEventIdPieces(uniqueEventId);
	LINES.state.nochangeStore.remove(idPieces.marketType, idPieces.marketType + "_" + idPieces.eventId);
};

LINES.helpers.EventHtml.emptyLink = function () {
	return "<a href=\"#\" class=\"wLnk\">&nbsp;</a>";
};
﻿/// <reference path="~/Scripts/docs/JSLINQ-vsdoc.js" />
/// <reference path="~/Scripts/docs/jquery-1.7.1-vsdoc.js" />

LINES.helpers.footerlinks = {
	refreshTimeout: 120,
	enhancedInit: function () {
		$(".footerLink, .footerLogoLicenseLink").on('click', function () {
			return betterpopup(this, null, 'width=985,height=580,scrollbars=yes');
		});
	}
}

﻿/// <reference path="~/Scripts/docs/jquery-1.7.1-vsdoc.js" />

LINES.helpers.fullBetList = {
	//static methods
	enhancedInit: function () {
		$("#linkFullBetList").click(function () { LINES.helpers.fullBetList.open(); return false; });
		var fullBetList = $("#FullBetList");
		fullBetList.on('click', ".close", function () { LINES.helpers.fullBetList.close(); return false; });
		fullBetList.on('click', ".refresh", function () { LINES.helpers.fullBetList.buildHashUrl(); return false; });
		fullBetList.on('click', '.betListFilter', function (event) { LINES.helpers.fullBetList.filter(this, event); return false; });
		fullBetList.on('click', ".buttonsContainer a", function () { LINES.helpers.statement.open(); return false; });
		$(document).on('mousemove', '#ui-datepicker-div.ui-weekpicker .ui-datepicker-calendar tr', function () { $(this).find('td a').addClass('ui-state-hover'); });
		$(document).on('mouseleave', '#ui-datepicker-div.ui-weekpicker .ui-datepicker-calendar tr', function () { $(this).find('td a').removeClass('ui-state-hover'); });
		$(document).on('click', '#ui-datepicker-div.ui-monthpicker .ui-datepicker-month', function () { LINES.helpers.fullBetList.selectMonth(); return false; });
		$(document).on('click', '#ui-datepicker-div.ui-monthpicker .ui-datepicker-year', function () { LINES.helpers.fullBetList.selectMonth(); return false; });
		if (LINES.state.culture != "en-US" && !($.datepicker.regional[LINES.state.culture])) {
			$LAB.script(cdnRoot + "Static/Scripts/localization/jquery.ui.datepicker-" + LINES.state.culture + ".js").wait();
		}

		$('#FullBetList').on('click', ".retry", function () {
			LINES.helpers.fullBetList.refresh();
			return false;
		});

		var fullBetListUrl = LINES.utils.getParameterByName("fullBetList", window.location.hash);

	    if (!fullBetListUrl) {
	        return;
	    }
	    
	    LINES.helpers.fullBetList.open(fullBetListUrl);
	},

	isOpen: function () {
		return !($('#FullBetList').hasClass('hidden'));
	},

	open: function (theUrl, filterId) {
	    LINES.state.enableInfiniteScroll = false;
		//close popups
		LINES.utils.popups.closeAllExcept("fullBetList");

	    LINES.utils.hideLines();

		// show full bet list
		$('#FullBetList').removeClass('hidden');

		if (theUrl == undefined) {
			theUrl = LINES.config.virtualDirectory + "Asia/BetList/GetFull/" + LINES.enums.betListDuration.Running + "?customerId=" + LINES.state.customerId;
		}
	    
		//refresh
		LINES.helpers.fullBetList.refresh(theUrl, filterId);
	},

	// filterId exists when called from Statement otherwise it's undefined
	refresh: function (theUrl, filterId) {
		var showBackToStatement = false;
		var fullBetList = $('#FullBetList');
		var partialView;

		if (!fullBetList.find(".partialbox").exists()) {
		    fullBetList.addClass("partialOuterBorder");
		    LINES.utils.showLoadingDiv(fullBetList, "medium");
		} else {
		    fullBetList.removeClass("partialOuterBorder");
		    LINES.utils.showLoadingDiv(fullBetList.find('.content'), "medium");
		}
		
		if (filterId == undefined) {
			filterId = $('#betListFilter').val();
			if (filterId == undefined) {
				if (theUrl != null && theUrl != "") {
					var urlPieces = theUrl.split("/");
					for (var i = 0; i < urlPieces.length; i++) {
					    if (urlPieces[i] != "GetFull" || urlPieces[i + 1] == undefined) {
					        continue;
					    }
					    var morePieces = urlPieces[i + 1].split("?");
					    filterId = morePieces.length > 1 ? morePieces[0] : urlPieces[i + 1];
					    break;
					}
				} else {
					filterId = LINES.enums.betListDuration.Running;
				}
			}
		} else {
			showBackToStatement = true;
		}
		
		// set parameters for post
		var postData = "test=test"; // workaround for browser bug, post cannot be empty
		if (showBackToStatement == false && $('#betListChosenDate').exists() &&
			(filterId == LINES.enums.betListDuration.ByDay || filterId == LINES.enums.betListDuration.ByWeek || filterId == LINES.enums.betListDuration.ByMonth)) {
			postData += "&date=" + $('#betListChosenDate').val();
		}
		if (!fullBetList.find(".partialbox").exists()) {
			var includeTemplate = true;
			postData += "&includeTemplate=true";
		}

		if (includeTemplate) {
			partialView = fullBetList;
		} else {
			partialView = fullBetList.find(".content");
			fullBetList.find('.betListFilter').removeClass("selected");
			$('#betListFilter' + filterId).addClass("selected");
		}

	    if (theUrl == null || theUrl == "") {
	        theUrl = LINES.config.virtualDirectory + "Asia/BetList/GetFull/" + filterId + "?customerId=" + LINES.state.customerId;
	    }
	    
	    LINES.utils.removeAllHashtags();
		LINES.utils.addParameterToHashTag("fullBetList", theUrl);

		//START: Action StopWatch
		var actionTimer = new LINES.stopWatch2();
		actionTimer.startstop();

		$.ajax({
			type: "POST",
			url: theUrl,
			data: postData,
			dataType: 'text'
		}).done(function (result) {
		    //STOP: Action StopWatch & Log
		    actionTimer.startstop();
		    LINES.utils.logNetworkCall(actionTimer.Getms(), theUrl, false);

		    fullBetList.removeClass("partialOuterBorder");// remove border from #Fullbetlist
		    LINES.utils.hideLoadingDiv();

		    partialView.html(result);
		    $('#betListFilter').val(filterId);
		    fullBetList.find('.betListFilter').removeClass("selected");
		    $('#betListFilter' + filterId).addClass("selected");
		    fullBetList.find('.refresh').attr('href', theUrl);
		    if (showBackToStatement) {
		        $('.buttonsContainer').removeClass('hidden');
		    }
		}).fail(function (xhr, textStatus, thrownError) {
		    //STOP: Action StopWatch & Log
		    actionTimer.startstop();
		    LINES.utils.logNetworkCall(actionTimer.Getms(), theUrl, true);

		    fullBetList.removeClass("partialOuterBorder");// remove border from #Fullbetlist
		    LINES.utils.hideLoadingDiv();

		    partialView.html($('#errorMessageSlim').html());
		    if (thrownError == undefined) thrownError = "";
		    LINES.logError(xhr.status + " " + textStatus + " " + xhr.statusText + " " + thrownError + " " + this.url, true, xhr.status);
		});
	},

	clickFromStatement: function (theUrl, filterId) {
		LINES.helpers.fullBetList.open(theUrl, filterId);
	},

	filter: function (obj, event, theUrl) {
		var clickedLink = $(obj);
		var fullBetList = $('#FullBetList');
		var filterId = $(obj).attr("id").substr(13);
		var href = $(obj).attr("href");
		fullBetList.find('.refresh').attr('href', href);
		fullBetList.find('#betListFilter').val(filterId);

		if (filterId == LINES.enums.betListDuration.ByDay || filterId == LINES.enums.betListDuration.ByWeek || filterId == LINES.enums.betListDuration.ByMonth) {
			var areaPosition = clickedLink.position();
			var positionLeft = areaPosition.left;
			var positionTop = areaPosition.top;
			var datePickerDiv = $('#betListDatePickerDiv');
			var datePickerForm = $('#betListDatePickerForm');
			var chosenDate = $('#betListChosenDate');
			if (chosenDate.hasClass("hasDatepicker")) {
				chosenDate.datepicker("destroy"); // ensure only 1 date picker is attached
			}
			datePickerForm.attr('action', href);
			datePickerDiv.css({ top: positionTop, left: positionLeft });
			if (chosenDate.val() == "") {
				var today = new Date();
				var theDate = LINES.helpers.fullBetList.formatDate(today.getFullYear(), (today.getMonth() + 1), today.getDate());
				chosenDate.val(theDate);
			}
			datePickerDiv.removeClass("hidden"); // show the div so the date picker can get it's location

			// add Date Picker functionality because the html is regenerated with every load
			chosenDate.datepicker({
				dateFormat: 'yy-m-d',
				showOtherMonths: true,
				selectOtherMonths: true,
				onSelect: function (dateText, inst) {
					LINES.helpers.fullBetList.selectDate(dateText, filterId);
				}
			});
			chosenDate.focus();
			datePickerDiv.addClass("hidden"); // hide the div again so you can't use the text input
			var uiDatePicker = $('#ui-datepicker-div');
			uiDatePicker.removeClass('ui-weekpicker').removeClass('ui-monthpicker');
			if (filterId == LINES.enums.betListDuration.ByWeek) {
				uiDatePicker.addClass('ui-weekpicker');
			}
			else if (filterId == LINES.enums.betListDuration.ByMonth) {
				uiDatePicker.addClass('ui-monthpicker');
			}

		    return;
		}
		
		if (theUrl == null || theUrl == "") {
		    theUrl = LINES.config.virtualDirectory + "Asia/BetList/GetFull/" + filterId + "?customerId=" + LINES.state.customerId;
		}
		LINES.helpers.fullBetList.refresh(theUrl);
	},

	selectMonth: function () {
		var uiDatePickerMonthName = $('#ui-datepicker-div .ui-datepicker-month');
		var uiDatePickerYear = $('#ui-datepicker-div .ui-datepicker-year');
		var cultureCode = "";
		if (LINES.state.culture != "en-US") {
			cultureCode = LINES.state.culture;
		}
		var selectedDate = LINES.helpers.fullBetList.formatDate(uiDatePickerYear.text(), $.inArray(uiDatePickerMonthName.text(), $.datepicker.regional[cultureCode].monthNames) + 1, 1);
		$('#betListChosenDate').datepicker("hide");
		LINES.helpers.fullBetList.selectDate(selectedDate, LINES.enums.betListDuration.ByMonth);
	},
	selectDate: function (dateText, filterId) {
		var chosenDate = $('#betListChosenDate');
		chosenDate.val(dateText);
		var theUrl = LINES.config.virtualDirectory + "Asia/BetList/GetFull/" + filterId + "/" + dateText + "?customerId=" + LINES.state.customerId;
		LINES.helpers.fullBetList.refresh(theUrl);
	},

	buildHashUrl: function () {
		var fullBetListUrl = LINES.utils.getParameterByName("fullBetList", window.location.hash);
		LINES.helpers.fullBetList.refresh(fullBetListUrl);
	},

	closeHtml: function () {
		LINES.utils.dropParameterFromHashTag("fullBetList");

		var betList = $('#FullBetList');
		betList.addClass('hidden');
		betList.find('content').html('<div class="noresults"></div>');
		betList.find('.buttonsContainer').addClass("hidden");
		LINES.utils.hideLoadingDiv();
	},

	close: function () {
	    LINES.state.enableInfiniteScroll = true;
		var href = $('#FullBetList').find('.close').attr('href');
		LINES.helpers.fullBetList.closeHtml();
	    LINES.utils.showLines();

		$.ajax({
			type: "POST",
			url: href,
			data: "test=test", // workaround for browser bug, post cannot be empty
			success: function () { },
			dataType: 'text'
		});
	},

	formatDate: function (year, month, day) {
		return year + "-" + month + "-" + day;
	}
}﻿/// <reference path="~/Scripts/docs/JSLINQ-vsdoc.js" />
/// <reference path="~/Scripts/docs/jquery-1.7.1-vsdoc.js" />

LINES.helpers.headerlinks = {
	refreshTimeout: 120,
	enhancedInit: function () {
		LINES.helpers.headerlinks.setMessagesCount();
		$("#linkMessages").on('click', function () {
			return betterpopup(this, 'MessageReport', 'width=735,height=580,scrollbars=yes');
		});
		$("#personalMessages a").on('click', function () {
			$("#personalMessagesCount").html('(0)');
			return betterpopup(this, 'MessageReport', 'width=735,height=580,scrollbars=yes');
		});
		$("#linkMore").on('click', function (event) {
			event.preventDefault();
			return false;
		});
	},

	setMessagesCount: function () {
		var url = LINES.config.virtualDirectory + "TickerTape/GetPersonalMessagesCount";

		$.ajax({
			type: "POST",
			data: "test=test", // workaround for browser bug, post cannot be empty
			dataType: 'json',
			url: url,
			success: function (result) {
				$("#personalMessagesCount").html('(' + result + ')');

				setTimeout(LINES.helpers.headerlinks.setMessagesCount, LINES.helpers.headerlinks.refreshTimeout * 1000);
			}
		});
	}
}

﻿/// <reference path="~/Scripts/docs/JSLINQ-vsdoc.js" />
/// <reference path="~/Scripts/docs/jquery-1.7.1-vsdoc.js" />

///	<summary> 
///		LINES application
///
///		style notes:
///		1) LINES should be the only global variable defined in this file.
///		2) functions should only begin with a capital letter if they are a constructor function.
///		3) properties should not begin with a capital letter, with the exception of the enums namespace.
///		4) LINES.utils namespace is for functions that could be used on any project
///		5) append 'Json' to the name of json objects that are returned server side. Those objects may have capitalized properties.
///		6) don't use setInterval use setTimeout instead
///		7) make your best effort not to use 'eval'
///		8) all document load/resize events need to go in lines.onload.js
///		9) don't embed javascript inside the HTML
///	</summary>

LINES.enums = {
	///	<summary>
	/// Enumerators
	///	</summary>

	// core enums
	oddsFormat: { "American": "0", "Decimal": "1", "HongKong": "2", "Indonesian": "3", "Malay": "4" },
	oddsFormatName: { "0": "American", "1": "Decimal", "2": "HongKong", "3": "Indonesian", "4": "Malay" },
	lineType: { "Spread": "0", "Moneyline": "1", "Total": "2", "Team1Total": "3", "Team2Total": "4", "TwSpread": "5", "TwTotal": "6" },
	lineTypeName: { "0": "Spread", "1": "Moneyline", "2": "Total", "3": "Team1Total", "4": "Team2Total", "5": "TwSpread", "6": "TwTotal" }, // this is related to lineType enum above
	marketType: { "Live": "Live", "Today": "Today", "Early": "Early" },
	marketTypeName: { "0": "Live", "1": "Today", "2": "Early" },
	soccerGamePeriod: {
		"EndOfExtraTime": "EndOfExtraTime", "EndOfGame": "EndOfGame", "EndOfRegulation": "EndOfRegulation",
		"ExtraTimeFirstHalf": "ExtraTimeFirstHalf", "ExtraTimeHalfTime": "ExtraTimeHalfTime", "ExtraTimeSecondHalf": "ExtraTimeSecondHalf",
		"FirstHalf": "FirstHalf", "HalfTime": "HalfTime", "Penalties": "Penalties",
		"PendingStart": "PendingStart", "SecondHalf": "SecondHalf", "Suspended": "Suspended"
	},
	bettingEventStatus: { "Open": "0", "Offline": "1", "Cancelled": "2", "Graded": "3", "Circled": "4" },
	// website enums
	sportType: { "Regular": "0", "Baseball": "1", "Soccer": "2" },
	sportTypeName: { "0": "Regular", "1": "Baseball", "2": "Soccer" },
	browserMode: { "Basic": "0", "Enhanced": "1" },
	browserType: { "Desktop": "0", "Mobile": "1" },
	tab: { "Menu": "Menu", "Ticket": "Ticket", "Wager": "Wager", "Pending": "Pending" },
	betListDuration: { "Running": "0", "Past7Days": "1", "Past4Weeks": "2", "ByDay": "3", "ByWeek": "4", "ByMonth": "5", "Last10Ungraded": "6", "LivePendingClearance": "7" },
	ticketNotificationType: { "None": 0, "AboveAllowedMatchMaximum": 1, "AboveMaximumWagerAmount": 2, "Accepted": 3, "BelowMinimumWagerAmount": 4, "GameOffline": 5, "InsufficientFunds": 6, "PriceChanged": 7, "LockoutTimeViolation": 8, "WagerRelatedDataMissing": 9, "Pending": 10, "PercentChanged": 11, "PriceAndPercentChanged": 12, "TotalLossLimitReached": 13, "TotalRiskLimitReached": 14 },
	ticketRiskOrWin: { "Risk": "0", "Win": "1" },
	lineViewType: { "Simple": 0, "Double": 1, "Classic": 2, "Single": 3 },
	cssViewType: { "Simple": 0, "Single": 1, "Double": 2, "Moneyline": 3, "Taiwan": 4, "TeamTotal": 5 },
	cssViewTypeName: { "0": "Simple", "1": "Single", "2": "Double", "3": "Moneyline", "4": "Taiwan", "5": "TeamTotal" },
	// js enums
	changeStatus: { "NoChange": 0, "Update": 1, "Offline": 2 },
	lineChangeDirection: { "Highlight": 2, "Better": 1, "NoChange": 0, "Worse": -1 },
	sortBy: { "DateTime": 0, "TeamId": 1, "RotationNumber": 420 },
	side: { "Home": 0, "Away": 1, "Draw": 2 },
	homeAway: { "Home": "Home", "Away": "Away" },
	alternateRow: { "Even": "Even", "Odd": "Odd" },
	altWagerTypeGroupId: { "TEAMTOTALS": "1", "MONEYLINE": "2" },
	linesTimeSelection: { "AllDates": 0, "6Days": 6 },
	parlayLinesTimeSelection: { "AllDates": 0, "Today": 1 },
	betStatus: { "Valid": 0, "Accepted": 1, "Rejected": 2, "ClearTicket": 3 , "Waiting": 4},
};

// the following variables are set in the master page:
//isDebugMode
//virtualDirectory
//verboseLoggingEnabled

//LINES.config.timerLimitCustomerBalance = 90;
LINES.config.timerLimitCustomerBalanceClose = 15;
LINES.config.timerLimitTicketRefresh = 11;
LINES.config.timerLimitPendingRefresh = 6;
LINES.config.timerLimitLiveTicketRefresh = 6;
LINES.config.timerLimitBetMenuRefresh = 60;

LINES.features = {
	OldBrowsersFullRefresh: false
},
	LINES.state = {
		// the following variables are set in the master page:
		//currency
		//selectedLineViewType
		//oddsFormat
		//browserMode
		//urlParams
		//translationsStore
		//culture
		template: {},
		//eventStore: {},
		refreshButtonList: { "Live": {}, "Today": {}, "Early": {} },
		//timerCountDownMarketRefresh: { "Live": LINES.config.timerLimitMarketRefresh.Live, "Today": LINES.config.timerLimitMarketRefresh.Today, "Early": LINES.config.timerLimitMarketRefresh.Early },	
		timerCountDownCustomerBalance: LINES.config.timerLimitCustomerBalance,
		timerCountDownCustomerBalanceClose: LINES.config.timerLimitCustomerBalanceClose,
		timerCountDownTicketRefresh: LINES.config.timerLimitTicketRefresh,
		timerCountDownPendingRefresh: LINES.config.timerLimitPendingRefresh,
		timerCountDownBetMenuRefresh: LINES.config.timerLimitBetMenuRefresh,
		countNetworkCalls: 0,
		betTicketTimerEnabled: false,
		betTicketIsRefreshing: false,
		pendingListTimerEnabled: false,
		pendingListHasWagers: false,
		updateLeagueQueue: [],
		addEventQueue: [],
		unchangedGamesQueue: [],
		expandedSportId: null,
		timeStamps: {},
		custid: null,
		debugLog: "",
		logoutStarted: false,
		allLeaguesVisible: false,
		linesLoading: false,
		enableInfiniteScroll: true,
		lastClickedLink: ""
	};

LINES.state.cleanQueues = function () {
	// clear out existing queues because a new event filter was selected
	LINES.state.updateLeagueQueue.length = 0;
	LINES.state.addEventQueue.length = 0;
	LINES.state.unchangedGamesQueue.length = 0;
};

LINES.state.IdList = function () {
	var that = this;

	this.uniqueIds = {};

	var batchAction = function (args, action) {
		args = Array.prototype.slice.call(args);
		for (var i = 0; i < args.length; i++) {
			var uniqueId = args[i];

			if (Object.prototype.toString.call(uniqueId) === '[object Array]') {
				for (var e = 0; e < uniqueId.length; e++) {
					var id = uniqueId[e];
					if (id != null) {
						action(id);
					}
				}

			} else if (uniqueId != null) {
				action(uniqueId);
			}
		}
	};

	this.hasId = function (uniqueId) {
		return that.uniqueIds[uniqueId] !== undefined;
	};

	this.add = function () {
		batchAction(arguments, function (uniqueId) {
			that.uniqueIds[uniqueId] = true;
		});
	};

	this.remove = function () {
		batchAction(arguments, function (uniqueId) {
			delete that.uniqueIds[uniqueId];
		});
	};

	this.clear = function () {
		that.uniqueIds = {};
	};

	this.clone = function () {
		var idList = new LINES.state.IdList();

		for (var n in that.uniqueIds) {
			idList.uniqueIds[n] = that.uniqueIds[n];
		}

		return idList;
	};

	return this;
};

LINES.state.IdCache = function (logName) {
	var that = this;

	var log = function (m) {
		if (logName) {
			LINES.utils.log(logName, m);
		}
	};

	for (var name in LINES.enums.marketType) {
		this[name] = new LINES.state.IdList();
	}

	this.hasMarket = function (marketType) {
		return that[marketType] !== undefined;
	};

	var batchAction = function (args, action) {
		args = Array.prototype.slice.call(args);
		var marketType = args.shift();

		if (marketType === undefined || args.length === 0 || !that.hasMarket(marketType)) {
			return;
		}

		action(marketType, args);
	};

	this.hasId = function (marketType, uniqueId) {

		if (!that.hasMarket(marketType)) {
			return false;
		}

		return that[marketType].hasId(uniqueId);
	};

	this.add = function () {

		batchAction(arguments, function (marketType, ids) {

			log("[" + marketType + "] add " + " " + ids.join(","));

			that[marketType].add(ids);
		});
	};

	this.remove = function () {
		batchAction(arguments, function (marketType, ids) {

			log("[" + marketType + "] remove " + " " + ids.join(","));

			that[marketType].remove(ids);
		});
	};

	this.clear = function (marketType) {

		log("[" + marketType + "] clear");

		if (!that.hasMarket(marketType)) {
			return;
		}

		that[marketType] = new LINES.state.IdList();
	};

	this.clone = function () {

		var cache = new LINES.state.IdCache(logName + ".clone");

		for (var n in LINES.enums.marketType) {
			cache[n] = that[n].clone();
		}

		return cache;
	};

	this.toJson = function () {

		var j = {};

		for (var n in LINES.enums.marketType) {

			j[n] = [];

			if (that[n].uniqueIds) {


				for (var v in that[n].uniqueIds) {
					j[n].push(v);
				}
			}
		}

		return j;

	};

	return this;
};



LINES.dto = {
	PriceLine: function (line, price, lineType, direction) {
		this.line = line;
		this.price = price;
		this.lineType = lineType;
		this.direction = (direction == undefined) ? LINES.enums.lineChangeDirection.NoChange : direction;
	}
};


LINES.logError = function (err, stopReload, statusCode) {
	if (statusCode === undefined && err != undefined && err.status != undefined) statusCode = err.status; // http status might be attached to custom Errors
	var stack = (err != undefined && err.stack != undefined) ? err.stack : ""; // Firefox and IE10+ have a 'stack' property
	var ignoreError = (err != undefined && err.ignoreError === true) ? true : false;
	var errStr = err + " " + $.toJSON(err) + " " + stack;

	if (LINES.config.isDebugMode) {
		console.log(errStr);
		alert(errStr + "\n" + arguments.callee.caller.name + "\n" + arguments.callee.caller.toString());
	} else {
		// ignore WinInet Error Codes (12001 through 12156) and other client side errors status codes (0 and 400)
		// http://support.microsoft.com/kb/193625
		// ignore WinHTTP Error Codes (12044 through 12185)
		// http://msdn.microsoft.com/en-us/library/windows/desktop/aa383770(v=vs.85).aspx
		if (!((statusCode >= 12001 && statusCode <= 12185)
				|| ignoreError === true // 'parsererror' are being ignored
				|| statusCode === 0 // page was terminated by navigation to another page
				|| statusCode === 400 // upload to server did not complete
				|| statusCode === 502 || statusCode === 503 || statusCode === 504 // gateway timeout or server too busy
				|| statusCode === 500 // general error that is currently noise. look for server side stack trace in logs.
				|| statusCode === 405 // method not allowed
				|| statusCode === 418 // known bad routes (aka 404s we have identified)
				|| statusCode === 404 // bad routes or url too long or query string too long
				|| LINES.utils == undefined // some clients are deleting this namespace causing noise in the logs
				|| (err != undefined && err.name == "NS_ERROR_NOT_AVAILABLE") // ignore Firefox errors that happen after user has surpressed alert/confirm dialogs
			)
			|| LINES.config.verboseLoggingEnabled) {

			var localState = {
				"browserMode": LINES.state.browserMode,
				"culture": LINES.state.culture,
				"currency": LINES.state.currency,
				"customerType": LINES.state.customerType,
				"oddsFormat": LINES.state.oddsFormat,
				"selectedEventFilterId": LINES.state.selectedEventFilterId,
				"selectedLineViewType": LINES.state.selectedLineViewType,
				"selectedPeriodNumber": LINES.state.selectedPeriodNumber,
				"selectedSportId": LINES.state.selectedSportId,
				"selectedTime": LINES.state.selectedTime,
				"selectedTimeForParlays": LINES.state.selectedTimeForParlays,
				"siteAccessType": LINES.state.siteAccessType,
				"timeZoneId": LINES.state.timeZoneId
			};
			var stateStr = $.toJSON(localState);
			var postStr = "error=[SB " + LINES.config.version + "] " + window.location.hostname + " "
				+ escape(errStr)
				+ "---UNICODE---" + LINES.utils.toUnicodeSequence(errStr)
				+ "---STATE---" + escape(stateStr);

			$.ajax({
				type: "POST",
				url: LINES.config.virtualDirectory + "App/LogError/",
				data: postStr,
				dataType: 'text'
			});
		}

		if (statusCode == 419) {
			LINES.reloadPage("logError");
			return;
		}
		else if (statusCode == 500 || statusCode == 503) {
			if (!stopReload) LINES.reloadPage("logError");
			return;
		}
	}
};

try {
	LINES.state.nochangeStore = new LINES.state.IdCache("lines.state.nochangeStore");
	LINES.state.uniqueLeagueIdStore = new LINES.state.IdCache("lines.state.uniqueLeagueIdStore");
} catch (e) {
	LINES.logError(e, true);
}

// send all page reload calls through this method
LINES.reloadPage = function (calledFrom) {

	if (LINES.state.logoutStarted) {
		return;
	}

	if (LINES.config.isDebugMode) {
		//alert(calledFrom); // uncomment when debugging
		window.location.reload();
	}
	else {
		window.location.reload();
	}
};

// Polyfills for older browser support
// From https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/keys
if (!Object.keys) {
	Object.keys = (function () {
		'use strict';
		var hasOwnProperty = Object.prototype.hasOwnProperty,
			hasDontEnumBug = !({ toString: null }).propertyIsEnumerable('toString'),
			dontEnums = [
			  'toString',
			  'toLocaleString',
			  'valueOf',
			  'hasOwnProperty',
			  'isPrototypeOf',
			  'propertyIsEnumerable',
			  'constructor'
			],
			dontEnumsLength = dontEnums.length;

		return function (obj) {
			if (typeof obj !== 'object' && (typeof obj !== 'function' || obj === null)) {
				throw new TypeError('Object.keys called on non-object');
			}

			var result = [], prop, i;

			for (prop in obj) {
				if (hasOwnProperty.call(obj, prop)) {
					result.push(prop);
				}
			}

			if (hasDontEnumBug) {
				for (i = 0; i < dontEnumsLength; i++) {
					if (hasOwnProperty.call(obj, dontEnums[i])) {
						result.push(dontEnums[i]);
					}
				}
			}
			return result;
		};
	}());
}
﻿/// <reference path="~/Scripts/docs/JSLINQ-vsdoc.js" />
/// <reference path="~/Scripts/docs/jquery-1.7.1-vsdoc.js" />

LINES.helpers.layout = {
	enhancedInit: function () {
		LINES.helpers.layout.setLeftColumnHeight();
		$(window).bind('resize', function () {
			LINES.helpers.layout.setLeftColumnHeight();
		});

		//link Rules
		$('#linkRules').on("click", null, function () {
			return betterpopup(this, 'Rules', 'width=980,height=600,scrollbars=yes');
		});

		// user profile drop downs (language, timezone)
		$("#userPrefs").on("change", null, null, function () {
			LINES.userPrefs.submit();
		});

		$("#culture").on("change", null, null, function () {
		    dataLayer.push({
		        'header.Language': $(this).val(),
		        'event': 'header.Language'
		    });

		});

		$("#siteAccessType").on("change", null, null, function () {
		    dataLayer.push({
		        'header.ViewType': $(this).val(),
		        'event': 'header.ViewType'
		    });

		});

		// confirm header drop downs match LINES.config values 
		// workaround for Firefox because it keeps previous form selections when page is reloaded
		//var lineViewType = $("#lineViewType").val(); // commented out until double view is brought back
		var culture = $("#culture").val();
		// make sure drop downs match config values

		// commented out until double view is brought back
		//if(LINES.enums.lineViewType[lineViewType] != undefined && LINES.enums.lineViewType[lineViewType] != LINES.state.selectedLineViewType)

		if ((culture != LINES.state.culture)) {
			// submit user prefs to get the correct template from the server and update the user session
			LINES.userPrefs.submit();
		}

		// check custid cookie on page load
		var id = LINES.utils.getParameterByName("id", LINES.utils.getCookie("custid"));
		LINES.state.custid = id;

		if (id) {
			$("#customerName").html(id.toUpperCase());
		}

		$("#logoutButtonLink").on("click", null, function () {
			LINES.state.logoutStarted = true;
			return true;
		});

		$(window).focus(function () {
			var custId = LINES.utils.getParameterByName("id", LINES.utils.getCookie("custid"));
			// verify custid cookie has not changed due to customer logging in with two different accounts in the same browser
			if (LINES.utils.getCookie("custid") != null && custId != LINES.state.custid) {
				LINES.state.custid = custId; // avoid the page checking twice in a row before the page reload completes
				alert("You have logged in with a second account in the same browser. This is not supported.");
				window.location.reload();
			}
		});
	},

	setLeftColumnHeight: function () {
		// set height of left column (balance, tabs, menu, ticket, etc)
		var windowHeight = $(window).height();
		var headerHeight = $("#divHeader").height();
		var tickerHeight = $("#TickerTape").height();
		$("#menu_and_ticket").css({ height: (windowHeight - headerHeight - tickerHeight - 5) + "px" });
	}
}﻿/// <reference path="~/Scripts/docs/JSLINQ-vsdoc.js" />
/// <reference path="~/Scripts/docs/jquery-1.7.1-vsdoc.js" />
/// <reference path="~/Scripts/lines/lines.js" />



// *** LEAGUE ***
LINES.helpers.League = function (uniqueLeagueId, leagueJson) {
	this.oddsFormat = LINES.state.oddsFormat;
	this.uniqueLeagueId = uniqueLeagueId;
	var idPieces = LINES.helpers.League.getUniqueLeagueIdPieces(uniqueLeagueId);
	this.sportId = idPieces.sportId;
	this.marketType = idPieces.marketType;
	this.leagueId = idPieces.leagueId;
	this.sportName = LINES.helpers.Sport.getSportName(this.sportId).toUpperCase();
	this.leagueJson = leagueJson;
};

LINES.helpers.League.onError = function (err) {
	LINES.utils.error("lines.league", err);
};

LINES.helpers.League.prototype.exists = function() {
	return LINES.helpers.League.doesLeagueExist(this.uniqueLeagueId);
};

LINES.helpers.League.prototype.create = function (leagueName, displayLeagueName, periodDesc, sortOrder, sportType, cssViewType) {
	var leagueTableClone = LINES.helpers.League.getTemplate();
	// change the id of the row and divs
	leagueTableClone.attr("id", this.uniqueLeagueId);
	leagueTableClone.removeClass("baseball regular soccer").addClass(LINES.enums.sportTypeName[sportType].toLowerCase());
	if (sortOrder == undefined) sortOrder = "";
	leagueTableClone.find('.order').html(sortOrder);
	leagueTableClone.find('.LeagueName').html(leagueName);
	if (periodDesc != null) displayLeagueName += " - " + periodDesc;
	leagueTableClone.find('.dispName').html(displayLeagueName);
	//var buySellLevel = LINES.state.selectedBuySellLevels[this.leagueId];
	var buySellItem = JSLINQ(this.leagueJson.BuySellLevels).Where(function (item) { return item.IsSelected == true; }).FirstOrDefault({ "Id": "0" });
	var buySellLevel = buySellItem.Id;
	leagueTableClone.find('.buySellLevels option[value="' + buySellLevel + '"]').attr("selected", "selected");
	leagueTableClone.children('.RefreshCountDown').removeClass("Early Today Live").addClass(this.marketType);
	var columnCount = 9;
	if (cssViewType == LINES.enums.cssViewType.Single) {
		columnCount = 15;
	}
	else if (cssViewType == LINES.enums.cssViewType.Taiwan) {
		columnCount = 7;
	}
	leagueTableClone.find('.ColumnCount').attr("colspan", columnCount);
	return leagueTableClone;
};


LINES.helpers.League.prototype.updateLeagueFast = function (leagueJson, isNewLeague, isUpdate, cssViewType) {

	var that = this;
	var deferred = $.Deferred();

	var updateStatus = LINES.utils.tryExec(deferred, function () {
		// update league label if this is not a refresh. we dont have the period info on refresh in some cases.
		if (!isUpdate) {
			LINES.helpers.League.updateLeagueHeader(
				that.uniqueLeagueId,
				leagueJson.DisplayName,
				leagueJson.PeriodDesc,
				leagueJson.BuySellLevels,
                cssViewType);
		}

		for (var eventIndex in leagueJson.UnchangedGames) {
			LINES.state.unchangedGamesQueue.push({
				"marketType": that.marketType,
				"eventId": leagueJson.UnchangedGames[eventIndex],
				"cssViewType": cssViewType
			});
		}
	}, "LINES.helpers.League.updateLeagueHeader");

	if (!updateStatus) {
		return deferred.promise();
	}

	LINES.utils.delayedForEach(LINES.state.unchangedGamesQueue,
		{
			action: function(_, item) {
				LINES.helpers.Event.updateEventNoChange(
					item.marketType,
					item.eventId,
					cssViewType);
			},
			delay: 10
		}).fail(function (err) {
			LINES.helpers.League.onError(err);
			deferred.reject(err);
		})
		.done(function() {

			var lineUpdateSuccess = LINES.utils.tryExec(deferred, function() {
				for (var indexEvent in leagueJson.GameLines) {
					var currentEventJson = leagueJson.GameLines[indexEvent];

					var uniqueEventId = LINES.helpers.Event.getUniqueEventId(
						that.marketType,
						currentEventJson.EvId,
						currentEventJson.Lvl);
					var eventHelper;
					var createEventSuccess = LINES.utils.tryExec(deferred, function() {
						eventHelper = new LINES.helpers.Event(
							that.sportId,
							that.leagueId,
							uniqueEventId,
							isNewLeague,
							that.sportName,
							isUpdate,
							cssViewType);
					}, "createEventSuccess");

					if (createEventSuccess) {
						var results = eventHelper.updateRow(currentEventJson);
						var domElements = results.domElements;

						if (isNewLeague) {
							LINES.state.addEventQueue.push({
								"uniqueLeagueId": that.uniqueLeagueId,
								"domElements": domElements,
								"isNewLeague": isNewLeague
							});
						}
							// update does not need to be queued for DOM attached Simple Rows
						else if (!eventHelper.exists()) {
							LINES.state.addEventQueue.push({
								"uniqueLeagueId": that.uniqueLeagueId,
								"domElements": domElements,
								"isNewLeague": isNewLeague,
								"uniqueEventId": uniqueEventId,
								"eventHelper": eventHelper
							});
						}

						// remove event from nochangeStore
						var key = that.marketType + "_" + currentEventJson.EvId;

						LINES.state.nochangeStore.remove(that.marketType, key);
					}
				}

				var change = [];
				var unchange = [];
				var remove = [];

				var isChangedGame = function (idPieces) {

					if (leagueJson.GameLines == null) {
						return false;
					}

					var changed = false;
					$.each(leagueJson.GameLines, function (_, item) {
						if (item == null) {
							return true;
						} else {
							changed = item.EvId == idPieces.eventId;

							changed = changed && item.Lvl == idPieces.buySellLevel;

							return !changed;
						}
					});
					
					if (LINES.utils.canLog('lines.league') && changed) {
						change.push(idPieces.eventId + "_" + idPieces.buySellLevel);
					}

					return changed;
				};

				var isNotChangedGame = function (idPieces) {

					if (leagueJson.UnchangedGames == null) {
						return false;
					}

					var unchanged = false;
					$.each(leagueJson.UnchangedGames, function (_, item) {
						if (item == null) {
							return true;
						} else {
							unchanged = item == idPieces.eventId;
							return !unchanged;
						}
					});
					
					if (LINES.utils.canLog('lines.league') && unchanged) {
						unchange.push(idPieces.eventId + "_" + idPieces.buySellLevel);
					}

					return unchanged;
				};

				// loop thru table compare to Json and remove rows that are 'closed'
				if (!isNewLeague) {
					var rows = LINES.helpers.League.getEventList(that.uniqueLeagueId);
					//var eventLinq = JSLINQ(leagueJson.GameLines);
					//var nochangeLinq = JSLINQ(leagueJson.UnchangedGames);
					$.each(rows, function(index, row) {
						var rowEventId = $(row).attr("id");
						var idPieces = LINES.helpers.Event.getUniqueEventIdPieces(rowEventId);
						//var result = eventLinq.Where(function(item) { return item.EvId == idPieces.eventId && item.Lvl == idPieces.buySellLevel; });
						//var resultNochange = nochangeLinq.Where(function(item) { return item == idPieces.eventId; });

						// if game is in not in update list or in unchanged games list
						//if (result.items.length == 0 && resultNochange.items.length == 0) {
						if (!isChangedGame(idPieces) && !isNotChangedGame(idPieces)) {
							remove.push(idPieces.eventId + "_" + idPieces.buySellLevel);
							LINES.helpers.League.removeEvent(rowEventId);
						}
					});

					var logger = function (c, m) {
						if (c.length == 0) {
							LINES.utils.log('lines.league', m);
						} else {
							LINES.utils.warn('lines.league', m);
						}

					};
					
					if (LINES.utils.canLog('lines.league')) {
						logger(change, that.uniqueLeagueId + " " + leagueJson.Name + " changed:  (" + change.length + ")" + change.join(","));
						logger(unchange, that.uniqueLeagueId + " " + leagueJson.Name + " unchanged:(" + unchange.length + ")" + unchange.join(","));
						logger(remove, that.uniqueLeagueId + " " + leagueJson.Name + " removed:  (" + remove.length + ")" + remove.join(",") + "\n");
					}
				}
			}, "lineUpdateSuccess");

			if (lineUpdateSuccess) {
				LINES.utils.delayedForEach(LINES.state.addEventQueue, {
					action: function (_, item) {
						var league = LINES.helpers.League;
						if (item.isNewLeague) {
							league.addEventToTableEnd(item.uniqueLeagueId, item.domElements);
						} else {
							league.addEvent(item.uniqueEventId, item.domElements, item.eventHelper, item.uniqueLeagueId);
						}
					},
					chunkSize: 5,
					chunkDelay: 20
				}).fail(function (err) {
					LINES.helpers.League.onError(err);
					deferred.reject(err);
				}).done(function () {
					deferred.resolve();
				});
			}
		});

	return deferred.promise();
};


LINES.helpers.League.addEvent = function (uniqueEventId, domElements, newEventHelper, uniqueLeagueId) {
	var isAddComplete = false;

	// if other buy sell rows exist for this event
	var idPieces = LINES.helpers.Event.getUniqueEventIdPieces(uniqueEventId);
	var existingBuySells = $("." + idPieces.marketType + "_" + idPieces.eventId + "-Row");
	if (existingBuySells.exists()) {
		var rowEventId = null;
		$.each(existingBuySells, function (index, row) {
			rowEventId = $(row).attr("id");
			var rowIdPieces = LINES.helpers.Event.getUniqueEventIdPieces(rowEventId);
			// must cast to numeric to avoid string comparison
			if ((idPieces.buySellLevel * 1) < (rowIdPieces.buySellLevel * 1)) {
				LINES.helpers.League.addEventToTable(rowEventId, domElements);
				isAddComplete = true;
				return false;
			}
			return true;
		});

		// insert at the end of the buy/sell list
		if (isAddComplete == false) {
			LINES.helpers.League.addEventToBuySellEnd(rowEventId, domElements);
			
		}
	}
	// no buy sell is exists in the DOM for this event
	else {
		// find where event belongs

		var newStartTime = new Date(newEventHelper.getStartTime());
		var newRotNum = newEventHelper.getRotationNumber();
		var rows = LINES.helpers.League.getEventList(uniqueLeagueId);
		idPieces = LINES.helpers.League.getUniqueLeagueIdPieces(uniqueLeagueId);
		var sportId = idPieces.sportId;
		var leagueId = idPieces.leagueId;
		newStartTime.setHours(0, 0, 0, 0); // set time to zero so we only compare date

		$.each(rows, function (index, row) {
			var theRowEventId = $(row).attr("id");
			var eventHelper = new LINES.helpers.Event(sportId, leagueId, theRowEventId, false, "");
			var currentStartTime = new Date(eventHelper.getStartTime());
			var currentRotNum = eventHelper.getRotationNumber();
			currentStartTime.setHours(0, 0, 0, 0); // set time to zero so we only compare date

			if (idPieces.marketType == LINES.enums.marketType.Early) {
				if (// sort by start time
					newStartTime.getTime() < currentStartTime.getTime() ||
						// sort by rotation number if start times are equal
						(newStartTime.getTime() == currentStartTime.getTime() && newRotNum < currentRotNum)) {
					LINES.helpers.League.addEventToTable(theRowEventId, domElements);
					isAddComplete = true;
					return false;
				}
			} 
			else {
				if (
						// sort by rotation number
						newRotNum < currentRotNum) {
						LINES.helpers.League.addEventToTable(theRowEventId, domElements);
						isAddComplete = true;
						return false;
				}
			}
			return true;
		});

		// if event should be added to the end of the league
		if (!isAddComplete) {
			LINES.helpers.League.addEventToTableEnd(uniqueLeagueId, domElements);
		}
	}
};



// static methods
LINES.helpers.League.enhancedInit = function () {
	var linesArea = $("#lines_area");
	linesArea.on('click', ".MarketContainer.Live .league_header .Refresh", function () {
		LINES.helpers.Market.refreshMarket(LINES.enums.marketType.Live);
		return false;
	});
	linesArea.on('click', ".MarketContainer.Today .league_header .Refresh", function () {
		LINES.helpers.Market.refreshMarket(LINES.enums.marketType.Today);
		return false;
	});
	linesArea.on('click', ".MarketContainer.Early .league_header .Refresh", function () {
		LINES.helpers.Market.refreshMarket(LINES.enums.marketType.Early);
		return false;
	});	
};

LINES.helpers.League.getTemplate = function () {
	var leagueTable;
	if (LINES.state.template.league != undefined) {
		leagueTable = LINES.state.template.league;
	}
	else {
		// template is output with no ids, use classes instead.
		leagueTable = $("#templateDiv").find('.sportContainer .MarketContainer .LeagueContainer').eq(0).clone();
		leagueTable.find('tr.evRow').remove();
		leagueTable.find('.buySellLevels option').removeAttr("selected");
		LINES.state.template.league = leagueTable;
	}
	return leagueTable.clone();
};

LINES.helpers.League.removeEvent = function(uniqueEventId) {
	LINES.helpers.EventHtml.removeEvent(uniqueEventId);
};

LINES.helpers.League.getUniqueLeagueId = function(marketType, sportId, leagueId) {
	///	<summary>
	///		Build unique league id
	///		Structure: marketType_sportId_leagueId
	///	</summary>
	///	<returns type="String" />
	///	<param name="marketType" type="String">
	///		 Enum value for market
	///	</param>
	///	<param name="sportId" type="Number">
	///		Numeric sportId
	///	</param>
	///	<param name="leagueId" type="Number">
	///		Numeric leagueId
	///	</param>
	var uniqLeagueId;
	if (sportId == undefined || String(sportId) == "undefined") throw "League.getUniqueLeagueId  sportId is undefined.";
	if (leagueId == undefined || String(leagueId) == "undefined") throw "League.getUniqueLeagueId  leagueId is undefined.";
	if (marketType == undefined || String(marketType) == "undefined") throw "League.getUniqueLeagueId  marketType is undefined.";

	uniqLeagueId = marketType + "_" + sportId + "_" + leagueId;

	return uniqLeagueId;
};

LINES.helpers.League.getUniqueLeagueIdPieces = function(uniqueLeagueId) {
	var idArray = uniqueLeagueId.split("_");
	var marketType = idArray[0];
	var sportId = idArray[1];
	var leagueId = idArray[2];

	if (marketType == undefined) throw "League.getUniqueLeagueIdPieces: marketType is undefined: uniqueLeagueId: " + uniqueLeagueId;
	if (sportId == undefined) throw "League.getUniqueLeagueIdPieces: sportId is undefined: uniqueLeagueId: " + uniqueLeagueId;
	if (leagueId == undefined) throw "League.getUniqueLeagueIdPieces: leagueId is undefined: uniqueLeagueId: " + uniqueLeagueId;

	return { "marketType": marketType, "sportId": sportId, "leagueId": leagueId };
};

LINES.helpers.League.doesLeagueExist = function(uniqueLeagueId) {
	return $("#" + uniqueLeagueId).exists();
};

LINES.helpers.League.closeLeague = function (uniqueLeagueId) {

	var idPieces = LINES.helpers.League.getUniqueLeagueIdPieces(uniqueLeagueId);

	if (idPieces != null && idPieces.marketType != undefined) {
		LINES.state.uniqueLeagueIdStore.remove(idPieces.marketType, uniqueLeagueId);
	}
  
	LINES.helpers.League.close(uniqueLeagueId);
	LINES.helpers.Market.clean(uniqueLeagueId);
	
	LINES.utils.warn('lines.league', "Closing league: " + uniqueLeagueId);
};

LINES.helpers.League.closeLeagues = function() {

	var result = $.Deferred();
	var args = $.makeArray(arguments);
	args.shift();

	var idList = LINES.utils.flattenArray(args, true);
   
	 /*
	LINES.utils.delayedForEach(idList, {
		action: function(_, id) {
			LINES.helpers.League.closeLeague(id);
			return true;
		}
	}).done(function() {
		result.resolve();
	}).fail(function (err) {
		result.reject(err);
	});   
  */
	
	result.resolve();

	$.each(idList, function(_, id) {
		LINES.helpers.League.closeLeague(id);
	});
  
	return result.promise();
};

LINES.helpers.League.close = function(uniqueLeagueId) {
	var eventList = LINES.helpers.League.getUniqueEventIdList(uniqueLeagueId);

	// remove events from eventStore then close league, otherwise events will stay in the hash

	$.each(eventList, function(_, item) {
		//delete LINES.state.eventStore[item];
		var idPieces = LINES.helpers.Event.getUniqueEventIdPieces(item);
		LINES.state.nochangeStore.remove(idPieces.marketType, idPieces.marketType + "_" + idPieces.eventId);
	});
	
	$("#" + uniqueLeagueId).remove();
};

LINES.helpers.League.addEventToTableEnd = function(uniqueLeagueId, domElements) {
	$("#" + uniqueLeagueId).append(domElements.rows[0].domElement);
};

LINES.helpers.League.addEventToTable = function(landMarkId, domElements) {
	$("#" + landMarkId).before(domElements.rows[0].domElement);
};

LINES.helpers.League.getUniqueEventIdList = function(uniqueLeagueId) {
	var eventList = [];
	var rows = LINES.helpers.League.getEventList(uniqueLeagueId);

	var row0 = $(rows[0]);
	if (row0.exists()) {
		$.each(rows, function(index, row) {
			var rowEventId = $(row).attr("id");
			eventList.push(rowEventId);
		});
	}

	return eventList;
};

LINES.helpers.League.getEventList = function(uniqueLeagueId) {
	return $('#' + uniqueLeagueId).find('tr:gt(0)').get();
};

LINES.helpers.League.addEventToBuySellEnd = function(landMarkId, domElements) {
	$("#" + landMarkId).after(domElements.rows[0].domElement);
};

LINES.helpers.League.updateLeagueHeader = function (uniqueLeagueId, displayLeagueName, periodDesc, buySellList, cssViewType) {
	if (periodDesc != null) displayLeagueName += " - " + periodDesc;
	var leagueElement = $("#" + uniqueLeagueId);
	leagueElement.find('.dispName').html(displayLeagueName);

	if (cssViewType == LINES.enums.cssViewType.Moneyline || cssViewType == LINES.enums.cssViewType.TeamTotal) {
		leagueElement.find('.buySellLevels').addClass("hidden");
	} else {
		var buySellItem = JSLINQ(buySellList).Where(function (item) { return item.IsSelected == true; }).FirstOrDefault({ "Id": "0" });
		var buySellLevel = buySellItem.Id;
		leagueElement.find('.buySellLevels option').removeAttr("selected");
		leagueElement.find('.buySellLevels option[value="' + buySellLevel + '"]').attr("selected", "selected");
	}
	
};

LINES.helpers.League.processLeagueQueue = function() {
	///	<summary>
	///		Processing the leagues in a setTimeout based queue allows control to go back to the browser UI after each league is updated.
	///		This makes the browser more responsive for the user.
	///	</summary>

	var args = $.makeArray(arguments);

	if (args.length == 0) {
		return LINES.utils.toEmptyPromise();
	}

	var sportId = args.shift();
	var deferred = args.shift();
	deferred = deferred === undefined ? $.Deferred() : deferred;
	
	var item = LINES.state.updateLeagueQueue.shift();

	if (item == undefined) {
		deferred.resolve();
	}
	else {
		
		var leagueHelper = new LINES.helpers.League(item.uniqueLeagueId, item.leagueJson);

		leagueHelper.updateLeagueFast(item.leagueJson, item.isNewLeague, item.isUpdate, item.cssViewType)
			.done(function() {
				var delay = 0;

				if (LINES.utils.isIE7()) {
					delay = 400;
				}

				LINES.utils.delay(function() {

					LINES.helpers.League.processLeagueQueue(sportId, deferred)
						.fail(function (err) {
							LINES.helpers.League.onError(err);
							deferred.reject(err);
						});

				}, delay);

			}).fail(function (err) {
				LINES.helpers.League.onError(err);
				deferred.reject(err);
			});
	}

	return deferred.promise();
};﻿/// <reference path="~/Scripts/docs/jquery-1.7.1-vsdoc.js" />
/// <reference path="~/Scripts/lines/lines.js" />

// constructor function
LINES.helpers.Market = function(marketType, sportId, sportName, cssViewType) {
    this.marketType = marketType;
    this.sportId = sportId;
    this.sportName = sportName;
    this.cssViewType = cssViewType;
    this.uniqueMarketId = LINES.helpers.Market.getUniqueMarketId(this.marketType, this.sportId);
    this.domElement = $("#" + this.uniqueMarketId);};


LINES.helpers.Market.onError = function (err) {
    LINES.utils.error("lines.market", err);
    LINES.logError(err);
};

// object methods
LINES.helpers.Market.prototype.exists = function () {
    return this.domElement.exists();
};

LINES.helpers.Market.prototype.create = function (marketName, headerLabels) {
    var html = this.createElement(marketName);

    this.domElement = html; // temporarily set dom element to detach market div
    this.updateHeaderLabels(headerLabels);
    LINES.helpers.Sport.addMarket(this.sportId, this.marketType, html);
    this.domElement = $("#" + this.uniqueMarketId);
};

LINES.helpers.Market.prototype.createElement = function (marketName) {
    var div = LINES.helpers.Market.getTemplate(this.cssViewType);

    div.attr("id", this.uniqueMarketId);
    var idPieces = LINES.helpers.Market.getUniqueMarketIdPieces(this.uniqueMarketId);
    var marketType = idPieces.marketType;
    div.addClass(marketType);
    div.find(".MarketName").html((marketName == null) ? "" : marketName.toString().toUpperCase());
    div.find(".RefreshCountDown").addClass(marketType);

    return div;
};

LINES.helpers.Market.prototype.addLeague = function (uniqueLeagueId, leagueJson, isUpdate) {
    var leagueHelper = new LINES.helpers.League(uniqueLeagueId, leagueJson);
    var htmlElement = leagueHelper.create(leagueJson.Name, leagueJson.DisplayName, leagueJson.PeriodDesc, leagueJson.SortOrder, leagueJson.SportType, this.cssViewType);

    // remove no events message if exists
    if ($("#" + this.uniqueMarketId).find(".noEvents").exists()) {
        $("#" + this.uniqueMarketId).find(".noEvents").remove();
    }
    var sortOrder = leagueJson.SortOrder;
    var leagueName = $(htmlElement).find(".LeagueName").html();
    var leagues = LINES.helpers.Market.getLeagueList(this.uniqueMarketId);
    var isAddComplete = false;
    var hasLeagues = false;
    $.each(leagues, function (index, league) {
        hasLeagues = true;
        var leagueQ = $(league);
        var currentLeagueId = leagueQ.attr("id");
        if (currentLeagueId == "") {
            return true;
        }

        var currentSortOrder = leagueQ.find(".order").html();
        var currentLeagueName = leagueQ.find(".LeagueName").html();
        var currentIdPieces = LINES.helpers.League.getUniqueLeagueIdPieces(currentLeagueId);

        if (// compare two non-null numeric sort order values
	        (sortOrder != null && currentSortOrder != "" && (sortOrder < currentSortOrder))
	            ||
            // new league has a sort order and current league doesn't
	            (sortOrder != null && currentSortOrder == "")
	            ||
            // both new league and current league don't have a valid sort order, so sort by name
	            (sortOrder == null && currentSortOrder == "" && (leagueName < currentLeagueName))) {
            $("#" + currentLeagueId).before(htmlElement);
            isAddComplete = true;
            return false;
        }

        return true;
    });
    // add to end
    if (!isAddComplete) {
        $("#" + this.uniqueMarketId).find('table').append(htmlElement);
    }
    htmlElement = null;

    LINES.state.updateLeagueQueue.push({
        "uniqueLeagueId": uniqueLeagueId,
        "leagueJson": leagueJson,
        "isNewLeague": true,
        "cssViewType": this.cssViewType,
        "isUpdate": isUpdate
    });
};

LINES.helpers.Market.prototype.addNoEvents = function () {
    LINES.helpers.Market.addNoEventsMessage(this.uniqueMarketId);
    return this;
};

LINES.helpers.Market.prototype.updateHeaderLabels = function (headerLabels) {
    // replace header DOM
    var table = this.domElement.find("table");
    var div = LINES.helpers.Market.getTemplate(this.cssViewType);
    table.find(".header").replaceWith(div.find(".header"));

	if (headerLabels != undefined) {
		for (var i = 0; i <= headerLabels.length; i++) {
			if (headerLabels[i] != null) headerLabels[i] = headerLabels[i].toString().toUpperCase();
			this.domElement.find(".Label" + i).html(headerLabels[i]);
		}
	}

	this.changeTableLayout();
    return this;
};

LINES.helpers.Market.prototype.changeTableLayout = function () {
    var viewType = LINES.enums.cssViewTypeName[this.cssViewType];
    var showingViewType = this.getShowingViewType();
    if (this.cssViewType == LINES.enums.cssViewType.TeamTotal) {
        viewType = LINES.enums.cssViewTypeName[LINES.enums.cssViewType.Simple];
    }
    if (viewType != showingViewType) {
        this.domElement.find(".lineView").removeClass(showingViewType).addClass(viewType);
        this.closeLeagues();
    }
};

LINES.helpers.Market.prototype.getShowingViewType = function () {
    var lineView = this.domElement.find(".lineView");

    if (lineView.hasClass("Simple")) return "Simple";
    if (lineView.hasClass("Single")) return "Single";
    if (lineView.hasClass("Moneyline")) return "Moneyline";
    if (lineView.hasClass("Double")) return "Double";
    if (lineView.hasClass("Taiwan")) return "Taiwan";
};

LINES.helpers.Market.prototype.closeLeagues = function () {

    var idList = LINES.helpers.Market.getUniqueLeagueIdList(this.uniqueMarketId); // array of ids
    return LINES.helpers.League.closeLeagues(null, idList);
};

LINES.helpers.Market.prototype.setHideMarket = function (hideCss, isUpdate, isParlay) {
    // overwrite hideCss value on update because it cannot be determined server side
    if (isUpdate) {
        var liveId = LINES.helpers.Market.getUniqueMarketId(LINES.enums.marketType.Live, this.sportId);
        var todayId = LINES.helpers.Market.getUniqueMarketId(LINES.enums.marketType.Today, this.sportId);
        var earlyId = LINES.helpers.Market.getUniqueMarketId(LINES.enums.marketType.Early, this.sportId);

        var doesLiveExist = LINES.helpers.Market.doesMarketExist(liveId);
        var doesTodayExist = LINES.helpers.Market.doesMarketExist(todayId);
        var doesEarlyExist = LINES.helpers.Market.doesMarketExist(earlyId);
        // three markets are open
        if (doesLiveExist && doesTodayExist && doesEarlyExist) {
            // if game count is 0 in all markets then hide Live OR Early market
            if (!LINES.helpers.Market.hasEvents(liveId) && !LINES.helpers.Market.hasEvents(todayId) && !LINES.helpers.Market.hasEvents(earlyId)) {
                // live or early market previously had games and Today market is hidden then we need to unhide the Today market
                $("#" + liveId).addClass("hidden");
                $("#" + earlyId).addClass("hidden");
                $("#" + todayId).removeClass("hidden");
            }
            else {
                if (!LINES.helpers.Market.hasEvents(liveId)) {
                    $("#" + liveId).addClass("hidden");
                }
                else {
                    $("#" + liveId).removeClass("hidden");
                }
                if (!LINES.helpers.Market.hasEvents(todayId)) {
                    $("#" + todayId).addClass("hidden");
                }
                else {
                    $("#" + todayId).removeClass("hidden");
                }
                if (!LINES.helpers.Market.hasEvents(earlyId)) {
                    $("#" + earlyId).addClass("hidden");
                }
                else {
                    $("#" + earlyId).removeClass("hidden");
                }
            }
        }
            // only live and today are open
        else if (doesLiveExist && doesTodayExist) {
            // live and today have no events
            if (!LINES.helpers.Market.hasEvents(liveId) && !LINES.helpers.Market.hasEvents(todayId)) {               
                $("#" + liveId).addClass("hidden");
                $("#" + todayId).removeClass("hidden");
            }
                // live has events, today has no events
            else if (LINES.helpers.Market.hasEvents(liveId) && !LINES.helpers.Market.hasEvents(todayId)) {
                $("#" + liveId).removeClass("hidden");
                $("#" + todayId).addClass("hidden");
            }
                // live has no events, today has events
            else if (!LINES.helpers.Market.hasEvents(liveId) && LINES.helpers.Market.hasEvents(todayId)) {
                $("#" + liveId).addClass("hidden");
                $("#" + todayId).removeClass("hidden");
            }
                // both live and today have events, so make sure they are not hidden
            else {
                $("#" + liveId).removeClass("hidden");
                $("#" + todayId).removeClass("hidden");
            }
        }
        // is parlay and only today and early are open   
        else if (isParlay && doesTodayExist && doesEarlyExist) {            
        	if (LINES.state.selectedTimeForParlays == LINES.enums.parlayLinesTimeSelection.Today) {
                $("#" + earlyId).addClass("hidden");
                $("#" + todayId).removeClass("hidden");
        	} else if (LINES.state.selectedTimeForParlays == LINES.enums.parlayLinesTimeSelection.AllDates) {
                if (LINES.helpers.Market.hasEvents(todayId) && LINES.helpers.Market.hasEvents(earlyId)) {
                    $("#" + todayId).removeClass("hidden");
                    $("#" + earlyId).removeClass("hidden");
                } else if (!LINES.helpers.Market.hasEvents(todayId) && !LINES.helpers.Market.hasEvents(earlyId)) {
                	$("#" + todayId).removeClass("hidden");
                	$("#" + earlyId).addClass("hidden");
                } else if (!LINES.helpers.Market.hasEvents(todayId) && LINES.helpers.Market.hasEvents(earlyId)) {
                	$("#" + todayId).addClass("hidden");
                	$("#" + earlyId).removeClass("hidden");
                } else if (LINES.helpers.Market.hasEvents(todayId) && !LINES.helpers.Market.hasEvents(earlyId)) {
                	$("#" + todayId).removeClass("hidden");
                	$("#" + earlyId).addClass("hidden");
                }
            } else {
                $("#" + todayId).addClass("hidden");
                $("#" + earlyId).removeClass("hidden");
            }
        }
    }     
        // NOT an update
    else {
        if (hideCss == true) {
            this.domElement.addClass("hidden");
        }
        else {
            this.domElement.removeClass("hidden");
        }
    }    

    return this;
};


// static methods
LINES.helpers.Market.enhancedInit = function () {
    var linesArea = $("#lines_area");
    linesArea.on('click', ".MarketContainer.Live .rfsh", function () {
        LINES.helpers.Market.refreshMarket(LINES.enums.marketType.Live);
        return false;
    });
    linesArea.on('click', ".MarketContainer.Today .rfsh", function () {
        LINES.helpers.Market.refreshMarket(LINES.enums.marketType.Today);
        return false;
    });
    linesArea.on('click', ".MarketContainer.Early .rfsh", function () {
        LINES.helpers.Market.refreshMarket(LINES.enums.marketType.Early);
        return false;
    });
};

LINES.helpers.Market.RefreshButton = function (marketType) {

    var buttons = LINES.state.refreshButtonList;
    var loc = LINES.state.translationsStore;

    this.marketType = marketType;
    this.button = null;

    if (buttons[this.marketType] === undefined || $.isEmptyObject(buttons[this.marketType])) {
        buttons[this.marketType] = $("#lines_area").find(".market_header .rfsh ." + this.marketType);
    }

    this.button = buttons[this.marketType];

    if (!this.button || !this.button.exists()) {
        this.button = null;
    }
    
    var self = this;

    this.exists = function () {
        return self.button != null;
    };

    this.isSuspended = function () {
        return self.exists() && self.button.attr("data-state") === "Waiting";
    };
    this.suspend = function (interval) {

        var handle = null;

        if (self.exists()) {
            self.button.attr("data-state", "Waiting");
            self.button.html(loc["Please Wait"]);

            if ($.isNumeric(interval) && interval > 0) {

                handle = setTimeout(function() {

                    if (self.isSuspended()) {

                        LINES.utils.log("lines.market", self.marketType + ": activating timeout to restart countdown timer.");

                        self.activate();
                    }

                    handle = null;
                }, interval);
            }
        }

        return handle;
    };
    this.updateText = function (count) {
        if (self.exists()) {
            self.button.attr("data-state", "Done");
            self.button.html(loc["refresh"] + "&nbsp;" + count);
        }
    };
    this.activate = function () {
        var timer = new LINES.helpers.Market.RefreshTimer(self.marketType);
        timer.reset();
        if (self.button != null) {
            self.button.attr("data-state", "Done");
            self.updateText(timer.count());
        }
    };

    return this;
};

LINES.helpers.Market.RefreshTimer = function (marketType) {
    this.marketType = marketType;
    var self = this;
    var timerLimit = LINES.config.timerLimitMarketRefresh[this.marketType];
    var counters = LINES.state.timerCountDownMarketRefresh;
    var market = LINES.helpers.Market;

    this.count = function (value) {

        if ($.isNumeric(value)) {
            counters[self.marketType] = value;
        }

        return counters[self.marketType];
    };

    this.reset = function () {
        self.count(timerLimit);
    };

    this.tickDown = function () {

        var cnt = self.count();
        var button = new market.RefreshButton(self.marketType);

        if (cnt <= 1) {
            self.reset();
            if (button.exists()) {
                market.refreshMarket(self.marketType);
            }
        } else {
            self.count(cnt - 1);
            if (!button.isSuspended()) {
                button.updateText(self.count());
            }
        }
    };

    return this;
};


LINES.helpers.Market.countDown = function () {

    for (var marketType in LINES.enums.marketType) {
        new LINES.helpers.Market.RefreshTimer(marketType).tickDown();
    }
};

LINES.helpers.Market.refreshMarket = function (marketType) {

    var deferred = $.Deferred();

    var timeStamp = (LINES.state.timeStamps[marketType] == undefined) ? null : LINES.state.timeStamps[marketType];

    LINES.utils.log("lines.market", marketType + " refresh [START] TimeStamp:" + timeStamp);

    var refreshButton = new LINES.helpers.Market.RefreshButton(marketType);

    try {


        var handle = null;
        
        deferred.always(function () {
            refreshButton.activate();

            if (handle != null) {
                LINES.utils.log("lines.market", marketType + " cancel reset Handle:" + handle);
                clearTimeout(handle);
            }
        });
        
        if (refreshButton.isSuspended()) {
            deferred.resolve();
            return deferred.promise();
        }
        
        handle = refreshButton.suspend(15000); // max 15 secs

        var action = function () {

            LINES.ajax.getUpdates(marketType)
                .done(function (linesContainerJson) {

	            if (linesContainerJson != null) {
		            if (LINES.utils.canLog("lines.market")) {

			            var gmLines = 0;
			            var unGames = 0;

			            $.each(linesContainerJson.Sport.Markets, function(_, m) {
				            $.each(m.GamesContainers, function(__, g) {
					            gmLines += g.GameLines.length;
					            unGames += g.UnchangedGames.length;
				            });
			            });

			            LINES.utils.assert("lines.market", gmLines + unGames > 0, marketType + " zero game lines and zero unchanged games");
		            }

		            LINES.utils.log("lines.market", marketType + " refresh [END]   TimeStamp:" + linesContainerJson.TimeStamp);

		            if (linesContainerJson.ErrorMessage != null) {
			            LINES.utils.log("lines.market", linesContainerJson.TimeStamp + ' ' + linesContainerJson.ErrorMessage);
		            }
	            } else {
	            	LINES.utils.log("lines.market", marketType + " linesContainerJson is null");
	            }


	            LINES.helpers.Sport.processLinesContainer(linesContainerJson, marketType, false)
                        .done(function () {
                            deferred.resolve();
                        }).fail(function(err) {
                            LINES.helpers.Market.onError(err);
                            deferred.reject(err);
                        });
                }).fail(function(err) {
                    LINES.helpers.Market.onError(err);
                    deferred.reject(err);
                });

        };

        // Increase the delay to test slow ajax call. For example 5000
        //if (LINES.utils === undefined) {
        action();
        //} else {
            //LINES.utils.sleep(5000).done(action);
        //}

    } catch (e) {
        LINES.helpers.Market.onError(e);
        deferred.reject(e);
    }

    return deferred.promise();
};

LINES.helpers.Market.clean = function (uniqueLeagueId) {

    var uniqueMarketId = LINES.helpers.Market.getUniqueMarketId(uniqueLeagueId);
    var list = LINES.helpers.Market.getLeagueList(uniqueMarketId); // array of HTMLTableSectionElement

    if (list.length == 0) {
        // cleaning market should not remove it from html it should show 
        // the no event message tbody 
        LINES.helpers.Market.addNoEventsMessage(uniqueMarketId);
    }
};

LINES.helpers.Market.getLeagueIdsByUniqueMarketId = function (uniqueMarketId) {
    var idList = [];

    var list = LINES.helpers.Market.getLeagueList(uniqueMarketId);

    $.each(list, function (_, item) {
        idList.push($(item).attr("id"));
    });

    return idList;
};


LINES.helpers.Market.close = function () {

    var ids = LINES.utils.flattenArray(arguments, true);

    if (ids.length == 0) {
        return LINES.utils.toEmptyPromise();
    }

    $.each(ids, function (_, uniqueMarketId) {
	    var idPieces = LINES.helpers.Market.getUniqueMarketIdPieces(uniqueMarketId);
	    LINES.state.uniqueLeagueIdStore.clear(idPieces.marketType);
	    LINES.state.nochangeStore.clear(idPieces.marketType);

        $("#" + uniqueMarketId).remove();
    });

    return LINES.utils.toEmptyPromise();
};

LINES.helpers.Market.getUniqueMarketId = function () {

    var marketType = null;
    var sportId = null;

    // uniqueLeagueId
    if (arguments.length == 1) {
        var uniqueLeagueId = arguments[0];
        var idPieces = LINES.helpers.League.getUniqueLeagueIdPieces(uniqueLeagueId);
        marketType = idPieces.marketType;
        sportId = idPieces.sportId;
    }
        // marketType, sportId
    else if (arguments.length == 2) {
        marketType = arguments[0];
        sportId = arguments[1];
    }

    return marketType + "_" + sportId;
};

LINES.helpers.Market.getUniqueMarketIdPieces = function (uniqueMarketId) {
    var idArray = uniqueMarketId.split("_");
    var marketType = idArray[0];
    var sportId = idArray[1];
    return { "marketType": marketType, "sportId": sportId };
};

LINES.helpers.Market.doesMarketExist = function (uniqueMarketId) {
    return $("#" + uniqueMarketId).exists();
};

LINES.helpers.Market.getUniqueLeagueIdList = function (uniqueMarketId) {
    ///	<summary>
    ///		return a list of the UniqueLeagueId in a given market
    ///	</summary>
    ///	<returns type="Array" />
    ///	<param name="uniqueMarketId" type="string"></param>
    var domList = LINES.helpers.Market.getLeagueList(uniqueMarketId);
    var idPieces = LINES.helpers.Market.getUniqueMarketIdPieces(uniqueMarketId);
    var sportId = idPieces.sportId;
    var marketType = idPieces.marketType;
    var idList = [];
    $.each(domList, function (index, league) {
        var uniqueLeagueId = $(league).attr("id");
        var idPieces = LINES.helpers.League.getUniqueLeagueIdPieces(uniqueLeagueId);
        if (idPieces.marketType == marketType && idPieces.sportId == sportId) {
            idList.push(uniqueLeagueId);
        }
    });

    return idList;
};

LINES.helpers.Market.getTemplate = function (cssViewType) {
    var div;
    if (cssViewType == LINES.enums.cssViewType.Moneyline) {
        if (LINES.state.template.marketMoneyline != undefined) {
            div = LINES.state.template.marketMoneyline;
        }
        else {
            div = $("#templateDiv").find('.sportContainer .MarketContainer').eq(0).clone();
            div.removeClass("Live Today Early");
            div.find(".LeagueContainer").remove();
            div.find(".RefreshCountDown").removeClass("Live Today Early");
            div.find(".header.Single").remove();
            div.find(".header.Simple").remove();
            div.find(".header.Double").remove();
            div.find(".header.Taiwan").remove();
            LINES.state.template.marketMoneyline = div;
        }
    }
    else if (cssViewType == LINES.enums.cssViewType.Single) {
        if (LINES.state.template.marketSingle != undefined) {
            div = LINES.state.template.marketSingle;
        }
        else {
            div = $("#templateDiv").find('.sportContainer .MarketContainer').eq(0).clone();
            div.removeClass("Live Today Early");
            div.find(".LeagueContainer").remove();
            div.find(".RefreshCountDown").removeClass("Live Today Early");
            div.find(".header.Simple").remove();
            div.find(".header.Moneyline").remove();
            div.find(".header.Double").remove();
            div.find(".header.Taiwan").remove();
            LINES.state.template.marketSingle = div;
        }
    }
    else if (cssViewType == LINES.enums.cssViewType.Double) {
        if (LINES.state.template.marketDouble != undefined) {
            div = LINES.state.template.marketDouble;
        }
        else {
            div = $("#templateDiv").find('.sportContainer .MarketContainer').eq(0).clone();
            div.removeClass("Live Today Early");
            div.find(".LeagueContainer").remove();
            div.find(".RefreshCountDown").removeClass("Live Today Early");
            div.find(".header.Simple").remove();
            div.find(".header.Moneyline").remove();
            div.find(".header.Single").remove();
            div.find(".header.Taiwan").remove();
            LINES.state.template.marketDouble = div;
        }
    }
    else if (cssViewType == LINES.enums.cssViewType.Taiwan) {
        if (LINES.state.template.marketTaiwan != undefined) {
            div = LINES.state.template.marketTaiwan;
        }
        else {
            div = $("#templateDiv").find('.sportContainer .MarketContainer').eq(0).clone();
            div.removeClass("Live Today Early");
            div.find(".LeagueContainer").remove();
            div.find(".RefreshCountDown").removeClass("Live Today Early");
            div.find(".header.Simple").remove();
            div.find(".header.Moneyline").remove();
            div.find(".header.Single").remove();
            div.find(".header.Double").remove();
            LINES.state.template.marketTaiwan = div;
        }
    }
    else {
        if (LINES.state.template.marketSimple != undefined) {
            div = LINES.state.template.marketSimple;
        }
        else {
            div = $("#templateDiv").find('.sportContainer .MarketContainer').eq(0).clone();
            div.removeClass("Live Today Early");
            div.find(".LeagueContainer").remove();
            div.find(".RefreshCountDown").removeClass("Live Today Early");
            div.find(".header.Moneyline").remove();
            div.find(".header.Single").remove();
            div.find(".header.Double").remove();
            div.find(".header.Taiwan").remove();
            LINES.state.template.marketSimple = div;
        }
    }

    return div.clone();
};

LINES.helpers.Market.getTemplateForNoEvents = function () {
    var div;
    if (LINES.state.template.noevents != undefined) {
        div = LINES.state.template.noevents;
    }
    else {
        div = $("#templateDiv").find('.noEvents').clone();
        LINES.state.template.noevents = div;
    }

    div = div.clone();
    return div;
};


LINES.helpers.Market.addNoEventsMessage = function (uniqueMarketId) {
    var market = $("#" + uniqueMarketId);
    var colSpan = 9;
    var header = market.find(".header");
    if (header.hasClass("Single")) {
        colSpan = 15;
    }
    else if (header.hasClass("Taiwan")) {
        colSpan = 7;
    }
    // add only if no events message not present
    if (!market.find(".noEvents").exists()) {
        var htmlElement = LINES.helpers.Market.getTemplateForNoEvents();
        htmlElement.find(".ColumnCount").attr("colspan", colSpan);
        market.find("thead").after(htmlElement);
    } else {
        market.find(".ColumnCount").attr("colspan", colSpan);
    }
};

LINES.helpers.Market.hasEvents = function (uniqueMarketId) {
    return !$("#" + uniqueMarketId).find(".noEvents").exists();
};

LINES.helpers.Market.getLeagueList = function (uniqueMarketId) {
    return $("#" + uniqueMarketId).find(".LeagueContainer").get(); // // array of HTMLTableSectionElement
};
﻿/// <reference path="~/Scripts/docs/jquery-1.7.1-vsdoc.js" />

LINES.helpers.miniBetList = {
	enhancedInit: function () {
		$("#WagerContent").on('click', "#acceptedWagerList .compactTicket", function () { return LINES.helpers.miniBetList.clickCompactTicket($(this)); });

		$('#WagerContent').on('click', ".retry", function () {
			LINES.helpers.miniBetList.loadBetList();
			return false;
		});

		LINES.helpers.miniBetList.showNewResults();
	    
		var href = LINES.utils.getParameterByName("wager", window.location.hash);

		if (href != null) {
		    this.callBetListUrl(href);
		}

	},

	clickCompactTicket: function (clickedDiv) {
		try {
			var clickedDivId = clickedDiv.attr("id");
			var ticketNumber = clickedDivId.substring(13);
			LINES.helpers.miniBetList.showAcceptedTicket(ticketNumber);
			return false;
		}
		catch (err) {
			LINES.logError(err);
			return true;
		}
	},

	showNewResults: function () {
		$("#acceptedWagerList").find(".acceptedTicket").css("display", "none");
		$("#acceptedWagerList").find("#acceptedTicket1").css("display", "block");
		$("#acceptedWagerList").find("#compactTicket1").css("display", "none");
		$("#acceptedWagerList").find(".compactTicket").removeClass("hidden");
		LINES.utils.hideLoadingDiv("acceptedWagerList");
	},
	
	getUrl: function () {
	    return LINES.config.virtualDirectory + "BetList/GetMini/" + LINES.enums.betListDuration.Last10Ungraded + "?customerId=" + LINES.state.customerId;
    },

	loadBetList: function () {
		//show loading
		LINES.utils.showLoadingDiv($("#acceptedWagerList"), "medium", "center", true);
	    var href = this.getUrl();
        this.callBetListUrl(href);
	},
	
	callBetListUrl: function (href) {
	    
	    //START: Action StopWatch
	    var actionTimer = new LINES.stopWatch2();
	    actionTimer.startstop();

	    LINES.helpers.tabs.activateTabWithHash("wager", href);

	    //get wager list
	    $.ajax({
	        type: "POST",
	        url: href,
	        data: "test=test", // workaround for browser bug, post cannot be empty
	        dataType: 'text',
	        success: function (result) {
	            //STOP: Action StopWatch & Log
	            actionTimer.startstop();
	            LINES.utils.logNetworkCall(actionTimer.Getms(), href, false);

	            $('#WagerContent').html(result);
	            LINES.helpers.miniBetList.showNewResults();
	        },
	        error: function (xhr, textStatus, thrownError) {
	            //STOP: Action StopWatch & Log
	            actionTimer.startstop();
	            LINES.utils.logNetworkCall(actionTimer.Getms(), href, true);

	            LINES.utils.hideLoadingDiv("acceptedWagerList");
	            $('#WagerContent').find(".betListContainer").html($('#errorMessageSlim').html());
	            if (thrownError == undefined) thrownError = "";
	            LINES.logError(xhr.status + " " + textStatus + " " + xhr.statusText + " " + thrownError + " " + this.url, true, xhr.status);
	        }
	    });
    },

	hideAllWagers: function () {
		$("#acceptedWagerList").find(".acceptedTicket").slideUp();
		$("#acceptedWagerList").find(".compactTicket").slideDown();
	},

	showAcceptedTicket: function (ticketNumber) {
		LINES.helpers.miniBetList.hideAllWagers();
		var compactTicketId = "compactTicket" + ticketNumber;
		var fullTicketId = "acceptedTicket" + ticketNumber;
		$("#" + compactTicketId).slideUp();
		$("#" + fullTicketId).slideDown();
	}
};﻿/// <reference path="~/Scripts/docs/jquery-1.7.1-vsdoc.js" />

//*** ON DOCUMENT LOAD ***

LINES.onload = function () {

    $(window).on('beforeunload', function () {        
    });

    /* START: Infinite Scroll */
    var didScroll = false,
    pageHeight = 0,
    endPage = 0,
    timer = false;
    


    $(window).scroll(function () {
        
        if (!didScroll) {

            timer = setTimeout(function () {
                if (didScroll) {
                    didScroll = false;
                    clearTimeout(timer);

                    pageHeight = $(document).height();
                    endPage = pageHeight * 0.95; // set end of page to 95% of page height

                    //hide more games link if all games loaded
                    if (LINES.state.allLeaguesVisible) {
                        LINES.helpers.Sport.hideLoadMoreGames();
                    }

                    // Check if end of page scroll
                    if ($(window).height() + $(window).scrollTop() > endPage) {

                        //check if lines being displayed 
                        if (LINES.state.enableInfiniteScroll && !LINES.state.linesLoading) {
                            // make call to get next page
                            LINES.helpers.Sport.displayMoreLeagues();
                        }
                    }
                }
            }, 250);
        }
        didScroll = true;
    });

    $("#loadMoreGamesLink").click(function () {
        LINES.helpers.Sport.displayMoreLeagues();
    });

    /* END: Infinite Scroll */

    // setup default ajax error handling
    $.ajaxSetup({
        error: function(xhr, textStatus, thrownError) {
            LINES.utils.hideLoadingDiv();
            if (thrownError == undefined) thrownError = "";
            
            var errorMessage = xhr.status + " " + textStatus + " " + xhr.statusText + " " + thrownError + " " + this.url;
            var error = new Error(errorMessage);
            error.status = xhr.status;
        	// do not log parsererror
            if (textStatus == "parsererror") {
            	error.ignoreError = true;
            } else {
            	LINES.logError(error, false, xhr.status);
            }
        }
    });

    $.ajax({
        type: "POST",
        url: LINES.config.virtualDirectory + "Asia/GetState",
        data: "test=test", // workaround for browser bug, post cannot be empty
        success: function(json) {
            var state = json.state;
            $.each(state, function(key, value) {
                if (key.indexOf("intelli") == -1) {
                    LINES.state[key] = value;
                } else if (key.indexOf("intellitrackerJsUrl") == -1) {
                    INTELLITRACKER[key.replace("intelli", "")] = value;
                }
            });
            
            if (json.hashes != undefined) {
                $.each(json.hashes, function (key, value) {
                    LINES.utils.addParameterToHashTag(key, value);
                });
            }

            for (var helperName in LINES.helpers) {
                var helper = LINES.helpers[helperName];
                if (helper["enhancedInit"] != undefined) {
                    helper["enhancedInit"]();
                }
            }

            try {
                
                LINES.utils.logs.learn('lines.league', 'lines.market', 'lines.betticket', 'lines.sport', 'lines.state', 'lines.ajax', 'lines.betmenu');

				// load intellitracker
            	if (!LINES.utils.isIE7() && window.location.hostname == "members.pinnaclesports.com") {
                    $LAB.script(state.intellitrackerJsUrl)
                        .script("https://tracker.pinnaclesports.com/e/clicks.js");
                }
            } catch(e) {
            }

            // load parlay ticket
        	PSPARLAYTICKET.load();
        },
        dataType: 'json'
    });

    // begin countdown
    setTimeout(LINES.timers.mainCountDown, 1000);

    $("#teaser-pop").click(function (e) {
        e.stopPropagation();
        var href = $(this).attr("href");
        var teasersPop = window.open(href, "listenWindow", "width=1000,height=600");
        if (window.focus) { teasersPop.focus() }

        if (!teasersPop.closed) { teasersPop.focus() }
        return false;
    });

    $("#outrights-pop").click(function (e) {
        e.stopPropagation();
        var href = $(this).attr("href");
        var outrightsPop = window.open(href, "listenWindow", "width=1000,height=600");
        if (window.focus) { outrightsPop.focus() }

        if (!outrightsPop.closed) { outrightsPop.focus() }
        return false;
    });

    $("#cashier-pop").click(function (e) {
        e.stopPropagation();
        var href = $(this).attr("href");
        var outrightsPop = window.open(href, "listenWindow", "width=1000,height=600");
        if (window.focus) { outrightsPop.focus() }

        if (!outrightsPop.closed) { outrightsPop.focus() }
        return false;
    });

    $("#pdetails-pop").click(function (e) {
        e.stopPropagation();
        var href = $(this).attr("href");
        var personalDetailsPop = window.open(href, "listenWindow", "width=1000,height=600");
        if (window.focus) { personalDetailsPop.focus() }

        if (!personalDetailsPop.closed) { personalDetailsPop.focus() }
        return false;
    });

    dataLayer.push({
        'd.language': LINES.state.culture,
        'd.oddsType': LINES.state.oddsType,
        'd.referrer': LINES.state.referrer,
        'd.clientID': LINES.state.IntellitrackerId,
        'd.domain': window.location.hostname,
        'd.site': 'desktop',
        'd.property': 'sportsbook',
        'd.logStatus': true,
        'd.view': 'asian'
    });

};
﻿/// <reference path="~/Scripts/docs/jquery-1.7.1-vsdoc.js" />

//*** ON DOCUMENT UNLOAD ***

LINES.onunload = function () {

   
};
﻿/// <reference path="~/Scripts/docs/jquery-1.7.1-vsdoc.js" />

LINES.helpers.pendingBetList = {

	enhancedInit: function () {
		$("#PendingContent").on('click', "#pendingBetsRefresh", function (event) { event.preventDefault(); LINES.helpers.pendingBetList.refreshWagerList(); return false; });
		$('#PendingContent').on('click', ".retry", function () {
			LINES.helpers.pendingBetList.refreshWagerList();
			return false;
		});
	    
		var href = LINES.utils.getParameterByName("ticket", window.location.hash);

		if (href != null) {
		    this.callPendingBetUrl(href);
		}
	},

	loadBetList: function () {
		//show loading
	    LINES.utils.showLoadingDiv($("#pendingBetList"), "medium", "center", true);

	    var href = LINES.config.virtualDirectory + "BetList/GetMini/" + LINES.enums.betListDuration.LivePendingClearance + "?customerId=" + LINES.state.customerId;

	    LINES.helpers.tabs.activateTabWithHash("ticket", href);

	    this.callPendingBetUrl(href);
	},
	
	callPendingBetUrl: function (href) {
	    //START: Action StopWatch
	    var actionTimer = new LINES.stopWatch2();
	    actionTimer.startstop();

	    //get wager list
	    $.ajax({
	        type: "POST",
	        url: href,
	        data: "test=test", // workaround for browser bug, post cannot be empty
	        dataType: 'text',
	        success: function (result) {
	            //STOP: Action StopWatch & Log
	            actionTimer.startstop();
	            LINES.utils.logNetworkCall(actionTimer.Getms(), href, false);

	            $('#PendingContent').html(result);
	            LINES.utils.hideLoadingDiv("pendingBetList");
	            var pendingRefresh = $("#pendingBetsRefresh");
	            if (!pendingRefresh.length > 0 && LINES.state.pendingListHasWagers) {
	                LINES.state.pendingListHasWagers = false;
	                LINES.state.pendingListTimerEnabled = false;
	                // The pending list is now empty but had wagers in it
	                // switch to the bet list tab to show the accepted/rejected wagers
	                LINES.helpers.tabs.selectTab(LINES.enums.tab.Wager);
	                LINES.helpers.miniBetList.loadBetList();
	            }
	            else if (!pendingRefresh.length > 0) {
	                LINES.state.pendingListHasWagers = false;
	                LINES.state.pendingListTimerEnabled = false;
	            }
	            else {
	                LINES.state.timerCountDownPendingRefresh = LINES.config.timerLimitPendingRefresh;
	                LINES.state.pendingListHasWagers = true;
	                LINES.state.pendingListTimerEnabled = true;
	            }
	        },
	        error: function (xhr, textStatus, thrownError) {
	            //STOP: Action StopWatch & Log
	            actionTimer.startstop();
	            LINES.utils.logNetworkCall(actionTimer.Getms(), href, true);

	            LINES.utils.hideLoadingDiv("pendingBetList");
	            $('#PendingContent').find(".betListContainer").html($('#errorMessageSlim').html());
	            if (thrownError == undefined) thrownError = "";
	            LINES.logError(xhr.status + " " + textStatus + " " + xhr.statusText + " " + thrownError + " " + this.url, true, xhr.status);
	        }
	    });
    },

	refreshWagerList: function () {
		var pendingRefresh = $("#pendingBetsRefresh");
		LINES.state.pendingListTimerEnabled = false;
		pendingRefresh.find('span').html(LINES.state.translationsStore["Please Wait"]);
		LINES.helpers.pendingBetList.loadBetList();
		LINES.state.timerCountDownPendingRefresh = LINES.config.timerLimitPendingRefresh;
	},

	countDown: function () {
		var pendingRefresh = $("#pendingBetsRefresh");
		if (pendingRefresh.length > 0 && LINES.state.pendingListTimerEnabled) {
			LINES.state.timerCountDownPendingRefresh--;
			if (LINES.state.timerCountDownPendingRefresh == 0) {
				LINES.helpers.pendingBetList.refreshWagerList();
			}
			else if (LINES.state.timerCountDownPendingRefresh > 0) {
				pendingRefresh.find('span').html(LINES.state.translationsStore["refresh"] + "&nbsp;" + LINES.state.timerCountDownPendingRefresh);
			}
		}
	}
};
﻿/// <reference path="~/Scripts/docs/jquery-1.7.1-vsdoc.js" />
/// <reference path="~/Scripts/lines/lines.js" />
/// <reference path="~/Scripts/lines/lines.utils.js" />

LINES.helpers.results = {
	//static methods
	enhancedInit: function () {
		$("#linkNormalGamesResults").click(function () { LINES.helpers.results.open(); return false; });
		var results = $("#Results");
		results.on('click', ".close", function () { LINES.helpers.results.close(); return false; });
		results.on('click', '.resultsFilter', function () { LINES.helpers.results.filter(this); return false; });
		results.on('change', '#resultsFilterSport', function () { LINES.helpers.results.applyFilter(); return false; });
		results.on('change', '#resultsFilterLeague', function () { LINES.helpers.results.applyFilter(); return false; });
		results.on('change', '#resultsFilterSort', function () { LINES.helpers.results.applyFilter(); return false; });
		results.on('change', '#resultsFilterDate', function () { LINES.helpers.results.applyDateFilter(); return false; });
		results.on('click', '#resultsFilterTodayDate', function () { LINES.helpers.results.applyTodayDate(); return false; });
		results.on('click', '#resultsFilterYesterdayDate', function () { LINES.helpers.results.applyYesterdayDate(); return false; });
		LINES.helpers.results.initDatePicker();

		var resultUrl = LINES.utils.getParameterByName("results", window.location.hash);
		if (resultUrl) LINES.helpers.results.open(resultUrl);
	},

	isOpen: function () {
		return !($('#Results').hasClass('hidden'));
	},

	open: function (theUrl) {
	    LINES.state.enableInfiniteScroll = false;

		//close open popups
		LINES.utils.popups.closeAllExcept("results");
	    LINES.utils.hideLines();
		// show results
		$('#Results').removeClass('hidden');
		LINES.helpers.results.load(theUrl);
	},

	load: function (theUrl) {
		var results = $('#Results');
		LINES.utils.showLoadingDiv(results.find('.content'), "medium");
		if (theUrl == null) theUrl = LINES.config.virtualDirectory + "Asia/" + LINES.state.culture + "/Results/NormalGames/";
		// clear hash
		LINES.utils.removeAllHashtags();
		LINES.helpers.results.ajaxUpdate(theUrl);
	},

	update: function () {
		var results = $('#Results');
		LINES.utils.showLoadingDiv(results.find('.content'), "medium");
		var theUrl = LINES.config.virtualDirectory + "Asia/" + LINES.state.culture + "/Results/NormalGames/" + this.selectedSorting +
			"/" + this.selectedSportId +
			"/" + this.selectedLeagueId +
			"/" + this.selectedDate;
		LINES.helpers.results.ajaxUpdate(theUrl);
	},

	ajaxUpdate: function (theUrl) {
		LINES.helpers.results.updateHashTag(theUrl);
		//START: Action StopWatch
		var actionTimer = new LINES.stopWatch2();
		actionTimer.startstop();

		$.ajax({
			type: "GET",
			url: theUrl,
			success: function (result) {
				//STOP: Action StopWatch & Log
				actionTimer.startstop();
				LINES.utils.logNetworkCall(actionTimer.Getms(), theUrl, false);

				LINES.utils.hideLoadingDiv();
				$('#Results').html(result);
				LINES.helpers.results.initDatePicker();
			},
			dataType: 'text'
		});
	},

	updateHashTag: function (theUrl) {
		LINES.utils.addParameterToHashTag("results", theUrl);
	},

	initDatePicker: function () {
		var selectedDate = $('#resultsFilterDate');
		selectedDate.datepicker({
			showOn: "both",
			dateFormat: 'yy-m-d',
			buttonImage: LINES.config.virtualDirectory + "Static/Images/template/calendar.gif",
			buttonText: "Select A Date",
			maxDate: 'today',
			minDate: '-60D',
			buttonImageOnly: true
		});
	},

	applyFilter: function () {
		LINES.helpers.results.setSelectedFilter();
		LINES.helpers.results.update();
	},

	applyDateFilter: function () {
		LINES.helpers.results.setSelectedFilter();
		this.selectedLeagueId = 0;
		LINES.helpers.results.update();
	},

	setSelectedFilter: function () {
		this.selectedSportId = $("#resultsFilterSport").val();
		this.selectedLeagueId = $("#resultsFilterLeague").val();
		this.selectedSorting = $("#resultsFilterSort").val();
		this.selectedDate = $("#resultsFilterDate").val();
	},

	applyYesterdayDate: function () {
		var todayDate = new Date();
		var yesterdayDate = todayDate.getFullYear() + "-" + (todayDate.getMonth() + 1) + "-" + (todayDate.getDate() - 1);
		LINES.helpers.results.setSelectedFilter();
		$("#resultsFilterDate").val = yesterdayDate;
		this.selectedDate = yesterdayDate;
		this.selectedLeagueId = 0;
		LINES.helpers.results.update();
	},

	applyTodayDate: function () {
		var todayDate = new Date();
		var strtodayDate = todayDate.getFullYear() + "-" + (todayDate.getMonth() + 1) + "-" + todayDate.getDate();
		LINES.helpers.results.setSelectedFilter();
		$("#resultsFilterDate").val = strtodayDate;
		this.selectedDate = strtodayDate;
		this.selectedLeagueId = 0;
		LINES.helpers.results.update();
	},

	filter: function (obj) {
		var results = $('#Results');
		var href = obj.toString();
		var filterId = href.substr(href.lastIndexOf("/") + 1);
		results.find('.resultsFilter').removeClass("selected");
		results.find('#resultsFilter').val(filterId);
		$(obj).addClass("selected");
	},

	close: function () {
	    LINES.state.enableInfiniteScroll = true;
		// clear hash
		LINES.utils.dropParameterFromHashTag("results");
		LINES.utils.showLines();
		LINES.helpers.results.closeHtml();
	},

	closeHtml: function () {
		$('#Results').addClass("hidden");
		$("#Results").find('content').html('');
		LINES.utils.hideLoadingDiv();
	}
}
﻿/// <reference path="~/Scripts/docs/jquery-1.7.1-vsdoc.js" />

LINES.routing = {
    getStateFromMenuUrl: function (url) {
        var parts = url.split("/");
        var i = $.inArray("Asia", parts);
        return {
            culture: parts[i + 1],
            sport: parts[i + 3],
            eventFilter: parts[i + 4],
            selectedLineViewType: parts[i + 5],
            selectedPeriodNumber: parts[i + 6],
            selectedTime: parts[i + 7],
            customerType: parts[i + 8],
            siteAccessType: parts[i + 9],
            oddsFormat: parts[i + 10],
            timeZoneId: parts[i + 11],
            isFattened: parts[i + 12]
        };
    },
    
    getUrl: function () {
        var url = LINES.config.virtualDirectory + "Asia/" + LINES.state.culture + "/";

        var w = function(part) { 
            if (part == null) { part = "null"; }
            url += part + '/';
        };
        
        $.each(arguments, function (_, arg) { if ($.isArray(arg)) { $.each(arg, function(__, a) { w(a); });} else { w(arg); } });
       
        return url;
    },
    
    getLinesUrl: function (sportName, eventFilterName) {

    	var s = LINES.state;
        var url;
	    if (eventFilterName == "Parlay") {

	        url = this.getUrl("GetLines",
	            sportName,
	            eventFilterName,
	            LINES.enums.lineViewType.Double,
	            s.selectedPeriodNumber,
	            LINES.state.selectedTimeForParlays,
	            s.customerType,
	            s.siteAccessType,
	            LINES.enums.oddsFormatName[s.oddsFormat],
	            s.timeZoneId,
	            s.isFattened
	        );
	    } else {
	           url = this.getUrl("GetLines",
               sportName,
               eventFilterName,
               s.selectedLineViewType,
               s.selectedPeriodNumber,
               s.selectedTime,
               s.customerType,
               s.siteAccessType,
               LINES.enums.oddsFormatName[s.oddsFormat],
               s.timeZoneId,
               s.isFattened
            );
	    }
       

        return url;
    },
    
    getBetUrl: function (sportName, eventFilterName, leagueIds) {
        var s = LINES.state;
        var e = LINES.enums;
        var lineViewType;
        var selectedTime;

        if (eventFilterName == "Parlay") {
            lineViewType = LINES.enums.lineViewType.Double;
            selectedTime = LINES.state.selectedTimeForParlays;
        } else {
            lineViewType = s.selectedLineViewType;
            selectedTime = s.selectedTime;
        }

        $.each(e.lineViewType, function (typeName, typeValue) {

            if (lineViewType == typeValue) {
                lineViewType = typeName;
                return false;
            }

            return true;
        });


        var args = [
            "Bet",
            sportName,
            eventFilterName,
            lineViewType,
            s.selectedPeriodNumber,
            selectedTime,
            s.customerType,
            s.siteAccessType,
            e.oddsFormatName[s.oddsFormat],
            s.timeZoneId
        ];

        var leagueIsNull = leagueIds == null || leagueIds == "";

        if (s.isFattened) {
            args.push("true");
        } else {
            if (!leagueIsNull) {
                args.push("false");
            }
        }

        var url = this.getUrl(args);

        if (!leagueIsNull) {
            url += '?selectedLeagueIds=' + leagueIds;
        }

        return url + window.location.hash;
    },
    
    getBetMenuUrl: function () {
        var s = LINES.state;
        var url = this.getUrl("BetMenu",
            s.selectedEventFilterId,
            s.selectedLineViewType,
            s.customerType,
            s.siteAccessType,
            s.oddsFormat,
            s.timeZoneId,
            s.isFattened
        );

        return url;
    },
    
    getUpdatesUrl: function (marketType, selectedEventFilterId, selectedPeriodNumber, selectedTime) {
        
        var timeStamp = (LINES.state.timeStamps[marketType] == undefined) ? null : LINES.state.timeStamps[marketType];

        return LINES.config.virtualDirectory + "Asia/GetUpdates/?marketType=" + marketType + "&timeStamp=" + timeStamp +
				"&selectedEventFilterId=" + selectedEventFilterId +
				"&selectedPeriodNumber=" + selectedPeriodNumber +
				"&selectedTime=" + selectedTime;
    }
}﻿/// <reference path="~/Scripts/docs/JSLINQ-vsdoc.js" />
/// <reference path="~/Scripts/docs/jquery-1.7.1-vsdoc.js" />

LINES.helpers.selectBuySellLevels = {
	enhancedInit: function () {
		$("#lines_area").on('change', ".buySellLevels", function (e) {
			LINES.helpers.selectBuySellLevels.select(this);
			return false;
		});
	},

	select: function (element) {
		var jqElement = $(element);
		var uniqueLeagueId = jqElement.parents(".LeagueContainer").attr("id");
		var idPieces = LINES.helpers.League.getUniqueLeagueIdPieces(uniqueLeagueId);
		var leagueId = idPieces.leagueId;
		var sportId = idPieces.sportId;
		var selectedBuySellLevel = jqElement.val();
		LINES.state.selectedBuySellLevels[leagueId] = selectedBuySellLevel;

		var sportName = LINES.state.urlParams.sportName;
		var eventFilterName = LINES.state.urlParams.eventFilterName;

		var leagueIds = {};
		var filters = {};
		filters[LINES.state.selectedEventFilterId] = [];
		filters[LINES.state.selectedEventFilterId].push(leagueId);
		leagueIds[sportId] = filters;

		LINES.ajax.session.postBuySellLevels(leagueId, selectedBuySellLevel);

		LINES.helpers.betMenu.getLinesPromise(
	        sportName,
	        eventFilterName,
	        LINES.state.selectedBuySellLevels,
	        leagueIds,
			false) // disable push state, if enabled it will cause only this league to be selected if the browser refreshes
	        .done(function (linesContainerJson) {

	        	try {

	        		if (linesContainerJson != null && linesContainerJson.LinesRequest != null) {
	        			var sportJson = linesContainerJson.Sport;
	        			for (var marketIndex = 0; marketIndex < sportJson.Markets.length; marketIndex++) {
	        				var marketJson = sportJson.Markets[marketIndex];
	        				var leagueJson;
	        				for (var leagueKey in marketJson.GamesContainers) {
	        					leagueJson = marketJson.GamesContainers[leagueKey];

	        					if (leagueJson == undefined) {
	        						continue;
	        					}

	        					// Keep state up to date with any changes
	        					for (var currentMarketIndex in LINES.state.currentSportJson.Markets) {
	        						if (LINES.state.currentSportJson.Markets[currentMarketIndex].Market == marketJson.Market) {
	        							LINES.state.currentSportJson.Markets[currentMarketIndex].GamesContainers[leagueKey] = $.secureEvalJSON($.toJSON(leagueJson));
	        							LINES.state.currentSportJson.Markets[currentMarketIndex].GamesContainers[leagueKey].IsVisible = true;
	        						}
	        					}

	        					var uniqLeagueId = LINES.helpers.League.getUniqueLeagueId(
									LINES.enums.marketTypeName[marketJson.Market],
									sportId,
									leagueJson.LeagueId);

	        					LINES.state.updateLeagueQueue.push({
	        						"uniqueLeagueId": uniqLeagueId,
	        						"leagueJson": leagueJson,
	        						"isNewLeague": false,
	        						"cssViewType": sportJson.CssViewType,
	        						"isUpdate": false
	        					});
	        				}
	        			}
	        		}

	        		LINES.utils.popups.closeAll();

	        		LINES.helpers.betMenu.state.isRendering(true);

	        		if (LINES.state.updateLeagueQueue.length > 0) {
	        			// 'async' DOM rendering
	        			LINES.helpers.League.processLeagueQueue(sportId);
	        		}

	        	} catch (err) {
	        		LINES.logError(err);
	        	}
	        }).fail(function (err) {
	        	LINES.logError(err);
	        });
	}
}

﻿/// <reference path="~/Scripts/docs/JSLINQ-vsdoc.js" />
/// <reference path="~/Scripts/docs/jquery-1.7.1-vsdoc.js" />

LINES.helpers.selectLeagues = {
	enhancedInit: function () {
		$("#lines_area").on('click', "#SelectLeaguesButton", function () {
			LINES.utils.showLoadingDiv($(this).parent(), "small", "left");
			// close alt. lines
			LINES.helpers.alternateLines.closeHtml();
			// open select leagues
			return LINES.helpers.selectLeagues.open(this);
		});

		var altLines = $("#SelectLeagues");
		altLines.on("click", ".close", function () {
			return LINES.helpers.selectLeagues.close();
		});

		// select leagues
		var selectLeagues = $("#SelectLeagues");
		selectLeagues.on('click', '.SelectAll', function () {
			return LINES.helpers.selectLeagues.selectAll();
		});
		selectLeagues.on('click', ".DeselectAll", function () {
			return LINES.helpers.selectLeagues.deselectAll();
		});
		selectLeagues.on('click', ".Cancel", function () {
			return LINES.helpers.selectLeagues.close();
		});
		selectLeagues.on('click', ".Ok input", function () {
			return LINES.helpers.selectLeagues.ok();
		});
		// position by select leagues button
		if (!selectLeagues.hasClass("hidden")) {
			LINES.helpers.selectLeagues.position($("#SelectLeaguesButton"), true);
		}

		if (LINES.utils.getParameterByName("leagues", window.location.hash) != null) {
		    this.open();
		}
	},

	selectAll: function () {
	    $("#SelectLeagues .Content input:checkbox").attr('checked', true);
	    return false;
	},

	deselectAll: function (clickedLink) {
	    $("#SelectLeagues .Content input:checkbox").attr('checked', false);
	    return false;
	},

	isOpen: function () {
		return !($('#SelectLeagues').hasClass('hidden'));
	},

	updateHash: function (url) {
	    var encodedLeagueIds = $.toJSON(LINES.state.selectedLeagueIds);
	    var selectedEventFilterId = LINES.state.selectedEventFilterId;
	    var firstChar = '?';
	    if (url.indexOf('?') > -1) {
	        firstChar = '&';
	    }

	    var hashUrlParam = url + firstChar + 'selectedEventFilterId=' + selectedEventFilterId + '&selectedLeagueIds=' + encodedLeagueIds;
	    LINES.utils.addParameterToHashTag("leagues", hashUrlParam);
	},

	clearHash: function () {
	    LINES.utils.dropParameterFromHashTag("leagues");
	},

	open: function (clickedLink) {

	    var leaguesSelected = $('#SelectLeagues').attr('class') == 'hidden';

	    var leaguesUrl = LINES.config.virtualDirectory + "Asia/GetSelectLeagues/";
        
		try {
		    if (leaguesSelected) {

		        //START: Action StopWatch
		        var actionTimer = new LINES.stopWatch2();
		        actionTimer.startstop();

				$.ajax({
					type: "POST",
					url: leaguesUrl,
					data: { selectedEventFilterId: LINES.state.selectedEventFilterId, selectedLeagueIds: $.toJSON(LINES.state.selectedLeagueIds) },
					success: function (responseStr) {
						try {
						    //STOP: Action StopWatch & Log
						    actionTimer.startstop();
						    LINES.utils.logNetworkCall(actionTimer.Getms(), leaguesUrl, false);

						    $('#SelectLeagues').html(responseStr);
						    $('#SelectLeagues').removeClass("hidden");
						    LINES.helpers.selectLeagues.position($(clickedLink), false);
						    LINES.utils.hideLoadingDiv();
						}
						    // LINES.helpers.selectLeagues.position is known to fail in IE sometimes
						catch(err) {
						    //alert(err);
						}
					},
					error: function (xhr, textStatus, thrownError) {
						//STOP: Action StopWatch & Log
						actionTimer.startstop();
						LINES.utils.logNetworkCall(actionTimer.Getms(), leaguesUrl, true);

						LINES.utils.hideLoadingDiv();
						$('#SelectLeagues').html($('#errorMessage').html());
						$('#SelectLeagues').removeClass("hidden");
						LINES.helpers.selectLeagues.position($(clickedLink), false);
						if (thrownError == undefined) thrownError = "";
						LINES.logError(xhr.status + " " + textStatus + " " + xhr.statusText + " " + thrownError + " " + this.url, true, xhr.status);
					},
					dataType: 'text'
				});

		        this.updateHash(leaguesUrl);
			}
			// close if already open
			else {
				LINES.utils.hideLoadingDiv();
				LINES.helpers.selectLeagues.close();
			}

			return false;
		}
		catch (err) {
			LINES.logError(err);
			return true;
		}
	},

	closeHtml: function () {
		$('#SelectLeagues').addClass("hidden");
		$("#SelectLeagues").html('');
	    this.clearHash();
	},

	close: function () {
	    
		LINES.helpers.selectLeagues.closeHtml(); // instant close, don't wait for ajax response
		try {
			this.clearHash();

			return false;
		}
		catch (err) {
			LINES.logError(err);
			return true;
		}
	},

	ok: function () {
		try {
	        
			var selectLeaguesDiv = $("#SelectLeagues");
			var formData = selectLeaguesDiv.find("form").serialize();
			var hasSelection = formData.indexOf('IsChecked=true') != -1;
			if (hasSelection) {
				//store the league selection in the variable

				var sportId = LINES.state.selectedSportId;

			    if (LINES.state.selectedLeagueIds == null) {
			        LINES.state.selectedLeagueIds = {};
			    }

				if (typeof LINES.state.selectedLeagueIds[sportId] === 'undefined') {
				    LINES.state.selectedLeagueIds[sportId] = {};
				}
				var filters = LINES.state.selectedLeagueIds[sportId];
				filters[LINES.state.selectedEventFilterId] = [];

				$("input[type=checkbox]", selectLeaguesDiv).each(function () {
					if ($(this).is(':checked')) {
						var leagueId = $(this).parent().find('input').val();
						filters[LINES.state.selectedEventFilterId].push(leagueId);
						LINES.state.selectedLeagueIds[sportId] = filters;
					}
				});

				LINES.ajax.session.postSelectLeagues(formData);

			    LINES.helpers.betMenu.loadLines(
			        LINES.state.urlParams.sportName,
			        LINES.state.urlParams.eventFilterName, false, true)
			        .fail(function(e) {
			            LINES.logError(e);
			        });

				LINES.helpers.selectLeagues.closeHtml();
                
				this.clearHash();
			}
			else {
				alert(LINES.state.translationsStore["Please select at least one league"]);
				this.updateHash(LINES.config.virtualDirectory + "AsiaSession/SelectLeagues/");
			}

			return false;
		}
		catch (err) {
			LINES.logError(err);
			return true;
		}
	},

	position: function (clickedLink, isOnload) {
		var mainDiv = $('#SelectLeagues');
		mainDiv.css("position", "absolute");
		var linkOffset = 0;
		if (clickedLink.offset() != null) {
			linkOffset = clickedLink.offset();
		}
		var linesArea = $("#lines_area");
		var diff = (-4);
		var headerOffset = linesArea.offset();
		var headerOffsetTop = 0;
		if (headerOffset != null) {
			headerOffsetTop = headerOffset.top;
		}
		var top = linkOffset.top - headerOffsetTop - diff + linesArea.scrollTop() + clickedLink.parent().height();
		mainDiv.css("top", top);
		mainDiv.css("right", 3);
		mainDiv.removeClass("hidden");
	}
}

﻿/// <reference path="~/Scripts/docs/JSLINQ-vsdoc.js" />
/// <reference path="~/Scripts/docs/jquery-1.7.1-vsdoc.js" />


LINES.helpers.selectLineViewType = {
	enhancedInit: function () {
		$("#lines_area").on('change', '#lineViewType', function () {
			LINES.helpers.selectLineViewType.select();
			return false;
		});
	},

	select: function () {
	    
	    try {
			var lineViewType = $("#lineViewType").val();
			if (lineViewType != null) {
			    LINES.state.selectedLineViewType = lineViewType;

			    //alert(LINES.state.urlParams.eventFilterName);

				try {
				    LINES.helpers.betMenu.loadLines(
				        LINES.state.urlParams.sportName,
				        LINES.state.urlParams.eventFilterName, false, true);
				} catch(err) {
				    alert(err);
				}
			}
		}
	    catch (err) {

	        alert(err);
			LINES.logError(err);
			return true;
		}
	}
}
﻿/// <reference path="~/Scripts/docs/JSLINQ-vsdoc.js" />
/// <reference path="~/Scripts/docs/jquery-1.7.1-vsdoc.js" />


LINES.helpers.selectOddsFormat = {
	enhancedInit: function () {
		$("#lines_area").on('change', '#oddsFormat', function () {
			LINES.helpers.selectOddsFormat.select();
			return false;
		});
	},

	select: function () {
		try {
			var oddsFormat = $("#oddsFormat").val();
			if (oddsFormat != null) {
				$.ajax({
					type: "POST",
					data: "oddsFormat=" + oddsFormat,
					url: LINES.config.virtualDirectory + "AsiaSession/SelectOddsFormat/",
					success: function () {
						LINES.reloadPage("LINES.helpers.selectOddsFormat.select()");
					},
					dataType: 'text'
				});
			}
		}
		catch (err) {
			LINES.logError(err);
			return true;
		}
	}
}
﻿/// <reference path="~/Scripts/docs/JSLINQ-vsdoc.js" />
/// <reference path="~/Scripts/docs/jquery-1.7.1-vsdoc.js" />


LINES.helpers.selectPeriod = {
    enhancedInit: function () {
        $("#lines_area").on('change', '#period', function () {
            LINES.helpers.selectPeriod.select();
            return false;
        });
    },

    select: function () {
        try{
        	var periodNumber = $("#period").val();
        	if (periodNumber != null) {
        	    LINES.state.selectedPeriodNumber = periodNumber;

        	    //alert(LINES.state.selectedPeriodNumber);

        		try {
        			LINES.helpers.betMenu.loadLines(LINES.state.urlParams.sportName, LINES.state.urlParams.eventFilterName, false, true);
        		}
        		catch (err) { }
        	}
        }
        catch (err) {
            LINES.logError(err);
            return true;
        }
    }
}
﻿/// <reference path="~/Scripts/docs/JSLINQ-vsdoc.js" />
/// <reference path="~/Scripts/docs/jquery-1.7.1-vsdoc.js" />


LINES.helpers.selectSport = {
	enhancedInit: function () {
		$("#lines_area").on('change', '#sport', function () {
			LINES.helpers.selectSport.select();
			return false;
		});
	},

	select: function () {
		var linesArea = $("#lines_area");
		var sportId = linesArea.find('#sport').val();
		LINES.state.selectedSportId = sportId;
		var menuContent = $("#MenuContent");
		var sport = menuContent.find("#menuSport_" + sportId);
		var parlayEventfilter = sport.find("a.parlay");
	    if (sport.length == 0 || parlayEventfilter.length == 0) {
	        LINES.helpers.betMenu.refresh();
	        setTimeout(function() {
	            sport = menuContent.find("#menuSport_" + sportId);
	            parlayEventfilter = sport.find("a.parlay");
	            sport.find(" a.sportLink").click();
	            setTimeout(function() {
	                parlayEventfilter.click();
	            }, 1000);
	        }, 2000);
	    } else {
	        sport.find(" a.sportLink").click();
	        setTimeout(function() {
	            parlayEventfilter.click();
	        }, 1000);
	    }

	    linesArea.find('#time>option:eq(0)').prop('selected', true);
		linesArea.find('#period>option:eq(0)').prop('selected', true);
		var time = linesArea.find('#time');
		var period = linesArea.find('#period');
		LINES.state.selectedPeriodNumber = period.val();
		LINES.state.selectedTimeForParlays = time.val();

	}
}
﻿/// <reference path="~/Scripts/docs/JSLINQ-vsdoc.js" />
/// <reference path="~/Scripts/docs/jquery-1.7.1-vsdoc.js" />


LINES.helpers.selectTime = {
	enhancedInit: function () {
		$("#lines_area").on('change', '#time', function () {
			LINES.helpers.selectTime.select();
			return false;
		});
	},

	select: function () {
		var linesArea = $("#lines_area");
		var time = linesArea.find('#time');

		if (linesArea.find('#lc_isParlay').val() == "True") {
			LINES.state.selectedTimeForParlays = time.val();
		} else {
			LINES.state.selectedTime = time.val();
		};

		try {

			try {
				LINES.helpers.betMenu.loadLines(LINES.state.urlParams.sportName, LINES.state.urlParams.eventFilterName);
			}
			catch (err) { }
		}
		catch (err) {
			LINES.logError(err);
			return true;
		}
	}
}
﻿/// <reference path="~/Scripts/docs/jquery-1.7.1-vsdoc.js" />
/// <reference path="~/Scripts/lines/lines.js" />
/// <reference path="~/Scripts/lines/lines.utils.js" />

LINES.helpers.settings = {
	//static methods
	enhancedInit: function () {
		$("#linkSettings").click(function () { LINES.helpers.settings.open(); return false; });
		LINES.helpers.settings.enableDefaulSports(true);
		var settings = $("#Settings");
		settings.on('click', '#settingsBoxSave', function () { LINES.helpers.settings.save(); return false; });
		settings.on('change', '#defaultSportSelectionCustom', function () { LINES.helpers.settings.enableDefaulSports();});
		settings.on('change', '#defaultSportSelectionCurrent', function () { LINES.helpers.settings.enableDefaulSports();});
		settings.on('click', ".close", function () { LINES.helpers.settings.close(); return false; });

		var settingsUrl = LINES.utils.getParameterByName("settings", window.location.hash);
	    if (settingsUrl) {
	        LINES.helpers.settings.open(settingsUrl);
	    } else {
	        //LINES.helpers.settings.load(LINES.config.virtualDirectory + "Asia/Settings/");
	    }
	},

	enableDefaulSports: function () {
		var selected = $('input[name="defaultSportSelection"]:checked').val();
		if (selected == "current") {
			$("#defaultSports").attr('disabled', true);
		} else {
			$("#defaultSports").attr('disabled', false);
		}
	},

	isOpen: function () {
		return !($('#Settings').hasClass('hidden'));
	},

	open: function (theUrl) {
	    LINES.state.enableInfiniteScroll = false;

		//close open popups
		LINES.utils.popups.closeAllExcept("settings");

	    LINES.utils.hideLines();
		// show settings
		$('#Settings').removeClass('hidden');
		LINES.helpers.settings.load(theUrl);
	},

	load: function (theUrl) {
		var settings = $('#Settings');
		LINES.utils.showLoadingDiv(settings.find('.content'), "medium");
		if (theUrl == null) theUrl = LINES.config.virtualDirectory + "Asia/Settings/";
		// clear hash
		LINES.utils.removeAllHashtags();
		LINES.helpers.settings.ajaxUpdate(theUrl);
	},

	ajaxUpdate: function (theUrl) {
	    LINES.helpers.settings.updateHashTag(theUrl);

		//START: Action StopWatch
		var actionTimer = new LINES.stopWatch2();
		actionTimer.startstop();

		$.ajax({
			type: "POST",
			url: theUrl,
			success: function (result) {
				//STOP: Action StopWatch & Log
				actionTimer.startstop();
				LINES.utils.logNetworkCall(actionTimer.Getms(), theUrl, false);

				LINES.utils.hideLoadingDiv();
				$('#Settings').html(result);
				LINES.helpers.settings.enableDefaulSports();
			},
			dataType: 'text'
		});
	},

	updateHashTag: function (theUrl) {
		LINES.utils.addParameterToHashTag("settings", theUrl);
	},

	save: function () {
		LINES.utils.showLoadingDiv($('#Settings'), "medium");
		var odd = $("#defaultOdds").val();
		var tzone = $("#defaultTimeZone").val();
		var spt = $("#defaultSports").val();
		var selected = $('input[name="defaultSportSelection"]:checked').val();
		if (selected == "current") {
			spt = null;
		}
		var theUrl = LINES.config.virtualDirectory + "Asia/Settings/" + odd +
			"/" + tzone +
			"/" + spt;
		$.ajax({
			type: "POST",
			url: theUrl,
			success: function (result) {
				LINES.utils.hideLoadingDiv();
				alert(LINES.state.translationsStore["Saved successfully"]);
				window.location.href = LINES.config.virtualDirectory;
			},
			dataType: 'text'
		});
	},

	close: function () {
	    LINES.state.enableInfiniteScroll = true;
		// clear hash
		LINES.utils.dropParameterFromHashTag("settings");
		LINES.utils.showLines();
		LINES.helpers.settings.closeHtml();
	},

	closeHtml: function () {
		LINES.utils.dropParameterFromHashTag("settings");
		$('#Settings').addClass("hidden");
		$("#Settings").find('.noresults').html('');
		LINES.utils.hideLoadingDiv();
	}
}
﻿/// <reference path="~/Scripts/docs/jquery-1.7.1-vsdoc.js" />
/// <reference path="~/Scripts/lines/lines.js" />

// *** SPORT ***
LINES.helpers.Sport = function () {

	var args = $.makeArray(arguments);

	this.sportId = args.shift();
	this.isUpdate = args.shift();
	this.sportJson = args.shift();
	var forceUpdate = args.shift();
	forceUpdate = forceUpdate == undefined ? false : forceUpdate;
	this.isScroll = args.shift();
	this.isScroll = this.isScroll == undefined ? false : this.isScroll;
	this.domElement = $("#" + this.sportId);

	this.oldMarketList = {};
	if (!forceUpdate && this.exists()) {
		try {
			// if this is NOT an update then we may need to remove markets
			// Example: switching from Today event filter to Live event filter
			if (!this.isUpdate) {
				this.updateHeader();
				this.oldMarketList = LINES.helpers.Sport.getMarketListEnum(this.sportId);
				$("#lines").find(".sportName").html(this.sportJson.SportName.toUpperCase());
			} else if (this.sportJson.IsParlay) {
				this.updateDropdownList('sport', this.sportJson.Sports);
			}
		} catch (err) {
			err.message = "LINES.helpers.Sport ctr -> " + err.message;
			throw err;
		}
	}
	else {
		try {
			this.create();
			this.updateHeader();
			this.attach();
		} catch (err) {
			err.message = "LINES.helpers.Sport ctr -> " + err.message;
			throw err;
		}
	}
};

// object methods
LINES.helpers.Sport.prototype.exists = function () {
	return $("#" + this.sportId).exists();
};

LINES.helpers.Sport.prototype.create = function () {
	try {
		var linesElement = $("#lines");

		// close down open sport
		var oldSportId = linesElement.find(".sportContainer").attr("id");

		if (oldSportId !== undefined) {

			LINES.helpers.Sport.close(oldSportId);
		}

		// get template and update values
		var sportDiv = LINES.helpers.Sport.getTemplate();

		sportDiv.attr("id", this.sportId);
		sportDiv.find(".sportName").html(this.sportJson.SportName.toUpperCase());
		sportDiv.find('#leagueIdsPerPage').html(this.sportJson.LeagueIdsPerPage);
		sportDiv.find('#totalAmaountOfPages').val(this.sportJson.TotalAmaountOfPages);

		sportDiv.find(".sportSortOrder").html(this.sportJson.SortOrder);
		// temporarily set dom element to detach market div
		this.domElement = sportDiv;
	} catch (err) {
		err.message = "sport create: " + err.message;
		throw err;
	}
};

LINES.helpers.Sport.prototype.attach = function () {
	try {

		$("#lines").html(this.domElement);

		return this;
	}
	catch (err) {
		err.message = "sport attach: " + err.message;
		throw err;
	}
};

LINES.helpers.Sport.prototype.updateHeader = function () {
	try {
		if (this.sportJson.CssViewType == LINES.enums.cssViewType.Taiwan || this.sportJson.CssViewType == LINES.enums.cssViewType.Moneyline || this.sportJson.CssViewType == LINES.enums.cssViewType.TeamTotal) {
			this.domElement.find('#lineViewType').addClass('hidden');
			this.updateDropdownList('time', this.sportJson.Times).updateDropdownList('period', this.sportJson.Periods);
		} else {
			this.updateDropdownList('time', this.sportJson.Times).updateDropdownList('period', this.sportJson.Periods).updateDropdownList('lineViewType', this.sportJson.LineViewTypes);
		}
		if (this.sportJson.IsParlay) {
			this.domElement.find('#lc_isParlay').val("True");
			this.domElement.find('#sport').removeClass('hidden');
			this.domElement.find('#lineViewType').addClass('hidden');
			this.updateDropdownList('sport', this.sportJson.Sports);
		} else {
			this.domElement.find('#lc_isParlay').val("False");
			this.domElement.find('#sport').addClass('hidden');
		}

		return this;
	} catch (err) {
		err.message = "sport updateHeader: " + err.message;
		throw err;
	}
};

LINES.helpers.Sport.prototype.updateDropdownList = function (dropdownName, list) {
	if (list != undefined) {
		var periodStr = "";
		for (var index in list) {
			var item = list[index];
			var selected = (item.IsSelected) ? 'selected="selected"' : "";
			periodStr += '<option value="' + item.Id + '" ' + selected + '>' + item.Text + '</option>';
		}
		this.domElement.find('#' + dropdownName).html(periodStr);
		this.domElement.find('#' + dropdownName).removeClass('hidden');
	} else {
		this.domElement.find('#' + dropdownName).addClass('hidden');
	}
	return this;
};

// returns the updated market names
LINES.helpers.Sport.prototype.updateMarkets = function (timeStamp, refreshMarkets) {

	var deferred = $.Deferred();
	var idList = [];

	var uniqMarketIds = [];

	try {
		var marketList = this.oldMarketList; // use this list to determine if a market is empty and should be deleted
		var sportJson = this.sportJson;
		var addedMarkets = [];
		var updatedMarkets = [];
		var deletedMarkets = [];
		var uniqMarketId = null;
		var visibleLeagueCount = 0;
		var totalLeagues = 0;
		var marketIndices = [];
		var isRefresh = false;

		// use these vars to manage which leagues need to be removed from the GUI
		var localUniqueLeagueIdStore = LINES.state.uniqueLeagueIdStore.clone();

		if (refreshMarkets.length <= 0) {
			// include all markets when updating
			for (var mIndex = 0; mIndex < sportJson.Markets.length; mIndex++) {
				marketIndices.push(mIndex);
			}
		} else {
			isRefresh = true;
			// only include specific markets to update
			for (var refIndex = 0; refIndex < sportJson.Markets.length; refIndex++) {
				for (var refreshMarketInd = 0; refreshMarketInd < refreshMarkets.length; refreshMarketInd++) {
					if (sportJson.Markets[refIndex].Market == refreshMarkets[refreshMarketInd]) {
						marketIndices.push(refIndex);
					}
				}

			}
		}

		if (!isRefresh) {
			LINES.state.allLeaguesVisible = false;
		}

		if (!this.isUpdate) {
			LINES.state.timeStamps = {};
		}

		for (var mInd = 0; mInd < marketIndices.length; mInd++) {
			var marketIndex = marketIndices[mInd];
			var addedLeagues = [];
			var updatedLeagues = [];
			var deletedLeagues = [];

			var marketJson = sportJson.Markets[marketIndex];
			var marketType = LINES.enums.marketTypeName[marketJson.Market];

			delete marketList[marketType];

			var marketHelper = new LINES.helpers.Market(marketType, this.sportId, sportJson.SportName, sportJson.CssViewType);

			if (!marketHelper.exists()) {
				marketHelper.create(marketJson.MarketName, marketJson.HeaderLabels);
				addedMarkets.push(marketType);
			} else {
				updatedMarkets.push(marketType);
				marketHelper.updateHeaderLabels(marketJson.HeaderLabels);
			}

			if (marketHelper.exists()) {
				var hasLeagues = false;

				for (var leagueKey in marketJson.GamesContainers) {
					hasLeagues = true;
					totalLeagues++;
					var leagueJson = marketJson.GamesContainers[leagueKey];
					var uniqueLeagueId = LINES.helpers.League.getUniqueLeagueId(marketType, this.sportId, leagueJson.LeagueId);

					// only add leagues that are currently visible to stack to process
					if (leagueJson.IsVisible) {
						visibleLeagueCount++;
						if (!leagueJson.DoNotProcess) {
							if (!LINES.helpers.League.doesLeagueExist(uniqueLeagueId)) {
								if (LINES.utils.canLog('lines.sport')) {
									addedLeagues.push(uniqueLeagueId);
								}

								marketHelper.addLeague(uniqueLeagueId, leagueJson, this.isUpdate, sportJson.CssViewType);
							}
							else {
								// apply update if League exists
								if (LINES.utils.canLog('lines.sport')) {
									updatedLeagues.push(uniqueLeagueId);
								}

								LINES.state.updateLeagueQueue.push({
									"uniqueLeagueId": uniqueLeagueId,
									"leagueJson": leagueJson,
									"isNewLeague": false,
									"cssViewType": sportJson.CssViewType,
									"isUpdate": this.isUpdate
								});
							}
						}
						LINES.state.uniqueLeagueIdStore.add(marketType, uniqueLeagueId);
						LINES.utils.assert('lines.sport', LINES.state.uniqueLeagueIdStore[marketType].hasId(uniqueLeagueId), "Missing league id in state: " + uniqueLeagueId);
						localUniqueLeagueIdStore.remove(marketType, uniqueLeagueId);
					}
				}

				marketHelper.setHideMarket(marketJson.HideMarket, (this.isUpdate || this.isScroll), sportJson.IsParlay);
			}

			// delete leagues that didn't come back for this market
			if (localUniqueLeagueIdStore[marketType] != undefined) {
				for (var uniqId in localUniqueLeagueIdStore[marketType].uniqueIds) {
					idList.push(uniqId);

					if (LINES.utils.canLog('lines.sport')) {
						deletedLeagues.push(uniqId);
					}
				}
			}

			// update state timestamps
			if (timeStamp) {
				LINES.state.timeStamps[marketType] = timeStamp;
			}

			var l = function (c, m) {
				if (c.length == 0) {
					LINES.utils.log('lines.sport', m);
				} else {
					LINES.utils.warn('lines.sport', m);
				}

			};

			if (LINES.utils.canLog('lines.sport')) {
				l(addedLeagues, marketType + ", leagues added: (" + addedLeagues.length + ")" + addedLeagues.join(","));
				l(updatedLeagues, marketType + ", leagues changed:(" + updatedLeagues.length + ")" + updatedLeagues.join(","));
				l(deletedLeagues, marketType + ", leagues removed:  (" + deletedLeagues.length + ")" + deletedLeagues.join(",") + "\n");
			}
		}

		if (!isRefresh && visibleLeagueCount == totalLeagues) {
			LINES.state.allLeaguesVisible = true;
		}

		// close leagues of market 
		for (var mType in marketList) {
			uniqMarketId = LINES.helpers.Market.getUniqueMarketId(mType, this.sportId);
			uniqMarketIds.push(uniqMarketId);
			deletedMarkets.push(mType);
		}

	} catch (e) {
		deferred.reject(e);
	}

	var onEnd = function () {
		deferred.resolve(addedMarkets, updatedMarkets, deletedMarkets);
	};

	LINES.helpers.Market.close(uniqMarketIds)
		.done(function () {
			if (idList.length == 0) {
				onEnd();
			} else {
				LINES.helpers.League.closeLeagues(null, idList).done(function () {
					onEnd();
				}).fail(function (err) {
					err.message = "LINES.helpers.League.closeLeagues.fail: " + err.message;
					deferred.reject(err);
				});
			}
		});


	return deferred.promise();
};

LINES.helpers.Sport.prototype.nextVisibleLeagues = function (minGames) {
	var visibleLeagues = [];
	var totalGamesAdded = 0;

	for (var marketIndex = 0; marketIndex < LINES.state.currentSportJson.Markets.length; marketIndex++) {
		var marketType = LINES.enums.marketTypeName[LINES.state.currentSportJson.Markets[marketIndex].Market];
		for (var leagueKey in LINES.state.currentSportJson.Markets[marketIndex].GamesContainers) {
			if (totalGamesAdded >= minGames) {
				return visibleLeagues;
			}
			if (LINES.state.currentSportJson.Markets[marketIndex].GamesContainers[leagueKey].IsVisible) {
				// League is already visible so do not add to queue to be processed again
				LINES.state.currentSportJson.Markets[marketIndex].GamesContainers[leagueKey].DoNotProcess = true;
				continue;
			}
			LINES.state.currentSportJson.Markets[marketIndex].GamesContainers[leagueKey].IsVisible = true;
			totalGamesAdded += LINES.state.currentSportJson.Markets[marketIndex].GamesContainers[leagueKey].GameLines.length;
			var uniqueLeagueId = LINES.helpers.League.getUniqueLeagueId(marketType, this.sportId, leagueKey);
			visibleLeagues.push(uniqueLeagueId);
		}
	}
	return visibleLeagues;
};

// static methods
LINES.helpers.Sport.getTemplate = function () {
	var sportDiv;
	if (LINES.state.template.sport != undefined) {
		sportDiv = LINES.state.template.sport;
	}
	else {
		sportDiv = $("#templateDiv").find('.sportContainer').eq(0).clone();
		sportDiv.find(".MarketContainer").remove();
		LINES.state.template.sport = sportDiv;
	}
	return sportDiv.clone();
};

LINES.helpers.Sport.close = function (sportId) {
	// remove events from LINES.state then close sport, otherwise events will stay in the hash

	LINES.state.nochangeStore = new LINES.state.IdCache();
	LINES.state.uniqueLeagueIdStore = new LINES.state.IdCache();
	$("#" + sportId).remove();
};

LINES.helpers.Sport.getSportId = function (uniqueMarketId) {
	var idArray = uniqueMarketId.split("_");
	var sportId = idArray[1];
	if (sportId == undefined) throw "Sport.getSportId: sportId is undefined.";
	return sportId;
};

LINES.helpers.Sport.getMarketListEnum = function (sportId) {
	var marketList = LINES.helpers.Sport.getMarketList(sportId);
	var marketEnum = {};
	$.each(marketList, function (index, item) {
		var uniqueMarketId = $(item).attr("id");
		var idPieces = LINES.helpers.Market.getUniqueMarketIdPieces(uniqueMarketId);
		marketEnum[idPieces.marketType] = idPieces.marketType;
	});
	return marketEnum;
};

LINES.helpers.Sport.getUniqueLeagueIdList = function (sportId) {
	var idList = [];
	for (var marketType in LINES.enums.marketType) {
		var idListTemp = LINES.helpers.Market.getUniqueLeagueIdList(LINES.helpers.Market.getUniqueMarketId(marketType, sportId));
		idList = $.merge(idList, idListTemp);
	}
	return idList;
};

LINES.helpers.Sport.getSportName = function (sportId) {
	var sportName = $("#" + sportId).find("h2.sportName").text();
	return $.trim(sportName);
};

LINES.helpers.Sport.getMarketList = function (sportId) {
	return $("#" + sportId).find('.MarketContainer').get();
};

LINES.helpers.Sport.getLatestServerTimeStamp = function () {
	var live = LINES.state.timeStamps[LINES.enums.marketType.Live];
	var today = LINES.state.timeStamps[LINES.enums.marketType.Today];
	var early = LINES.state.timeStamps[LINES.enums.marketType.Early];
	if (live != undefined && today != undefined && early != undefined) {
		if (live >= today || live >= early) return live;
		if (today >= live || today >= early) return today;
		if (early >= live || early >= today) return early;
	}
	else if (live != undefined && today != undefined) {
		if (live >= today) return live;
		if (today >= live) return today;
	}
	else if (live != undefined && early != undefined) {
		if (live >= early) return live;
		if (early >= live) return early;
	}
	else if (early != undefined && today != undefined) {
		if (early >= today) return early;
		if (today >= early) return today;
	}
	else if (live != undefined) {
		return live;
	}
	else if (today != undefined) {
		return today;
	}
	else if (early != undefined) {
		return early;
	}

	return "";
};

LINES.helpers.Sport.addMarket = function (sportId, marketType, marketHtmlElement) {
	var marketList = LINES.helpers.Sport.getMarketList(sportId);
	if (LINES.utils.objectSize(marketList) == 0) {
		$("#" + sportId).append(marketHtmlElement);
	}
	else {
		if (marketType == LINES.enums.marketType.Live) {
			$(marketList).eq(0).before(marketHtmlElement);
		}
		else if (marketType == LINES.enums.marketType.Today) {
			if (!LINES.helpers.Market.doesMarketExist(LINES.helpers.Market.getUniqueMarketId(LINES.enums.marketType.Early, sportId))) {
				$("#" + sportId).append(marketHtmlElement);
			}
			else {
				var uniqueEarlyMarketId = LINES.helpers.Market.getUniqueMarketId(LINES.enums.marketType.Early, sportId);
				$("#" + uniqueEarlyMarketId).before(marketHtmlElement);
			}
		}
			// Early
		else {
			$("#" + sportId).append(marketHtmlElement);
		}
	}
	marketHtmlElement = null;
};

LINES.helpers.Sport.processLinesContainer = function (linesContainerJson, marketType, forceUpdate, isScroll) {
	///	<summary>
	///		handles updating and adding leagues
	///	</summary>
	///	<returns type="null" />
	///	<param name="marketType" type="String">
	///		 Should be null on full load. Should contain marketType for refresh
	///	</param>

	var deferred = $.Deferred();

	//if (LINES.utils.isIE7or8()) {
	//    forceUpdate = true;
	//}

	var onError = function (source, error) {
		if (error != null) {
			error.message = source + ": " + error.message;
		} else {
			error = new Error(source);
		}
		deferred.reject(error);
	};

	var isCancelled = function () {
		return LINES.helpers.betMenu.state.isCancelled();
	};

	LINES.utils.tryExec(deferred, function () {

		if (!linesContainerJson || !linesContainerJson.LinesRequest || isCancelled()) {
			return;
		}

		LINES.stopWatch.swreset();
		var sportId = linesContainerJson.Sport.SportId;

		var isUpdate = (marketType == null) ? false : true;

		var refreshMarkets = [];
		if (!isScroll) {
			if (isUpdate) {
				// if is an update then merge update (linesContainerJson) into LINES.state.currentSportJson
				LINES.helpers.Sport.mergeLinesContainerJson(linesContainerJson);
				// Figure out which markets are included
				for (var refreshMarketInd in linesContainerJson.Sport.Markets) {
					refreshMarkets.push(linesContainerJson.Sport.Markets[refreshMarketInd].Market);
				}
			} else {
				// if full load then reset LINES.state.currentSportJson
				LINES.state.allLeaguesVisible = false;
				LINES.state.currentSportJson = $.secureEvalJSON($.toJSON(linesContainerJson.Sport));
			}
		}

		var sportJson = LINES.state.currentSportJson;

		var sportHelper = new LINES.helpers.Sport(sportId, isUpdate, sportJson, forceUpdate, isScroll);
		if (isScroll) {
			LINES.helpers.Sport.addLinesLoadingIndicator(); // show loading indicator
			LINES.state.linesLoading = true;
			// load more leagues/games on a scroll
			var numberOfGamesToShow = 50;
			if (sportJson.CssViewType == LINES.enums.cssViewType.Double && LINES.config.minimumAmountOfGamesPerPageForDouble) {
				numberOfGamesToShow = LINES.config.minimumAmountOfGamesPerPageForDouble;
			} else if (LINES.config.minimumAmountOfGamesPerPageForSimpleSingle) {
				numberOfGamesToShow = LINES.config.minimumAmountOfGamesPerPageForSimpleSingle;
			}

			sportHelper.nextVisibleLeagues(numberOfGamesToShow);
		}
		sportHelper.updateMarkets(linesContainerJson.TimeStamp, refreshMarkets)
			.fail(function (err) {
				onError("sportHelper.updateMarkets.fail", err);
			})
			.done(function (addedMarkets, updatedMarkets, deletedMarkets) {
				try {
					var visibleMarkets = $.merge(addedMarkets, updatedMarkets);

					if (isCancelled()) {
						deferred.resolve();
						return;
					}

					// cache market refresh buttons, so DOM read is not necessary to update the count down value
					var linesArea = $("#lines_area");

					for (var mType in LINES.enums.marketType) {
						LINES.state.refreshButtonList[mType] = linesArea.find(".market_header .rfsh ." + mType);
					}

					LINES.helpers.League.processLeagueQueue(sportId)
						.done(function () {

							try {
								// check if visible markets have leagues and add message if they don't 
								$.each(visibleMarkets, function (_, marketName) {
									var uniqMarketId = LINES.helpers.Market.getUniqueMarketId(marketName, sportId);
									var list = LINES.helpers.Market.getLeagueList(uniqMarketId);
									if (list == undefined || list.length === 0) {
										LINES.helpers.Market.addNoEventsMessage(uniqMarketId);
									}
								});
								LINES.helpers.Sport.removeLinesLoadingIndicator(); // hide loading indicator
								LINES.state.linesLoading = false;
								deferred.resolve();
							} catch (e) {
								onError("LINES.helpers.League.processLeagueQueue.done", e);
							}

						}).fail(function (err) {
							onError("LINES.helpers.League.processLeagueQueue.fail", err);
						});

				} catch (err) {
					onError("sportHelper.updateMarkets.done", err);
				}
			}).fail(function (err) {
				onError("sportHelper.updateMarkets.fail", err);
			}).always(function () {
				linesContainerJson = null;
				// call the garbage collector in IE
				if (typeof (CollectGarbage) == "function") {
					CollectGarbage();
				}
			});

	}, "LINES.helpers.Sport.processLinesContainer");

	return deferred.promise();
};

LINES.helpers.Sport.mergeLinesContainerJson = function (refreshJson) {

	// The refresh will probably only be one "Market" so the marketIndex may be different

	// check if all leagues are visible and just set state = refreshJson.Sport
	if (LINES.state.allLeaguesVisible) {
		for (var marketInd in LINES.state.currentSportJson.Markets) {
			var refMarketIndex = -1;
			for (var refMarketInd in refreshJson.Sport.Markets) {
				if (LINES.state.currentSportJson.Markets[marketInd].Market == refreshJson.Sport.Markets[refMarketInd].Market) {
					refMarketIndex = refMarketInd;
					LINES.state.currentSportJson.Markets[marketInd] = $.secureEvalJSON($.toJSON(refreshJson.Sport.Markets[refMarketIndex]));
					for (var cLeagueId in LINES.state.currentSportJson.Markets[marketInd].GamesContainers) {
						LINES.state.currentSportJson.Markets[marketInd].GamesContainers[cLeagueId].IsVisible = true;
					}
				}
			}
		}
		return true;
	}

	for (var marketIndex = 0; marketIndex < LINES.state.currentSportJson.Markets.length; marketIndex++) {

		var refreshMarketIndex = -1;
		for (var refreshMarketInd = 0; refreshMarketInd < refreshJson.Sport.Markets.length; refreshMarketInd++) {
			if (LINES.state.currentSportJson.Markets[marketIndex].Market == refreshJson.Sport.Markets[refreshMarketInd].Market) {
				refreshMarketIndex = refreshMarketInd;
			}
		}

		if (refreshMarketIndex >= 0) {
			var updatedLeagues = [];
			for (var leagueKey in LINES.state.currentSportJson.Markets[marketIndex].GamesContainers) {
				if (LINES.state.currentSportJson.Markets[marketIndex].GamesContainers[leagueKey].IsVisible) {
					// Anything currently visible should be taken from the refresh JSON and marked as visible
					if (refreshJson.Sport.Markets[refreshMarketIndex].GamesContainers[leagueKey]) {
						LINES.state.currentSportJson.Markets[marketIndex].GamesContainers[leagueKey] = $.secureEvalJSON($.toJSON(refreshJson.Sport.Markets[refreshMarketIndex].GamesContainers[leagueKey]));
						LINES.state.currentSportJson.Markets[marketIndex].GamesContainers[leagueKey].IsVisible = true;
						updatedLeagues.push(leagueKey);
					} else {
						// Delete league, it was not returned
						delete LINES.state.currentSportJson.Markets[marketIndex].GamesContainers[leagueKey];
					}
				} else {
					if (refreshJson.Sport.Markets[refreshMarketIndex].GamesContainers[leagueKey]) {
						var updatedEventIds = [];
						for (var gameLineIndex = 0; gameLineIndex < LINES.state.currentSportJson.Markets[marketIndex].GamesContainers[leagueKey].GameLines.length; gameLineIndex++) {
							var eventId = LINES.state.currentSportJson.Markets[marketIndex].GamesContainers[leagueKey].GameLines[gameLineIndex].EvId;
							var deleteGame = true;
							// Anything not visible should be taken from refresh JSON if in "changed games"
							for (var refGameLineInd = 0; refGameLineInd < refreshJson.Sport.Markets[refreshMarketIndex].GamesContainers[leagueKey].GameLines.length; refGameLineInd++) {
								if (refreshJson.Sport.Markets[refreshMarketIndex].GamesContainers[leagueKey].GameLines[refGameLineInd] !== undefined &&
									eventId == refreshJson.Sport.Markets[refreshMarketIndex].GamesContainers[leagueKey].GameLines[refGameLineInd].EvId) {
									LINES.state.currentSportJson.Markets[marketIndex].GamesContainers[leagueKey].GameLines[gameLineIndex] = $.secureEvalJSON($.toJSON(refreshJson.Sport.Markets[refreshMarketIndex].GamesContainers[leagueKey].GameLines[refGameLineInd]));
									deleteGame = false;
									updatedEventIds.push(eventId);
									break;
								}
							}
							// Anything not visible should be taken from state if in Unchanged games of refresh JSON
							if ($.inArray(parseInt(eventId), refreshJson.Sport.Markets[refreshMarketIndex].GamesContainers[leagueKey].UnchangedGames) != -1) {
								deleteGame = false;
								updatedEventIds.push(eventId);
							}
							// Delete anything not found in refresh JSON
							if (deleteGame) {
								LINES.state.currentSportJson.Markets[marketIndex].GamesContainers[leagueKey].GameLines.splice(gameLineIndex, 1);
							}
						}

						// Handle adding a game in the refresh JSON but not in current state
						var totalRefGames = refreshJson.Sport.Markets[refreshMarketIndex].GamesContainers[leagueKey].GameLines.length + refreshJson.Sport.Markets[refreshMarketIndex].GamesContainers[leagueKey].UnchangedGames.length;
						if (updatedEventIds.length < totalRefGames) {
							for (var refGameLineId = 0; refGameLineId < refreshJson.Sport.Markets[refreshMarketIndex].GamesContainers[leagueKey].GameLines.length; refGameLineId++) {
								if (refreshJson.Sport.Markets[refreshMarketIndex].GamesContainers[leagueKey].GameLines[refGameLineInd] !== undefined &&
									$.inArray(refreshJson.Sport.Markets[refreshMarketIndex].GamesContainers[leagueKey].GameLines[refGameLineInd].EvId, updatedEventIds) == -1) {
									LINES.state.currentSportJson.Markets[marketIndex].GamesContainers[leagueKey].GameLines.push($.secureEvalJSON($.toJSON(refreshJson.Sport.Markets[refreshMarketIndex].GamesContainers[leagueKey].GameLines[refGameLineId])));
									break;
								}
							}
						}
						updatedLeagues.push(leagueKey);
					} else {
						// Delete league, it was not returned
						delete LINES.state.currentSportJson.Markets[marketIndex].GamesContainers[leagueKey];
					}
				}
			}

			// handle adding a league in the refresh but not in current state
			if (updatedLeagues.length < Object.keys(refreshJson.Sport.Markets[refreshMarketIndex].GamesContainers).length) {
				for (var newLeagueKey in refreshJson.Sport.Markets[refreshMarketIndex].GamesContainers) {
					if ($.inArray(newLeagueKey, updatedLeagues) == -1) {
						LINES.state.currentSportJson.Markets[marketIndex].GamesContainers[newLeagueKey] = $.secureEvalJSON($.toJSON(refreshJson.Sport.Markets[refreshMarketIndex].GamesContainers[newLeagueKey]));
						// when a new league make it visible
						LINES.state.currentSportJson.Markets[marketIndex].GamesContainers[newLeagueKey].IsVisible = true;
					}
				}
			}
		}
	}
	return true;
};

LINES.helpers.Sport.displayMoreLeagues = function () {

	var isLoading = LINES.helpers.Sport.isLoadingIndicatorVisible();

	if (!LINES.state.allLeaguesVisible && !isLoading) {
		var linesContainerJson = {};
		linesContainerJson.LinesRequest = true;
		linesContainerJson.Sport = LINES.state.currentSportJson;
		LINES.helpers.Sport.processLinesContainer(linesContainerJson, null, false, true);
	}
	return;
};

LINES.helpers.Sport.addLinesLoadingIndicator = function () {
	if (!LINES.helpers.Sport.isLoadingIndicatorVisible()) { //if loading indicator not is showing
		LINES.helpers.Sport.hideLoadMoreGames(); // hide more games link while games are being loaded
		var lastMarketContainer = $("#lines div.MarketContainer:not('.hidden'):last");
		var lastLeagueContainerInMarket = lastMarketContainer.find("tbody.LeagueContainer:last");
		var colSpan = lastLeagueContainerInMarket.find(".league_header").attr("colspan");
		lastLeagueContainerInMarket.after('<tbody id="infscr-wrapper"><tr><td colspan="' + colSpan + '"><div id="infscr-loading"></div></td></tr></tbody>');
	}
};

LINES.helpers.Sport.removeLinesLoadingIndicator = function () {
	$("#infscr-wrapper").remove();
	if (!LINES.state.allLeaguesVisible) {
		LINES.helpers.Sport.showLoadMoreGames(); // show more games link after games loading completed
	}
};

LINES.helpers.Sport.hideLoadMoreGames = function () {
	$("#loadMoreGamesLink").hide();
};

LINES.helpers.Sport.showLoadMoreGames = function () {
	$("#loadMoreGamesLink").show();
};

LINES.helpers.Sport.isLoadingIndicatorVisible = function () {
	var loadingIndicator = $("#infscr-loading");
	if (loadingIndicator.length > 1) { //if loading indicator is showing
		return true;
	} else {
		return false;
	}
};﻿/// <reference path="~/Scripts/docs/jquery-1.7.1-vsdoc.js" />

LINES.helpers.statement = {
	//static methods
	enhancedInit: function () {
		$("#linkStatement").click(function () { LINES.helpers.statement.open(); return false; });
		var statement = $("#Statement");
		statement.on('click', ".close", function () { LINES.helpers.statement.close(); return false; });
		statement.on('click', ".refresh", function () { LINES.helpers.statement.buildHashUrl(); return false; });
		statement.on('click', ".link", function () { LINES.helpers.statement.click($(this)); return false; });
		statement.on('click', ".linkRow", function () { LINES.helpers.statement.click($(this).find('.link')); return false; });
		statement.on('mousemove', '.linkRow', function () { $(this).addClass('clickable'); });
		statement.on('mouseleave', '.linkRow', function () { $(this).removeClass('clickable'); });
		statement.on('click', '.statementFilter', function () { LINES.helpers.statement.filter(this); return false; });

		$('#Statement').on('click', ".retry", function () {
			LINES.helpers.statement.refresh();
			return false;
		});

		var statementUrl = LINES.utils.getParameterByName("statement", window.location.hash);
		if (statementUrl) LINES.helpers.statement.open(statementUrl);
	},

	isOpen: function () {
		return !($('#Statement').hasClass('hidden'));
	},

	open: function (theUrl) {
	    LINES.state.enableInfiniteScroll = false;
		//close open popups
		LINES.utils.popups.closeAllExcept("statement");
	    LINES.utils.hideLines();
		// show statement
	    $('#Statement').removeClass('hidden');
		//refresh
		LINES.helpers.statement.refresh(theUrl);
	},

	refresh: function (theUrl) {
		if (theUrl == null || theUrl == "") theUrl = LINES.config.virtualDirectory + "Asia/Statement/" + $("#statementFilter").val() + "?customerId=" + LINES.state.customerId;

		// clear hash
		LINES.utils.removeAllHashtags();
		LINES.utils.addParameterToHashTag("statement", theUrl);

		var statement = $('#Statement');

		LINES.utils.showLoadingDiv(statement.find('.content'), "medium");

		//START: Action StopWatch
		var actionTimer = new LINES.stopWatch2();
		actionTimer.startstop();

		$.ajax({
			type: "POST",
			url: theUrl,
			data: "test=test",
			success: function (result) {
				//STOP: Action StopWatch & Log
				actionTimer.startstop();
				LINES.utils.logNetworkCall(actionTimer.Getms(), theUrl, false);

				LINES.utils.hideLoadingDiv();
				statement.html(result);
			},
			error: function (xhr, textStatus, thrownError) {
				//STOP: Action StopWatch & Log
				actionTimer.startstop();
				LINES.utils.logNetworkCall(actionTimer.Getms(), theUrl, true);

				LINES.utils.hideLoadingDiv();
				statement.find(".content").html($('#errorMessageSlim').html());
				if (thrownError == undefined) thrownError = "";
				LINES.logError(xhr.status + " " + textStatus + " " + xhr.statusText + " " + thrownError + " " + this.url, true, xhr.status);
			},
			dataType: 'text'
		});
	},

	filter: function (obj) {
		var statement = $('#Statement');
		var href = obj.toString();
		var duration = href.substr(href.lastIndexOf("/") + 1);
		statement.find('.statementFilter').removeClass("selected");
		statement.find('#statementFilter').val(duration);
		$(obj).addClass("selected");
		var url = LINES.config.virtualDirectory + "Asia/Statement/" + duration + "?customerId=" + LINES.state.customerId;
		LINES.helpers.statement.refresh(url);
	},

	buildHashUrl: function () {
		var statementUrl = LINES.utils.getParameterByName("statement", window.location.hash);
		LINES.helpers.statement.refresh(statementUrl);
	},

	closeHtml: function () {
		// clear hash
		LINES.utils.dropParameterFromHashTag("statement");
		$('#Statement').addClass("hidden");
		$("#Statement").find('content').html('');
		LINES.utils.hideLoadingDiv();
	},

	close: function () {
	    LINES.state.enableInfiniteScroll = true;
		var href = $('#Statement').find('.close').attr('href');
		LINES.helpers.statement.closeHtml();
		LINES.utils.showLines();

		$.ajax({
			type: "POST",
			url: href,
			data: "test=test", // workaround for browser bug, post cannot be empty
			dataType: 'text'
		});
	},

	click: function (obj) {
		var href = obj.attr('href');
		LINES.helpers.fullBetList.clickFromStatement(href, LINES.enums.betListDuration.ByDay);
	}
}


﻿/// <reference path="~/Scripts/docs/jquery-1.7.1-vsdoc.js" />

LINES.helpers.tabs = {

    hashConfig: {
        sport: { tabName: LINES.enums.tab.Menu },
        wager: { tabName: LINES.enums.tab.Wager },
        line: { tabName: LINES.enums.tab.Ticket },
        ticket: { tabName: LINES.enums.tab.Pending }
    },

    // static method
    enhancedInit: function () {
        $('#tabs').on('click', 'li', function () { return LINES.helpers.tabs.clickTab($(this)); });

        LINES.utils.removeAllUnknownHashtags();

        var tabName = this.getTabNameFromHash();

        if (tabName) {
            this.selectTab(tabName);
        } else {
            this.selectTab(LINES.enums.tab.Menu);
        }
    },

    activateTabWithHash: function () {

        var args = $.makeArray(arguments);

        if (args.length === 0) {
            return;
        }

        var hashName = args.shift();

        if (hashName === undefined) {
            return;
        }

        var hashValue = args.shift();
        var hashRefresh = args.shift();

        hashRefresh = hashRefresh === undefined ? true : hashRefresh;
        hashValue = hashValue === undefined ? null : hashValue;

        var config = this.hashConfig[hashName];

        for (var name in this.hashConfig) {

            if (name == hashName) {
                if (hashValue == null) {
                    hashValue = config.hashValue;
                } else {
                    config.hashValue = hashValue;
                }

                if (hashRefresh) {
                    LINES.utils.addParameterToHashTag(hashName, hashValue);                    
                }
                
                break;
            }
        }
    },

    getHashNameFromTabName: function (tabName) {
        for (var name in this.hashConfig) {
            if (this.hashConfig[name].tabName == tabName) {
                return name;
            }
        }

        return null;
    },

    getTabNameFromHash: function () {
        var hashParameters = LINES.utils.getParametersByName(window.location.hash);
        var keys = hashParameters.getKeys();

        if ($.inArray("tab", keys) > -1) {
            var value = hashParameters["tab"];
            return value;
        }

        for (var i = 0; i < keys.length; i++) {
            var key = keys[i];
            
            
            for (var hashName in this.hashConfig) {
               
                if (hashName != key) {
                    continue;
                }

                var config = this.hashConfig[hashName];

                if (config == null) {
                    continue;
                }

                value = hashParameters[hashName];
                config.hashValue = value;
                LINES.utils.addParameterToHashTag("tab", config.tabName);
                return config.tabName;
            }
        }

        return null;
    },

    clickTab: function (clickedLink) {
        try {
            var tabName = clickedLink.attr("id").replace("Tab", "");
            this.selectTab(tabName);
            return false;
        }
        catch (err) {
            LINES.logError(err);
            return true;
        }
    },

    selectTab: function (tabName) {

        var tabs = $("#tabs");
        var selectedTab = tabs.find("#" + tabName + "Tab");
        LINES.utils.addParameterToHashTag("tab", tabName);
        this.activateTabWithHash(this.getHashNameFromTabName(tabName));

        // only select the tab if it's not already selected
        if (!selectedTab.hasClass('selectedtab')) {
            //select choosen tab; 
            tabs.find("ul").removeClass('selectedtabgroup').addClass('tabgroup');
            tabs.find("li").removeClass('selectedtab');
            selectedTab.addClass('selectedtab');
            selectedTab.parent().removeClass('tabgroup').addClass('selectedtabgroup');
            // hide loading divs for all tabs in case they're still shown
            LINES.utils.hideLoadingDiv("betMenu");
            LINES.utils.hideLoadingDiv("acceptedWagerList");
            LINES.utils.hideLoadingDiv("pendingBetList");
            LINES.utils.hideLoadingDiv("ticketWagers");

            //show choosen tab content
            var tabsContent = $("#tabsContent");
            tabsContent.children('div').removeClass('hidden').addClass('hidden');
            tabsContent.find("#" + tabName + "Content").removeClass('hidden');
            //disable the timer on the pending list if another tab is selected
            LINES.state.pendingListTimerEnabled = false;

            // load wager list when it's tab is selected
            if (tabName == LINES.enums.tab.Wager) {
                LINES.helpers.miniBetList.loadBetList();
            } else if (tabName == LINES.enums.tab.Pending) {
                LINES.helpers.pendingBetList.loadBetList();
            }
        }
    }
};

﻿/// <reference path="~/Scripts/docs/jquery-1.7.1-vsdoc.js" />


// *** TIMERS ***
LINES.timers = {
	mainCountDown: function () {
		///<summary>
		/// called every second to take 1 second off the timer 
		/// and decide if refresh or other timed actions need to occur.
		///</summary>

		try {
			// do not count down while items are still rendering
			if (LINES.state.addEventQueue.length == 0 && LINES.state.updateLeagueQueue.length == 0) {

				// call the countDown function on each helper function
				for (var helperName in LINES.helpers) {
					var helper = LINES.helpers[helperName];
					if (helper["countDown"] != undefined) {
						helper["countDown"]();
					}
				}
			}
		}
		catch (err) {
			LINES.logError(err);
		}

		setTimeout(LINES.timers.mainCountDown, 1000);
	}
};

LINES.stopWatch = (function StopWatch() {
	var ms = 0;
	var state = 0;

	this.startstop = function() {
		if (state == 0) {
			state = 1;
			then = new Date();
			then.setTime(then.getTime() - ms);
		} else {
			state = 0;
			now = new Date();
			ms = now.getTime() - then.getTime();
			display();
		}
	};

	this.swreset = function () {
		state = 0;
		ms = 0;
	};

	function display() { }

	return this;
})();


LINES.stopWatch2 = function() {
	this.ms = 0;
	this.state = 0;

	return this;
};

LINES.stopWatch2.prototype.startstop = function () {
	if (this.state == 0) {
		this.state = 1;
		this.then = new Date();
		this.then.setTime(this.then.getTime() - this.ms);
	} else {
		this.state = 0;
		this.now = new Date();
		this.ms = this.now.getTime() - this.then.getTime();
	}
};

LINES.stopWatch2.prototype.swreset = function () {
	this.state = 0;
	this.ms = 0;
};

LINES.stopWatch2.prototype.Getms = function () {
	return this.ms;
};

LINES.stopWatch2.prototype.Getstate = function () {
	return this.state;
};
﻿LINES.userPrefs = (function() {
    var form = null;

    function getForm() {
        if (form === null) {
            form = $("#userPrefs");
        }

        return form;
    }

    return {
        add: function (key, value) {

            if (key == null || key == '') {
                return;
            }

            if (value == null) {
                value = '';
            }

            var userPrefsForm = getForm();

            var inputName = "tab_" + key;
            var input = userPrefsForm.find("#" + inputName).val();

            if (input == undefined) {
                userPrefsForm.append('<input type="hidden" id="' + inputName + '" name="' + inputName + '" value="' + value + '" />');
            } else {
                userPrefsForm.find("#" + inputName).val(value);
            }
        },
        
        remove: function (key) {
            
            if (key == null || key == '') {
                return;
            }

            var inputName = "tab_" + key;
            $("#" + inputName).remove();
        },
        
        submit: function () {
            $("#userPrefsSubmitButton").click();
        }
    };


})();
﻿// *** UTILITIES ***

LINES.utils = {
    
    hashNames : ["results", "statement", "fullBetList", "alternateLines", "settings", "leagues"],

	objectSize: function (obj) {
		var size = 0, key;
		for (key in obj) {
			if (obj.hasOwnProperty(key)) size++;
		}
		return size;
	},
	addCommas: function (nStr) {
		nStr += '';
		x = nStr.split('.');
		x1 = x[0];
		x2 = x.length > 1 ? '.' + x[1] : '';
		var rgx = /(\d+)(\d{3})/;
		while (rgx.test(x1)) {
			x1 = x1.replace(rgx, '$1' + ',' + '$2');
		}
		return x1 + x2;
	},
    
	showLines: function () {
	    //console.log("show lines");
	    $('#lines').removeClass('hidden');
    },
    
	hideLines: function () {
	    //console.log("hide lines");
        $('#lines').addClass('hidden');
    },

    // TODO: look into taking into account items that are offset by a margin in the CSS
	//	the width can be fixed by passing in true to outerWidth but the position also needs
	//	to be adjusted so the loading Div appears over the item properly
	showLoadingDiv: function (areaToCover, loadingSize, imageAlign, createNewDiv, newDivId, widthAdjustment) {
		if (areaToCover == undefined || !areaToCover.exists()) return;
		var areaPosition = areaToCover.offset();
		if (areaPosition == undefined) return; // display: none elements will have an undefined position
		var positionLeft = areaPosition.left;
		var positionTop = areaPosition.top;
		var newHeight = areaToCover.outerHeight();
		var newWidth = areaToCover.outerWidth();
		if (createNewDiv === undefined) {
			createNewDiv = false;
		}
		if (widthAdjustment != undefined && widthAdjustment != "") {
			positionLeft += widthAdjustment;
			newWidth -= widthAdjustment;
		}
		var loadingDivImg;
		var loadingDiv;
		if (createNewDiv) {
			var areaToCoverId;
			if (newDivId != undefined) {
				areaToCoverId = newDivId;
			}
			else {
				areaToCoverId = areaToCover.attr("id");
			}
			// remove existing div in case of being called multiple times
			$("#" + areaToCoverId + "loadingDiv").remove();
			$("#" + areaToCoverId + "loadingDivImg").remove();

			loadingDiv = $("#loadingDiv").clone();
			loadingDivImg = $("#loadingDivImg").clone();
			loadingDiv.attr("id", areaToCoverId + "loadingDiv");
			loadingDivImg.attr("id", areaToCoverId + "loadingDivImg");

			loadingDiv.appendTo("#divMain");
			loadingDivImg.appendTo("#divMain");
		}
		else {
			loadingDiv = $("#loadingDiv");
			loadingDivImg = $("#loadingDivImg");
		}
		loadingDivImg.removeClass("medium").removeClass("small").removeClass("left");
		loadingDivImg.addClass(loadingSize);
		if (imageAlign != undefined && imageAlign != "") {
			loadingDivImg.addClass(imageAlign);
		}
		loadingDiv.css({ top: positionTop, left: positionLeft });
		loadingDiv.height(newHeight).width(newWidth);
		loadingDivImg.css({ top: positionTop, left: positionLeft });
		loadingDivImg.height(newHeight).width(newWidth);
		loadingDiv.removeClass("hidden");
		loadingDivImg.removeClass("hidden");
	},

	hideLoadingDiv: function (areaToCoverId) {
		if (areaToCoverId === undefined) {
			var loadingDiv;
			var loadingDivImg;
			loadingDiv = $("#loadingDiv");
			loadingDivImg = $("#loadingDivImg");
			loadingDiv.css({ top: 0, left: 0 });
			loadingDiv.height(0).width(0);
			loadingDivImg.css({ top: 0, left: 0 });
			loadingDivImg.height(0).width(0);
			loadingDivImg.addClass("hidden");
			loadingDiv.addClass("hidden");
		}
		else {
			$("#" + areaToCoverId + "loadingDiv").remove();
			$("#" + areaToCoverId + "loadingDivImg").remove();
		}
	},

	getFirstKey: function (data) {
		for (var prop in data) {
			//if (data.propertyIsEnumerable(prop)) // removed this unnecessary check because it returns false in Opera 10
			return prop;
		}
	},

	insertSoftHyphens: function (stringToHyphenate, hyphenEveryXChars) {
		var hyphenatedString = "";
		var hyphenCount = stringToHyphenate.length / hyphenEveryXChars;
		var softHyphen = "&shy;";

		for (var insertCount = 0; insertCount < hyphenCount; insertCount++) {
			hyphenatedString += stringToHyphenate.substr(insertCount * hyphenEveryXChars, hyphenEveryXChars);
			if (insertCount < hyphenCount - 1) {
				hyphenatedString += softHyphen;
			}
		}
		return hyphenatedString;
	},

	// retrieve one key/value pair from a query string like data
	getParametersByName: function () {
	    var dict = {};

	    dict.getKeys = function() {
	        var keys = [];
	        for (key in dict) {
	            if (key != "getKeys") {
	                keys.push(key);
	            }
	        }

	        return keys;
	    };

	    if (arguments.length < 1) {
	        return dict;
	    }

	    var querystring = arguments[0];

	    if (querystring == "#_") {
	        return dict;
	    }

	    if (querystring.substr(0, 1) == "#" || querystring.substr(0, 1) == "?") {
	        querystring = querystring.substring(1);
	    }

	    var parts = querystring.split('#');
	    querystring = parts[0];

	    if (parts.length > 1) {
	        var hashPart = parts[1];
	        if (hashPart != null && hashPart != "_") {
	            if (hashPart.substr(0, 1) == "?" || hashPart.substr(0, 1) == "&") {
	                hashPart = hashPart.substring(1);
	            }
	            querystring = querystring + '&' + hashPart;
	        }
	    }

	    var params = querystring.split('&');

	    for (var i = 0; i < params.length; i++) {
	        var keyValue = params[i].split('=');
	        var key = keyValue[0];
	        if (key == null) {
	            continue;
	        }

	        var value = null;
	        if (keyValue.length > 1) {
	            value = keyValue[1];
	        }
	        
	        var that = this;

	        var add = function (k, n) {
	            if (n == k) {
	                var decodedValue = null;
	                if (value != null) {
	                    decodedValue = that.decodeHashUrlValue(value);
	                }
	                dict[key] = decodedValue;
	                return true;
	            }

	            return false;
	        };

	        if (arguments.length == 1) {
	            add(key, key);
	        } else {
	            for (var j = 1; j < arguments.length; j++) {
	                var names = arguments[j];
	                var found = false;
	                if ($.isArray(names)) {
	                    for (var u = 0; u < names.length; u++) {
	                        found = add(names[u], key);
	                        if (found) {
	                            break;
	                        }
	                    }
	                }

	                if (found || add(names, key)) {
	                    break;
	                }
	            }
	        }
	    }

	    return dict;
	},

    // retrieve one key/value pair from a query string like data
	getParameterByName: function (name, querystring) {
	    if (!querystring) {
	        querystring = location.search;
	    }
	    
	    var dict = this.getParametersByName(querystring, name);
	    if (dict.hasOwnProperty(name)) {
	        return dict[name];
	    }
	    return null;
	},
	
	dropParametersFromHashTag: function () {
	    var loc = window.location;
	    var oldHash = loc.hash;
	    var that = this;
        
	    if (arguments.length == 0 || oldHash == "" || oldHash.substr(0, 1) != "#") {
	        if (loc.hash == "#" || loc.hash == "") {
	            loc.hash = "#_";
	        }
	        
	        return;
	    }

	    var newHash = "#";
	    var params = this.getParametersByName(oldHash);
	    var args = $.makeArray(arguments);
	    var keys = params.getKeys();

	    var remove = function (k, v) {
	        if (k == v) {
	            var index = $.inArray(k, keys);
	            if (index > -1) {
	                keys.splice(index, 1);
	                return true;
	            }
	        }
	        return false;
	    };

	    $.each(params, function (key, _) {
	        
	        LINES.userPrefs.remove(key);
	        
	        for (var o = 0; o < args.length; o++) {
	            var argument = args[o];
	            var value = argument;
	            var found = false;
	            if ($.isArray(argument)) {
	                for (var e = 0; e < argument.length; e++) {
	                    value = argument[e];
	                    found = remove(key, value);
	                    if (found) {
	                        break;
	                    }
	                }
	            }

	            if (found || remove(key, value)) {
	                break;
	            }
	        }
	    });

	    $.each(keys, function(i, key) {
	        if (i > 0) {
	            newHash += "&";
	        }

	        var value = that.encodeHashUrlValue(params[key]);

	        newHash += key + "=" + value;
	        LINES.userPrefs.add(key, value);
	    });

	    if (newHash == null || newHash == "#") {
	        newHash = "#_";
	    }
	    
	    loc.hash = newHash;
	},

	dropParameterFromHashTag: function (param) {
	    this.dropParametersFromHashTag(param);
	},

    addParametersToHashTag: function (params) {
        
	    var loc = window.location;
	    var newHash = "#";
	    var dict = this.getParametersByName(loc.hash);
	    var keys = dict.getKeys();
	    var that = this;

	    $.each(params, function (param, value) {
	        dict[param] = value;
	        var index = $.inArray(param, keys);
	        if (index == -1) {
	            keys.push(param);
	        } 
	    });
	    
	    $.each(keys, function (i, key) {
	        if (i > 0) {
	            newHash += "&";
	        }

	        var theValue = dict[key];

	        if (theValue == null) {
	            theValue = '';
	        } else {
	            theValue = that.encodeHashUrlValue(theValue);
	        }

	        newHash += key + "=" + theValue;
	        LINES.userPrefs.add(key, theValue);
	    });
	    
	    if (newHash == null || newHash == "#") {
	        newHash = "#_";
	    }

	    newHash = newHash.replace("#=&", "#");

	    loc.hash = newHash;
	},

	addParameterToHashTag: function (param, theValue) {
	    var p = {};
	    p[param] = theValue;
	    this.addParametersToHashTag(p);
	},

	removeAllHashtags: function () {
	    this.dropParametersFromHashTag(this.hashNames);
	},
    
	getAllKnownHashNames: function () {
	    var validHashes = this.hashNames.slice();

	    for (var name in LINES.helpers.tabs.hashConfig) {
	        validHashes.push(name);
	    }
	    
	    validHashes.push("tab");

	    return validHashes;
	},
    
	getAllUnknownHashNames: function () {
	    var keys = this.getParametersByName(window.location.hash).getKeys();
	    var validHashes = this.getAllKnownHashNames();
	    var unknownHashes = [];

	    $.each(keys, function (_, key) {
	        if ($.inArray(key, validHashes) == -1) {
	            unknownHashes.push(key);
	        }
	    });
	    
	    return unknownHashes;
	},

	removeAllUnknownHashtags: function () {
	    var unknownHashes = this.getAllUnknownHashNames();
	    this.dropParametersFromHashTag(window.location.hash, unknownHashes);
	},
    
	popups: (function () {
	    var hover = ["fullBetList", "results", "statement", "settings"];
	    var popups = $.merge(hover.slice(0), ["alternateLines", "selectLeagues"]);
	    
	    var getPopup = function (id) {
	        var popupName = "";
	        popupName = $.isNumeric(id) ? popups[parseInt(id, 10)] : id;
	        var popup = LINES.helpers[popupName];
	        return popup == undefined ? null : popup;
	    };

	    return {
	        
	        hoverPopups : hover,
	        
	        close: function () {
	            var wasClosed = false;
	            var args = LINES.utils.flattenArray(arguments, false);
	            $.each(args, function (_, popupName) {
	                var popup = getPopup(popupName);
	                if (popup != null && $.isFunction(popup.closeHtml)) {
	                    popup.closeHtml();
	                    wasClosed = true;
	                }
	            });
	            
	            LINES.utils.showLines();
	            
	            return wasClosed;
	        },

	        closeAll: function () {
	            $.each(popups, function (_, name) {
	                LINES.helpers[name].closeHtml();
	            });
	            
	            LINES.utils.showLines();
	        },

	        closeAllExcept: function () {
	            if (arguments.length === 0) {
	                return false;
	            }
	            
	            var args = LINES.utils.flattenArray(arguments, false);

	            var names = $.grep(popups, function (e, _) {
	                return $.inArray(e, args) === -1;
	            });

	            return this.close(names);
	        },
	        
	        anyOpen: function () {
	            var isOpen = false;
	            var args = null;
	            if (arguments.length === 0) {
	                args = popups;
	            } else {
	                args = LINES.utils.flattenArray(arguments, false);
	            }

	            $.each(args, function(_, popupName) {
	                var popup = LINES.helpers[popupName];
	                if (popup != null && $.isFunction(popup.isOpen) !== undefined && popup.isOpen()) {
	                    isOpen = true;
	                    return false;
	                }
	                
	                return true;
	            });
	            
	            return isOpen;
	        }
	    };
	})(),

	getCookie: function (c_name) {
		var c_value = document.cookie;
		var c_start = c_value.indexOf(" " + c_name + "=");
		if (c_start == -1) {
			c_start = c_value.indexOf(c_name + "=");
		}
		if (c_start == -1) {
			c_value = null;
		}
		else {
			c_start = c_value.indexOf("=", c_start) + 1;
			var c_end = c_value.indexOf(";", c_start);
			if (c_end == -1) {
				c_end = c_value.length;
			}
			c_value = unescape(c_value.substring(c_start, c_end));
		}
		return c_value;
    },

	logNetworkCall: function(ms, url, isError) {
	    if (LINES.state.canLogCustomer) {
			// initialize object on first network call
	    	if (LINES.state.countNetworkCalls == 0) {
	    		LINES.state.debugLog = { "profile": {}, "items": [] };
		    }
	        LINES.state.countNetworkCalls++;

	    	// add item to call log
	        var timeStamp = LINES.helpers.Sport.getLatestServerTimeStamp();
	        var item = {
	        	"callTime": ms,
	        	"url": escape(url),
	        	"isError": (isError == true),
				"approxTime": timeStamp
	        };
	        LINES.state.debugLog.items.push(item);

			// log after X network calls
	        if (LINES.state.countNetworkCalls == LINES.config.limitNetworkCallLog) {
	        	var screenResolution = window.screen.width + " x " + window.screen.height;
	        	var userAgent = navigator.userAgent;
	        	var profile = {
	        		"customerId": LINES.state.customerId,
	        		"userAgent": userAgent,
	        		"screen": screenResolution,
	        		"timeUnit": "ms"
	        	};
	        	LINES.state.debugLog.profile = profile;
	        	var postStr = "cust=" + LINES.state.customerId + "&error=" + $.toJSON(LINES.state.debugLog);
	            $.ajax({
	                type: "POST",
	                url: LINES.config.virtualDirectory + "App/LogNetworkError/",
	                data: postStr,
	                dataType: 'text'
	            });
	            LINES.state.countNetworkCalls = 0;
	            LINES.state.debugLog = { "profile": {}, "items": [] };
	        }
	    }
	},
    
	encodeHashUrlValue: function (url) {
	    return url.split('?').join('__').split('&').join('^^').split('#').join('**').split('=').join('--');
	},
	
	decodeHashUrlValue: function (encodedUrl) {
	    return encodedUrl.split('__').join('?').split('^^').join('&').split('**').join('#').split('--').join('=');
	},
    
	flattenArray: function (array, onlyUniqueItems) {
	    var ids = [];
	    
	    var addUnique = function (v) {
	        if (onlyUniqueItems) {
	            if (v != null && $.inArray(v, ids) === -1) {
	                ids.push(v);
	            }
	        } else {
	            ids.push(v);
	        }
	    };

	    for (var e = 0; e < array.length; e++) {
	        var item = array[e];
	        if ($.isArray(item)) {
	            for (var u = 0; u < item.length; u++) {
	                addUnique(item[u]);
	            }
	        } else {
	            addUnique(item);
	        }
	    }

	    return ids;
	},
    
	logs: (function () {

	    var l = {};

	    this.enable = function () {

	        var e = function (n) {
	            if (window.console) {
	                console.log("enabling " + n + " log");
	            }
	            l[n] = true;
	        };

	        if (arguments.length == 0) {
	            $.each(l, function (name, _) {
	                e(name);
	            });
	        } else {
	            $.each(arguments, function(_, name) {
	                e(name);
	            });
	        }
	    };

	    this.disable = function () {

	        var d = function (n) {
	            if (window.console) {
	                console.log("disabling " + n + " log");
	            }
	            l[n] = false;
	        };

	        if (arguments.length == 0) {
	            $.each(l, function (name, _) {
	                d(name);
	            });
	        } else {
	            $.each(arguments, function (_, name) {
	                d(name);
	            });
	        }
        };

        this.isEnabled = function (name) {
            return l[name] === true;
        };

        this.getNames = function () {
            return l;
        };

        this.learn = function () {
            $.each(arguments, function(_, name) {
                if (l[name] == undefined) {
                    l[name] = false;
                }
            });
        };

	    return this;
	})(),

	canLog: function (logName) {
	    LINES.utils.logs.learn(logName);
        return LINES.utils.logs.isEnabled(logName);
    },

	log: function (logName, message) {
	    LINES.utils.logs.learn(logName);
        if (window.console && LINES.utils.canLog(logName)) {
            window.console.log("[" + logName + "] " + message);
	    }
    },
    
	warn: function (logName, message) {
	    LINES.utils.logs.learn(logName);
        if (window.console && LINES.utils.canLog(logName)) {
            window.console.warn("[" + logName + "] " + message);
        }
	},
    
	error: function (logName, err) {
	    LINES.utils.logs.learn(logName);
	    
	    var stack = (err != undefined && err.stack != undefined) ? err.stack : ""; // Firefox and IE10+ have a 'stack' property
	    var errStr = err + " " + $.toJSON(err) + " " + stack;

	    if (window.console && LINES.utils.canLog(logName)) {
	        window.console.error("[" + logName + "] " + errStr);
	    }
	},
    
	assert: function (logName, expression, message) {
	    LINES.utils.logs.learn(logName);
	    
	    if (window.console && LINES.utils.canLog(logName)) {
	        window.console.assert(expression, "[" + logName + "] " + message);
	    }
    },

    isIE7or8: function () {
        //jQuery 1.9 and is available only through the jQuery.migrate plugin. Please try to use feature detection instead.
        return $.browser.msie != undefined && parseInt($.browser.version, 10) < 9;
    },
    
    isIE7: function () {
        //jQuery 1.9 and is available only through the jQuery.migrate plugin. Please try to use feature detection instead.
        return $.browser.msie != undefined && parseInt($.browser.version, 10) < 8;
	},

	sleep: function (delay) {
	    return this.delay(null, delay);
	},

    delay: function (action, delay) {

	    if (action == null) {
	        action = function() {
	        };
	    }

	    var deferred = $.Deferred();

	    setTimeout(function () {
	        try {
	            deferred.resolve(action());
	        }
	        catch (e) {
	            deferred.reject(e);
	        }

	    }, delay);

	    return deferred.promise();
	},

    delayedForEach: function () {

        var args = $.makeArray(arguments);

        var queue = args.shift();
        var config = args.shift();

        if (queue == null || config == null || !$.isArray(queue) || queue.length == 0) {
            return this.sleep(0);
        }
        
        
        if ($.isFunction(config)) {
            var action = config;
            var delay = args.shift();
            if (delay == undefined) {
                delay = 0;
            }

            config = { action: action, delay : delay };
        }

        if (!$.isFunction(config.isCancelled)) {
            config.isCancelled = function() {
                return LINES.helpers.betMenu.state.isCancelled();
            };
        }
        
        if (config.deferred == undefined) {
	        config.deferred = $.Deferred();
	    }
        
        if (config.isCancelled()) {
	        config.deferred.resolve();
	    } else {
            try {

                if (!$.isNumeric(config.counter)) {
                    config.counter = 0;
                }

                var i = config.counter;
	           
	            var item = queue.shift();
	            if (item == undefined) {
	                config.deferred.resolve();
	            } else {

	                var timeout = 0;
	                
	                if (this.isIE7()) {
	                    if ($.isNumeric(config.delay)) {
	                        timeout = config.delay;
	                    }

	                    if ($.isNumeric(config.chunkSize)) {
	                        var size = config.chunkSize;
	                        if ($.isNumeric(config.chunkDelay)) {
	                            var chunkDelay = config.chunkDelay;

	                            var isChunk = (1 + i) % size == 0;

	                            if (isChunk && timeout == 0) {
	                                timeout = chunkDelay;
	                            }
	                        }
	                    }
	                }

	                var continueProcessing = $.isFunction(config.action);

	                if (continueProcessing) {
	                    continueProcessing = config.action(i, item);
	                }
	                
	                config.counter++;

	                if (continueProcessing === false || queue.length == 0) {
	                    config.deferred.resolve();
	                } else {
	                    setTimeout(function() {
	                        LINES.utils.delayedForEach(queue, config);
	                    }, timeout);
	                }
	            }
	        }
	        catch (e) {
	            config.deferred.reject(e);
	        }
	    }

        return config.deferred.promise();
    },

    toEmptyPromise: function () {
        var deferred = arguments.length < 1 || arguments[0] == null ? $.Deferred() : arguments[0];
        deferred.resolve();
        return deferred.promise();
    },
    
    tryExec: function (deferred, func, blockName) {
        try {
            func();
            return true;
        } catch (e) {
        	if (blockName) {
		        e.message = blockName + ": " + e.message;
        		deferred.reject(e);
            } else {
                deferred.reject(e);
            }

            return false;
        }
    },

    toUnicodeSequence: function (str) {
		try {
			return str.replace(/[\s\S]/g, function(c) {
				return '\\u' + ('000' + c.charCodeAt(0).toString(16)).slice(-4);
			});
		} 
    	catch (exc) {
		    return "";
	    }
    },

	testErrorLog: function() {
		var error = new Error("test error log 汉语");
		LINES.logError(error);
	}
};
