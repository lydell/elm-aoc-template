(function(scope){
'use strict';

function F(arity, fun, wrapper) {
  wrapper.a = arity;
  wrapper.f = fun;
  return wrapper;
}

function F2(fun) {
  return F(2, fun, function(a) { return function(b) { return fun(a,b); }; })
}
function F3(fun) {
  return F(3, fun, function(a) {
    return function(b) { return function(c) { return fun(a, b, c); }; };
  });
}
function F4(fun) {
  return F(4, fun, function(a) { return function(b) { return function(c) {
    return function(d) { return fun(a, b, c, d); }; }; };
  });
}
function F5(fun) {
  return F(5, fun, function(a) { return function(b) { return function(c) {
    return function(d) { return function(e) { return fun(a, b, c, d, e); }; }; }; };
  });
}
function F6(fun) {
  return F(6, fun, function(a) { return function(b) { return function(c) {
    return function(d) { return function(e) { return function(f) {
    return fun(a, b, c, d, e, f); }; }; }; }; };
  });
}
function F7(fun) {
  return F(7, fun, function(a) { return function(b) { return function(c) {
    return function(d) { return function(e) { return function(f) {
    return function(g) { return fun(a, b, c, d, e, f, g); }; }; }; }; }; };
  });
}
function F8(fun) {
  return F(8, fun, function(a) { return function(b) { return function(c) {
    return function(d) { return function(e) { return function(f) {
    return function(g) { return function(h) {
    return fun(a, b, c, d, e, f, g, h); }; }; }; }; }; }; };
  });
}
function F9(fun) {
  return F(9, fun, function(a) { return function(b) { return function(c) {
    return function(d) { return function(e) { return function(f) {
    return function(g) { return function(h) { return function(i) {
    return fun(a, b, c, d, e, f, g, h, i); }; }; }; }; }; }; }; };
  });
}

function A2(fun, a, b) {
  return fun.a === 2 ? fun.f(a, b) : fun(a)(b);
}
function A3(fun, a, b, c) {
  return fun.a === 3 ? fun.f(a, b, c) : fun(a)(b)(c);
}
function A4(fun, a, b, c, d) {
  return fun.a === 4 ? fun.f(a, b, c, d) : fun(a)(b)(c)(d);
}
function A5(fun, a, b, c, d, e) {
  return fun.a === 5 ? fun.f(a, b, c, d, e) : fun(a)(b)(c)(d)(e);
}
function A6(fun, a, b, c, d, e, f) {
  return fun.a === 6 ? fun.f(a, b, c, d, e, f) : fun(a)(b)(c)(d)(e)(f);
}
function A7(fun, a, b, c, d, e, f, g) {
  return fun.a === 7 ? fun.f(a, b, c, d, e, f, g) : fun(a)(b)(c)(d)(e)(f)(g);
}
function A8(fun, a, b, c, d, e, f, g, h) {
  return fun.a === 8 ? fun.f(a, b, c, d, e, f, g, h) : fun(a)(b)(c)(d)(e)(f)(g)(h);
}
function A9(fun, a, b, c, d, e, f, g, h, i) {
  return fun.a === 9 ? fun.f(a, b, c, d, e, f, g, h, i) : fun(a)(b)(c)(d)(e)(f)(g)(h)(i);
}

console.warn('Compiled in DEV mode. Follow the advice at https://elm-lang.org/0.19.1/optimize for better performance and smaller assets.');


// EQUALITY

function _Utils_eq(x, y)
{
	for (
		var pair, stack = [], isEqual = _Utils_eqHelp(x, y, 0, stack);
		isEqual && (pair = stack.pop());
		isEqual = _Utils_eqHelp(pair.a, pair.b, 0, stack)
		)
	{}

	return isEqual;
}

function _Utils_eqHelp(x, y, depth, stack)
{
	if (x === y)
	{
		return true;
	}

	if (typeof x !== 'object' || x === null || y === null)
	{
		typeof x === 'function' && _Debug_crash(5);
		return false;
	}

	if (depth > 100)
	{
		stack.push(_Utils_Tuple2(x,y));
		return true;
	}

	/**/
	if (x.$ === 'Set_elm_builtin')
	{
		x = $elm$core$Set$toList(x);
		y = $elm$core$Set$toList(y);
	}
	if (x.$ === 'RBNode_elm_builtin' || x.$ === 'RBEmpty_elm_builtin')
	{
		x = $elm$core$Dict$toList(x);
		y = $elm$core$Dict$toList(y);
	}
	//*/

	/**_UNUSED/
	if (x.$ < 0)
	{
		x = $elm$core$Dict$toList(x);
		y = $elm$core$Dict$toList(y);
	}
	//*/

	for (var key in x)
	{
		if (!_Utils_eqHelp(x[key], y[key], depth + 1, stack))
		{
			return false;
		}
	}
	return true;
}

var _Utils_equal = F2(_Utils_eq);
var _Utils_notEqual = F2(function(a, b) { return !_Utils_eq(a,b); });



// COMPARISONS

// Code in Generate/JavaScript.hs, Basics.js, and List.js depends on
// the particular integer values assigned to LT, EQ, and GT.

function _Utils_cmp(x, y, ord)
{
	if (typeof x !== 'object')
	{
		return x === y ? /*EQ*/ 0 : x < y ? /*LT*/ -1 : /*GT*/ 1;
	}

	/**/
	if (x instanceof String)
	{
		var a = x.valueOf();
		var b = y.valueOf();
		return a === b ? 0 : a < b ? -1 : 1;
	}
	//*/

	/**_UNUSED/
	if (typeof x.$ === 'undefined')
	//*/
	/**/
	if (x.$[0] === '#')
	//*/
	{
		return (ord = _Utils_cmp(x.a, y.a))
			? ord
			: (ord = _Utils_cmp(x.b, y.b))
				? ord
				: _Utils_cmp(x.c, y.c);
	}

	// traverse conses until end of a list or a mismatch
	for (; x.b && y.b && !(ord = _Utils_cmp(x.a, y.a)); x = x.b, y = y.b) {} // WHILE_CONSES
	return ord || (x.b ? /*GT*/ 1 : y.b ? /*LT*/ -1 : /*EQ*/ 0);
}

var _Utils_lt = F2(function(a, b) { return _Utils_cmp(a, b) < 0; });
var _Utils_le = F2(function(a, b) { return _Utils_cmp(a, b) < 1; });
var _Utils_gt = F2(function(a, b) { return _Utils_cmp(a, b) > 0; });
var _Utils_ge = F2(function(a, b) { return _Utils_cmp(a, b) >= 0; });

var _Utils_compare = F2(function(x, y)
{
	var n = _Utils_cmp(x, y);
	return n < 0 ? $elm$core$Basics$LT : n ? $elm$core$Basics$GT : $elm$core$Basics$EQ;
});


// COMMON VALUES

var _Utils_Tuple0_UNUSED = 0;
var _Utils_Tuple0 = { $: '#0' };

function _Utils_Tuple2_UNUSED(a, b) { return { a: a, b: b }; }
function _Utils_Tuple2(a, b) { return { $: '#2', a: a, b: b }; }

function _Utils_Tuple3_UNUSED(a, b, c) { return { a: a, b: b, c: c }; }
function _Utils_Tuple3(a, b, c) { return { $: '#3', a: a, b: b, c: c }; }

function _Utils_chr_UNUSED(c) { return c; }
function _Utils_chr(c) { return new String(c); }


// RECORDS

function _Utils_update(oldRecord, updatedFields)
{
	var newRecord = {};

	for (var key in oldRecord)
	{
		newRecord[key] = oldRecord[key];
	}

	for (var key in updatedFields)
	{
		newRecord[key] = updatedFields[key];
	}

	return newRecord;
}


// APPEND

var _Utils_append = F2(_Utils_ap);

function _Utils_ap(xs, ys)
{
	// append Strings
	if (typeof xs === 'string')
	{
		return xs + ys;
	}

	// append Lists
	if (!xs.b)
	{
		return ys;
	}
	var root = _List_Cons(xs.a, ys);
	xs = xs.b
	for (var curr = root; xs.b; xs = xs.b) // WHILE_CONS
	{
		curr = curr.b = _List_Cons(xs.a, ys);
	}
	return root;
}



var _List_Nil_UNUSED = { $: 0 };
var _List_Nil = { $: '[]' };

function _List_Cons_UNUSED(hd, tl) { return { $: 1, a: hd, b: tl }; }
function _List_Cons(hd, tl) { return { $: '::', a: hd, b: tl }; }


var _List_cons = F2(_List_Cons);

function _List_fromArray(arr)
{
	var out = _List_Nil;
	for (var i = arr.length; i--; )
	{
		out = _List_Cons(arr[i], out);
	}
	return out;
}

function _List_toArray(xs)
{
	for (var out = []; xs.b; xs = xs.b) // WHILE_CONS
	{
		out.push(xs.a);
	}
	return out;
}

var _List_map2 = F3(function(f, xs, ys)
{
	for (var arr = []; xs.b && ys.b; xs = xs.b, ys = ys.b) // WHILE_CONSES
	{
		arr.push(A2(f, xs.a, ys.a));
	}
	return _List_fromArray(arr);
});

var _List_map3 = F4(function(f, xs, ys, zs)
{
	for (var arr = []; xs.b && ys.b && zs.b; xs = xs.b, ys = ys.b, zs = zs.b) // WHILE_CONSES
	{
		arr.push(A3(f, xs.a, ys.a, zs.a));
	}
	return _List_fromArray(arr);
});

var _List_map4 = F5(function(f, ws, xs, ys, zs)
{
	for (var arr = []; ws.b && xs.b && ys.b && zs.b; ws = ws.b, xs = xs.b, ys = ys.b, zs = zs.b) // WHILE_CONSES
	{
		arr.push(A4(f, ws.a, xs.a, ys.a, zs.a));
	}
	return _List_fromArray(arr);
});

var _List_map5 = F6(function(f, vs, ws, xs, ys, zs)
{
	for (var arr = []; vs.b && ws.b && xs.b && ys.b && zs.b; vs = vs.b, ws = ws.b, xs = xs.b, ys = ys.b, zs = zs.b) // WHILE_CONSES
	{
		arr.push(A5(f, vs.a, ws.a, xs.a, ys.a, zs.a));
	}
	return _List_fromArray(arr);
});

var _List_sortBy = F2(function(f, xs)
{
	return _List_fromArray(_List_toArray(xs).sort(function(a, b) {
		return _Utils_cmp(f(a), f(b));
	}));
});

var _List_sortWith = F2(function(f, xs)
{
	return _List_fromArray(_List_toArray(xs).sort(function(a, b) {
		var ord = A2(f, a, b);
		return ord === $elm$core$Basics$EQ ? 0 : ord === $elm$core$Basics$LT ? -1 : 1;
	}));
});



var _JsArray_empty = [];

function _JsArray_singleton(value)
{
    return [value];
}

function _JsArray_length(array)
{
    return array.length;
}

var _JsArray_initialize = F3(function(size, offset, func)
{
    var result = new Array(size);

    for (var i = 0; i < size; i++)
    {
        result[i] = func(offset + i);
    }

    return result;
});

var _JsArray_initializeFromList = F2(function (max, ls)
{
    var result = new Array(max);

    for (var i = 0; i < max && ls.b; i++)
    {
        result[i] = ls.a;
        ls = ls.b;
    }

    result.length = i;
    return _Utils_Tuple2(result, ls);
});

var _JsArray_unsafeGet = F2(function(index, array)
{
    return array[index];
});

var _JsArray_unsafeSet = F3(function(index, value, array)
{
    var length = array.length;
    var result = new Array(length);

    for (var i = 0; i < length; i++)
    {
        result[i] = array[i];
    }

    result[index] = value;
    return result;
});

var _JsArray_push = F2(function(value, array)
{
    var length = array.length;
    var result = new Array(length + 1);

    for (var i = 0; i < length; i++)
    {
        result[i] = array[i];
    }

    result[length] = value;
    return result;
});

var _JsArray_foldl = F3(function(func, acc, array)
{
    var length = array.length;

    for (var i = 0; i < length; i++)
    {
        acc = A2(func, array[i], acc);
    }

    return acc;
});

var _JsArray_foldr = F3(function(func, acc, array)
{
    for (var i = array.length - 1; i >= 0; i--)
    {
        acc = A2(func, array[i], acc);
    }

    return acc;
});

var _JsArray_map = F2(function(func, array)
{
    var length = array.length;
    var result = new Array(length);

    for (var i = 0; i < length; i++)
    {
        result[i] = func(array[i]);
    }

    return result;
});

var _JsArray_indexedMap = F3(function(func, offset, array)
{
    var length = array.length;
    var result = new Array(length);

    for (var i = 0; i < length; i++)
    {
        result[i] = A2(func, offset + i, array[i]);
    }

    return result;
});

var _JsArray_slice = F3(function(from, to, array)
{
    return array.slice(from, to);
});

var _JsArray_appendN = F3(function(n, dest, source)
{
    var destLen = dest.length;
    var itemsToCopy = n - destLen;

    if (itemsToCopy > source.length)
    {
        itemsToCopy = source.length;
    }

    var size = destLen + itemsToCopy;
    var result = new Array(size);

    for (var i = 0; i < destLen; i++)
    {
        result[i] = dest[i];
    }

    for (var i = 0; i < itemsToCopy; i++)
    {
        result[i + destLen] = source[i];
    }

    return result;
});



// LOG

var _Debug_log_UNUSED = F2(function(tag, value)
{
	return value;
});

var _Debug_log = F2(function(tag, value)
{
	console.log(tag + ': ' + _Debug_toString(value));
	return value;
});


// TODOS

function _Debug_todo(moduleName, region)
{
	return function(message) {
		_Debug_crash(8, moduleName, region, message);
	};
}

function _Debug_todoCase(moduleName, region, value)
{
	return function(message) {
		_Debug_crash(9, moduleName, region, value, message);
	};
}


// TO STRING

function _Debug_toString_UNUSED(value)
{
	return '<internals>';
}

function _Debug_toString(value)
{
	return _Debug_toAnsiString(false, value);
}

function _Debug_toAnsiString(ansi, value)
{
	if (typeof value === 'function')
	{
		return _Debug_internalColor(ansi, '<function>');
	}

	if (typeof value === 'boolean')
	{
		return _Debug_ctorColor(ansi, value ? 'True' : 'False');
	}

	if (typeof value === 'number')
	{
		return _Debug_numberColor(ansi, value + '');
	}

	if (value instanceof String)
	{
		return _Debug_charColor(ansi, "'" + _Debug_addSlashes(value, true) + "'");
	}

	if (typeof value === 'string')
	{
		return _Debug_stringColor(ansi, '"' + _Debug_addSlashes(value, false) + '"');
	}

	if (typeof value === 'object' && '$' in value)
	{
		var tag = value.$;

		if (typeof tag === 'number')
		{
			return _Debug_internalColor(ansi, '<internals>');
		}

		if (tag[0] === '#')
		{
			var output = [];
			for (var k in value)
			{
				if (k === '$') continue;
				output.push(_Debug_toAnsiString(ansi, value[k]));
			}
			return '(' + output.join(',') + ')';
		}

		if (tag === 'Set_elm_builtin')
		{
			return _Debug_ctorColor(ansi, 'Set')
				+ _Debug_fadeColor(ansi, '.fromList') + ' '
				+ _Debug_toAnsiString(ansi, $elm$core$Set$toList(value));
		}

		if (tag === 'RBNode_elm_builtin' || tag === 'RBEmpty_elm_builtin')
		{
			return _Debug_ctorColor(ansi, 'Dict')
				+ _Debug_fadeColor(ansi, '.fromList') + ' '
				+ _Debug_toAnsiString(ansi, $elm$core$Dict$toList(value));
		}

		if (tag === 'Array_elm_builtin')
		{
			return _Debug_ctorColor(ansi, 'Array')
				+ _Debug_fadeColor(ansi, '.fromList') + ' '
				+ _Debug_toAnsiString(ansi, $elm$core$Array$toList(value));
		}

		if (tag === '::' || tag === '[]')
		{
			var output = '[';

			value.b && (output += _Debug_toAnsiString(ansi, value.a), value = value.b)

			for (; value.b; value = value.b) // WHILE_CONS
			{
				output += ',' + _Debug_toAnsiString(ansi, value.a);
			}
			return output + ']';
		}

		var output = '';
		for (var i in value)
		{
			if (i === '$') continue;
			var str = _Debug_toAnsiString(ansi, value[i]);
			var c0 = str[0];
			var parenless = c0 === '{' || c0 === '(' || c0 === '[' || c0 === '<' || c0 === '"' || str.indexOf(' ') < 0;
			output += ' ' + (parenless ? str : '(' + str + ')');
		}
		return _Debug_ctorColor(ansi, tag) + output;
	}

	if (typeof DataView === 'function' && value instanceof DataView)
	{
		return _Debug_stringColor(ansi, '<' + value.byteLength + ' bytes>');
	}

	if (typeof File !== 'undefined' && value instanceof File)
	{
		return _Debug_internalColor(ansi, '<' + value.name + '>');
	}

	if (typeof value === 'object')
	{
		var output = [];
		for (var key in value)
		{
			var field = key[0] === '_' ? key.slice(1) : key;
			output.push(_Debug_fadeColor(ansi, field) + ' = ' + _Debug_toAnsiString(ansi, value[key]));
		}
		if (output.length === 0)
		{
			return '{}';
		}
		return '{ ' + output.join(', ') + ' }';
	}

	return _Debug_internalColor(ansi, '<internals>');
}

function _Debug_addSlashes(str, isChar)
{
	var s = str
		.replace(/\\/g, '\\\\')
		.replace(/\n/g, '\\n')
		.replace(/\t/g, '\\t')
		.replace(/\r/g, '\\r')
		.replace(/\v/g, '\\v')
		.replace(/\0/g, '\\0');

	if (isChar)
	{
		return s.replace(/\'/g, '\\\'');
	}
	else
	{
		return s.replace(/\"/g, '\\"');
	}
}

function _Debug_ctorColor(ansi, string)
{
	return ansi ? '\x1b[96m' + string + '\x1b[0m' : string;
}

function _Debug_numberColor(ansi, string)
{
	return ansi ? '\x1b[95m' + string + '\x1b[0m' : string;
}

function _Debug_stringColor(ansi, string)
{
	return ansi ? '\x1b[93m' + string + '\x1b[0m' : string;
}

function _Debug_charColor(ansi, string)
{
	return ansi ? '\x1b[92m' + string + '\x1b[0m' : string;
}

function _Debug_fadeColor(ansi, string)
{
	return ansi ? '\x1b[37m' + string + '\x1b[0m' : string;
}

function _Debug_internalColor(ansi, string)
{
	return ansi ? '\x1b[36m' + string + '\x1b[0m' : string;
}

function _Debug_toHexDigit(n)
{
	return String.fromCharCode(n < 10 ? 48 + n : 55 + n);
}


// CRASH


function _Debug_crash_UNUSED(identifier)
{
	throw new Error('https://github.com/elm/core/blob/1.0.0/hints/' + identifier + '.md');
}


function _Debug_crash(identifier, fact1, fact2, fact3, fact4)
{
	switch(identifier)
	{
		case 0:
			throw new Error('What node should I take over? In JavaScript I need something like:\n\n    Elm.Main.init({\n        node: document.getElementById("elm-node")\n    })\n\nYou need to do this with any Browser.sandbox or Browser.element program.');

		case 1:
			throw new Error('Browser.application programs cannot handle URLs like this:\n\n    ' + document.location.href + '\n\nWhat is the root? The root of your file system? Try looking at this program with `elm reactor` or some other server.');

		case 2:
			var jsonErrorString = fact1;
			throw new Error('Problem with the flags given to your Elm program on initialization.\n\n' + jsonErrorString);

		case 3:
			var portName = fact1;
			throw new Error('There can only be one port named `' + portName + '`, but your program has multiple.');

		case 4:
			var portName = fact1;
			var problem = fact2;
			throw new Error('Trying to send an unexpected type of value through port `' + portName + '`:\n' + problem);

		case 5:
			throw new Error('Trying to use `(==)` on functions.\nThere is no way to know if functions are "the same" in the Elm sense.\nRead more about this at https://package.elm-lang.org/packages/elm/core/latest/Basics#== which describes why it is this way and what the better version will look like.');

		case 6:
			var moduleName = fact1;
			throw new Error('Your page is loading multiple Elm scripts with a module named ' + moduleName + '. Maybe a duplicate script is getting loaded accidentally? If not, rename one of them so I know which is which!');

		case 8:
			var moduleName = fact1;
			var region = fact2;
			var message = fact3;
			throw new Error('TODO in module `' + moduleName + '` ' + _Debug_regionToString(region) + '\n\n' + message);

		case 9:
			var moduleName = fact1;
			var region = fact2;
			var value = fact3;
			var message = fact4;
			throw new Error(
				'TODO in module `' + moduleName + '` from the `case` expression '
				+ _Debug_regionToString(region) + '\n\nIt received the following value:\n\n    '
				+ _Debug_toString(value).replace('\n', '\n    ')
				+ '\n\nBut the branch that handles it says:\n\n    ' + message.replace('\n', '\n    ')
			);

		case 10:
			throw new Error('Bug in https://github.com/elm/virtual-dom/issues');

		case 11:
			throw new Error('Cannot perform mod 0. Division by zero error.');
	}
}

function _Debug_regionToString(region)
{
	if (region.start.line === region.end.line)
	{
		return 'on line ' + region.start.line;
	}
	return 'on lines ' + region.start.line + ' through ' + region.end.line;
}



// MATH

var _Basics_add = F2(function(a, b) { return a + b; });
var _Basics_sub = F2(function(a, b) { return a - b; });
var _Basics_mul = F2(function(a, b) { return a * b; });
var _Basics_fdiv = F2(function(a, b) { return a / b; });
var _Basics_idiv = F2(function(a, b) { return (a / b) | 0; });
var _Basics_pow = F2(Math.pow);

var _Basics_remainderBy = F2(function(b, a) { return a % b; });

// https://www.microsoft.com/en-us/research/wp-content/uploads/2016/02/divmodnote-letter.pdf
var _Basics_modBy = F2(function(modulus, x)
{
	var answer = x % modulus;
	return modulus === 0
		? _Debug_crash(11)
		:
	((answer > 0 && modulus < 0) || (answer < 0 && modulus > 0))
		? answer + modulus
		: answer;
});


// TRIGONOMETRY

var _Basics_pi = Math.PI;
var _Basics_e = Math.E;
var _Basics_cos = Math.cos;
var _Basics_sin = Math.sin;
var _Basics_tan = Math.tan;
var _Basics_acos = Math.acos;
var _Basics_asin = Math.asin;
var _Basics_atan = Math.atan;
var _Basics_atan2 = F2(Math.atan2);


// MORE MATH

function _Basics_toFloat(x) { return x; }
function _Basics_truncate(n) { return n | 0; }
function _Basics_isInfinite(n) { return n === Infinity || n === -Infinity; }

var _Basics_ceiling = Math.ceil;
var _Basics_floor = Math.floor;
var _Basics_round = Math.round;
var _Basics_sqrt = Math.sqrt;
var _Basics_log = Math.log;
var _Basics_isNaN = isNaN;


// BOOLEANS

function _Basics_not(bool) { return !bool; }
var _Basics_and = F2(function(a, b) { return a && b; });
var _Basics_or  = F2(function(a, b) { return a || b; });
var _Basics_xor = F2(function(a, b) { return a !== b; });



var _String_cons = F2(function(chr, str)
{
	return chr + str;
});

function _String_uncons(string)
{
	var word = string.charCodeAt(0);
	return !isNaN(word)
		? $elm$core$Maybe$Just(
			0xD800 <= word && word <= 0xDBFF
				? _Utils_Tuple2(_Utils_chr(string[0] + string[1]), string.slice(2))
				: _Utils_Tuple2(_Utils_chr(string[0]), string.slice(1))
		)
		: $elm$core$Maybe$Nothing;
}

var _String_append = F2(function(a, b)
{
	return a + b;
});

function _String_length(str)
{
	return str.length;
}

var _String_map = F2(function(func, string)
{
	var len = string.length;
	var array = new Array(len);
	var i = 0;
	while (i < len)
	{
		var word = string.charCodeAt(i);
		if (0xD800 <= word && word <= 0xDBFF)
		{
			array[i] = func(_Utils_chr(string[i] + string[i+1]));
			i += 2;
			continue;
		}
		array[i] = func(_Utils_chr(string[i]));
		i++;
	}
	return array.join('');
});

var _String_filter = F2(function(isGood, str)
{
	var arr = [];
	var len = str.length;
	var i = 0;
	while (i < len)
	{
		var char = str[i];
		var word = str.charCodeAt(i);
		i++;
		if (0xD800 <= word && word <= 0xDBFF)
		{
			char += str[i];
			i++;
		}

		if (isGood(_Utils_chr(char)))
		{
			arr.push(char);
		}
	}
	return arr.join('');
});

function _String_reverse(str)
{
	var len = str.length;
	var arr = new Array(len);
	var i = 0;
	while (i < len)
	{
		var word = str.charCodeAt(i);
		if (0xD800 <= word && word <= 0xDBFF)
		{
			arr[len - i] = str[i + 1];
			i++;
			arr[len - i] = str[i - 1];
			i++;
		}
		else
		{
			arr[len - i] = str[i];
			i++;
		}
	}
	return arr.join('');
}

var _String_foldl = F3(function(func, state, string)
{
	var len = string.length;
	var i = 0;
	while (i < len)
	{
		var char = string[i];
		var word = string.charCodeAt(i);
		i++;
		if (0xD800 <= word && word <= 0xDBFF)
		{
			char += string[i];
			i++;
		}
		state = A2(func, _Utils_chr(char), state);
	}
	return state;
});

var _String_foldr = F3(function(func, state, string)
{
	var i = string.length;
	while (i--)
	{
		var char = string[i];
		var word = string.charCodeAt(i);
		if (0xDC00 <= word && word <= 0xDFFF)
		{
			i--;
			char = string[i] + char;
		}
		state = A2(func, _Utils_chr(char), state);
	}
	return state;
});

var _String_split = F2(function(sep, str)
{
	return str.split(sep);
});

var _String_join = F2(function(sep, strs)
{
	return strs.join(sep);
});

var _String_slice = F3(function(start, end, str) {
	return str.slice(start, end);
});

function _String_trim(str)
{
	return str.trim();
}

function _String_trimLeft(str)
{
	return str.replace(/^\s+/, '');
}

function _String_trimRight(str)
{
	return str.replace(/\s+$/, '');
}

function _String_words(str)
{
	return _List_fromArray(str.trim().split(/\s+/g));
}

function _String_lines(str)
{
	return _List_fromArray(str.split(/\r\n|\r|\n/g));
}

function _String_toUpper(str)
{
	return str.toUpperCase();
}

function _String_toLower(str)
{
	return str.toLowerCase();
}

var _String_any = F2(function(isGood, string)
{
	var i = string.length;
	while (i--)
	{
		var char = string[i];
		var word = string.charCodeAt(i);
		if (0xDC00 <= word && word <= 0xDFFF)
		{
			i--;
			char = string[i] + char;
		}
		if (isGood(_Utils_chr(char)))
		{
			return true;
		}
	}
	return false;
});

var _String_all = F2(function(isGood, string)
{
	var i = string.length;
	while (i--)
	{
		var char = string[i];
		var word = string.charCodeAt(i);
		if (0xDC00 <= word && word <= 0xDFFF)
		{
			i--;
			char = string[i] + char;
		}
		if (!isGood(_Utils_chr(char)))
		{
			return false;
		}
	}
	return true;
});

var _String_contains = F2(function(sub, str)
{
	return str.indexOf(sub) > -1;
});

var _String_startsWith = F2(function(sub, str)
{
	return str.indexOf(sub) === 0;
});

var _String_endsWith = F2(function(sub, str)
{
	return str.length >= sub.length &&
		str.lastIndexOf(sub) === str.length - sub.length;
});

var _String_indexes = F2(function(sub, str)
{
	var subLen = sub.length;

	if (subLen < 1)
	{
		return _List_Nil;
	}

	var i = 0;
	var is = [];

	while ((i = str.indexOf(sub, i)) > -1)
	{
		is.push(i);
		i = i + subLen;
	}

	return _List_fromArray(is);
});


// TO STRING

function _String_fromNumber(number)
{
	return number + '';
}


// INT CONVERSIONS

function _String_toInt(str)
{
	var total = 0;
	var code0 = str.charCodeAt(0);
	var start = code0 == 0x2B /* + */ || code0 == 0x2D /* - */ ? 1 : 0;

	for (var i = start; i < str.length; ++i)
	{
		var code = str.charCodeAt(i);
		if (code < 0x30 || 0x39 < code)
		{
			return $elm$core$Maybe$Nothing;
		}
		total = 10 * total + code - 0x30;
	}

	return i == start
		? $elm$core$Maybe$Nothing
		: $elm$core$Maybe$Just(code0 == 0x2D ? -total : total);
}


// FLOAT CONVERSIONS

function _String_toFloat(s)
{
	// check if it is a hex, octal, or binary number
	if (s.length === 0 || /[\sxbo]/.test(s))
	{
		return $elm$core$Maybe$Nothing;
	}
	var n = +s;
	// faster isNaN check
	return n === n ? $elm$core$Maybe$Just(n) : $elm$core$Maybe$Nothing;
}

function _String_fromList(chars)
{
	return _List_toArray(chars).join('');
}




function _Char_toCode(char)
{
	var code = char.charCodeAt(0);
	if (0xD800 <= code && code <= 0xDBFF)
	{
		return (code - 0xD800) * 0x400 + char.charCodeAt(1) - 0xDC00 + 0x10000
	}
	return code;
}

function _Char_fromCode(code)
{
	return _Utils_chr(
		(code < 0 || 0x10FFFF < code)
			? '\uFFFD'
			:
		(code <= 0xFFFF)
			? String.fromCharCode(code)
			:
		(code -= 0x10000,
			String.fromCharCode(Math.floor(code / 0x400) + 0xD800, code % 0x400 + 0xDC00)
		)
	);
}

function _Char_toUpper(char)
{
	return _Utils_chr(char.toUpperCase());
}

function _Char_toLower(char)
{
	return _Utils_chr(char.toLowerCase());
}

function _Char_toLocaleUpper(char)
{
	return _Utils_chr(char.toLocaleUpperCase());
}

function _Char_toLocaleLower(char)
{
	return _Utils_chr(char.toLocaleLowerCase());
}



/**/
function _Json_errorToString(error)
{
	return $elm$json$Json$Decode$errorToString(error);
}
//*/


// CORE DECODERS

function _Json_succeed(msg)
{
	return {
		$: 0,
		a: msg
	};
}

function _Json_fail(msg)
{
	return {
		$: 1,
		a: msg
	};
}

function _Json_decodePrim(decoder)
{
	return { $: 2, b: decoder };
}

var _Json_decodeInt = _Json_decodePrim(function(value) {
	return (typeof value !== 'number')
		? _Json_expecting('an INT', value)
		:
	(-2147483647 < value && value < 2147483647 && (value | 0) === value)
		? $elm$core$Result$Ok(value)
		:
	(isFinite(value) && !(value % 1))
		? $elm$core$Result$Ok(value)
		: _Json_expecting('an INT', value);
});

var _Json_decodeBool = _Json_decodePrim(function(value) {
	return (typeof value === 'boolean')
		? $elm$core$Result$Ok(value)
		: _Json_expecting('a BOOL', value);
});

var _Json_decodeFloat = _Json_decodePrim(function(value) {
	return (typeof value === 'number')
		? $elm$core$Result$Ok(value)
		: _Json_expecting('a FLOAT', value);
});

var _Json_decodeValue = _Json_decodePrim(function(value) {
	return $elm$core$Result$Ok(_Json_wrap(value));
});

var _Json_decodeString = _Json_decodePrim(function(value) {
	return (typeof value === 'string')
		? $elm$core$Result$Ok(value)
		: (value instanceof String)
			? $elm$core$Result$Ok(value + '')
			: _Json_expecting('a STRING', value);
});

function _Json_decodeList(decoder) { return { $: 3, b: decoder }; }
function _Json_decodeArray(decoder) { return { $: 4, b: decoder }; }

function _Json_decodeNull(value) { return { $: 5, c: value }; }

var _Json_decodeField = F2(function(field, decoder)
{
	return {
		$: 6,
		d: field,
		b: decoder
	};
});

var _Json_decodeIndex = F2(function(index, decoder)
{
	return {
		$: 7,
		e: index,
		b: decoder
	};
});

function _Json_decodeKeyValuePairs(decoder)
{
	return {
		$: 8,
		b: decoder
	};
}

function _Json_mapMany(f, decoders)
{
	return {
		$: 9,
		f: f,
		g: decoders
	};
}

var _Json_andThen = F2(function(callback, decoder)
{
	return {
		$: 10,
		b: decoder,
		h: callback
	};
});

function _Json_oneOf(decoders)
{
	return {
		$: 11,
		g: decoders
	};
}


// DECODING OBJECTS

var _Json_map1 = F2(function(f, d1)
{
	return _Json_mapMany(f, [d1]);
});

var _Json_map2 = F3(function(f, d1, d2)
{
	return _Json_mapMany(f, [d1, d2]);
});

var _Json_map3 = F4(function(f, d1, d2, d3)
{
	return _Json_mapMany(f, [d1, d2, d3]);
});

var _Json_map4 = F5(function(f, d1, d2, d3, d4)
{
	return _Json_mapMany(f, [d1, d2, d3, d4]);
});

var _Json_map5 = F6(function(f, d1, d2, d3, d4, d5)
{
	return _Json_mapMany(f, [d1, d2, d3, d4, d5]);
});

var _Json_map6 = F7(function(f, d1, d2, d3, d4, d5, d6)
{
	return _Json_mapMany(f, [d1, d2, d3, d4, d5, d6]);
});

var _Json_map7 = F8(function(f, d1, d2, d3, d4, d5, d6, d7)
{
	return _Json_mapMany(f, [d1, d2, d3, d4, d5, d6, d7]);
});

var _Json_map8 = F9(function(f, d1, d2, d3, d4, d5, d6, d7, d8)
{
	return _Json_mapMany(f, [d1, d2, d3, d4, d5, d6, d7, d8]);
});


// DECODE

var _Json_runOnString = F2(function(decoder, string)
{
	try
	{
		var value = JSON.parse(string);
		return _Json_runHelp(decoder, value);
	}
	catch (e)
	{
		return $elm$core$Result$Err(A2($elm$json$Json$Decode$Failure, 'This is not valid JSON! ' + e.message, _Json_wrap(string)));
	}
});

var _Json_run = F2(function(decoder, value)
{
	return _Json_runHelp(decoder, _Json_unwrap(value));
});

function _Json_runHelp(decoder, value)
{
	switch (decoder.$)
	{
		case 2:
			return decoder.b(value);

		case 5:
			return (value === null)
				? $elm$core$Result$Ok(decoder.c)
				: _Json_expecting('null', value);

		case 3:
			if (!_Json_isArray(value))
			{
				return _Json_expecting('a LIST', value);
			}
			return _Json_runArrayDecoder(decoder.b, value, _List_fromArray);

		case 4:
			if (!_Json_isArray(value))
			{
				return _Json_expecting('an ARRAY', value);
			}
			return _Json_runArrayDecoder(decoder.b, value, _Json_toElmArray);

		case 6:
			var field = decoder.d;
			if (typeof value !== 'object' || value === null || !(field in value))
			{
				return _Json_expecting('an OBJECT with a field named `' + field + '`', value);
			}
			var result = _Json_runHelp(decoder.b, value[field]);
			return ($elm$core$Result$isOk(result)) ? result : $elm$core$Result$Err(A2($elm$json$Json$Decode$Field, field, result.a));

		case 7:
			var index = decoder.e;
			if (!_Json_isArray(value))
			{
				return _Json_expecting('an ARRAY', value);
			}
			if (index >= value.length)
			{
				return _Json_expecting('a LONGER array. Need index ' + index + ' but only see ' + value.length + ' entries', value);
			}
			var result = _Json_runHelp(decoder.b, value[index]);
			return ($elm$core$Result$isOk(result)) ? result : $elm$core$Result$Err(A2($elm$json$Json$Decode$Index, index, result.a));

		case 8:
			if (typeof value !== 'object' || value === null || _Json_isArray(value))
			{
				return _Json_expecting('an OBJECT', value);
			}

			var keyValuePairs = _List_Nil;
			// TODO test perf of Object.keys and switch when support is good enough
			for (var key in value)
			{
				if (value.hasOwnProperty(key))
				{
					var result = _Json_runHelp(decoder.b, value[key]);
					if (!$elm$core$Result$isOk(result))
					{
						return $elm$core$Result$Err(A2($elm$json$Json$Decode$Field, key, result.a));
					}
					keyValuePairs = _List_Cons(_Utils_Tuple2(key, result.a), keyValuePairs);
				}
			}
			return $elm$core$Result$Ok($elm$core$List$reverse(keyValuePairs));

		case 9:
			var answer = decoder.f;
			var decoders = decoder.g;
			for (var i = 0; i < decoders.length; i++)
			{
				var result = _Json_runHelp(decoders[i], value);
				if (!$elm$core$Result$isOk(result))
				{
					return result;
				}
				answer = answer(result.a);
			}
			return $elm$core$Result$Ok(answer);

		case 10:
			var result = _Json_runHelp(decoder.b, value);
			return (!$elm$core$Result$isOk(result))
				? result
				: _Json_runHelp(decoder.h(result.a), value);

		case 11:
			var errors = _List_Nil;
			for (var temp = decoder.g; temp.b; temp = temp.b) // WHILE_CONS
			{
				var result = _Json_runHelp(temp.a, value);
				if ($elm$core$Result$isOk(result))
				{
					return result;
				}
				errors = _List_Cons(result.a, errors);
			}
			return $elm$core$Result$Err($elm$json$Json$Decode$OneOf($elm$core$List$reverse(errors)));

		case 1:
			return $elm$core$Result$Err(A2($elm$json$Json$Decode$Failure, decoder.a, _Json_wrap(value)));

		case 0:
			return $elm$core$Result$Ok(decoder.a);
	}
}

function _Json_runArrayDecoder(decoder, value, toElmValue)
{
	var len = value.length;
	var array = new Array(len);
	for (var i = 0; i < len; i++)
	{
		var result = _Json_runHelp(decoder, value[i]);
		if (!$elm$core$Result$isOk(result))
		{
			return $elm$core$Result$Err(A2($elm$json$Json$Decode$Index, i, result.a));
		}
		array[i] = result.a;
	}
	return $elm$core$Result$Ok(toElmValue(array));
}

function _Json_isArray(value)
{
	return Array.isArray(value) || (typeof FileList !== 'undefined' && value instanceof FileList);
}

function _Json_toElmArray(array)
{
	return A2($elm$core$Array$initialize, array.length, function(i) { return array[i]; });
}

function _Json_expecting(type, value)
{
	return $elm$core$Result$Err(A2($elm$json$Json$Decode$Failure, 'Expecting ' + type, _Json_wrap(value)));
}


// EQUALITY

function _Json_equality(x, y)
{
	if (x === y)
	{
		return true;
	}

	if (x.$ !== y.$)
	{
		return false;
	}

	switch (x.$)
	{
		case 0:
		case 1:
			return x.a === y.a;

		case 2:
			return x.b === y.b;

		case 5:
			return x.c === y.c;

		case 3:
		case 4:
		case 8:
			return _Json_equality(x.b, y.b);

		case 6:
			return x.d === y.d && _Json_equality(x.b, y.b);

		case 7:
			return x.e === y.e && _Json_equality(x.b, y.b);

		case 9:
			return x.f === y.f && _Json_listEquality(x.g, y.g);

		case 10:
			return x.h === y.h && _Json_equality(x.b, y.b);

		case 11:
			return _Json_listEquality(x.g, y.g);
	}
}

function _Json_listEquality(aDecoders, bDecoders)
{
	var len = aDecoders.length;
	if (len !== bDecoders.length)
	{
		return false;
	}
	for (var i = 0; i < len; i++)
	{
		if (!_Json_equality(aDecoders[i], bDecoders[i]))
		{
			return false;
		}
	}
	return true;
}


// ENCODE

var _Json_encode = F2(function(indentLevel, value)
{
	return JSON.stringify(_Json_unwrap(value), null, indentLevel) + '';
});

function _Json_wrap(value) { return { $: 0, a: value }; }
function _Json_unwrap(value) { return value.a; }

function _Json_wrap_UNUSED(value) { return value; }
function _Json_unwrap_UNUSED(value) { return value; }

function _Json_emptyArray() { return []; }
function _Json_emptyObject() { return {}; }

var _Json_addField = F3(function(key, value, object)
{
	object[key] = _Json_unwrap(value);
	return object;
});

function _Json_addEntry(func)
{
	return F2(function(entry, array)
	{
		array.push(_Json_unwrap(func(entry)));
		return array;
	});
}

var _Json_encodeNull = _Json_wrap(null);



// TASKS

function _Scheduler_succeed(value)
{
	return {
		$: 0,
		a: value
	};
}

function _Scheduler_fail(error)
{
	return {
		$: 1,
		a: error
	};
}

function _Scheduler_binding(callback)
{
	return {
		$: 2,
		b: callback,
		c: null
	};
}

var _Scheduler_andThen = F2(function(callback, task)
{
	return {
		$: 3,
		b: callback,
		d: task
	};
});

var _Scheduler_onError = F2(function(callback, task)
{
	return {
		$: 4,
		b: callback,
		d: task
	};
});

function _Scheduler_receive(callback)
{
	return {
		$: 5,
		b: callback
	};
}


// PROCESSES

var _Scheduler_guid = 0;

function _Scheduler_rawSpawn(task)
{
	var proc = {
		$: 0,
		e: _Scheduler_guid++,
		f: task,
		g: null,
		h: []
	};

	_Scheduler_enqueue(proc);

	return proc;
}

function _Scheduler_spawn(task)
{
	return _Scheduler_binding(function(callback) {
		callback(_Scheduler_succeed(_Scheduler_rawSpawn(task)));
	});
}

function _Scheduler_rawSend(proc, msg)
{
	proc.h.push(msg);
	_Scheduler_enqueue(proc);
}

var _Scheduler_send = F2(function(proc, msg)
{
	return _Scheduler_binding(function(callback) {
		_Scheduler_rawSend(proc, msg);
		callback(_Scheduler_succeed(_Utils_Tuple0));
	});
});

function _Scheduler_kill(proc)
{
	return _Scheduler_binding(function(callback) {
		var task = proc.f;
		if (task.$ === 2 && task.c)
		{
			task.c();
		}

		proc.f = null;

		callback(_Scheduler_succeed(_Utils_Tuple0));
	});
}


/* STEP PROCESSES

type alias Process =
  { $ : tag
  , id : unique_id
  , root : Task
  , stack : null | { $: SUCCEED | FAIL, a: callback, b: stack }
  , mailbox : [msg]
  }

*/


var _Scheduler_working = false;
var _Scheduler_queue = [];


function _Scheduler_enqueue(proc)
{
	_Scheduler_queue.push(proc);
	if (_Scheduler_working)
	{
		return;
	}
	_Scheduler_working = true;
	while (proc = _Scheduler_queue.shift())
	{
		_Scheduler_step(proc);
	}
	_Scheduler_working = false;
}


function _Scheduler_step(proc)
{
	while (proc.f)
	{
		var rootTag = proc.f.$;
		if (rootTag === 0 || rootTag === 1)
		{
			while (proc.g && proc.g.$ !== rootTag)
			{
				proc.g = proc.g.i;
			}
			if (!proc.g)
			{
				return;
			}
			proc.f = proc.g.b(proc.f.a);
			proc.g = proc.g.i;
		}
		else if (rootTag === 2)
		{
			proc.f.c = proc.f.b(function(newRoot) {
				proc.f = newRoot;
				_Scheduler_enqueue(proc);
			});
			return;
		}
		else if (rootTag === 5)
		{
			if (proc.h.length === 0)
			{
				return;
			}
			proc.f = proc.f.b(proc.h.shift());
		}
		else // if (rootTag === 3 || rootTag === 4)
		{
			proc.g = {
				$: rootTag === 3 ? 0 : 1,
				b: proc.f.b,
				i: proc.g
			};
			proc.f = proc.f.d;
		}
	}
}



function _Process_sleep(time)
{
	return _Scheduler_binding(function(callback) {
		var id = setTimeout(function() {
			callback(_Scheduler_succeed(_Utils_Tuple0));
		}, time);

		return function() { clearTimeout(id); };
	});
}




// PROGRAMS


var _Platform_worker = F4(function(impl, flagDecoder, debugMetadata, args)
{
	return _Platform_initialize(
		flagDecoder,
		args,
		impl.init,
		impl.update,
		impl.subscriptions,
		function() { return function() {} }
	);
});



// INITIALIZE A PROGRAM


function _Platform_initialize(flagDecoder, args, init, update, subscriptions, stepperBuilder)
{
	var result = A2(_Json_run, flagDecoder, _Json_wrap(args ? args['flags'] : undefined));
	$elm$core$Result$isOk(result) || _Debug_crash(2 /**/, _Json_errorToString(result.a) /**/);
	var managers = {};
	var initPair = init(result.a);
	var model = initPair.a;
	var stepper = stepperBuilder(sendToApp, model);
	var ports = _Platform_setupEffects(managers, sendToApp);

	function sendToApp(msg, viewMetadata)
	{
		var pair = A2(update, msg, model);
		stepper(model = pair.a, viewMetadata);
		_Platform_enqueueEffects(managers, pair.b, subscriptions(model));
	}

	_Platform_enqueueEffects(managers, initPair.b, subscriptions(model));

	return ports ? { ports: ports } : {};
}



// TRACK PRELOADS
//
// This is used by code in elm/browser and elm/http
// to register any HTTP requests that are triggered by init.
//


var _Platform_preload;


function _Platform_registerPreload(url)
{
	_Platform_preload.add(url);
}



// EFFECT MANAGERS


var _Platform_effectManagers = {};


function _Platform_setupEffects(managers, sendToApp)
{
	var ports;

	// setup all necessary effect managers
	for (var key in _Platform_effectManagers)
	{
		var manager = _Platform_effectManagers[key];

		if (manager.a)
		{
			ports = ports || {};
			ports[key] = manager.a(key, sendToApp);
		}

		managers[key] = _Platform_instantiateManager(manager, sendToApp);
	}

	return ports;
}


function _Platform_createManager(init, onEffects, onSelfMsg, cmdMap, subMap)
{
	return {
		b: init,
		c: onEffects,
		d: onSelfMsg,
		e: cmdMap,
		f: subMap
	};
}


function _Platform_instantiateManager(info, sendToApp)
{
	var router = {
		g: sendToApp,
		h: undefined
	};

	var onEffects = info.c;
	var onSelfMsg = info.d;
	var cmdMap = info.e;
	var subMap = info.f;

	function loop(state)
	{
		return A2(_Scheduler_andThen, loop, _Scheduler_receive(function(msg)
		{
			var value = msg.a;

			if (msg.$ === 0)
			{
				return A3(onSelfMsg, router, value, state);
			}

			return cmdMap && subMap
				? A4(onEffects, router, value.i, value.j, state)
				: A3(onEffects, router, cmdMap ? value.i : value.j, state);
		}));
	}

	return router.h = _Scheduler_rawSpawn(A2(_Scheduler_andThen, loop, info.b));
}



// ROUTING


var _Platform_sendToApp = F2(function(router, msg)
{
	return _Scheduler_binding(function(callback)
	{
		router.g(msg);
		callback(_Scheduler_succeed(_Utils_Tuple0));
	});
});


var _Platform_sendToSelf = F2(function(router, msg)
{
	return A2(_Scheduler_send, router.h, {
		$: 0,
		a: msg
	});
});



// BAGS


function _Platform_leaf(home)
{
	return function(value)
	{
		return {
			$: 1,
			k: home,
			l: value
		};
	};
}


function _Platform_batch(list)
{
	return {
		$: 2,
		m: list
	};
}


var _Platform_map = F2(function(tagger, bag)
{
	return {
		$: 3,
		n: tagger,
		o: bag
	}
});



// PIPE BAGS INTO EFFECT MANAGERS
//
// Effects must be queued!
//
// Say your init contains a synchronous command, like Time.now or Time.here
//
//   - This will produce a batch of effects (FX_1)
//   - The synchronous task triggers the subsequent `update` call
//   - This will produce a batch of effects (FX_2)
//
// If we just start dispatching FX_2, subscriptions from FX_2 can be processed
// before subscriptions from FX_1. No good! Earlier versions of this code had
// this problem, leading to these reports:
//
//   https://github.com/elm/core/issues/980
//   https://github.com/elm/core/pull/981
//   https://github.com/elm/compiler/issues/1776
//
// The queue is necessary to avoid ordering issues for synchronous commands.


// Why use true/false here? Why not just check the length of the queue?
// The goal is to detect "are we currently dispatching effects?" If we
// are, we need to bail and let the ongoing while loop handle things.
//
// Now say the queue has 1 element. When we dequeue the final element,
// the queue will be empty, but we are still actively dispatching effects.
// So you could get queue jumping in a really tricky category of cases.
//
var _Platform_effectsQueue = [];
var _Platform_effectsActive = false;


function _Platform_enqueueEffects(managers, cmdBag, subBag)
{
	_Platform_effectsQueue.push({ p: managers, q: cmdBag, r: subBag });

	if (_Platform_effectsActive) return;

	_Platform_effectsActive = true;
	for (var fx; fx = _Platform_effectsQueue.shift(); )
	{
		_Platform_dispatchEffects(fx.p, fx.q, fx.r);
	}
	_Platform_effectsActive = false;
}


function _Platform_dispatchEffects(managers, cmdBag, subBag)
{
	var effectsDict = {};
	_Platform_gatherEffects(true, cmdBag, effectsDict, null);
	_Platform_gatherEffects(false, subBag, effectsDict, null);

	for (var home in managers)
	{
		_Scheduler_rawSend(managers[home], {
			$: 'fx',
			a: effectsDict[home] || { i: _List_Nil, j: _List_Nil }
		});
	}
}


function _Platform_gatherEffects(isCmd, bag, effectsDict, taggers)
{
	switch (bag.$)
	{
		case 1:
			var home = bag.k;
			var effect = _Platform_toEffect(isCmd, home, taggers, bag.l);
			effectsDict[home] = _Platform_insert(isCmd, effect, effectsDict[home]);
			return;

		case 2:
			for (var list = bag.m; list.b; list = list.b) // WHILE_CONS
			{
				_Platform_gatherEffects(isCmd, list.a, effectsDict, taggers);
			}
			return;

		case 3:
			_Platform_gatherEffects(isCmd, bag.o, effectsDict, {
				s: bag.n,
				t: taggers
			});
			return;
	}
}


function _Platform_toEffect(isCmd, home, taggers, value)
{
	function applyTaggers(x)
	{
		for (var temp = taggers; temp; temp = temp.t)
		{
			x = temp.s(x);
		}
		return x;
	}

	var map = isCmd
		? _Platform_effectManagers[home].e
		: _Platform_effectManagers[home].f;

	return A2(map, applyTaggers, value)
}


function _Platform_insert(isCmd, newEffect, effects)
{
	effects = effects || { i: _List_Nil, j: _List_Nil };

	isCmd
		? (effects.i = _List_Cons(newEffect, effects.i))
		: (effects.j = _List_Cons(newEffect, effects.j));

	return effects;
}



// PORTS


function _Platform_checkPortName(name)
{
	if (_Platform_effectManagers[name])
	{
		_Debug_crash(3, name)
	}
}



// OUTGOING PORTS


function _Platform_outgoingPort(name, converter)
{
	_Platform_checkPortName(name);
	_Platform_effectManagers[name] = {
		e: _Platform_outgoingPortMap,
		u: converter,
		a: _Platform_setupOutgoingPort
	};
	return _Platform_leaf(name);
}


var _Platform_outgoingPortMap = F2(function(tagger, value) { return value; });


function _Platform_setupOutgoingPort(name)
{
	var subs = [];
	var converter = _Platform_effectManagers[name].u;

	// CREATE MANAGER

	var init = _Process_sleep(0);

	_Platform_effectManagers[name].b = init;
	_Platform_effectManagers[name].c = F3(function(router, cmdList, state)
	{
		for ( ; cmdList.b; cmdList = cmdList.b) // WHILE_CONS
		{
			// grab a separate reference to subs in case unsubscribe is called
			var currentSubs = subs;
			var value = _Json_unwrap(converter(cmdList.a));
			for (var i = 0; i < currentSubs.length; i++)
			{
				currentSubs[i](value);
			}
		}
		return init;
	});

	// PUBLIC API

	function subscribe(callback)
	{
		subs.push(callback);
	}

	function unsubscribe(callback)
	{
		// copy subs into a new array in case unsubscribe is called within a
		// subscribed callback
		subs = subs.slice();
		var index = subs.indexOf(callback);
		if (index >= 0)
		{
			subs.splice(index, 1);
		}
	}

	return {
		subscribe: subscribe,
		unsubscribe: unsubscribe
	};
}



// INCOMING PORTS


function _Platform_incomingPort(name, converter)
{
	_Platform_checkPortName(name);
	_Platform_effectManagers[name] = {
		f: _Platform_incomingPortMap,
		u: converter,
		a: _Platform_setupIncomingPort
	};
	return _Platform_leaf(name);
}


var _Platform_incomingPortMap = F2(function(tagger, finalTagger)
{
	return function(value)
	{
		return tagger(finalTagger(value));
	};
});


function _Platform_setupIncomingPort(name, sendToApp)
{
	var subs = _List_Nil;
	var converter = _Platform_effectManagers[name].u;

	// CREATE MANAGER

	var init = _Scheduler_succeed(null);

	_Platform_effectManagers[name].b = init;
	_Platform_effectManagers[name].c = F3(function(router, subList, state)
	{
		subs = subList;
		return init;
	});

	// PUBLIC API

	function send(incomingValue)
	{
		var result = A2(_Json_run, converter, _Json_wrap(incomingValue));

		$elm$core$Result$isOk(result) || _Debug_crash(4, name, result.a);

		var value = result.a;
		for (var temp = subs; temp.b; temp = temp.b) // WHILE_CONS
		{
			sendToApp(temp.a(value));
		}
	}

	return { send: send };
}



// EXPORT ELM MODULES
//
// Have DEBUG and PROD versions so that we can (1) give nicer errors in
// debug mode and (2) not pay for the bits needed for that in prod mode.
//


function _Platform_export_UNUSED(exports)
{
	scope['Elm']
		? _Platform_mergeExportsProd(scope['Elm'], exports)
		: scope['Elm'] = exports;
}


function _Platform_mergeExportsProd(obj, exports)
{
	for (var name in exports)
	{
		(name in obj)
			? (name == 'init')
				? _Debug_crash(6)
				: _Platform_mergeExportsProd(obj[name], exports[name])
			: (obj[name] = exports[name]);
	}
}


function _Platform_export(exports)
{
	scope['Elm']
		? _Platform_mergeExportsDebug('Elm', scope['Elm'], exports)
		: scope['Elm'] = exports;
}


function _Platform_mergeExportsDebug(moduleName, obj, exports)
{
	for (var name in exports)
	{
		(name in obj)
			? (name == 'init')
				? _Debug_crash(6, moduleName)
				: _Platform_mergeExportsDebug(moduleName + '.' + name, obj[name], exports[name])
			: (obj[name] = exports[name]);
	}
}




// HELPERS


var _VirtualDom_divertHrefToApp;

var _VirtualDom_doc = typeof document !== 'undefined' ? document : {};


function _VirtualDom_appendChild(parent, child)
{
	parent.appendChild(child);
}

var _VirtualDom_init = F4(function(virtualNode, flagDecoder, debugMetadata, args)
{
	// NOTE: this function needs _Platform_export available to work

	/**_UNUSED/
	var node = args['node'];
	//*/
	/**/
	var node = args && args['node'] ? args['node'] : _Debug_crash(0);
	//*/

	node.parentNode.replaceChild(
		_VirtualDom_render(virtualNode, function() {}),
		node
	);

	return {};
});



// TEXT


function _VirtualDom_text(string)
{
	return {
		$: 0,
		a: string
	};
}



// NODE


var _VirtualDom_nodeNS = F2(function(namespace, tag)
{
	return F2(function(factList, kidList)
	{
		for (var kids = [], descendantsCount = 0; kidList.b; kidList = kidList.b) // WHILE_CONS
		{
			var kid = kidList.a;
			descendantsCount += (kid.b || 0);
			kids.push(kid);
		}
		descendantsCount += kids.length;

		return {
			$: 1,
			c: tag,
			d: _VirtualDom_organizeFacts(factList),
			e: kids,
			f: namespace,
			b: descendantsCount
		};
	});
});


var _VirtualDom_node = _VirtualDom_nodeNS(undefined);



// KEYED NODE


var _VirtualDom_keyedNodeNS = F2(function(namespace, tag)
{
	return F2(function(factList, kidList)
	{
		for (var kids = [], descendantsCount = 0; kidList.b; kidList = kidList.b) // WHILE_CONS
		{
			var kid = kidList.a;
			descendantsCount += (kid.b.b || 0);
			kids.push(kid);
		}
		descendantsCount += kids.length;

		return {
			$: 2,
			c: tag,
			d: _VirtualDom_organizeFacts(factList),
			e: kids,
			f: namespace,
			b: descendantsCount
		};
	});
});


var _VirtualDom_keyedNode = _VirtualDom_keyedNodeNS(undefined);



// CUSTOM


function _VirtualDom_custom(factList, model, render, diff)
{
	return {
		$: 3,
		d: _VirtualDom_organizeFacts(factList),
		g: model,
		h: render,
		i: diff
	};
}



// MAP


var _VirtualDom_map = F2(function(tagger, node)
{
	return {
		$: 4,
		j: tagger,
		k: node,
		b: 1 + (node.b || 0)
	};
});



// LAZY


function _VirtualDom_thunk(refs, thunk)
{
	return {
		$: 5,
		l: refs,
		m: thunk,
		k: undefined
	};
}

var _VirtualDom_lazy = F2(function(func, a)
{
	return _VirtualDom_thunk([func, a], function() {
		return func(a);
	});
});

var _VirtualDom_lazy2 = F3(function(func, a, b)
{
	return _VirtualDom_thunk([func, a, b], function() {
		return A2(func, a, b);
	});
});

var _VirtualDom_lazy3 = F4(function(func, a, b, c)
{
	return _VirtualDom_thunk([func, a, b, c], function() {
		return A3(func, a, b, c);
	});
});

var _VirtualDom_lazy4 = F5(function(func, a, b, c, d)
{
	return _VirtualDom_thunk([func, a, b, c, d], function() {
		return A4(func, a, b, c, d);
	});
});

var _VirtualDom_lazy5 = F6(function(func, a, b, c, d, e)
{
	return _VirtualDom_thunk([func, a, b, c, d, e], function() {
		return A5(func, a, b, c, d, e);
	});
});

var _VirtualDom_lazy6 = F7(function(func, a, b, c, d, e, f)
{
	return _VirtualDom_thunk([func, a, b, c, d, e, f], function() {
		return A6(func, a, b, c, d, e, f);
	});
});

var _VirtualDom_lazy7 = F8(function(func, a, b, c, d, e, f, g)
{
	return _VirtualDom_thunk([func, a, b, c, d, e, f, g], function() {
		return A7(func, a, b, c, d, e, f, g);
	});
});

var _VirtualDom_lazy8 = F9(function(func, a, b, c, d, e, f, g, h)
{
	return _VirtualDom_thunk([func, a, b, c, d, e, f, g, h], function() {
		return A8(func, a, b, c, d, e, f, g, h);
	});
});



// FACTS


var _VirtualDom_on = F2(function(key, handler)
{
	return {
		$: 'a0',
		n: key,
		o: handler
	};
});
var _VirtualDom_style = F2(function(key, value)
{
	return {
		$: 'a1',
		n: key,
		o: value
	};
});
var _VirtualDom_property = F2(function(key, value)
{
	return {
		$: 'a2',
		n: key,
		o: value
	};
});
var _VirtualDom_attribute = F2(function(key, value)
{
	return {
		$: 'a3',
		n: key,
		o: value
	};
});
var _VirtualDom_attributeNS = F3(function(namespace, key, value)
{
	return {
		$: 'a4',
		n: key,
		o: { f: namespace, o: value }
	};
});



// XSS ATTACK VECTOR CHECKS
//
// For some reason, tabs can appear in href protocols and it still works.
// So '\tjava\tSCRIPT:alert("!!!")' and 'javascript:alert("!!!")' are the same
// in practice. That is why _VirtualDom_RE_js and _VirtualDom_RE_js_html look
// so freaky.
//
// Pulling the regular expressions out to the top level gives a slight speed
// boost in small benchmarks (4-10%) but hoisting values to reduce allocation
// can be unpredictable in large programs where JIT may have a harder time with
// functions are not fully self-contained. The benefit is more that the js and
// js_html ones are so weird that I prefer to see them near each other.


var _VirtualDom_RE_script = /^script$/i;
var _VirtualDom_RE_on_formAction = /^(on|formAction$)/i;
var _VirtualDom_RE_js = /^\s*j\s*a\s*v\s*a\s*s\s*c\s*r\s*i\s*p\s*t\s*:/i;
var _VirtualDom_RE_js_html = /^\s*(j\s*a\s*v\s*a\s*s\s*c\s*r\s*i\s*p\s*t\s*:|d\s*a\s*t\s*a\s*:\s*t\s*e\s*x\s*t\s*\/\s*h\s*t\s*m\s*l\s*(,|;))/i;


function _VirtualDom_noScript(tag)
{
	return _VirtualDom_RE_script.test(tag) ? 'p' : tag;
}

function _VirtualDom_noOnOrFormAction(key)
{
	return _VirtualDom_RE_on_formAction.test(key) ? 'data-' + key : key;
}

function _VirtualDom_noInnerHtmlOrFormAction(key)
{
	return key == 'innerHTML' || key == 'formAction' ? 'data-' + key : key;
}

function _VirtualDom_noJavaScriptUri(value)
{
	return _VirtualDom_RE_js.test(value)
		? /**_UNUSED/''//*//**/'javascript:alert("This is an XSS vector. Please use ports or web components instead.")'//*/
		: value;
}

function _VirtualDom_noJavaScriptOrHtmlUri(value)
{
	return _VirtualDom_RE_js_html.test(value)
		? /**_UNUSED/''//*//**/'javascript:alert("This is an XSS vector. Please use ports or web components instead.")'//*/
		: value;
}

function _VirtualDom_noJavaScriptOrHtmlJson(value)
{
	return (typeof _Json_unwrap(value) === 'string' && _VirtualDom_RE_js_html.test(_Json_unwrap(value)))
		? _Json_wrap(
			/**_UNUSED/''//*//**/'javascript:alert("This is an XSS vector. Please use ports or web components instead.")'//*/
		) : value;
}



// MAP FACTS


var _VirtualDom_mapAttribute = F2(function(func, attr)
{
	return (attr.$ === 'a0')
		? A2(_VirtualDom_on, attr.n, _VirtualDom_mapHandler(func, attr.o))
		: attr;
});

function _VirtualDom_mapHandler(func, handler)
{
	var tag = $elm$virtual_dom$VirtualDom$toHandlerInt(handler);

	// 0 = Normal
	// 1 = MayStopPropagation
	// 2 = MayPreventDefault
	// 3 = Custom

	return {
		$: handler.$,
		a:
			!tag
				? A2($elm$json$Json$Decode$map, func, handler.a)
				:
			A3($elm$json$Json$Decode$map2,
				tag < 3
					? _VirtualDom_mapEventTuple
					: _VirtualDom_mapEventRecord,
				$elm$json$Json$Decode$succeed(func),
				handler.a
			)
	};
}

var _VirtualDom_mapEventTuple = F2(function(func, tuple)
{
	return _Utils_Tuple2(func(tuple.a), tuple.b);
});

var _VirtualDom_mapEventRecord = F2(function(func, record)
{
	return {
		message: func(record.message),
		stopPropagation: record.stopPropagation,
		preventDefault: record.preventDefault
	}
});



// ORGANIZE FACTS


function _VirtualDom_organizeFacts(factList)
{
	for (var facts = {}; factList.b; factList = factList.b) // WHILE_CONS
	{
		var entry = factList.a;

		var tag = entry.$;
		var key = entry.n;
		var value = entry.o;

		if (tag === 'a2')
		{
			(key === 'className')
				? _VirtualDom_addClass(facts, key, _Json_unwrap(value))
				: facts[key] = _Json_unwrap(value);

			continue;
		}

		var subFacts = facts[tag] || (facts[tag] = {});
		(tag === 'a3' && key === 'class')
			? _VirtualDom_addClass(subFacts, key, value)
			: subFacts[key] = value;
	}

	return facts;
}

function _VirtualDom_addClass(object, key, newClass)
{
	var classes = object[key];
	object[key] = classes ? classes + ' ' + newClass : newClass;
}



// RENDER


function _VirtualDom_render(vNode, eventNode)
{
	var tag = vNode.$;

	if (tag === 5)
	{
		return _VirtualDom_render(vNode.k || (vNode.k = vNode.m()), eventNode);
	}

	if (tag === 0)
	{
		return _VirtualDom_doc.createTextNode(vNode.a);
	}

	if (tag === 4)
	{
		var subNode = vNode.k;
		var tagger = vNode.j;

		while (subNode.$ === 4)
		{
			typeof tagger !== 'object'
				? tagger = [tagger, subNode.j]
				: tagger.push(subNode.j);

			subNode = subNode.k;
		}

		var subEventRoot = { j: tagger, p: eventNode };
		var domNode = _VirtualDom_render(subNode, subEventRoot);
		domNode.elm_event_node_ref = subEventRoot;
		return domNode;
	}

	if (tag === 3)
	{
		var domNode = vNode.h(vNode.g);
		_VirtualDom_applyFacts(domNode, eventNode, vNode.d);
		return domNode;
	}

	// at this point `tag` must be 1 or 2

	var domNode = vNode.f
		? _VirtualDom_doc.createElementNS(vNode.f, vNode.c)
		: _VirtualDom_doc.createElement(vNode.c);

	if (_VirtualDom_divertHrefToApp && vNode.c == 'a')
	{
		domNode.addEventListener('click', _VirtualDom_divertHrefToApp(domNode));
	}

	_VirtualDom_applyFacts(domNode, eventNode, vNode.d);

	for (var kids = vNode.e, i = 0; i < kids.length; i++)
	{
		_VirtualDom_appendChild(domNode, _VirtualDom_render(tag === 1 ? kids[i] : kids[i].b, eventNode));
	}

	return domNode;
}



// APPLY FACTS


function _VirtualDom_applyFacts(domNode, eventNode, facts)
{
	for (var key in facts)
	{
		var value = facts[key];

		key === 'a1'
			? _VirtualDom_applyStyles(domNode, value)
			:
		key === 'a0'
			? _VirtualDom_applyEvents(domNode, eventNode, value)
			:
		key === 'a3'
			? _VirtualDom_applyAttrs(domNode, value)
			:
		key === 'a4'
			? _VirtualDom_applyAttrsNS(domNode, value)
			:
		((key !== 'value' && key !== 'checked') || domNode[key] !== value) && (domNode[key] = value);
	}
}



// APPLY STYLES


function _VirtualDom_applyStyles(domNode, styles)
{
	var domNodeStyle = domNode.style;

	for (var key in styles)
	{
		domNodeStyle[key] = styles[key];
	}
}



// APPLY ATTRS


function _VirtualDom_applyAttrs(domNode, attrs)
{
	for (var key in attrs)
	{
		var value = attrs[key];
		typeof value !== 'undefined'
			? domNode.setAttribute(key, value)
			: domNode.removeAttribute(key);
	}
}



// APPLY NAMESPACED ATTRS


function _VirtualDom_applyAttrsNS(domNode, nsAttrs)
{
	for (var key in nsAttrs)
	{
		var pair = nsAttrs[key];
		var namespace = pair.f;
		var value = pair.o;

		typeof value !== 'undefined'
			? domNode.setAttributeNS(namespace, key, value)
			: domNode.removeAttributeNS(namespace, key);
	}
}



// APPLY EVENTS


function _VirtualDom_applyEvents(domNode, eventNode, events)
{
	var allCallbacks = domNode.elmFs || (domNode.elmFs = {});

	for (var key in events)
	{
		var newHandler = events[key];
		var oldCallback = allCallbacks[key];

		if (!newHandler)
		{
			domNode.removeEventListener(key, oldCallback);
			allCallbacks[key] = undefined;
			continue;
		}

		if (oldCallback)
		{
			var oldHandler = oldCallback.q;
			if (oldHandler.$ === newHandler.$)
			{
				oldCallback.q = newHandler;
				continue;
			}
			domNode.removeEventListener(key, oldCallback);
		}

		oldCallback = _VirtualDom_makeCallback(eventNode, newHandler);
		domNode.addEventListener(key, oldCallback,
			_VirtualDom_passiveSupported
			&& { passive: $elm$virtual_dom$VirtualDom$toHandlerInt(newHandler) < 2 }
		);
		allCallbacks[key] = oldCallback;
	}
}



// PASSIVE EVENTS


var _VirtualDom_passiveSupported;

try
{
	window.addEventListener('t', null, Object.defineProperty({}, 'passive', {
		get: function() { _VirtualDom_passiveSupported = true; }
	}));
}
catch(e) {}



// EVENT HANDLERS


function _VirtualDom_makeCallback(eventNode, initialHandler)
{
	function callback(event)
	{
		var handler = callback.q;
		var result = _Json_runHelp(handler.a, event);

		if (!$elm$core$Result$isOk(result))
		{
			return;
		}

		var tag = $elm$virtual_dom$VirtualDom$toHandlerInt(handler);

		// 0 = Normal
		// 1 = MayStopPropagation
		// 2 = MayPreventDefault
		// 3 = Custom

		var value = result.a;
		var message = !tag ? value : tag < 3 ? value.a : value.message;
		var stopPropagation = tag == 1 ? value.b : tag == 3 && value.stopPropagation;
		var currentEventNode = (
			stopPropagation && event.stopPropagation(),
			(tag == 2 ? value.b : tag == 3 && value.preventDefault) && event.preventDefault(),
			eventNode
		);
		var tagger;
		var i;
		while (tagger = currentEventNode.j)
		{
			if (typeof tagger == 'function')
			{
				message = tagger(message);
			}
			else
			{
				for (var i = tagger.length; i--; )
				{
					message = tagger[i](message);
				}
			}
			currentEventNode = currentEventNode.p;
		}
		currentEventNode(message, stopPropagation); // stopPropagation implies isSync
	}

	callback.q = initialHandler;

	return callback;
}

function _VirtualDom_equalEvents(x, y)
{
	return x.$ == y.$ && _Json_equality(x.a, y.a);
}



// DIFF


// TODO: Should we do patches like in iOS?
//
// type Patch
//   = At Int Patch
//   | Batch (List Patch)
//   | Change ...
//
// How could it not be better?
//
function _VirtualDom_diff(x, y)
{
	var patches = [];
	_VirtualDom_diffHelp(x, y, patches, 0);
	return patches;
}


function _VirtualDom_pushPatch(patches, type, index, data)
{
	var patch = {
		$: type,
		r: index,
		s: data,
		t: undefined,
		u: undefined
	};
	patches.push(patch);
	return patch;
}


function _VirtualDom_diffHelp(x, y, patches, index)
{
	if (x === y)
	{
		return;
	}

	var xType = x.$;
	var yType = y.$;

	// Bail if you run into different types of nodes. Implies that the
	// structure has changed significantly and it's not worth a diff.
	if (xType !== yType)
	{
		if (xType === 1 && yType === 2)
		{
			y = _VirtualDom_dekey(y);
			yType = 1;
		}
		else
		{
			_VirtualDom_pushPatch(patches, 0, index, y);
			return;
		}
	}

	// Now we know that both nodes are the same $.
	switch (yType)
	{
		case 5:
			var xRefs = x.l;
			var yRefs = y.l;
			var i = xRefs.length;
			var same = i === yRefs.length;
			while (same && i--)
			{
				same = xRefs[i] === yRefs[i];
			}
			if (same)
			{
				y.k = x.k;
				return;
			}
			y.k = y.m();
			var subPatches = [];
			_VirtualDom_diffHelp(x.k, y.k, subPatches, 0);
			subPatches.length > 0 && _VirtualDom_pushPatch(patches, 1, index, subPatches);
			return;

		case 4:
			// gather nested taggers
			var xTaggers = x.j;
			var yTaggers = y.j;
			var nesting = false;

			var xSubNode = x.k;
			while (xSubNode.$ === 4)
			{
				nesting = true;

				typeof xTaggers !== 'object'
					? xTaggers = [xTaggers, xSubNode.j]
					: xTaggers.push(xSubNode.j);

				xSubNode = xSubNode.k;
			}

			var ySubNode = y.k;
			while (ySubNode.$ === 4)
			{
				nesting = true;

				typeof yTaggers !== 'object'
					? yTaggers = [yTaggers, ySubNode.j]
					: yTaggers.push(ySubNode.j);

				ySubNode = ySubNode.k;
			}

			// Just bail if different numbers of taggers. This implies the
			// structure of the virtual DOM has changed.
			if (nesting && xTaggers.length !== yTaggers.length)
			{
				_VirtualDom_pushPatch(patches, 0, index, y);
				return;
			}

			// check if taggers are "the same"
			if (nesting ? !_VirtualDom_pairwiseRefEqual(xTaggers, yTaggers) : xTaggers !== yTaggers)
			{
				_VirtualDom_pushPatch(patches, 2, index, yTaggers);
			}

			// diff everything below the taggers
			_VirtualDom_diffHelp(xSubNode, ySubNode, patches, index + 1);
			return;

		case 0:
			if (x.a !== y.a)
			{
				_VirtualDom_pushPatch(patches, 3, index, y.a);
			}
			return;

		case 1:
			_VirtualDom_diffNodes(x, y, patches, index, _VirtualDom_diffKids);
			return;

		case 2:
			_VirtualDom_diffNodes(x, y, patches, index, _VirtualDom_diffKeyedKids);
			return;

		case 3:
			if (x.h !== y.h)
			{
				_VirtualDom_pushPatch(patches, 0, index, y);
				return;
			}

			var factsDiff = _VirtualDom_diffFacts(x.d, y.d);
			factsDiff && _VirtualDom_pushPatch(patches, 4, index, factsDiff);

			var patch = y.i(x.g, y.g);
			patch && _VirtualDom_pushPatch(patches, 5, index, patch);

			return;
	}
}

// assumes the incoming arrays are the same length
function _VirtualDom_pairwiseRefEqual(as, bs)
{
	for (var i = 0; i < as.length; i++)
	{
		if (as[i] !== bs[i])
		{
			return false;
		}
	}

	return true;
}

function _VirtualDom_diffNodes(x, y, patches, index, diffKids)
{
	// Bail if obvious indicators have changed. Implies more serious
	// structural changes such that it's not worth it to diff.
	if (x.c !== y.c || x.f !== y.f)
	{
		_VirtualDom_pushPatch(patches, 0, index, y);
		return;
	}

	var factsDiff = _VirtualDom_diffFacts(x.d, y.d);
	factsDiff && _VirtualDom_pushPatch(patches, 4, index, factsDiff);

	diffKids(x, y, patches, index);
}



// DIFF FACTS


// TODO Instead of creating a new diff object, it's possible to just test if
// there *is* a diff. During the actual patch, do the diff again and make the
// modifications directly. This way, there's no new allocations. Worth it?
function _VirtualDom_diffFacts(x, y, category)
{
	var diff;

	// look for changes and removals
	for (var xKey in x)
	{
		if (xKey === 'a1' || xKey === 'a0' || xKey === 'a3' || xKey === 'a4')
		{
			var subDiff = _VirtualDom_diffFacts(x[xKey], y[xKey] || {}, xKey);
			if (subDiff)
			{
				diff = diff || {};
				diff[xKey] = subDiff;
			}
			continue;
		}

		// remove if not in the new facts
		if (!(xKey in y))
		{
			diff = diff || {};
			diff[xKey] =
				!category
					? (typeof x[xKey] === 'string' ? '' : null)
					:
				(category === 'a1')
					? ''
					:
				(category === 'a0' || category === 'a3')
					? undefined
					:
				{ f: x[xKey].f, o: undefined };

			continue;
		}

		var xValue = x[xKey];
		var yValue = y[xKey];

		// reference equal, so don't worry about it
		if (xValue === yValue && xKey !== 'value' && xKey !== 'checked'
			|| category === 'a0' && _VirtualDom_equalEvents(xValue, yValue))
		{
			continue;
		}

		diff = diff || {};
		diff[xKey] = yValue;
	}

	// add new stuff
	for (var yKey in y)
	{
		if (!(yKey in x))
		{
			diff = diff || {};
			diff[yKey] = y[yKey];
		}
	}

	return diff;
}



// DIFF KIDS


function _VirtualDom_diffKids(xParent, yParent, patches, index)
{
	var xKids = xParent.e;
	var yKids = yParent.e;

	var xLen = xKids.length;
	var yLen = yKids.length;

	// FIGURE OUT IF THERE ARE INSERTS OR REMOVALS

	if (xLen > yLen)
	{
		_VirtualDom_pushPatch(patches, 6, index, {
			v: yLen,
			i: xLen - yLen
		});
	}
	else if (xLen < yLen)
	{
		_VirtualDom_pushPatch(patches, 7, index, {
			v: xLen,
			e: yKids
		});
	}

	// PAIRWISE DIFF EVERYTHING ELSE

	for (var minLen = xLen < yLen ? xLen : yLen, i = 0; i < minLen; i++)
	{
		var xKid = xKids[i];
		_VirtualDom_diffHelp(xKid, yKids[i], patches, ++index);
		index += xKid.b || 0;
	}
}



// KEYED DIFF


function _VirtualDom_diffKeyedKids(xParent, yParent, patches, rootIndex)
{
	var localPatches = [];

	var changes = {}; // Dict String Entry
	var inserts = []; // Array { index : Int, entry : Entry }
	// type Entry = { tag : String, vnode : VNode, index : Int, data : _ }

	var xKids = xParent.e;
	var yKids = yParent.e;
	var xLen = xKids.length;
	var yLen = yKids.length;
	var xIndex = 0;
	var yIndex = 0;

	var index = rootIndex;

	while (xIndex < xLen && yIndex < yLen)
	{
		var x = xKids[xIndex];
		var y = yKids[yIndex];

		var xKey = x.a;
		var yKey = y.a;
		var xNode = x.b;
		var yNode = y.b;

		var newMatch = undefined;
		var oldMatch = undefined;

		// check if keys match

		if (xKey === yKey)
		{
			index++;
			_VirtualDom_diffHelp(xNode, yNode, localPatches, index);
			index += xNode.b || 0;

			xIndex++;
			yIndex++;
			continue;
		}

		// look ahead 1 to detect insertions and removals.

		var xNext = xKids[xIndex + 1];
		var yNext = yKids[yIndex + 1];

		if (xNext)
		{
			var xNextKey = xNext.a;
			var xNextNode = xNext.b;
			oldMatch = yKey === xNextKey;
		}

		if (yNext)
		{
			var yNextKey = yNext.a;
			var yNextNode = yNext.b;
			newMatch = xKey === yNextKey;
		}


		// swap x and y
		if (newMatch && oldMatch)
		{
			index++;
			_VirtualDom_diffHelp(xNode, yNextNode, localPatches, index);
			_VirtualDom_insertNode(changes, localPatches, xKey, yNode, yIndex, inserts);
			index += xNode.b || 0;

			index++;
			_VirtualDom_removeNode(changes, localPatches, xKey, xNextNode, index);
			index += xNextNode.b || 0;

			xIndex += 2;
			yIndex += 2;
			continue;
		}

		// insert y
		if (newMatch)
		{
			index++;
			_VirtualDom_insertNode(changes, localPatches, yKey, yNode, yIndex, inserts);
			_VirtualDom_diffHelp(xNode, yNextNode, localPatches, index);
			index += xNode.b || 0;

			xIndex += 1;
			yIndex += 2;
			continue;
		}

		// remove x
		if (oldMatch)
		{
			index++;
			_VirtualDom_removeNode(changes, localPatches, xKey, xNode, index);
			index += xNode.b || 0;

			index++;
			_VirtualDom_diffHelp(xNextNode, yNode, localPatches, index);
			index += xNextNode.b || 0;

			xIndex += 2;
			yIndex += 1;
			continue;
		}

		// remove x, insert y
		if (xNext && xNextKey === yNextKey)
		{
			index++;
			_VirtualDom_removeNode(changes, localPatches, xKey, xNode, index);
			_VirtualDom_insertNode(changes, localPatches, yKey, yNode, yIndex, inserts);
			index += xNode.b || 0;

			index++;
			_VirtualDom_diffHelp(xNextNode, yNextNode, localPatches, index);
			index += xNextNode.b || 0;

			xIndex += 2;
			yIndex += 2;
			continue;
		}

		break;
	}

	// eat up any remaining nodes with removeNode and insertNode

	while (xIndex < xLen)
	{
		index++;
		var x = xKids[xIndex];
		var xNode = x.b;
		_VirtualDom_removeNode(changes, localPatches, x.a, xNode, index);
		index += xNode.b || 0;
		xIndex++;
	}

	while (yIndex < yLen)
	{
		var endInserts = endInserts || [];
		var y = yKids[yIndex];
		_VirtualDom_insertNode(changes, localPatches, y.a, y.b, undefined, endInserts);
		yIndex++;
	}

	if (localPatches.length > 0 || inserts.length > 0 || endInserts)
	{
		_VirtualDom_pushPatch(patches, 8, rootIndex, {
			w: localPatches,
			x: inserts,
			y: endInserts
		});
	}
}



// CHANGES FROM KEYED DIFF


var _VirtualDom_POSTFIX = '_elmW6BL';


function _VirtualDom_insertNode(changes, localPatches, key, vnode, yIndex, inserts)
{
	var entry = changes[key];

	// never seen this key before
	if (!entry)
	{
		entry = {
			c: 0,
			z: vnode,
			r: yIndex,
			s: undefined
		};

		inserts.push({ r: yIndex, A: entry });
		changes[key] = entry;

		return;
	}

	// this key was removed earlier, a match!
	if (entry.c === 1)
	{
		inserts.push({ r: yIndex, A: entry });

		entry.c = 2;
		var subPatches = [];
		_VirtualDom_diffHelp(entry.z, vnode, subPatches, entry.r);
		entry.r = yIndex;
		entry.s.s = {
			w: subPatches,
			A: entry
		};

		return;
	}

	// this key has already been inserted or moved, a duplicate!
	_VirtualDom_insertNode(changes, localPatches, key + _VirtualDom_POSTFIX, vnode, yIndex, inserts);
}


function _VirtualDom_removeNode(changes, localPatches, key, vnode, index)
{
	var entry = changes[key];

	// never seen this key before
	if (!entry)
	{
		var patch = _VirtualDom_pushPatch(localPatches, 9, index, undefined);

		changes[key] = {
			c: 1,
			z: vnode,
			r: index,
			s: patch
		};

		return;
	}

	// this key was inserted earlier, a match!
	if (entry.c === 0)
	{
		entry.c = 2;
		var subPatches = [];
		_VirtualDom_diffHelp(vnode, entry.z, subPatches, index);

		_VirtualDom_pushPatch(localPatches, 9, index, {
			w: subPatches,
			A: entry
		});

		return;
	}

	// this key has already been removed or moved, a duplicate!
	_VirtualDom_removeNode(changes, localPatches, key + _VirtualDom_POSTFIX, vnode, index);
}



// ADD DOM NODES
//
// Each DOM node has an "index" assigned in order of traversal. It is important
// to minimize our crawl over the actual DOM, so these indexes (along with the
// descendantsCount of virtual nodes) let us skip touching entire subtrees of
// the DOM if we know there are no patches there.


function _VirtualDom_addDomNodes(domNode, vNode, patches, eventNode)
{
	_VirtualDom_addDomNodesHelp(domNode, vNode, patches, 0, 0, vNode.b, eventNode);
}


// assumes `patches` is non-empty and indexes increase monotonically.
function _VirtualDom_addDomNodesHelp(domNode, vNode, patches, i, low, high, eventNode)
{
	var patch = patches[i];
	var index = patch.r;

	while (index === low)
	{
		var patchType = patch.$;

		if (patchType === 1)
		{
			_VirtualDom_addDomNodes(domNode, vNode.k, patch.s, eventNode);
		}
		else if (patchType === 8)
		{
			patch.t = domNode;
			patch.u = eventNode;

			var subPatches = patch.s.w;
			if (subPatches.length > 0)
			{
				_VirtualDom_addDomNodesHelp(domNode, vNode, subPatches, 0, low, high, eventNode);
			}
		}
		else if (patchType === 9)
		{
			patch.t = domNode;
			patch.u = eventNode;

			var data = patch.s;
			if (data)
			{
				data.A.s = domNode;
				var subPatches = data.w;
				if (subPatches.length > 0)
				{
					_VirtualDom_addDomNodesHelp(domNode, vNode, subPatches, 0, low, high, eventNode);
				}
			}
		}
		else
		{
			patch.t = domNode;
			patch.u = eventNode;
		}

		i++;

		if (!(patch = patches[i]) || (index = patch.r) > high)
		{
			return i;
		}
	}

	var tag = vNode.$;

	if (tag === 4)
	{
		var subNode = vNode.k;

		while (subNode.$ === 4)
		{
			subNode = subNode.k;
		}

		return _VirtualDom_addDomNodesHelp(domNode, subNode, patches, i, low + 1, high, domNode.elm_event_node_ref);
	}

	// tag must be 1 or 2 at this point

	var vKids = vNode.e;
	var childNodes = domNode.childNodes;
	for (var j = 0; j < vKids.length; j++)
	{
		low++;
		var vKid = tag === 1 ? vKids[j] : vKids[j].b;
		var nextLow = low + (vKid.b || 0);
		if (low <= index && index <= nextLow)
		{
			i = _VirtualDom_addDomNodesHelp(childNodes[j], vKid, patches, i, low, nextLow, eventNode);
			if (!(patch = patches[i]) || (index = patch.r) > high)
			{
				return i;
			}
		}
		low = nextLow;
	}
	return i;
}



// APPLY PATCHES


function _VirtualDom_applyPatches(rootDomNode, oldVirtualNode, patches, eventNode)
{
	if (patches.length === 0)
	{
		return rootDomNode;
	}

	_VirtualDom_addDomNodes(rootDomNode, oldVirtualNode, patches, eventNode);
	return _VirtualDom_applyPatchesHelp(rootDomNode, patches);
}

function _VirtualDom_applyPatchesHelp(rootDomNode, patches)
{
	for (var i = 0; i < patches.length; i++)
	{
		var patch = patches[i];
		var localDomNode = patch.t
		var newNode = _VirtualDom_applyPatch(localDomNode, patch);
		if (localDomNode === rootDomNode)
		{
			rootDomNode = newNode;
		}
	}
	return rootDomNode;
}

function _VirtualDom_applyPatch(domNode, patch)
{
	switch (patch.$)
	{
		case 0:
			return _VirtualDom_applyPatchRedraw(domNode, patch.s, patch.u);

		case 4:
			_VirtualDom_applyFacts(domNode, patch.u, patch.s);
			return domNode;

		case 3:
			domNode.replaceData(0, domNode.length, patch.s);
			return domNode;

		case 1:
			return _VirtualDom_applyPatchesHelp(domNode, patch.s);

		case 2:
			if (domNode.elm_event_node_ref)
			{
				domNode.elm_event_node_ref.j = patch.s;
			}
			else
			{
				domNode.elm_event_node_ref = { j: patch.s, p: patch.u };
			}
			return domNode;

		case 6:
			var data = patch.s;
			for (var i = 0; i < data.i; i++)
			{
				domNode.removeChild(domNode.childNodes[data.v]);
			}
			return domNode;

		case 7:
			var data = patch.s;
			var kids = data.e;
			var i = data.v;
			var theEnd = domNode.childNodes[i];
			for (; i < kids.length; i++)
			{
				domNode.insertBefore(_VirtualDom_render(kids[i], patch.u), theEnd);
			}
			return domNode;

		case 9:
			var data = patch.s;
			if (!data)
			{
				domNode.parentNode.removeChild(domNode);
				return domNode;
			}
			var entry = data.A;
			if (typeof entry.r !== 'undefined')
			{
				domNode.parentNode.removeChild(domNode);
			}
			entry.s = _VirtualDom_applyPatchesHelp(domNode, data.w);
			return domNode;

		case 8:
			return _VirtualDom_applyPatchReorder(domNode, patch);

		case 5:
			return patch.s(domNode);

		default:
			_Debug_crash(10); // 'Ran into an unknown patch!'
	}
}


function _VirtualDom_applyPatchRedraw(domNode, vNode, eventNode)
{
	var parentNode = domNode.parentNode;
	var newNode = _VirtualDom_render(vNode, eventNode);

	if (!newNode.elm_event_node_ref)
	{
		newNode.elm_event_node_ref = domNode.elm_event_node_ref;
	}

	if (parentNode && newNode !== domNode)
	{
		parentNode.replaceChild(newNode, domNode);
	}
	return newNode;
}


function _VirtualDom_applyPatchReorder(domNode, patch)
{
	var data = patch.s;

	// remove end inserts
	var frag = _VirtualDom_applyPatchReorderEndInsertsHelp(data.y, patch);

	// removals
	domNode = _VirtualDom_applyPatchesHelp(domNode, data.w);

	// inserts
	var inserts = data.x;
	for (var i = 0; i < inserts.length; i++)
	{
		var insert = inserts[i];
		var entry = insert.A;
		var node = entry.c === 2
			? entry.s
			: _VirtualDom_render(entry.z, patch.u);
		domNode.insertBefore(node, domNode.childNodes[insert.r]);
	}

	// add end inserts
	if (frag)
	{
		_VirtualDom_appendChild(domNode, frag);
	}

	return domNode;
}


function _VirtualDom_applyPatchReorderEndInsertsHelp(endInserts, patch)
{
	if (!endInserts)
	{
		return;
	}

	var frag = _VirtualDom_doc.createDocumentFragment();
	for (var i = 0; i < endInserts.length; i++)
	{
		var insert = endInserts[i];
		var entry = insert.A;
		_VirtualDom_appendChild(frag, entry.c === 2
			? entry.s
			: _VirtualDom_render(entry.z, patch.u)
		);
	}
	return frag;
}


function _VirtualDom_virtualize(node)
{
	// TEXT NODES

	if (node.nodeType === 3)
	{
		return _VirtualDom_text(node.textContent);
	}


	// WEIRD NODES

	if (node.nodeType !== 1)
	{
		return _VirtualDom_text('');
	}


	// ELEMENT NODES

	var attrList = _List_Nil;
	var attrs = node.attributes;
	for (var i = attrs.length; i--; )
	{
		var attr = attrs[i];
		var name = attr.name;
		var value = attr.value;
		attrList = _List_Cons( A2(_VirtualDom_attribute, name, value), attrList );
	}

	var tag = node.tagName.toLowerCase();
	var kidList = _List_Nil;
	var kids = node.childNodes;

	for (var i = kids.length; i--; )
	{
		kidList = _List_Cons(_VirtualDom_virtualize(kids[i]), kidList);
	}
	return A3(_VirtualDom_node, tag, attrList, kidList);
}

function _VirtualDom_dekey(keyedNode)
{
	var keyedKids = keyedNode.e;
	var len = keyedKids.length;
	var kids = new Array(len);
	for (var i = 0; i < len; i++)
	{
		kids[i] = keyedKids[i].b;
	}

	return {
		$: 1,
		c: keyedNode.c,
		d: keyedNode.d,
		e: kids,
		f: keyedNode.f,
		b: keyedNode.b
	};
}




// ELEMENT


var _Debugger_element;

var _Browser_element = _Debugger_element || F4(function(impl, flagDecoder, debugMetadata, args)
{
	return _Platform_initialize(
		flagDecoder,
		args,
		impl.init,
		impl.update,
		impl.subscriptions,
		function(sendToApp, initialModel) {
			var view = impl.view;
			/**_UNUSED/
			var domNode = args['node'];
			//*/
			/**/
			var domNode = args && args['node'] ? args['node'] : _Debug_crash(0);
			//*/
			var currNode = _VirtualDom_virtualize(domNode);

			return _Browser_makeAnimator(initialModel, function(model)
			{
				var nextNode = view(model);
				var patches = _VirtualDom_diff(currNode, nextNode);
				domNode = _VirtualDom_applyPatches(domNode, currNode, patches, sendToApp);
				currNode = nextNode;
			});
		}
	);
});



// DOCUMENT


var _Debugger_document;

var _Browser_document = _Debugger_document || F4(function(impl, flagDecoder, debugMetadata, args)
{
	return _Platform_initialize(
		flagDecoder,
		args,
		impl.init,
		impl.update,
		impl.subscriptions,
		function(sendToApp, initialModel) {
			var divertHrefToApp = impl.setup && impl.setup(sendToApp)
			var view = impl.view;
			var title = _VirtualDom_doc.title;
			var bodyNode = _VirtualDom_doc.body;
			var currNode = _VirtualDom_virtualize(bodyNode);
			return _Browser_makeAnimator(initialModel, function(model)
			{
				_VirtualDom_divertHrefToApp = divertHrefToApp;
				var doc = view(model);
				var nextNode = _VirtualDom_node('body')(_List_Nil)(doc.body);
				var patches = _VirtualDom_diff(currNode, nextNode);
				bodyNode = _VirtualDom_applyPatches(bodyNode, currNode, patches, sendToApp);
				currNode = nextNode;
				_VirtualDom_divertHrefToApp = 0;
				(title !== doc.title) && (_VirtualDom_doc.title = title = doc.title);
			});
		}
	);
});



// ANIMATION


var _Browser_cancelAnimationFrame =
	typeof cancelAnimationFrame !== 'undefined'
		? cancelAnimationFrame
		: function(id) { clearTimeout(id); };

var _Browser_requestAnimationFrame =
	typeof requestAnimationFrame !== 'undefined'
		? requestAnimationFrame
		: function(callback) { return setTimeout(callback, 1000 / 60); };


function _Browser_makeAnimator(model, draw)
{
	draw(model);

	var state = 0;

	function updateIfNeeded()
	{
		state = state === 1
			? 0
			: ( _Browser_requestAnimationFrame(updateIfNeeded), draw(model), 1 );
	}

	return function(nextModel, isSync)
	{
		model = nextModel;

		isSync
			? ( draw(model),
				state === 2 && (state = 1)
				)
			: ( state === 0 && _Browser_requestAnimationFrame(updateIfNeeded),
				state = 2
				);
	};
}



// APPLICATION


function _Browser_application(impl)
{
	var onUrlChange = impl.onUrlChange;
	var onUrlRequest = impl.onUrlRequest;
	var key = function() { key.a(onUrlChange(_Browser_getUrl())); };

	return _Browser_document({
		setup: function(sendToApp)
		{
			key.a = sendToApp;
			_Browser_window.addEventListener('popstate', key);
			_Browser_window.navigator.userAgent.indexOf('Trident') < 0 || _Browser_window.addEventListener('hashchange', key);

			return F2(function(domNode, event)
			{
				if (!event.ctrlKey && !event.metaKey && !event.shiftKey && event.button < 1 && !domNode.target && !domNode.hasAttribute('download'))
				{
					event.preventDefault();
					var href = domNode.href;
					var curr = _Browser_getUrl();
					var next = $elm$url$Url$fromString(href).a;
					sendToApp(onUrlRequest(
						(next
							&& curr.protocol === next.protocol
							&& curr.host === next.host
							&& curr.port_.a === next.port_.a
						)
							? $elm$browser$Browser$Internal(next)
							: $elm$browser$Browser$External(href)
					));
				}
			});
		},
		init: function(flags)
		{
			return A3(impl.init, flags, _Browser_getUrl(), key);
		},
		view: impl.view,
		update: impl.update,
		subscriptions: impl.subscriptions
	});
}

function _Browser_getUrl()
{
	return $elm$url$Url$fromString(_VirtualDom_doc.location.href).a || _Debug_crash(1);
}

var _Browser_go = F2(function(key, n)
{
	return A2($elm$core$Task$perform, $elm$core$Basics$never, _Scheduler_binding(function() {
		n && history.go(n);
		key();
	}));
});

var _Browser_pushUrl = F2(function(key, url)
{
	return A2($elm$core$Task$perform, $elm$core$Basics$never, _Scheduler_binding(function() {
		history.pushState({}, '', url);
		key();
	}));
});

var _Browser_replaceUrl = F2(function(key, url)
{
	return A2($elm$core$Task$perform, $elm$core$Basics$never, _Scheduler_binding(function() {
		history.replaceState({}, '', url);
		key();
	}));
});



// GLOBAL EVENTS


var _Browser_fakeNode = { addEventListener: function() {}, removeEventListener: function() {} };
var _Browser_doc = typeof document !== 'undefined' ? document : _Browser_fakeNode;
var _Browser_window = typeof window !== 'undefined' ? window : _Browser_fakeNode;

var _Browser_on = F3(function(node, eventName, sendToSelf)
{
	return _Scheduler_spawn(_Scheduler_binding(function(callback)
	{
		function handler(event)	{ _Scheduler_rawSpawn(sendToSelf(event)); }
		node.addEventListener(eventName, handler, _VirtualDom_passiveSupported && { passive: true });
		return function() { node.removeEventListener(eventName, handler); };
	}));
});

var _Browser_decodeEvent = F2(function(decoder, event)
{
	var result = _Json_runHelp(decoder, event);
	return $elm$core$Result$isOk(result) ? $elm$core$Maybe$Just(result.a) : $elm$core$Maybe$Nothing;
});



// PAGE VISIBILITY


function _Browser_visibilityInfo()
{
	return (typeof _VirtualDom_doc.hidden !== 'undefined')
		? { hidden: 'hidden', change: 'visibilitychange' }
		:
	(typeof _VirtualDom_doc.mozHidden !== 'undefined')
		? { hidden: 'mozHidden', change: 'mozvisibilitychange' }
		:
	(typeof _VirtualDom_doc.msHidden !== 'undefined')
		? { hidden: 'msHidden', change: 'msvisibilitychange' }
		:
	(typeof _VirtualDom_doc.webkitHidden !== 'undefined')
		? { hidden: 'webkitHidden', change: 'webkitvisibilitychange' }
		: { hidden: 'hidden', change: 'visibilitychange' };
}



// ANIMATION FRAMES


function _Browser_rAF()
{
	return _Scheduler_binding(function(callback)
	{
		var id = _Browser_requestAnimationFrame(function() {
			callback(_Scheduler_succeed(Date.now()));
		});

		return function() {
			_Browser_cancelAnimationFrame(id);
		};
	});
}


function _Browser_now()
{
	return _Scheduler_binding(function(callback)
	{
		callback(_Scheduler_succeed(Date.now()));
	});
}



// DOM STUFF


function _Browser_withNode(id, doStuff)
{
	return _Scheduler_binding(function(callback)
	{
		_Browser_requestAnimationFrame(function() {
			var node = document.getElementById(id);
			callback(node
				? _Scheduler_succeed(doStuff(node))
				: _Scheduler_fail($elm$browser$Browser$Dom$NotFound(id))
			);
		});
	});
}


function _Browser_withWindow(doStuff)
{
	return _Scheduler_binding(function(callback)
	{
		_Browser_requestAnimationFrame(function() {
			callback(_Scheduler_succeed(doStuff()));
		});
	});
}


// FOCUS and BLUR


var _Browser_call = F2(function(functionName, id)
{
	return _Browser_withNode(id, function(node) {
		node[functionName]();
		return _Utils_Tuple0;
	});
});



// WINDOW VIEWPORT


function _Browser_getViewport()
{
	return {
		scene: _Browser_getScene(),
		viewport: {
			x: _Browser_window.pageXOffset,
			y: _Browser_window.pageYOffset,
			width: _Browser_doc.documentElement.clientWidth,
			height: _Browser_doc.documentElement.clientHeight
		}
	};
}

function _Browser_getScene()
{
	var body = _Browser_doc.body;
	var elem = _Browser_doc.documentElement;
	return {
		width: Math.max(body.scrollWidth, body.offsetWidth, elem.scrollWidth, elem.offsetWidth, elem.clientWidth),
		height: Math.max(body.scrollHeight, body.offsetHeight, elem.scrollHeight, elem.offsetHeight, elem.clientHeight)
	};
}

var _Browser_setViewport = F2(function(x, y)
{
	return _Browser_withWindow(function()
	{
		_Browser_window.scroll(x, y);
		return _Utils_Tuple0;
	});
});



// ELEMENT VIEWPORT


function _Browser_getViewportOf(id)
{
	return _Browser_withNode(id, function(node)
	{
		return {
			scene: {
				width: node.scrollWidth,
				height: node.scrollHeight
			},
			viewport: {
				x: node.scrollLeft,
				y: node.scrollTop,
				width: node.clientWidth,
				height: node.clientHeight
			}
		};
	});
}


var _Browser_setViewportOf = F3(function(id, x, y)
{
	return _Browser_withNode(id, function(node)
	{
		node.scrollLeft = x;
		node.scrollTop = y;
		return _Utils_Tuple0;
	});
});



// ELEMENT


function _Browser_getElement(id)
{
	return _Browser_withNode(id, function(node)
	{
		var rect = node.getBoundingClientRect();
		var x = _Browser_window.pageXOffset;
		var y = _Browser_window.pageYOffset;
		return {
			scene: _Browser_getScene(),
			viewport: {
				x: x,
				y: y,
				width: _Browser_doc.documentElement.clientWidth,
				height: _Browser_doc.documentElement.clientHeight
			},
			element: {
				x: x + rect.left,
				y: y + rect.top,
				width: rect.width,
				height: rect.height
			}
		};
	});
}



// LOAD and RELOAD


function _Browser_reload(skipCache)
{
	return A2($elm$core$Task$perform, $elm$core$Basics$never, _Scheduler_binding(function(callback)
	{
		_VirtualDom_doc.location.reload(skipCache);
	}));
}

function _Browser_load(url)
{
	return A2($elm$core$Task$perform, $elm$core$Basics$never, _Scheduler_binding(function(callback)
	{
		try
		{
			_Browser_window.location = url;
		}
		catch(err)
		{
			// Only Firefox can throw a NS_ERROR_MALFORMED_URI exception here.
			// Other browsers reload the page, so let's be consistent about that.
			_VirtualDom_doc.location.reload(false);
		}
	}));
}



function _Time_now(millisToPosix)
{
	return _Scheduler_binding(function(callback)
	{
		callback(_Scheduler_succeed(millisToPosix(Date.now())));
	});
}

var _Time_setInterval = F2(function(interval, task)
{
	return _Scheduler_binding(function(callback)
	{
		var id = setInterval(function() { _Scheduler_rawSpawn(task); }, interval);
		return function() { clearInterval(id); };
	});
});

function _Time_here()
{
	return _Scheduler_binding(function(callback)
	{
		callback(_Scheduler_succeed(
			A2($elm$time$Time$customZone, -(new Date().getTimezoneOffset()), _List_Nil)
		));
	});
}


function _Time_getZoneName()
{
	return _Scheduler_binding(function(callback)
	{
		try
		{
			var name = $elm$time$Time$Name(Intl.DateTimeFormat().resolvedOptions().timeZone);
		}
		catch (e)
		{
			var name = $elm$time$Time$Offset(new Date().getTimezoneOffset());
		}
		callback(_Scheduler_succeed(name));
	});
}
var $elm$core$Basics$EQ = {$: 'EQ'};
var $elm$core$Basics$GT = {$: 'GT'};
var $elm$core$Basics$LT = {$: 'LT'};
var $elm$core$List$cons = _List_cons;
var $elm$core$Dict$foldr = F3(
	function (func, acc, t) {
		foldr:
		while (true) {
			if (t.$ === 'RBEmpty_elm_builtin') {
				return acc;
			} else {
				var key = t.b;
				var value = t.c;
				var left = t.d;
				var right = t.e;
				var $temp$func = func,
					$temp$acc = A3(
					func,
					key,
					value,
					A3($elm$core$Dict$foldr, func, acc, right)),
					$temp$t = left;
				func = $temp$func;
				acc = $temp$acc;
				t = $temp$t;
				continue foldr;
			}
		}
	});
var $elm$core$Dict$toList = function (dict) {
	return A3(
		$elm$core$Dict$foldr,
		F3(
			function (key, value, list) {
				return A2(
					$elm$core$List$cons,
					_Utils_Tuple2(key, value),
					list);
			}),
		_List_Nil,
		dict);
};
var $elm$core$Dict$keys = function (dict) {
	return A3(
		$elm$core$Dict$foldr,
		F3(
			function (key, value, keyList) {
				return A2($elm$core$List$cons, key, keyList);
			}),
		_List_Nil,
		dict);
};
var $elm$core$Set$toList = function (_v0) {
	var dict = _v0.a;
	return $elm$core$Dict$keys(dict);
};
var $elm$core$Elm$JsArray$foldr = _JsArray_foldr;
var $elm$core$Array$foldr = F3(
	function (func, baseCase, _v0) {
		var tree = _v0.c;
		var tail = _v0.d;
		var helper = F2(
			function (node, acc) {
				if (node.$ === 'SubTree') {
					var subTree = node.a;
					return A3($elm$core$Elm$JsArray$foldr, helper, acc, subTree);
				} else {
					var values = node.a;
					return A3($elm$core$Elm$JsArray$foldr, func, acc, values);
				}
			});
		return A3(
			$elm$core$Elm$JsArray$foldr,
			helper,
			A3($elm$core$Elm$JsArray$foldr, func, baseCase, tail),
			tree);
	});
var $elm$core$Array$toList = function (array) {
	return A3($elm$core$Array$foldr, $elm$core$List$cons, _List_Nil, array);
};
var $elm$core$Result$Err = function (a) {
	return {$: 'Err', a: a};
};
var $elm$json$Json$Decode$Failure = F2(
	function (a, b) {
		return {$: 'Failure', a: a, b: b};
	});
var $elm$json$Json$Decode$Field = F2(
	function (a, b) {
		return {$: 'Field', a: a, b: b};
	});
var $elm$json$Json$Decode$Index = F2(
	function (a, b) {
		return {$: 'Index', a: a, b: b};
	});
var $elm$core$Result$Ok = function (a) {
	return {$: 'Ok', a: a};
};
var $elm$json$Json$Decode$OneOf = function (a) {
	return {$: 'OneOf', a: a};
};
var $elm$core$Basics$False = {$: 'False'};
var $elm$core$Basics$add = _Basics_add;
var $elm$core$Maybe$Just = function (a) {
	return {$: 'Just', a: a};
};
var $elm$core$Maybe$Nothing = {$: 'Nothing'};
var $elm$core$String$all = _String_all;
var $elm$core$Basics$and = _Basics_and;
var $elm$core$Basics$append = _Utils_append;
var $elm$json$Json$Encode$encode = _Json_encode;
var $elm$core$String$fromInt = _String_fromNumber;
var $elm$core$String$join = F2(
	function (sep, chunks) {
		return A2(
			_String_join,
			sep,
			_List_toArray(chunks));
	});
var $elm$core$String$split = F2(
	function (sep, string) {
		return _List_fromArray(
			A2(_String_split, sep, string));
	});
var $elm$json$Json$Decode$indent = function (str) {
	return A2(
		$elm$core$String$join,
		'\n    ',
		A2($elm$core$String$split, '\n', str));
};
var $elm$core$List$foldl = F3(
	function (func, acc, list) {
		foldl:
		while (true) {
			if (!list.b) {
				return acc;
			} else {
				var x = list.a;
				var xs = list.b;
				var $temp$func = func,
					$temp$acc = A2(func, x, acc),
					$temp$list = xs;
				func = $temp$func;
				acc = $temp$acc;
				list = $temp$list;
				continue foldl;
			}
		}
	});
var $elm$core$List$length = function (xs) {
	return A3(
		$elm$core$List$foldl,
		F2(
			function (_v0, i) {
				return i + 1;
			}),
		0,
		xs);
};
var $elm$core$List$map2 = _List_map2;
var $elm$core$Basics$le = _Utils_le;
var $elm$core$Basics$sub = _Basics_sub;
var $elm$core$List$rangeHelp = F3(
	function (lo, hi, list) {
		rangeHelp:
		while (true) {
			if (_Utils_cmp(lo, hi) < 1) {
				var $temp$lo = lo,
					$temp$hi = hi - 1,
					$temp$list = A2($elm$core$List$cons, hi, list);
				lo = $temp$lo;
				hi = $temp$hi;
				list = $temp$list;
				continue rangeHelp;
			} else {
				return list;
			}
		}
	});
var $elm$core$List$range = F2(
	function (lo, hi) {
		return A3($elm$core$List$rangeHelp, lo, hi, _List_Nil);
	});
var $elm$core$List$indexedMap = F2(
	function (f, xs) {
		return A3(
			$elm$core$List$map2,
			f,
			A2(
				$elm$core$List$range,
				0,
				$elm$core$List$length(xs) - 1),
			xs);
	});
var $elm$core$Char$toCode = _Char_toCode;
var $elm$core$Char$isLower = function (_char) {
	var code = $elm$core$Char$toCode(_char);
	return (97 <= code) && (code <= 122);
};
var $elm$core$Char$isUpper = function (_char) {
	var code = $elm$core$Char$toCode(_char);
	return (code <= 90) && (65 <= code);
};
var $elm$core$Basics$or = _Basics_or;
var $elm$core$Char$isAlpha = function (_char) {
	return $elm$core$Char$isLower(_char) || $elm$core$Char$isUpper(_char);
};
var $elm$core$Char$isDigit = function (_char) {
	var code = $elm$core$Char$toCode(_char);
	return (code <= 57) && (48 <= code);
};
var $elm$core$Char$isAlphaNum = function (_char) {
	return $elm$core$Char$isLower(_char) || ($elm$core$Char$isUpper(_char) || $elm$core$Char$isDigit(_char));
};
var $elm$core$List$reverse = function (list) {
	return A3($elm$core$List$foldl, $elm$core$List$cons, _List_Nil, list);
};
var $elm$core$String$uncons = _String_uncons;
var $elm$json$Json$Decode$errorOneOf = F2(
	function (i, error) {
		return '\n\n(' + ($elm$core$String$fromInt(i + 1) + (') ' + $elm$json$Json$Decode$indent(
			$elm$json$Json$Decode$errorToString(error))));
	});
var $elm$json$Json$Decode$errorToString = function (error) {
	return A2($elm$json$Json$Decode$errorToStringHelp, error, _List_Nil);
};
var $elm$json$Json$Decode$errorToStringHelp = F2(
	function (error, context) {
		errorToStringHelp:
		while (true) {
			switch (error.$) {
				case 'Field':
					var f = error.a;
					var err = error.b;
					var isSimple = function () {
						var _v1 = $elm$core$String$uncons(f);
						if (_v1.$ === 'Nothing') {
							return false;
						} else {
							var _v2 = _v1.a;
							var _char = _v2.a;
							var rest = _v2.b;
							return $elm$core$Char$isAlpha(_char) && A2($elm$core$String$all, $elm$core$Char$isAlphaNum, rest);
						}
					}();
					var fieldName = isSimple ? ('.' + f) : ('[\'' + (f + '\']'));
					var $temp$error = err,
						$temp$context = A2($elm$core$List$cons, fieldName, context);
					error = $temp$error;
					context = $temp$context;
					continue errorToStringHelp;
				case 'Index':
					var i = error.a;
					var err = error.b;
					var indexName = '[' + ($elm$core$String$fromInt(i) + ']');
					var $temp$error = err,
						$temp$context = A2($elm$core$List$cons, indexName, context);
					error = $temp$error;
					context = $temp$context;
					continue errorToStringHelp;
				case 'OneOf':
					var errors = error.a;
					if (!errors.b) {
						return 'Ran into a Json.Decode.oneOf with no possibilities' + function () {
							if (!context.b) {
								return '!';
							} else {
								return ' at json' + A2(
									$elm$core$String$join,
									'',
									$elm$core$List$reverse(context));
							}
						}();
					} else {
						if (!errors.b.b) {
							var err = errors.a;
							var $temp$error = err,
								$temp$context = context;
							error = $temp$error;
							context = $temp$context;
							continue errorToStringHelp;
						} else {
							var starter = function () {
								if (!context.b) {
									return 'Json.Decode.oneOf';
								} else {
									return 'The Json.Decode.oneOf at json' + A2(
										$elm$core$String$join,
										'',
										$elm$core$List$reverse(context));
								}
							}();
							var introduction = starter + (' failed in the following ' + ($elm$core$String$fromInt(
								$elm$core$List$length(errors)) + ' ways:'));
							return A2(
								$elm$core$String$join,
								'\n\n',
								A2(
									$elm$core$List$cons,
									introduction,
									A2($elm$core$List$indexedMap, $elm$json$Json$Decode$errorOneOf, errors)));
						}
					}
				default:
					var msg = error.a;
					var json = error.b;
					var introduction = function () {
						if (!context.b) {
							return 'Problem with the given value:\n\n';
						} else {
							return 'Problem with the value at json' + (A2(
								$elm$core$String$join,
								'',
								$elm$core$List$reverse(context)) + ':\n\n    ');
						}
					}();
					return introduction + ($elm$json$Json$Decode$indent(
						A2($elm$json$Json$Encode$encode, 4, json)) + ('\n\n' + msg));
			}
		}
	});
var $elm$core$Array$branchFactor = 32;
var $elm$core$Array$Array_elm_builtin = F4(
	function (a, b, c, d) {
		return {$: 'Array_elm_builtin', a: a, b: b, c: c, d: d};
	});
var $elm$core$Elm$JsArray$empty = _JsArray_empty;
var $elm$core$Basics$ceiling = _Basics_ceiling;
var $elm$core$Basics$fdiv = _Basics_fdiv;
var $elm$core$Basics$logBase = F2(
	function (base, number) {
		return _Basics_log(number) / _Basics_log(base);
	});
var $elm$core$Basics$toFloat = _Basics_toFloat;
var $elm$core$Array$shiftStep = $elm$core$Basics$ceiling(
	A2($elm$core$Basics$logBase, 2, $elm$core$Array$branchFactor));
var $elm$core$Array$empty = A4($elm$core$Array$Array_elm_builtin, 0, $elm$core$Array$shiftStep, $elm$core$Elm$JsArray$empty, $elm$core$Elm$JsArray$empty);
var $elm$core$Elm$JsArray$initialize = _JsArray_initialize;
var $elm$core$Array$Leaf = function (a) {
	return {$: 'Leaf', a: a};
};
var $elm$core$Basics$apL = F2(
	function (f, x) {
		return f(x);
	});
var $elm$core$Basics$apR = F2(
	function (x, f) {
		return f(x);
	});
var $elm$core$Basics$eq = _Utils_equal;
var $elm$core$Basics$floor = _Basics_floor;
var $elm$core$Elm$JsArray$length = _JsArray_length;
var $elm$core$Basics$gt = _Utils_gt;
var $elm$core$Basics$max = F2(
	function (x, y) {
		return (_Utils_cmp(x, y) > 0) ? x : y;
	});
var $elm$core$Basics$mul = _Basics_mul;
var $elm$core$Array$SubTree = function (a) {
	return {$: 'SubTree', a: a};
};
var $elm$core$Elm$JsArray$initializeFromList = _JsArray_initializeFromList;
var $elm$core$Array$compressNodes = F2(
	function (nodes, acc) {
		compressNodes:
		while (true) {
			var _v0 = A2($elm$core$Elm$JsArray$initializeFromList, $elm$core$Array$branchFactor, nodes);
			var node = _v0.a;
			var remainingNodes = _v0.b;
			var newAcc = A2(
				$elm$core$List$cons,
				$elm$core$Array$SubTree(node),
				acc);
			if (!remainingNodes.b) {
				return $elm$core$List$reverse(newAcc);
			} else {
				var $temp$nodes = remainingNodes,
					$temp$acc = newAcc;
				nodes = $temp$nodes;
				acc = $temp$acc;
				continue compressNodes;
			}
		}
	});
var $elm$core$Tuple$first = function (_v0) {
	var x = _v0.a;
	return x;
};
var $elm$core$Array$treeFromBuilder = F2(
	function (nodeList, nodeListSize) {
		treeFromBuilder:
		while (true) {
			var newNodeSize = $elm$core$Basics$ceiling(nodeListSize / $elm$core$Array$branchFactor);
			if (newNodeSize === 1) {
				return A2($elm$core$Elm$JsArray$initializeFromList, $elm$core$Array$branchFactor, nodeList).a;
			} else {
				var $temp$nodeList = A2($elm$core$Array$compressNodes, nodeList, _List_Nil),
					$temp$nodeListSize = newNodeSize;
				nodeList = $temp$nodeList;
				nodeListSize = $temp$nodeListSize;
				continue treeFromBuilder;
			}
		}
	});
var $elm$core$Array$builderToArray = F2(
	function (reverseNodeList, builder) {
		if (!builder.nodeListSize) {
			return A4(
				$elm$core$Array$Array_elm_builtin,
				$elm$core$Elm$JsArray$length(builder.tail),
				$elm$core$Array$shiftStep,
				$elm$core$Elm$JsArray$empty,
				builder.tail);
		} else {
			var treeLen = builder.nodeListSize * $elm$core$Array$branchFactor;
			var depth = $elm$core$Basics$floor(
				A2($elm$core$Basics$logBase, $elm$core$Array$branchFactor, treeLen - 1));
			var correctNodeList = reverseNodeList ? $elm$core$List$reverse(builder.nodeList) : builder.nodeList;
			var tree = A2($elm$core$Array$treeFromBuilder, correctNodeList, builder.nodeListSize);
			return A4(
				$elm$core$Array$Array_elm_builtin,
				$elm$core$Elm$JsArray$length(builder.tail) + treeLen,
				A2($elm$core$Basics$max, 5, depth * $elm$core$Array$shiftStep),
				tree,
				builder.tail);
		}
	});
var $elm$core$Basics$idiv = _Basics_idiv;
var $elm$core$Basics$lt = _Utils_lt;
var $elm$core$Array$initializeHelp = F5(
	function (fn, fromIndex, len, nodeList, tail) {
		initializeHelp:
		while (true) {
			if (fromIndex < 0) {
				return A2(
					$elm$core$Array$builderToArray,
					false,
					{nodeList: nodeList, nodeListSize: (len / $elm$core$Array$branchFactor) | 0, tail: tail});
			} else {
				var leaf = $elm$core$Array$Leaf(
					A3($elm$core$Elm$JsArray$initialize, $elm$core$Array$branchFactor, fromIndex, fn));
				var $temp$fn = fn,
					$temp$fromIndex = fromIndex - $elm$core$Array$branchFactor,
					$temp$len = len,
					$temp$nodeList = A2($elm$core$List$cons, leaf, nodeList),
					$temp$tail = tail;
				fn = $temp$fn;
				fromIndex = $temp$fromIndex;
				len = $temp$len;
				nodeList = $temp$nodeList;
				tail = $temp$tail;
				continue initializeHelp;
			}
		}
	});
var $elm$core$Basics$remainderBy = _Basics_remainderBy;
var $elm$core$Array$initialize = F2(
	function (len, fn) {
		if (len <= 0) {
			return $elm$core$Array$empty;
		} else {
			var tailLen = len % $elm$core$Array$branchFactor;
			var tail = A3($elm$core$Elm$JsArray$initialize, tailLen, len - tailLen, fn);
			var initialFromIndex = (len - tailLen) - $elm$core$Array$branchFactor;
			return A5($elm$core$Array$initializeHelp, fn, initialFromIndex, len, _List_Nil, tail);
		}
	});
var $elm$core$Basics$True = {$: 'True'};
var $elm$core$Result$isOk = function (result) {
	if (result.$ === 'Ok') {
		return true;
	} else {
		return false;
	}
};
var $elm$json$Json$Decode$map = _Json_map1;
var $elm$json$Json$Decode$map2 = _Json_map2;
var $elm$json$Json$Decode$succeed = _Json_succeed;
var $elm$virtual_dom$VirtualDom$toHandlerInt = function (handler) {
	switch (handler.$) {
		case 'Normal':
			return 0;
		case 'MayStopPropagation':
			return 1;
		case 'MayPreventDefault':
			return 2;
		default:
			return 3;
	}
};
var $elm$browser$Browser$External = function (a) {
	return {$: 'External', a: a};
};
var $elm$browser$Browser$Internal = function (a) {
	return {$: 'Internal', a: a};
};
var $elm$core$Basics$identity = function (x) {
	return x;
};
var $elm$browser$Browser$Dom$NotFound = function (a) {
	return {$: 'NotFound', a: a};
};
var $elm$url$Url$Http = {$: 'Http'};
var $elm$url$Url$Https = {$: 'Https'};
var $elm$url$Url$Url = F6(
	function (protocol, host, port_, path, query, fragment) {
		return {fragment: fragment, host: host, path: path, port_: port_, protocol: protocol, query: query};
	});
var $elm$core$String$contains = _String_contains;
var $elm$core$String$length = _String_length;
var $elm$core$String$slice = _String_slice;
var $elm$core$String$dropLeft = F2(
	function (n, string) {
		return (n < 1) ? string : A3(
			$elm$core$String$slice,
			n,
			$elm$core$String$length(string),
			string);
	});
var $elm$core$String$indexes = _String_indexes;
var $elm$core$String$isEmpty = function (string) {
	return string === '';
};
var $elm$core$String$left = F2(
	function (n, string) {
		return (n < 1) ? '' : A3($elm$core$String$slice, 0, n, string);
	});
var $elm$core$String$toInt = _String_toInt;
var $elm$url$Url$chompBeforePath = F5(
	function (protocol, path, params, frag, str) {
		if ($elm$core$String$isEmpty(str) || A2($elm$core$String$contains, '@', str)) {
			return $elm$core$Maybe$Nothing;
		} else {
			var _v0 = A2($elm$core$String$indexes, ':', str);
			if (!_v0.b) {
				return $elm$core$Maybe$Just(
					A6($elm$url$Url$Url, protocol, str, $elm$core$Maybe$Nothing, path, params, frag));
			} else {
				if (!_v0.b.b) {
					var i = _v0.a;
					var _v1 = $elm$core$String$toInt(
						A2($elm$core$String$dropLeft, i + 1, str));
					if (_v1.$ === 'Nothing') {
						return $elm$core$Maybe$Nothing;
					} else {
						var port_ = _v1;
						return $elm$core$Maybe$Just(
							A6(
								$elm$url$Url$Url,
								protocol,
								A2($elm$core$String$left, i, str),
								port_,
								path,
								params,
								frag));
					}
				} else {
					return $elm$core$Maybe$Nothing;
				}
			}
		}
	});
var $elm$url$Url$chompBeforeQuery = F4(
	function (protocol, params, frag, str) {
		if ($elm$core$String$isEmpty(str)) {
			return $elm$core$Maybe$Nothing;
		} else {
			var _v0 = A2($elm$core$String$indexes, '/', str);
			if (!_v0.b) {
				return A5($elm$url$Url$chompBeforePath, protocol, '/', params, frag, str);
			} else {
				var i = _v0.a;
				return A5(
					$elm$url$Url$chompBeforePath,
					protocol,
					A2($elm$core$String$dropLeft, i, str),
					params,
					frag,
					A2($elm$core$String$left, i, str));
			}
		}
	});
var $elm$url$Url$chompBeforeFragment = F3(
	function (protocol, frag, str) {
		if ($elm$core$String$isEmpty(str)) {
			return $elm$core$Maybe$Nothing;
		} else {
			var _v0 = A2($elm$core$String$indexes, '?', str);
			if (!_v0.b) {
				return A4($elm$url$Url$chompBeforeQuery, protocol, $elm$core$Maybe$Nothing, frag, str);
			} else {
				var i = _v0.a;
				return A4(
					$elm$url$Url$chompBeforeQuery,
					protocol,
					$elm$core$Maybe$Just(
						A2($elm$core$String$dropLeft, i + 1, str)),
					frag,
					A2($elm$core$String$left, i, str));
			}
		}
	});
var $elm$url$Url$chompAfterProtocol = F2(
	function (protocol, str) {
		if ($elm$core$String$isEmpty(str)) {
			return $elm$core$Maybe$Nothing;
		} else {
			var _v0 = A2($elm$core$String$indexes, '#', str);
			if (!_v0.b) {
				return A3($elm$url$Url$chompBeforeFragment, protocol, $elm$core$Maybe$Nothing, str);
			} else {
				var i = _v0.a;
				return A3(
					$elm$url$Url$chompBeforeFragment,
					protocol,
					$elm$core$Maybe$Just(
						A2($elm$core$String$dropLeft, i + 1, str)),
					A2($elm$core$String$left, i, str));
			}
		}
	});
var $elm$core$String$startsWith = _String_startsWith;
var $elm$url$Url$fromString = function (str) {
	return A2($elm$core$String$startsWith, 'http://', str) ? A2(
		$elm$url$Url$chompAfterProtocol,
		$elm$url$Url$Http,
		A2($elm$core$String$dropLeft, 7, str)) : (A2($elm$core$String$startsWith, 'https://', str) ? A2(
		$elm$url$Url$chompAfterProtocol,
		$elm$url$Url$Https,
		A2($elm$core$String$dropLeft, 8, str)) : $elm$core$Maybe$Nothing);
};
var $elm$core$Basics$never = function (_v0) {
	never:
	while (true) {
		var nvr = _v0.a;
		var $temp$_v0 = nvr;
		_v0 = $temp$_v0;
		continue never;
	}
};
var $elm$core$Task$Perform = function (a) {
	return {$: 'Perform', a: a};
};
var $elm$core$Task$succeed = _Scheduler_succeed;
var $elm$core$Task$init = $elm$core$Task$succeed(_Utils_Tuple0);
var $elm$core$List$foldrHelper = F4(
	function (fn, acc, ctr, ls) {
		if (!ls.b) {
			return acc;
		} else {
			var a = ls.a;
			var r1 = ls.b;
			if (!r1.b) {
				return A2(fn, a, acc);
			} else {
				var b = r1.a;
				var r2 = r1.b;
				if (!r2.b) {
					return A2(
						fn,
						a,
						A2(fn, b, acc));
				} else {
					var c = r2.a;
					var r3 = r2.b;
					if (!r3.b) {
						return A2(
							fn,
							a,
							A2(
								fn,
								b,
								A2(fn, c, acc)));
					} else {
						var d = r3.a;
						var r4 = r3.b;
						var res = (ctr > 500) ? A3(
							$elm$core$List$foldl,
							fn,
							acc,
							$elm$core$List$reverse(r4)) : A4($elm$core$List$foldrHelper, fn, acc, ctr + 1, r4);
						return A2(
							fn,
							a,
							A2(
								fn,
								b,
								A2(
									fn,
									c,
									A2(fn, d, res))));
					}
				}
			}
		}
	});
var $elm$core$List$foldr = F3(
	function (fn, acc, ls) {
		return A4($elm$core$List$foldrHelper, fn, acc, 0, ls);
	});
var $elm$core$List$map = F2(
	function (f, xs) {
		return A3(
			$elm$core$List$foldr,
			F2(
				function (x, acc) {
					return A2(
						$elm$core$List$cons,
						f(x),
						acc);
				}),
			_List_Nil,
			xs);
	});
var $elm$core$Task$andThen = _Scheduler_andThen;
var $elm$core$Task$map = F2(
	function (func, taskA) {
		return A2(
			$elm$core$Task$andThen,
			function (a) {
				return $elm$core$Task$succeed(
					func(a));
			},
			taskA);
	});
var $elm$core$Task$map2 = F3(
	function (func, taskA, taskB) {
		return A2(
			$elm$core$Task$andThen,
			function (a) {
				return A2(
					$elm$core$Task$andThen,
					function (b) {
						return $elm$core$Task$succeed(
							A2(func, a, b));
					},
					taskB);
			},
			taskA);
	});
var $elm$core$Task$sequence = function (tasks) {
	return A3(
		$elm$core$List$foldr,
		$elm$core$Task$map2($elm$core$List$cons),
		$elm$core$Task$succeed(_List_Nil),
		tasks);
};
var $elm$core$Platform$sendToApp = _Platform_sendToApp;
var $elm$core$Task$spawnCmd = F2(
	function (router, _v0) {
		var task = _v0.a;
		return _Scheduler_spawn(
			A2(
				$elm$core$Task$andThen,
				$elm$core$Platform$sendToApp(router),
				task));
	});
var $elm$core$Task$onEffects = F3(
	function (router, commands, state) {
		return A2(
			$elm$core$Task$map,
			function (_v0) {
				return _Utils_Tuple0;
			},
			$elm$core$Task$sequence(
				A2(
					$elm$core$List$map,
					$elm$core$Task$spawnCmd(router),
					commands)));
	});
var $elm$core$Task$onSelfMsg = F3(
	function (_v0, _v1, _v2) {
		return $elm$core$Task$succeed(_Utils_Tuple0);
	});
var $elm$core$Task$cmdMap = F2(
	function (tagger, _v0) {
		var task = _v0.a;
		return $elm$core$Task$Perform(
			A2($elm$core$Task$map, tagger, task));
	});
_Platform_effectManagers['Task'] = _Platform_createManager($elm$core$Task$init, $elm$core$Task$onEffects, $elm$core$Task$onSelfMsg, $elm$core$Task$cmdMap);
var $elm$core$Task$command = _Platform_leaf('Task');
var $elm$core$Task$perform = F2(
	function (toMessage, task) {
		return $elm$core$Task$command(
			$elm$core$Task$Perform(
				A2($elm$core$Task$map, toMessage, task)));
	});
var $elm$browser$Browser$element = _Browser_element;
var $author$project$AB$A = {$: 'A'};
var $author$project$AB$Example = {$: 'Example'};
var $author$project$AB$Right = {$: 'Right'};
var $elm$core$Dict$RBEmpty_elm_builtin = {$: 'RBEmpty_elm_builtin'};
var $elm$core$Dict$empty = $elm$core$Dict$RBEmpty_elm_builtin;
var $author$project$Input$example = '\n        ...#\n        .#..\n        #...\n        ....\n...#.......#\n........#...\n..#....#....\n..........#.\n        ...#....\n        .....#..\n        .#......\n        ......#.\n\n10R5L5R10L4R5L5\n';
var $author$project$AB$Down = {$: 'Down'};
var $author$project$AB$Left = {$: 'Left'};
var $author$project$AB$Up = {$: 'Up'};
var $elm$core$Dict$Black = {$: 'Black'};
var $elm$core$Dict$RBNode_elm_builtin = F5(
	function (a, b, c, d, e) {
		return {$: 'RBNode_elm_builtin', a: a, b: b, c: c, d: d, e: e};
	});
var $elm$core$Dict$Red = {$: 'Red'};
var $elm$core$Dict$balance = F5(
	function (color, key, value, left, right) {
		if ((right.$ === 'RBNode_elm_builtin') && (right.a.$ === 'Red')) {
			var _v1 = right.a;
			var rK = right.b;
			var rV = right.c;
			var rLeft = right.d;
			var rRight = right.e;
			if ((left.$ === 'RBNode_elm_builtin') && (left.a.$ === 'Red')) {
				var _v3 = left.a;
				var lK = left.b;
				var lV = left.c;
				var lLeft = left.d;
				var lRight = left.e;
				return A5(
					$elm$core$Dict$RBNode_elm_builtin,
					$elm$core$Dict$Red,
					key,
					value,
					A5($elm$core$Dict$RBNode_elm_builtin, $elm$core$Dict$Black, lK, lV, lLeft, lRight),
					A5($elm$core$Dict$RBNode_elm_builtin, $elm$core$Dict$Black, rK, rV, rLeft, rRight));
			} else {
				return A5(
					$elm$core$Dict$RBNode_elm_builtin,
					color,
					rK,
					rV,
					A5($elm$core$Dict$RBNode_elm_builtin, $elm$core$Dict$Red, key, value, left, rLeft),
					rRight);
			}
		} else {
			if ((((left.$ === 'RBNode_elm_builtin') && (left.a.$ === 'Red')) && (left.d.$ === 'RBNode_elm_builtin')) && (left.d.a.$ === 'Red')) {
				var _v5 = left.a;
				var lK = left.b;
				var lV = left.c;
				var _v6 = left.d;
				var _v7 = _v6.a;
				var llK = _v6.b;
				var llV = _v6.c;
				var llLeft = _v6.d;
				var llRight = _v6.e;
				var lRight = left.e;
				return A5(
					$elm$core$Dict$RBNode_elm_builtin,
					$elm$core$Dict$Red,
					lK,
					lV,
					A5($elm$core$Dict$RBNode_elm_builtin, $elm$core$Dict$Black, llK, llV, llLeft, llRight),
					A5($elm$core$Dict$RBNode_elm_builtin, $elm$core$Dict$Black, key, value, lRight, right));
			} else {
				return A5($elm$core$Dict$RBNode_elm_builtin, color, key, value, left, right);
			}
		}
	});
var $elm$core$Basics$compare = _Utils_compare;
var $elm$core$Dict$insertHelp = F3(
	function (key, value, dict) {
		if (dict.$ === 'RBEmpty_elm_builtin') {
			return A5($elm$core$Dict$RBNode_elm_builtin, $elm$core$Dict$Red, key, value, $elm$core$Dict$RBEmpty_elm_builtin, $elm$core$Dict$RBEmpty_elm_builtin);
		} else {
			var nColor = dict.a;
			var nKey = dict.b;
			var nValue = dict.c;
			var nLeft = dict.d;
			var nRight = dict.e;
			var _v1 = A2($elm$core$Basics$compare, key, nKey);
			switch (_v1.$) {
				case 'LT':
					return A5(
						$elm$core$Dict$balance,
						nColor,
						nKey,
						nValue,
						A3($elm$core$Dict$insertHelp, key, value, nLeft),
						nRight);
				case 'EQ':
					return A5($elm$core$Dict$RBNode_elm_builtin, nColor, nKey, value, nLeft, nRight);
				default:
					return A5(
						$elm$core$Dict$balance,
						nColor,
						nKey,
						nValue,
						nLeft,
						A3($elm$core$Dict$insertHelp, key, value, nRight));
			}
		}
	});
var $elm$core$Dict$insert = F3(
	function (key, value, dict) {
		var _v0 = A3($elm$core$Dict$insertHelp, key, value, dict);
		if ((_v0.$ === 'RBNode_elm_builtin') && (_v0.a.$ === 'Red')) {
			var _v1 = _v0.a;
			var k = _v0.b;
			var v = _v0.c;
			var l = _v0.d;
			var r = _v0.e;
			return A5($elm$core$Dict$RBNode_elm_builtin, $elm$core$Dict$Black, k, v, l, r);
		} else {
			var x = _v0;
			return x;
		}
	});
var $elm$core$Dict$fromList = function (assocs) {
	return A3(
		$elm$core$List$foldl,
		F2(
			function (_v0, dict) {
				var key = _v0.a;
				var value = _v0.b;
				return A3($elm$core$Dict$insert, key, value, dict);
			}),
		$elm$core$Dict$empty,
		assocs);
};
var $author$project$AB$mapKeys = F2(
	function (f, dict) {
		return $elm$core$Dict$fromList(
			A2(
				$elm$core$List$map,
				function (_v0) {
					var key = _v0.a;
					var value = _v0.b;
					return _Utils_Tuple2(
						f(key),
						value);
				},
				$elm$core$Dict$toList(dict)));
	});
var $elm$core$Basics$negate = function (n) {
	return -n;
};
var $elm$core$Debug$toString = _Debug_toString;
var $elm$core$Debug$todo = _Debug_todo;
var $author$project$AB$exampleHardcoded = F2(
	function (sideLength, path) {
		_v0$6:
		while (true) {
			if (!path.b) {
				return {
					directions: $elm$core$Dict$fromList(
						_List_fromArray(
							[
								_Utils_Tuple2(
								_Utils_Tuple3(0, 1, 0),
								$author$project$AB$Up),
								_Utils_Tuple2(
								_Utils_Tuple3(0, -1, 0),
								$author$project$AB$Down),
								_Utils_Tuple2(
								_Utils_Tuple3(-1, 0, 0),
								$author$project$AB$Left),
								_Utils_Tuple2(
								_Utils_Tuple3(1, 0, 0),
								$author$project$AB$Right)
							])),
					transform: $author$project$AB$mapKeys(
						function (_v1) {
							var x = _v1.a;
							var y = _v1.b;
							return _Utils_Tuple3(x, y, sideLength);
						})
				};
			} else {
				if (path.a.$ === 'Down') {
					if (!path.b.b) {
						var _v2 = path.a;
						return {
							directions: $elm$core$Dict$fromList(
								_List_fromArray(
									[
										_Utils_Tuple2(
										_Utils_Tuple3(0, 0, 1),
										$author$project$AB$Up),
										_Utils_Tuple2(
										_Utils_Tuple3(0, 0, -1),
										$author$project$AB$Down),
										_Utils_Tuple2(
										_Utils_Tuple3(-1, 0, 0),
										$author$project$AB$Left),
										_Utils_Tuple2(
										_Utils_Tuple3(1, 0, 0),
										$author$project$AB$Right)
									])),
							transform: $author$project$AB$mapKeys(
								function (_v3) {
									var x = _v3.a;
									var y = _v3.b;
									return _Utils_Tuple3(x, -1, y);
								})
						};
					} else {
						if (!path.b.b.b) {
							switch (path.b.a.$) {
								case 'Left':
									var _v4 = path.a;
									var _v5 = path.b;
									var _v6 = _v5.a;
									return {
										directions: $elm$core$Dict$fromList(
											_List_fromArray(
												[
													_Utils_Tuple2(
													_Utils_Tuple3(0, 0, 1),
													$author$project$AB$Up),
													_Utils_Tuple2(
													_Utils_Tuple3(0, 0, -1),
													$author$project$AB$Down),
													_Utils_Tuple2(
													_Utils_Tuple3(0, 1, 0),
													$author$project$AB$Left),
													_Utils_Tuple2(
													_Utils_Tuple3(0, -1, 0),
													$author$project$AB$Right)
												])),
										transform: $author$project$AB$mapKeys(
											function (_v7) {
												var x = _v7.a;
												var y = _v7.b;
												return _Utils_Tuple3(-1, (sideLength - 1) - x, y);
											})
									};
								case 'Down':
									var _v14 = path.a;
									var _v15 = path.b;
									var _v16 = _v15.a;
									return {
										directions: $elm$core$Dict$fromList(
											_List_fromArray(
												[
													_Utils_Tuple2(
													_Utils_Tuple3(0, -1, 0),
													$author$project$AB$Up),
													_Utils_Tuple2(
													_Utils_Tuple3(0, 1, 0),
													$author$project$AB$Down),
													_Utils_Tuple2(
													_Utils_Tuple3(-1, 0, 0),
													$author$project$AB$Left),
													_Utils_Tuple2(
													_Utils_Tuple3(1, 0, 0),
													$author$project$AB$Right)
												])),
										transform: $author$project$AB$mapKeys(
											function (_v17) {
												var x = _v17.a;
												var y = _v17.b;
												return _Utils_Tuple3(x, (sideLength - 1) - y, -1);
											})
									};
								default:
									break _v0$6;
							}
						} else {
							if (!path.b.b.b.b) {
								switch (path.b.a.$) {
									case 'Left':
										if (path.b.b.a.$ === 'Left') {
											var _v8 = path.a;
											var _v9 = path.b;
											var _v10 = _v9.a;
											var _v11 = _v9.b;
											var _v12 = _v11.a;
											return {
												directions: $elm$core$Dict$fromList(
													_List_fromArray(
														[
															_Utils_Tuple2(
															_Utils_Tuple3(0, 0, 1),
															$author$project$AB$Up),
															_Utils_Tuple2(
															_Utils_Tuple3(0, 0, -1),
															$author$project$AB$Down),
															_Utils_Tuple2(
															_Utils_Tuple3(1, 0, 0),
															$author$project$AB$Left),
															_Utils_Tuple2(
															_Utils_Tuple3(-1, 0, 0),
															$author$project$AB$Right)
														])),
												transform: $author$project$AB$mapKeys(
													function (_v13) {
														var x = _v13.a;
														var y = _v13.b;
														return _Utils_Tuple3((sideLength - 1) - x, sideLength, y);
													})
											};
										} else {
											break _v0$6;
										}
									case 'Down':
										if (path.b.b.a.$ === 'Right') {
											var _v18 = path.a;
											var _v19 = path.b;
											var _v20 = _v19.a;
											var _v21 = _v19.b;
											var _v22 = _v21.a;
											return {
												directions: $elm$core$Dict$fromList(
													_List_fromArray(
														[
															_Utils_Tuple2(
															_Utils_Tuple3(0, -1, 0),
															$author$project$AB$Up),
															_Utils_Tuple2(
															_Utils_Tuple3(0, 1, 0),
															$author$project$AB$Down),
															_Utils_Tuple2(
															_Utils_Tuple3(0, 0, -1),
															$author$project$AB$Left),
															_Utils_Tuple2(
															_Utils_Tuple3(0, 0, 1),
															$author$project$AB$Right)
														])),
												transform: $author$project$AB$mapKeys(
													function (_v23) {
														var x = _v23.a;
														var y = _v23.b;
														return _Utils_Tuple3(sideLength, (sideLength - 1) - y, x);
													})
											};
										} else {
											break _v0$6;
										}
									default:
										break _v0$6;
								}
							} else {
								break _v0$6;
							}
						}
					}
				} else {
					break _v0$6;
				}
			}
		}
		return _Debug_todo(
			'AB',
			{
				start: {line: 621, column: 13},
				end: {line: 621, column: 23}
			})(
			'exampleHardcoded: Unsupported path: ' + $elm$core$Debug$toString(path));
	});
var $elm$core$List$maybeCons = F3(
	function (f, mx, xs) {
		var _v0 = f(mx);
		if (_v0.$ === 'Just') {
			var x = _v0.a;
			return A2($elm$core$List$cons, x, xs);
		} else {
			return xs;
		}
	});
var $elm$core$List$filterMap = F2(
	function (f, xs) {
		return A3(
			$elm$core$List$foldr,
			$elm$core$List$maybeCons(f),
			_List_Nil,
			xs);
	});
var $elm$core$Dict$get = F2(
	function (targetKey, dict) {
		get:
		while (true) {
			if (dict.$ === 'RBEmpty_elm_builtin') {
				return $elm$core$Maybe$Nothing;
			} else {
				var key = dict.b;
				var value = dict.c;
				var left = dict.d;
				var right = dict.e;
				var _v1 = A2($elm$core$Basics$compare, targetKey, key);
				switch (_v1.$) {
					case 'LT':
						var $temp$targetKey = targetKey,
							$temp$dict = left;
						targetKey = $temp$targetKey;
						dict = $temp$dict;
						continue get;
					case 'EQ':
						return $elm$core$Maybe$Just(value);
					default:
						var $temp$targetKey = targetKey,
							$temp$dict = right;
						targetKey = $temp$targetKey;
						dict = $temp$dict;
						continue get;
				}
			}
		}
	});
var $author$project$AB$findStart = F4(
	function (sideLength, x, bounds, map) {
		findStart:
		while (true) {
			var _v0 = A2(
				$elm$core$Dict$get,
				_Utils_Tuple2(x, bounds.yMin),
				map);
			if (_v0.$ === 'Just') {
				return _Utils_Tuple2(x, bounds.yMin);
			} else {
				var $temp$sideLength = sideLength,
					$temp$x = x + sideLength,
					$temp$bounds = bounds,
					$temp$map = map;
				sideLength = $temp$sideLength;
				x = $temp$x;
				bounds = $temp$bounds;
				map = $temp$map;
				continue findStart;
			}
		}
	});
var $author$project$AB$fullHardcoded = F2(
	function (sideLength, path) {
		_v0$6:
		while (true) {
			if (!path.b) {
				return {
					directions: $elm$core$Dict$fromList(
						_List_fromArray(
							[
								_Utils_Tuple2(
								_Utils_Tuple3(0, 1, 0),
								$author$project$AB$Up),
								_Utils_Tuple2(
								_Utils_Tuple3(0, -1, 0),
								$author$project$AB$Down),
								_Utils_Tuple2(
								_Utils_Tuple3(-1, 0, 0),
								$author$project$AB$Left),
								_Utils_Tuple2(
								_Utils_Tuple3(1, 0, 0),
								$author$project$AB$Right)
							])),
					transform: $author$project$AB$mapKeys(
						function (_v1) {
							var x = _v1.a;
							var y = _v1.b;
							return _Utils_Tuple3(x, y, sideLength);
						})
				};
			} else {
				if (!path.b.b) {
					switch (path.a.$) {
						case 'Right':
							var _v2 = path.a;
							return {
								directions: $elm$core$Dict$fromList(
									_List_fromArray(
										[
											_Utils_Tuple2(
											_Utils_Tuple3(0, 1, 0),
											$author$project$AB$Up),
											_Utils_Tuple2(
											_Utils_Tuple3(0, -1, 0),
											$author$project$AB$Down),
											_Utils_Tuple2(
											_Utils_Tuple3(0, 0, 1),
											$author$project$AB$Left),
											_Utils_Tuple2(
											_Utils_Tuple3(0, 0, -1),
											$author$project$AB$Right)
										])),
								transform: $author$project$AB$mapKeys(
									function (_v3) {
										var x = _v3.a;
										var y = _v3.b;
										return _Utils_Tuple3(sideLength, y, (sideLength - 1) - x);
									})
							};
						case 'Down':
							var _v4 = path.a;
							return {
								directions: $elm$core$Dict$fromList(
									_List_fromArray(
										[
											_Utils_Tuple2(
											_Utils_Tuple3(0, 0, 1),
											$author$project$AB$Up),
											_Utils_Tuple2(
											_Utils_Tuple3(0, 0, -1),
											$author$project$AB$Down),
											_Utils_Tuple2(
											_Utils_Tuple3(-1, 0, 0),
											$author$project$AB$Left),
											_Utils_Tuple2(
											_Utils_Tuple3(1, 0, 0),
											$author$project$AB$Right)
										])),
								transform: $author$project$AB$mapKeys(
									function (_v5) {
										var x = _v5.a;
										var y = _v5.b;
										return _Utils_Tuple3(x, -1, y);
									})
							};
						default:
							break _v0$6;
					}
				} else {
					if ((path.a.$ === 'Down') && (path.b.a.$ === 'Down')) {
						if (!path.b.b.b) {
							var _v6 = path.a;
							var _v7 = path.b;
							var _v8 = _v7.a;
							return {
								directions: $elm$core$Dict$fromList(
									_List_fromArray(
										[
											_Utils_Tuple2(
											_Utils_Tuple3(0, -1, 0),
											$author$project$AB$Up),
											_Utils_Tuple2(
											_Utils_Tuple3(0, 1, 0),
											$author$project$AB$Down),
											_Utils_Tuple2(
											_Utils_Tuple3(-1, 0, 0),
											$author$project$AB$Left),
											_Utils_Tuple2(
											_Utils_Tuple3(1, 0, 0),
											$author$project$AB$Right)
										])),
								transform: $author$project$AB$mapKeys(
									function (_v9) {
										var x = _v9.a;
										var y = _v9.b;
										return _Utils_Tuple3(x, (sideLength - 1) - y, -1);
									})
							};
						} else {
							if (path.b.b.a.$ === 'Left') {
								if (!path.b.b.b.b) {
									var _v10 = path.a;
									var _v11 = path.b;
									var _v12 = _v11.a;
									var _v13 = _v11.b;
									var _v14 = _v13.a;
									return {
										directions: $elm$core$Dict$fromList(
											_List_fromArray(
												[
													_Utils_Tuple2(
													_Utils_Tuple3(0, -1, 0),
													$author$project$AB$Up),
													_Utils_Tuple2(
													_Utils_Tuple3(0, 1, 0),
													$author$project$AB$Down),
													_Utils_Tuple2(
													_Utils_Tuple3(0, 0, 1),
													$author$project$AB$Left),
													_Utils_Tuple2(
													_Utils_Tuple3(0, 0, -1),
													$author$project$AB$Right)
												])),
										transform: $author$project$AB$mapKeys(
											function (_v15) {
												var x = _v15.a;
												var y = _v15.b;
												return _Utils_Tuple3(-1, (sideLength - 1) - y, (sideLength - 1) - x);
											})
									};
								} else {
									if ((path.b.b.b.a.$ === 'Down') && (!path.b.b.b.b.b)) {
										var _v16 = path.a;
										var _v17 = path.b;
										var _v18 = _v17.a;
										var _v19 = _v17.b;
										var _v20 = _v19.a;
										var _v21 = _v19.b;
										var _v22 = _v21.a;
										return {
											directions: $elm$core$Dict$fromList(
												_List_fromArray(
													[
														_Utils_Tuple2(
														_Utils_Tuple3(-1, 0, 0),
														$author$project$AB$Up),
														_Utils_Tuple2(
														_Utils_Tuple3(1, 0, 0),
														$author$project$AB$Down),
														_Utils_Tuple2(
														_Utils_Tuple3(0, 0, 1),
														$author$project$AB$Left),
														_Utils_Tuple2(
														_Utils_Tuple3(0, 0, -1),
														$author$project$AB$Right)
													])),
											transform: $author$project$AB$mapKeys(
												function (_v23) {
													var x = _v23.a;
													var y = _v23.b;
													return _Utils_Tuple3((sideLength - 1) - y, sideLength, (sideLength - 1) - x);
												})
										};
									} else {
										break _v0$6;
									}
								}
							} else {
								break _v0$6;
							}
						}
					} else {
						break _v0$6;
					}
				}
			}
		}
		return _Debug_todo(
			'AB',
			{
				start: {line: 700, column: 13},
				end: {line: 700, column: 23}
			})(
			'fullHardcoded: Unsupported path: ' + $elm$core$Debug$toString(path));
	});
var $elm$core$Basics$modBy = _Basics_modBy;
var $author$project$AB$gcd = F2(
	function (a, b) {
		gcd:
		while (true) {
			if (!b) {
				return a;
			} else {
				var $temp$a = b,
					$temp$b = A2($elm$core$Basics$modBy, b, a);
				a = $temp$a;
				b = $temp$b;
				continue gcd;
			}
		}
	});
var $author$project$AB$getSideLength = function (bounds) {
	return A2($author$project$AB$gcd, (bounds.xMax - bounds.xMin) + 1, (bounds.yMax - bounds.yMin) + 1);
};
var $author$project$Input$input = '\n                                                  ..................#....#....#...#...#................#.................#..............#....#......#.\n                                                  .#.......................#.......#.......#.............#.#...#....#....#.....#.#.......#.....#......\n                                                  #......#...#...##....#.......................#.#.......#..#........#....#......................#....\n                                                  ..#......#.....#.......................#...............#....#..........#........#...................\n                                                  .....#....#.#......#..#.....#....#...............................#.#......#..###..............#.....\n                                                  #...#.#..#.##......#...............#..........###...#......#.............#...........###.....#.....#\n                                                  ......#......#......#..........#.......#...#....#...............#.......................#...........\n                                                  #......#...........#.#...............#....#..#..#.#..............#........#.....#...#..#.#..........\n                                                  ..............................##.........................................#..........................\n                                                  ##......#........................#..............#.........#..##..................#.#......#...#.....\n                                                  ...#..#.#............#.....#.....#.#.#.#.##......#......................................#.......#...\n                                                  ..#................#................#..........#.......................#...#..#.......#.....#.......\n                                                  ...................#.#........................#........................................##...#.....#.\n                                                  .............#..#......#.................#.#.......#................#.#..........#..........#....#..\n                                                  ................#..#..........#.#.............#......#....#..............#...........##.#....#..#...\n                                                  ........................#.........#......#.......#...#...........#...........#...................##.\n                                                  ............#.#.......#............#.......#.#..............#..............#......#.#.........#.....\n                                                  .#.........................#.#.............#...#.......##....#.##..#...##...............#.......#.#.\n                                                  ................#..................#....##........#.#..#.....#.........................#........#...\n                                                  .....#........#.....#...#..........................#.......#...#..#...##.....#.#......#.............\n                                                  .................#..#....#.....#........#...........................................#.....#...#.##..\n                                                  ......................#...................#...#...#.......#..#.....#......#......#.#.....#......#...\n                                                  ...#..........#...#......#.........#..##............#............#.................#.....#......#...\n                                                  .........................#.#.....#...#.............#..#..###..#.#....#..#........#.##...............\n                                                  .............#.........#...#..#.......#..........#.............#............#..#..#.........#......#\n                                                  ......#.#..#.........#.....#..#....#............#.......#.#........#.................#...#.........#\n                                                  .....................#...................#...#...........#.###..#..............##........#......#...\n                                                  .......#.............#........##......#..........#..##........#..#..#.....#........#......#.........\n                                                  #.........#.......#.........#........#...................#..#..#............#.#...#.................\n                                                  .......#.......#........#.....#..........................#........#.........#........#..............\n                                                  ..................#.....##.....#..#.............##....#........#..#..#............#.............#...\n                                                  ..................#.........#....#.#.#.....#......#.......#...#......##..........#.......#..........\n                                                  .#...#....#...##.............#..###.....#.........##.........#.....#.....#.#...#....................\n                                                  ..#.........#.....#.........#.................##.......#............#...............................\n                                                  #................#...................##.#....#......#.........#..........................#.....#....\n                                                  .................#........................#....#............#...#........#.....................#....\n                                                  ...............#...............................................#..#....................#.#..........\n                                                  #............#...#.................#..#................#.............#.....#..............#....#....\n                                                  .................#....#...............#.......#.........#...##..............#.....#..#..............\n                                                  .#..............................#..#.......#.........................................#........#.....\n                                                  .......#........#.........#...#..................................................#........###....##.\n                                                  ......#.........#..........#........###...............#.#......#.#..........#........#...#.....#....\n                                                  #.#..................#............#.#...#.....................#..##..#...........##.................\n                                                  ...#..................#..................#....#....#........#......#....................#..#.......#\n                                                  ..........................#.....#..#..#.....#...#...##..#...#.................#..#......#..........#\n                                                  ....................#.....................#.......#.....#.........#...##.##..........#.........#....\n                                                  ..................#.........#.........#...##.........#.#..#.....#....#........................#....#\n                                                  #..##......#...#.....#......#.....#..#............#####...#....#.....##.#...............##..#.......\n                                                  ....#.........#.....#.....#.....#.....................................#...........##.......##.......\n                                                  ......##......#...##...............................#................#................#..............\n                                                  ..#....#...........#.........................##.#.\n                                                  .............#.................##..#.......#.....#\n                                                  .............#.......##......................#....\n                                                  ....................#..#.#.................#......\n                                                  .............#...........#......#.....#.....#..#..\n                                                  #.................................................\n                                                  .............................................#....\n                                                  .........#........................................\n                                                  ........#.#.................................#.....\n                                                  .....#...#.............#................#.........\n                                                  #........#..#......#...........#....#.....##..#...\n                                                  ..........#.................................#.....\n                                                  ...........##...................................#.\n                                                  ....##....#....................#...#.........#...#\n                                                  .#....#..........................#................\n                                                  ....##......#.....................................\n                                                  ..........#.......#.......##...#.........#..#.....\n                                                  ................##.................##.....#.#....#\n                                                  .........................................#........\n                                                  ..................#...............#...............\n                                                  .#.......#.....##.......#....##.....#.....#.#.....\n                                                  #.........#...#...#.........#......#..#...........\n                                                  #.......#......#.........#.....................#..\n                                                  #.......#.....#....#..............................\n                                                  #....#...#.#......................................\n                                                  .............#.....................#.....#....#...\n                                                  ..#..........#..................#................#\n                                                  ......#................#.........###.#............\n                                                  ....#...............................#....#........\n                                                  ........................#.........................\n                                                  #.#..#.#.......................#..................\n                                                  #.#........#.......#.#......#.##.#......#.#...#...\n                                                  ..#.......................#.#.......#.............\n                                                  ..................................................\n                                                  ........#.....###.........#.....#....#.#...##.....\n                                                  .......#......#.......#.#........#............#...\n                                                  ..##..............#.....#.#...........#...........\n                                                  ..............##.#.........#.......#..........#...\n                                                  ..#...........#............#......................\n                                                  .......................#...#.#...#.#.....#..#..#..\n                                                  ............#..............................#......\n                                                  ......#.............#.##..#..#...............#....\n                                                  ...#.........................................#....\n                                                  .#........#.....#.....#..................#....#...\n                                                  #......#.....................#..#........#........\n                                                  ..#.....................##..........#...#.....#...\n                                                  .......#.#....#......#.....#.....................#\n                                                  .......................#...........##.........#...\n                                                  .....##..........#......#.........................\n                                                  ..........#.............#.............#........#..\n..........................#..#....#...#...#................##....................#......#...#.....#.\n.................................#........#.#......#..#...#...............................#.........\n...............#.##............#.##.#.#...........#.............#..................#....#...........\n#.........................#......#........#.........#......#...............#.....#...##.........#...\n.#..#.....#...............#..........#...............#.....#....##....#.............................\n..#........................#..................#.......#.............#......#...##........#...#......\n....#...#........#................##.........#..........#..........#....#....#......................\n...#..............#.##.##.................#.....#...........#.................#............#.....#..\n...#..#...................#..#....#...#....#.............#...#.......#.......#..........##.......#..\n........................##.....#.......#..#......#..................#..#...#.............#..#...#...\n#...............#.......#...........#...................#..................#......#..............##.\n#..#....................#..............#.................#.#...#..#...#............#...#....#.......\n............#...#..................#...........#................................................#...\n.............#..........................#......#................................#..................#\n.##...#..#....##...#.........#..#..........#.........#.....................#...#...........##..#..#.\n.............#.............#........#.....#........#.....#.................#...#....................\n............#............#................#................##........#......#.#....#...#......##....\n....#.........#..............#...............#...#......#.......................#...#.......#.......\n....#............................#.........................#.....#..........#...#.......#..#..#.....\n..........#..#.......#........#....###......#........#............#.................................\n........................#...#....#....#.##...#............#.....#............................#......\n........#..#...#........................#...............................................#...........\n....#....#.....#.....#......#....#.....#....#.#............................##................#......\n..........#........................##............#.#..........#....#.................#.........#....\n............#...#......#...........................#................#...##.............#..........##\n..#...............#...#.....#..#.........#..#.................................#.......#.#.........#.\n........##........#..................................#...#.....#....................................\n..#....#.............#...#...................#........##.......#.......#...................#........\n....................#...#........##.#..........#........#..................#........#.......#.......\n....#...#.#....#..####..#...#.......................#.....#..........................#.#............\n..#....#....#........#...........#..........##...............#....#.................................\n#.#.............#...........#..........#.....#...#....#..#...........................#.....#........\n.....#..............................................................##..............................\n..............#...##.......#....#..#..#..........#.....#..#.......##...#........##..................\n.................#...........................#.#.................................#.......#.......#..\n#.....#....#.#......##.........................#.......#....##.#..##......#.....#...#...............\n.......#..#......##...#......#.....##..#..........#.#.#...........#...#.................#....#...#..\n#..#.....................#....#..#..............#.#................#............#................#..\n....#.....#..............#........................#....#...#..#.....................................\n..#........................#.....#..................#....#.##.#............#.........#...........#..\n............##..#....#......#...........#.....#..............#...................................##.\n..#........#......##...#.#..........#.....#..........#.......#.........#...................#........\n........#.....................#...#..............#.....##...............................#.#......#..\n......................#.................................#............#.......................##...#.\n...#...................#..........#.....#.##....#.....#.......#.....#...............................\n..........................................#...............#........#.........#................#..#..\n...#.....#.#...............#...#...........#......#.................................................\n....#......#.#......#.............#.##....#..................#.#..#.........#....#.#..#...........#.\n#..........#..#............#...........#..............#............#..###......................#....\n..............................#.........#...........#........#...............#.##...............#.#.\n#.#........#.....#..#..#.#......#........#......#.\n#..#.............#.........##.........#..#.....##.\n........##.....#.#..............................#.\n............................#...........#........#\n...................................#..............\n.........#......................#.......#..#.....#\n##.............#........#.........................\n......#.........#............#................##..\n......#.......#.........##.......#..#..#..........\n#......#..#.................#..###...#....#.......\n....##..............................#..#........#.\n......#.#.....#........#..#...#...................\n..#......#.#.#........#.........#.................\n........##............#.#.................#......#\n.#..............#....#...............#.#..#..#.#..\n...#................#...#.........................\n........#..............#...#......................\n.#.................#.....#..............#.........\n.......#........................#.#..............#\n..#..........#........#....#..........#..........#\n........#.#.............#.#........#..............\n.#...#........................#...................\n.......#...........#.#.#.......##............#...#\n....##...#........#................#..............\n..............................#...............#...\n.#............#.......#..............#............\n.....#.........#..............#...................\n........#..#...#....#.#.................#.........\n.............#.....................#..............\n.#....#..............#.....#......................\n..#.#............#.............#..................\n....#..........#....#.........#...#........##.....\n............................#.#.#.........#.#.....\n......#...............#.................#.#.......\n..........#.........#...........#....###.......#..\n........#.........#............#..#..#....##......\n.............#..#....#........................#...\n..........#.#......#.....................##.......\n......###....#.......#..#.#......#..#..........#..\n.......###............#.#.#............#..........\n..#........#.........#.......#...................#\n.........#.#.....#......................#.........\n#....#..#.#..#.......###....#.#.................#.\n......#.........#.#...............................\n...#....#.........##..#.....#......#..#.........#.\n.......#........##.......#..#....##....#....#.....\n..#....#.........#.....#......##.................#\n#.#.......#.....#...........#.................#..#\n........#......#.........................#.#.....#\n.......#...#....##...........#.#.......#..........\n\n42R43L25R29R48L44R4L30R4L46L14L13R45L12R11L47L32R12L6L16L36L10R37L40L10L23L2L13R31L3L5R30L5L22L12R33L1L2R29R43R12R1L19L20L49R30R14L44R14R31R25L38L40R4L10L21L23L45L36R13R6L16R20L6L12L21R7L47R45R19L7R37R34R14R37R45R5R10R24L4L45L1L6L10R10L43R34R31L32L17L12R39R22L46L26R46R1L18R44R50L42L48R15L28L33R34L48R23R9R15R5R46R30R4L17R36R16L16R28R7L10L47L37L11R50R8L26R17R34L36L25R31R30R33L36L26L31L39R39R14R34L31L2L1L23L39R11R27L10L41R29R11L2L50L4R7R36L31R28L7L33L44L31R46R13R41L10R50R14L1L47R22R10L2R22L34L24R39R37L29R29L6R43L50L43R20R41L41L41R49L35R4L28R32L40L48R28L5R41R5R10R1R5L26R11R30L21R26R30R47R27L1L13R21R18L15L38R2R15R44R27L10L32L29L9L41L17L29R14R41R27L26R24R24R7L24R6R38L7R17L47L2R26R16L34L35L20R21L6R39L3R16L23L42L1R42L4R10L7L16L47L12R39R27R40L48L32R32R22L43R3L12R19R42R5L12R36L10R27L25L33R27R22L35L36L35L38L50L11L31R45L43L41L15L25L23L29R12L34L9R20L43R21L50L19L19L21R21R41L15L33R42R44R26R23L34L41L35L34R34R41L19R29L20L4L30L15R5L24R34R37L34L35R20R8R41L1L20L46L46L14R29R13R36R31R47R46R36R19L49L27L38L29L47L3L30R15R24L2R28L11L50R3R47R22L48L40L2R12R14L8R9R41R2L9R9L45L37R41R50L18R11L50L19L6R40R7R24L5R26R22L23R23R11L3L7R26R20R43R19R24R46L47R9L24R37L14L20R4R40R48R38L21L20R12L10R31L29L32L43L8L11L4R6R4R41L6L8L3L34L14L14R20L4L25L45R31R29L34R50L10L7L42L34L29L25R22R45R39L28L44L37R18R45R34R7R33L14L31L9R9L45R12R31R1R45L8L45L14R18R2R40L29R29L38L33R6R38L40L46R47L9L21R13L16R45R24R15R11R38L6R27L3R24R12L22R43L32L8L15R40R2R6L40L34R31R8R39L32R45L34R25L26R3L44L28R1R48L50L29R11R4L45R43L8L34L15R12L34R39L32R45R28R20R35R14L13L21R17L27R29R46L46R48L38R3L14L10R40R1L1R25L39L43R37L19L38L18R28L12L7L9L49L34L8L35R31R18R32R11L14R15L39L39R30R7L25R37R16L34L29L2R39R31R6L4R41L28L36L47L1L6L43L36L23L16L34R45L8L29L20L45L39L2L19L35R47R10L27L47L9R10R12R11L25L25L19L36L6R45L25R35R30L40R42R1R44R13R13R40R30L48L13R40L39R18L49L17L20R33R43L40L21R34L20L20R50R32L28R39L39R5R22R9R20L33R41L23L43L39R49L37L3R5R2L43L4R32R49L30R4L30L25R40L9L6R17R41L38L44R38R22L47L19R10R1L13R43L13R22R46R24R43L15R35L35R10L44L7R31L16R17L24R9L14L7L30R4L11L49L5R46L32R28R35L7R34L44R26R2R11L48R11R41L16R21L44L9L17L8R14L49R16L30L15L21L6L27R25L25L26L41R33L10R10R16L19L33R44R38L1R6R40R18L14L10L28L35L47L36R6L17R49R23L37L45L32R12R21L49L20R36L36R8L7L44R38R16L2R20L13L19R25L25L31L16L3L1R31L44R45L20R14R23R25R2L16L47L21R31R37L46R29R40R18L23R10R15L8L33R9R10L9L3L47R22L31R10L17L5R14L39L33R30L7L15R45R18R17R17R49R11L31R36L30L50R3R31L38L19R14L22R40L48L40R30L28R32R5R24L9R19R21R12L14R41L3R50L46R26R24L45R5L2L49L11R50R34R8R12L23R31L37L26L32L25R46L28R35R10L2R31L38L41R37L22L29L25R23R42R32L2R3R44R50R26L13L36R9L10R16L1R14L50L46R20R33R28R20L40L6R34L33R2L25R29L18L28R3L15L37R20L42R4L16R30R46L35L18R2L31L16R24R24R34R22R10L27R38R16R30R7R30L27R10R17L18L20L5R21L43L26L42L41R4L45R8L20L31R43L19L2R18L35R7R42R32L15L21R35L44L43L7R23R35L36L45L49R16R13R35R34R11R39L35R21R34L30R48R35L20L8R43R7R30L34R35R13R15L10L30R36L7L2L47R39L36R31L23R44R15L20R21R5R2R50L9L29L12L7L38R19R10R33R10R15R35L17L11R9L26R7L48L25R21L34L26R47L3R5L22L27R8L15L46L1L34L27L8L37R5R24L33R17R50L33L16R7R19R38R22R6L48L38L9R8R3R41L22L11R38L49R5R16R2L15L11L15R8R37R48R42L17L9R20L24R27R7R31L19R3R30R42L24R14R47L39L26R45R19R7R18L11R30R23L46R46R4R10L13L20R25R41L39L44R48R15R36R9R27R4L19R36R45R11R42R28R33R50R42R27R49L44R43R12R37R31L9R20R37L50R2L41L16R43L19R41R44R23R23L1R39L39L11L32L1L17R17L4R48L32R39R37L3R4R17R19L38R15R5R41R40L48L8R13L23L11L21L6R18L50R4L21R23R25L33R38R4R46L16R12L21L22R26R16L11L42R23R21R47L27R5L27R39L36L17R2L19R14R45R20R41R42R46L26R23R32R32R1L17R38L15R42R29R20R17R3L42L29L38R7L7L46R30R26R37R21R23L14L23R22R40R8L16L27R17R12R32R22R48L4L8L16R9R25R42R35R15L49R47L13R49R20L36R35L34R4L12L22L49R26L45R41R37L3L29R21R3L23R43R19L5R12R43L16R31L19R28R26R8L41R11L22R28L18R31L24R13R2L27R4L22L27L49R25R8R31R8R49R45R15R12R42L20R32L10L35L37R7R14L20L32R41L26L48R17R4R39R47R12L1L46L39R14R24R22L42R33L4L1R28R25L45R33L2L23L36L36R44R2R13L20R32L41R37L15L31L28L13L35L43L4R46L23L15R45L10R13R1R28L25L8L8L26R15L27L11L41L44R36R10R32L18R45R2L48L3R29R10R8R14R24R26L28L43R44R22R47R40R25R50R35R8R32R34R1R27R41R2L40L22L8L30L31L1L26L50L17L25R2L38R9L24R37R7R44L7R36L39R42R29R30L30R32L7L39L11R50R7L14R14R34L38R50L29R37R36R49R30R27R38L14L7L29L36R11L38L39L31L39L39R36R2R37R40L44R14L34R39R18L36R48R34R6R40L38L19R20L4R30R7L44R28L29R36L12L4R12R11R11R12L38L7R14R11R29R24R24L13R47R7R48L45L48L14L40R35L16L27R40R13L8L48L10L43R29R23L5R1L35L26R2R42R7L17L15R19L13L5L49L47L30R49L1L23L24L33L13R40R43R22R18R40L43R14R34L19L26R5L38R28L8L14R4L12R23L22R1L39L22R50R17R2L20L15R36L41L2L37L8L37L13R20R18L23R39L28R9L15R26L40R10L41R11R34L19R29R29L15R2R40R46R31R20L50R12R2L2R28R50R32L28R50L32L40R1R27L17L47L32R16R11R38R37R44R9L17L35L41L25L35L19R13L11R8R20R5R46L48L47R22L16R45R33L25R3L28L23L15L7L45R42R46R29L18R15R36L45L39L20L28L7L6L38L50R30L25L43L41R7R42R35R27R27R40R34R28L31R43R17L34L6R20R15R38L1R18L46L28L49L40R17R10L30R21L6R41R10L8R30L27R32R41R27L28R6L10R48R8L38L3L20L14R38R49R27R29R40L21L22R19L2R22R9R5L27L50L25L24L25L42L10R14L41L1R23R34R43R15L20R14L37R46R24L30R36R16L24R4L28L45L28L33R25L47L1L15R41R6L2L1R3L45L22R50L15L27R19R13R34L46L7R31L28R3R30L23L33L47L13L10L11L42L3L24L18L1L48R9R25R23L16L25R19L13R11R39R2R22L28R7R33L43L19R30L40R34R26L40L14R10L6L33L4L13L14R39R15R24R18R34R43L46R46L34L10L26R33L33R25L15R5L49L15L31L31R22R6R23L15R26L34L27L29L35L6L32R42L42L12R49R47L23R48L40R7R12R43R15L20L16L7L35L47R46R48L14L48R35R32R42R17R42R44L47L1L2L33R36L36L8R37R5L19R30L12R50R9L2L3L46L7L15R5R14L43R25R37L36R42R44R41R18L21R36L35L35R14L8L10R23R21R20L5R30L5R16L21L34R19L37L36R7R32L21R11R37L48L43L17L48L44L22L23R26R15R24L40R18L34L40R26L22L23R34L16L49R11R5L36L6R38R33R16L18R30R15R16R13L9R2R23R49R5R47R50L30L13R48R49L1R12L36R1L9L10L10L31R17L46R46R11L35R43L45R9R49R8L16R28R13L10L37L10R23R9R24L4R46L5L29L42L38L3R34R17L4L36L44R47L16\n';
var $author$project$AB$Chain = function (a) {
	return {$: 'Chain', a: a};
};
var $elm$core$List$append = F2(
	function (xs, ys) {
		if (!ys.b) {
			return xs;
		} else {
			return A3($elm$core$List$foldr, $elm$core$List$cons, ys, xs);
		}
	});
var $elm$core$List$concat = function (lists) {
	return A3($elm$core$List$foldr, $elm$core$List$append, _List_Nil, lists);
};
var $elm$core$List$concatMap = F2(
	function (f, list) {
		return $elm$core$List$concat(
			A2($elm$core$List$map, f, list));
	});
var $elm$core$Set$Set_elm_builtin = function (a) {
	return {$: 'Set_elm_builtin', a: a};
};
var $elm$core$Set$insert = F2(
	function (key, _v0) {
		var dict = _v0.a;
		return $elm$core$Set$Set_elm_builtin(
			A3($elm$core$Dict$insert, key, _Utils_Tuple0, dict));
	});
var $elm$core$Maybe$map = F2(
	function (f, maybe) {
		if (maybe.$ === 'Just') {
			var value = maybe.a;
			return $elm$core$Maybe$Just(
				f(value));
		} else {
			return $elm$core$Maybe$Nothing;
		}
	});
var $elm$core$Dict$member = F2(
	function (key, dict) {
		var _v0 = A2($elm$core$Dict$get, key, dict);
		if (_v0.$ === 'Just') {
			return true;
		} else {
			return false;
		}
	});
var $elm$core$Set$member = F2(
	function (key, _v0) {
		var dict = _v0.a;
		return A2($elm$core$Dict$member, key, dict);
	});
var $author$project$AB$makeChain = F4(
	function (sideLength, _v0, visited, map) {
		var x = _v0.a;
		var y = _v0.b;
		var _try = F2(
			function (direction, nextCoordinate) {
				return A2($elm$core$Set$member, nextCoordinate, visited) ? $elm$core$Maybe$Nothing : (A2($elm$core$Dict$member, nextCoordinate, map) ? $elm$core$Maybe$Just(
					_Utils_Tuple2(
						direction,
						A4(
							$author$project$AB$makeChain,
							sideLength,
							nextCoordinate,
							A2($elm$core$Set$insert, nextCoordinate, visited),
							map))) : $elm$core$Maybe$Nothing);
			});
		var mapPiece = $elm$core$Dict$fromList(
			A2(
				$elm$core$List$filterMap,
				$elm$core$Basics$identity,
				A2(
					$elm$core$List$concatMap,
					function (tx) {
						return A2(
							$elm$core$List$map,
							function (ty) {
								return A2(
									$elm$core$Maybe$map,
									function (item) {
										return _Utils_Tuple2(
											_Utils_Tuple2(tx - x, ((sideLength - 1) - ty) + y),
											{
												item: item,
												originalCoordinate: _Utils_Tuple2(tx, ty)
											});
									},
									A2(
										$elm$core$Dict$get,
										_Utils_Tuple2(tx, ty),
										map));
							},
							A2($elm$core$List$range, y, (y + sideLength) - 1));
					},
					A2($elm$core$List$range, x, (x + sideLength) - 1))));
		return $author$project$AB$Chain(
			{
				links: A2(
					$elm$core$List$filterMap,
					$elm$core$Basics$identity,
					_List_fromArray(
						[
							A2(
							_try,
							$author$project$AB$Left,
							_Utils_Tuple2(x - sideLength, y)),
							A2(
							_try,
							$author$project$AB$Right,
							_Utils_Tuple2(x + sideLength, y)),
							A2(
							_try,
							$author$project$AB$Up,
							_Utils_Tuple2(x, y - sideLength)),
							A2(
							_try,
							$author$project$AB$Down,
							_Utils_Tuple2(x, y + sideLength))
						])),
				map: mapPiece
			});
	});
var $elm$core$Basics$composeR = F3(
	function (f, g, x) {
		return g(
			f(x));
	});
var $elm$core$List$maximum = function (list) {
	if (list.b) {
		var x = list.a;
		var xs = list.b;
		return $elm$core$Maybe$Just(
			A3($elm$core$List$foldl, $elm$core$Basics$max, x, xs));
	} else {
		return $elm$core$Maybe$Nothing;
	}
};
var $elm$core$Maybe$withDefault = F2(
	function (_default, maybe) {
		if (maybe.$ === 'Just') {
			var value = maybe.a;
			return value;
		} else {
			return _default;
		}
	});
var $author$project$AB$maximum = A2(
	$elm$core$Basics$composeR,
	$elm$core$List$maximum,
	$elm$core$Maybe$withDefault(0));
var $elm$core$Basics$min = F2(
	function (x, y) {
		return (_Utils_cmp(x, y) < 0) ? x : y;
	});
var $elm$core$List$minimum = function (list) {
	if (list.b) {
		var x = list.a;
		var xs = list.b;
		return $elm$core$Maybe$Just(
			A3($elm$core$List$foldl, $elm$core$Basics$min, x, xs));
	} else {
		return $elm$core$Maybe$Nothing;
	}
};
var $author$project$AB$minimum = A2(
	$elm$core$Basics$composeR,
	$elm$core$List$minimum,
	$elm$core$Maybe$withDefault(0));
var $elm$core$List$unzip = function (pairs) {
	var step = F2(
		function (_v0, _v1) {
			var x = _v0.a;
			var y = _v0.b;
			var xs = _v1.a;
			var ys = _v1.b;
			return _Utils_Tuple2(
				A2($elm$core$List$cons, x, xs),
				A2($elm$core$List$cons, y, ys));
		});
	return A3(
		$elm$core$List$foldr,
		step,
		_Utils_Tuple2(_List_Nil, _List_Nil),
		pairs);
};
var $author$project$AB$mapToBounds = function (map) {
	var _v0 = $elm$core$List$unzip(
		$elm$core$Dict$keys(map));
	var xs = _v0.a;
	var ys = _v0.b;
	return {
		xMax: $author$project$AB$maximum(xs),
		xMin: $author$project$AB$minimum(xs),
		yMax: $author$project$AB$maximum(ys),
		yMin: $author$project$AB$minimum(ys)
	};
};
var $author$project$AB$Floor = {$: 'Floor'};
var $author$project$AB$Wall = {$: 'Wall'};
var $elm$core$List$isEmpty = function (xs) {
	if (!xs.b) {
		return true;
	} else {
		return false;
	}
};
var $elm$core$Result$toMaybe = function (result) {
	if (result.$ === 'Ok') {
		var v = result.a;
		return $elm$core$Maybe$Just(v);
	} else {
		return $elm$core$Maybe$Nothing;
	}
};
var $author$project$AB$collectResults = function (list) {
	var oks = A2($elm$core$List$filterMap, $elm$core$Result$toMaybe, list);
	var errors = A2(
		$elm$core$List$filterMap,
		function (result) {
			if (result.$ === 'Err') {
				var error = result.a;
				return $elm$core$Maybe$Just(error);
			} else {
				return $elm$core$Maybe$Nothing;
			}
		},
		list);
	return $elm$core$List$isEmpty(errors) ? $elm$core$Result$Ok(oks) : $elm$core$Result$Err(errors);
};
var $elm$core$String$cons = _String_cons;
var $elm$core$String$fromChar = function (_char) {
	return A2($elm$core$String$cons, _char, '');
};
var $elm$core$Result$map = F2(
	function (func, ra) {
		if (ra.$ === 'Ok') {
			var a = ra.a;
			return $elm$core$Result$Ok(
				func(a));
		} else {
			var e = ra.a;
			return $elm$core$Result$Err(e);
		}
	});
var $elm$core$Result$mapError = F2(
	function (f, result) {
		if (result.$ === 'Ok') {
			var v = result.a;
			return $elm$core$Result$Ok(v);
		} else {
			var e = result.a;
			return $elm$core$Result$Err(
				f(e));
		}
	});
var $author$project$AB$GoForward = function (a) {
	return {$: 'GoForward', a: a};
};
var $author$project$AB$TurnLeft = {$: 'TurnLeft'};
var $author$project$AB$TurnRight = {$: 'TurnRight'};
var $author$project$AB$parseMoves = F2(
	function (chars, buffer) {
		parseMoves:
		while (true) {
			if (!chars.b) {
				return $elm$core$Result$Ok(
					_List_fromArray(
						[
							$author$project$AB$GoForward(buffer)
						]));
			} else {
				var _char = chars.a;
				var rest = chars.b;
				switch (_char.valueOf()) {
					case 'L':
						return A2(
							$elm$core$Result$map,
							function (moves) {
								return A2(
									$elm$core$List$cons,
									$author$project$AB$GoForward(buffer),
									A2($elm$core$List$cons, $author$project$AB$TurnLeft, moves));
							},
							A2($author$project$AB$parseMoves, rest, 0));
					case 'R':
						return A2(
							$elm$core$Result$map,
							function (moves) {
								return A2(
									$elm$core$List$cons,
									$author$project$AB$GoForward(buffer),
									A2($elm$core$List$cons, $author$project$AB$TurnRight, moves));
							},
							A2($author$project$AB$parseMoves, rest, 0));
					default:
						if ($elm$core$Char$isDigit(_char)) {
							var _v2 = $elm$core$String$toInt(
								$elm$core$String$fromChar(_char));
							if (_v2.$ === 'Just') {
								var _int = _v2.a;
								var $temp$chars = rest,
									$temp$buffer = (buffer * 10) + _int;
								chars = $temp$chars;
								buffer = $temp$buffer;
								continue parseMoves;
							} else {
								return $elm$core$Result$Err(
									'Invalid char: ' + $elm$core$String$fromChar(_char));
							}
						} else {
							return $elm$core$Result$Err(
								'Invalid move char: ' + $elm$core$String$fromChar(_char));
						}
				}
			}
		}
	});
var $elm$core$String$foldr = _String_foldr;
var $elm$core$String$toList = function (string) {
	return A3($elm$core$String$foldr, $elm$core$List$cons, _List_Nil, string);
};
var $author$project$AB$trimLeadingNewlines = function (string) {
	trimLeadingNewlines:
	while (true) {
		var _v0 = $elm$core$String$uncons(string);
		if ((_v0.$ === 'Just') && ('\n' === _v0.a.a.valueOf())) {
			var _v1 = _v0.a;
			var rest = _v1.b;
			var $temp$string = rest;
			string = $temp$string;
			continue trimLeadingNewlines;
		} else {
			return string;
		}
	}
};
var $elm$core$String$trimRight = _String_trimRight;
var $author$project$AB$parse = function (input) {
	var _v0 = A2(
		$elm$core$String$split,
		'\n\n',
		$elm$core$String$trimRight(
			$author$project$AB$trimLeadingNewlines(input)));
	if ((_v0.b && _v0.b.b) && (!_v0.b.b.b)) {
		var first = _v0.a;
		var _v1 = _v0.b;
		var second = _v1.a;
		var movesResult = A2(
			$author$project$AB$parseMoves,
			$elm$core$String$toList(second),
			0);
		var mapResult = A2(
			$elm$core$Result$mapError,
			$elm$core$List$concat,
			A2(
				$elm$core$Result$map,
				A2($elm$core$Basics$composeR, $elm$core$List$concat, $elm$core$Dict$fromList),
				$author$project$AB$collectResults(
					A2(
						$elm$core$List$indexedMap,
						F2(
							function (lineIndex, line) {
								return A2(
									$elm$core$Result$map,
									$elm$core$List$filterMap($elm$core$Basics$identity),
									$author$project$AB$collectResults(
										A2(
											$elm$core$List$indexedMap,
											F2(
												function (charIndex, _char) {
													switch (_char.valueOf()) {
														case ' ':
															return $elm$core$Result$Ok($elm$core$Maybe$Nothing);
														case '.':
															return $elm$core$Result$Ok(
																$elm$core$Maybe$Just(
																	_Utils_Tuple2(
																		_Utils_Tuple2(charIndex, lineIndex),
																		$author$project$AB$Floor)));
														case '#':
															return $elm$core$Result$Ok(
																$elm$core$Maybe$Just(
																	_Utils_Tuple2(
																		_Utils_Tuple2(charIndex, lineIndex),
																		$author$project$AB$Wall)));
														default:
															return $elm$core$Result$Err(
																'Line ' + ($elm$core$String$fromInt(lineIndex + 1) + (', char ' + ($elm$core$String$fromInt(charIndex + 1) + (': Invalid char: ' + $elm$core$String$fromChar(_char))))));
													}
												}),
											$elm$core$String$toList(line))));
							}),
						A2($elm$core$String$split, '\n', first)))));
		var _v2 = _Utils_Tuple2(mapResult, movesResult);
		if (_v2.a.$ === 'Err') {
			if (_v2.b.$ === 'Err') {
				var mapErrors = _v2.a.a;
				var moveError = _v2.b.a;
				return $elm$core$Result$Err(
					_Utils_ap(
						mapErrors,
						_List_fromArray(
							[moveError])));
			} else {
				var mapErrors = _v2.a.a;
				return $elm$core$Result$Err(mapErrors);
			}
		} else {
			if (_v2.b.$ === 'Ok') {
				var map = _v2.a.a;
				var moves = _v2.b.a;
				return $elm$core$Result$Ok(
					_Utils_Tuple2(map, moves));
			} else {
				var moveError = _v2.b.a;
				return $elm$core$Result$Err(
					_List_fromArray(
						[moveError]));
			}
		}
	} else {
		var list = _v0;
		return $elm$core$Result$Err(
			_List_fromArray(
				[
					'Expected two sections separated by a blank line, but got: ' + ($elm$core$String$fromInt(
					$elm$core$List$length(list)) + ' sections.')
				]));
	}
};
var $elm$core$Dict$singleton = F2(
	function (key, value) {
		return A5($elm$core$Dict$RBNode_elm_builtin, $elm$core$Dict$Black, key, value, $elm$core$Dict$RBEmpty_elm_builtin, $elm$core$Dict$RBEmpty_elm_builtin);
	});
var $elm$core$Set$singleton = function (key) {
	return $elm$core$Set$Set_elm_builtin(
		A2($elm$core$Dict$singleton, key, _Utils_Tuple0));
};
var $elm$core$Basics$ge = _Utils_ge;
var $author$project$AB$getDirectionKey = F2(
	function (sideLength, _v0) {
		var x = _v0.a;
		var y = _v0.b;
		var z = _v0.c;
		return ((x < 0) || (_Utils_cmp(x, sideLength) > -1)) ? _Utils_Tuple3(x, 0, 0) : (((y < 0) || (_Utils_cmp(y, sideLength) > -1)) ? _Utils_Tuple3(0, y, 0) : (((z < 0) || (_Utils_cmp(z, sideLength) > -1)) ? _Utils_Tuple3(0, 0, z) : _Debug_todo(
			'AB',
			{
				start: {line: 766, column: 9},
				end: {line: 766, column: 19}
			})(
			'directionKey: Not found for: ' + $elm$core$Debug$toString(
				_Utils_Tuple3(x, y, z)))));
	});
var $elm$core$Dict$foldl = F3(
	function (func, acc, dict) {
		foldl:
		while (true) {
			if (dict.$ === 'RBEmpty_elm_builtin') {
				return acc;
			} else {
				var key = dict.b;
				var value = dict.c;
				var left = dict.d;
				var right = dict.e;
				var $temp$func = func,
					$temp$acc = A3(
					func,
					key,
					value,
					A3($elm$core$Dict$foldl, func, acc, left)),
					$temp$dict = right;
				func = $temp$func;
				acc = $temp$acc;
				dict = $temp$dict;
				continue foldl;
			}
		}
	});
var $elm$core$Dict$union = F2(
	function (t1, t2) {
		return A3($elm$core$Dict$foldl, $elm$core$Dict$insert, t2, t1);
	});
var $author$project$AB$walkChain = F4(
	function (sideLength, hardcoded, path, _v0) {
		var chain = _v0.a;
		var _v1 = A2(hardcoded, sideLength, path);
		var transform = _v1.transform;
		var directions = _v1.directions;
		var cube = transform(chain.map);
		var onePosition = function () {
			var _v3 = $elm$core$Dict$toList(cube);
			if (_v3.b) {
				var _v4 = _v3.a;
				var first = _v4.a;
				return first;
			} else {
				return _Debug_todo(
					'AB',
					{
						start: {line: 733, column: 21},
						end: {line: 733, column: 31}
					})('walkChain: Empty cube');
			}
		}();
		var directionKey = A2($author$project$AB$getDirectionKey, sideLength, onePosition);
		return A3(
			$elm$core$List$foldl,
			F2(
				function (_v2, acc) {
					var direction = _v2.a;
					var nextChain = _v2.b;
					var next = A4(
						$author$project$AB$walkChain,
						sideLength,
						hardcoded,
						_Utils_ap(
							path,
							_List_fromArray(
								[direction])),
						nextChain);
					return {
						cube: A2($elm$core$Dict$union, acc.cube, next.cube),
						directionsMap: A2($elm$core$Dict$union, acc.directionsMap, next.directionsMap)
					};
				}),
			{
				cube: cube,
				directionsMap: A2($elm$core$Dict$singleton, directionKey, directions)
			},
			chain.links);
	});
var $author$project$AB$initPart = function (model) {
	var input = function () {
		var _v6 = model.input;
		if (_v6.$ === 'Example') {
			return $author$project$Input$example;
		} else {
			return $author$project$Input$input;
		}
	}();
	var _v0 = $author$project$AB$parse(input);
	if (_v0.$ === 'Ok') {
		var _v1 = _v0.a;
		var map = _v1.a;
		var moves = _v1.b;
		var hardcoded = function () {
			var _v5 = model.input;
			if (_v5.$ === 'Example') {
				return $author$project$AB$exampleHardcoded;
			} else {
				return $author$project$AB$fullHardcoded;
			}
		}();
		var bounds = $author$project$AB$mapToBounds(map);
		var sideLength = $author$project$AB$getSideLength(bounds);
		var start = A4($author$project$AB$findStart, sideLength, 0, bounds, map);
		var chain = A4(
			$author$project$AB$makeChain,
			sideLength,
			start,
			$elm$core$Set$singleton(start),
			map);
		var xRange = A2($elm$core$List$range, bounds.xMin, bounds.xMax);
		var yRange = A2($elm$core$List$range, bounds.yMin, bounds.yMax);
		var columnBounds = $elm$core$Dict$fromList(
			A2(
				$elm$core$List$map,
				function (x) {
					var ys = A2(
						$elm$core$List$filterMap,
						function (y) {
							return A2(
								$elm$core$Dict$member,
								_Utils_Tuple2(x, y),
								map) ? $elm$core$Maybe$Just(y) : $elm$core$Maybe$Nothing;
						},
						yRange);
					return _Utils_Tuple2(
						x,
						_Utils_Tuple2(
							$author$project$AB$minimum(ys),
							$author$project$AB$maximum(ys)));
				},
				xRange));
		var rowBounds = $elm$core$Dict$fromList(
			A2(
				$elm$core$List$map,
				function (y) {
					var xs = A2(
						$elm$core$List$filterMap,
						function (x) {
							return A2(
								$elm$core$Dict$member,
								_Utils_Tuple2(x, y),
								map) ? $elm$core$Maybe$Just(x) : $elm$core$Maybe$Nothing;
						},
						xRange);
					return _Utils_Tuple2(
						y,
						_Utils_Tuple2(
							$author$project$AB$minimum(xs),
							$author$project$AB$maximum(xs)));
				},
				yRange));
		var _v2 = A4($author$project$AB$walkChain, sideLength, hardcoded, _List_Nil, chain);
		var cube = _v2.cube;
		var directionsMap = _v2.directionsMap;
		var _v3 = A2($elm$core$Dict$get, bounds.yMin, rowBounds);
		if (_v3.$ === 'Just') {
			var _v4 = _v3.a;
			var xMin = _v4.a;
			return _Utils_update(
				model,
				{
					bounds: bounds,
					columnBounds: columnBounds,
					cube: cube,
					directionA: $author$project$AB$Right,
					directionB: _Utils_Tuple3(1, 0, 0),
					directionsMap: directionsMap,
					historyA: _List_Nil,
					historyB: _List_Nil,
					map: map,
					moves: moves,
					positionA: _Utils_Tuple2(xMin, bounds.yMin),
					positionB: _Utils_Tuple3(0, sideLength - 1, sideLength),
					rowBounds: rowBounds,
					sideLength: sideLength
				});
		} else {
			return _Utils_update(
				model,
				{
					inputError: $elm$core$Maybe$Just('No starting position found.')
				});
		}
	} else {
		var errors = _v0.a;
		return _Utils_update(
			model,
			{
				inputError: $elm$core$Maybe$Just(
					A2($elm$core$String$join, '\n', errors))
			});
	}
};
var $elm$core$Platform$Cmd$batch = _Platform_batch;
var $elm$core$Platform$Cmd$none = $elm$core$Platform$Cmd$batch(_List_Nil);
var $author$project$AB$init = function (_v0) {
	var fps = 8;
	return _Utils_Tuple2(
		$author$project$AB$initPart(
			{
				bounds: $author$project$AB$mapToBounds($elm$core$Dict$empty),
				columnBounds: $elm$core$Dict$empty,
				cube: $elm$core$Dict$empty,
				directionA: $author$project$AB$Right,
				directionB: _Utils_Tuple3(0, 0, 0),
				directionsMap: $elm$core$Dict$empty,
				fps: fps,
				fpsInput: $elm$core$String$fromInt(fps),
				historyA: _List_Nil,
				historyB: _List_Nil,
				input: $author$project$AB$Example,
				inputError: $elm$core$Maybe$Nothing,
				map: $elm$core$Dict$empty,
				moves: _List_Nil,
				part: $author$project$AB$A,
				playing: false,
				positionA: _Utils_Tuple2(0, 0),
				positionB: _Utils_Tuple3(0, 0, 0),
				rowBounds: $elm$core$Dict$empty,
				sideLength: 0,
				steppingToEnd: false
			}),
		$elm$core$Platform$Cmd$none);
};
var $author$project$AB$Step = {$: 'Step'};
var $elm$core$Basics$always = F2(
	function (a, _v0) {
		return a;
	});
var $elm$time$Time$Every = F2(
	function (a, b) {
		return {$: 'Every', a: a, b: b};
	});
var $elm$time$Time$State = F2(
	function (taggers, processes) {
		return {processes: processes, taggers: taggers};
	});
var $elm$time$Time$init = $elm$core$Task$succeed(
	A2($elm$time$Time$State, $elm$core$Dict$empty, $elm$core$Dict$empty));
var $elm$time$Time$addMySub = F2(
	function (_v0, state) {
		var interval = _v0.a;
		var tagger = _v0.b;
		var _v1 = A2($elm$core$Dict$get, interval, state);
		if (_v1.$ === 'Nothing') {
			return A3(
				$elm$core$Dict$insert,
				interval,
				_List_fromArray(
					[tagger]),
				state);
		} else {
			var taggers = _v1.a;
			return A3(
				$elm$core$Dict$insert,
				interval,
				A2($elm$core$List$cons, tagger, taggers),
				state);
		}
	});
var $elm$core$Process$kill = _Scheduler_kill;
var $elm$core$Dict$merge = F6(
	function (leftStep, bothStep, rightStep, leftDict, rightDict, initialResult) {
		var stepState = F3(
			function (rKey, rValue, _v0) {
				stepState:
				while (true) {
					var list = _v0.a;
					var result = _v0.b;
					if (!list.b) {
						return _Utils_Tuple2(
							list,
							A3(rightStep, rKey, rValue, result));
					} else {
						var _v2 = list.a;
						var lKey = _v2.a;
						var lValue = _v2.b;
						var rest = list.b;
						if (_Utils_cmp(lKey, rKey) < 0) {
							var $temp$rKey = rKey,
								$temp$rValue = rValue,
								$temp$_v0 = _Utils_Tuple2(
								rest,
								A3(leftStep, lKey, lValue, result));
							rKey = $temp$rKey;
							rValue = $temp$rValue;
							_v0 = $temp$_v0;
							continue stepState;
						} else {
							if (_Utils_cmp(lKey, rKey) > 0) {
								return _Utils_Tuple2(
									list,
									A3(rightStep, rKey, rValue, result));
							} else {
								return _Utils_Tuple2(
									rest,
									A4(bothStep, lKey, lValue, rValue, result));
							}
						}
					}
				}
			});
		var _v3 = A3(
			$elm$core$Dict$foldl,
			stepState,
			_Utils_Tuple2(
				$elm$core$Dict$toList(leftDict),
				initialResult),
			rightDict);
		var leftovers = _v3.a;
		var intermediateResult = _v3.b;
		return A3(
			$elm$core$List$foldl,
			F2(
				function (_v4, result) {
					var k = _v4.a;
					var v = _v4.b;
					return A3(leftStep, k, v, result);
				}),
			intermediateResult,
			leftovers);
	});
var $elm$core$Platform$sendToSelf = _Platform_sendToSelf;
var $elm$time$Time$Name = function (a) {
	return {$: 'Name', a: a};
};
var $elm$time$Time$Offset = function (a) {
	return {$: 'Offset', a: a};
};
var $elm$time$Time$Zone = F2(
	function (a, b) {
		return {$: 'Zone', a: a, b: b};
	});
var $elm$time$Time$customZone = $elm$time$Time$Zone;
var $elm$time$Time$setInterval = _Time_setInterval;
var $elm$core$Process$spawn = _Scheduler_spawn;
var $elm$time$Time$spawnHelp = F3(
	function (router, intervals, processes) {
		if (!intervals.b) {
			return $elm$core$Task$succeed(processes);
		} else {
			var interval = intervals.a;
			var rest = intervals.b;
			var spawnTimer = $elm$core$Process$spawn(
				A2(
					$elm$time$Time$setInterval,
					interval,
					A2($elm$core$Platform$sendToSelf, router, interval)));
			var spawnRest = function (id) {
				return A3(
					$elm$time$Time$spawnHelp,
					router,
					rest,
					A3($elm$core$Dict$insert, interval, id, processes));
			};
			return A2($elm$core$Task$andThen, spawnRest, spawnTimer);
		}
	});
var $elm$time$Time$onEffects = F3(
	function (router, subs, _v0) {
		var processes = _v0.processes;
		var rightStep = F3(
			function (_v6, id, _v7) {
				var spawns = _v7.a;
				var existing = _v7.b;
				var kills = _v7.c;
				return _Utils_Tuple3(
					spawns,
					existing,
					A2(
						$elm$core$Task$andThen,
						function (_v5) {
							return kills;
						},
						$elm$core$Process$kill(id)));
			});
		var newTaggers = A3($elm$core$List$foldl, $elm$time$Time$addMySub, $elm$core$Dict$empty, subs);
		var leftStep = F3(
			function (interval, taggers, _v4) {
				var spawns = _v4.a;
				var existing = _v4.b;
				var kills = _v4.c;
				return _Utils_Tuple3(
					A2($elm$core$List$cons, interval, spawns),
					existing,
					kills);
			});
		var bothStep = F4(
			function (interval, taggers, id, _v3) {
				var spawns = _v3.a;
				var existing = _v3.b;
				var kills = _v3.c;
				return _Utils_Tuple3(
					spawns,
					A3($elm$core$Dict$insert, interval, id, existing),
					kills);
			});
		var _v1 = A6(
			$elm$core$Dict$merge,
			leftStep,
			bothStep,
			rightStep,
			newTaggers,
			processes,
			_Utils_Tuple3(
				_List_Nil,
				$elm$core$Dict$empty,
				$elm$core$Task$succeed(_Utils_Tuple0)));
		var spawnList = _v1.a;
		var existingDict = _v1.b;
		var killTask = _v1.c;
		return A2(
			$elm$core$Task$andThen,
			function (newProcesses) {
				return $elm$core$Task$succeed(
					A2($elm$time$Time$State, newTaggers, newProcesses));
			},
			A2(
				$elm$core$Task$andThen,
				function (_v2) {
					return A3($elm$time$Time$spawnHelp, router, spawnList, existingDict);
				},
				killTask));
	});
var $elm$time$Time$Posix = function (a) {
	return {$: 'Posix', a: a};
};
var $elm$time$Time$millisToPosix = $elm$time$Time$Posix;
var $elm$time$Time$now = _Time_now($elm$time$Time$millisToPosix);
var $elm$time$Time$onSelfMsg = F3(
	function (router, interval, state) {
		var _v0 = A2($elm$core$Dict$get, interval, state.taggers);
		if (_v0.$ === 'Nothing') {
			return $elm$core$Task$succeed(state);
		} else {
			var taggers = _v0.a;
			var tellTaggers = function (time) {
				return $elm$core$Task$sequence(
					A2(
						$elm$core$List$map,
						function (tagger) {
							return A2(
								$elm$core$Platform$sendToApp,
								router,
								tagger(time));
						},
						taggers));
			};
			return A2(
				$elm$core$Task$andThen,
				function (_v1) {
					return $elm$core$Task$succeed(state);
				},
				A2($elm$core$Task$andThen, tellTaggers, $elm$time$Time$now));
		}
	});
var $elm$core$Basics$composeL = F3(
	function (g, f, x) {
		return g(
			f(x));
	});
var $elm$time$Time$subMap = F2(
	function (f, _v0) {
		var interval = _v0.a;
		var tagger = _v0.b;
		return A2(
			$elm$time$Time$Every,
			interval,
			A2($elm$core$Basics$composeL, f, tagger));
	});
_Platform_effectManagers['Time'] = _Platform_createManager($elm$time$Time$init, $elm$time$Time$onEffects, $elm$time$Time$onSelfMsg, 0, $elm$time$Time$subMap);
var $elm$time$Time$subscription = _Platform_leaf('Time');
var $elm$time$Time$every = F2(
	function (interval, tagger) {
		return $elm$time$Time$subscription(
			A2($elm$time$Time$Every, interval, tagger));
	});
var $elm$core$Platform$Sub$batch = _Platform_batch;
var $elm$core$Platform$Sub$none = $elm$core$Platform$Sub$batch(_List_Nil);
var $author$project$AB$subscriptions = function (model) {
	return model.playing ? A2(
		$elm$time$Time$every,
		1000 / model.fps,
		$elm$core$Basics$always($author$project$AB$Step)) : $elm$core$Platform$Sub$none;
};
var $author$project$AB$StepToEndStarted = {$: 'StepToEndStarted'};
var $author$project$AB$fpsMin = 1;
var $elm$core$Basics$not = _Basics_not;
var $elm$core$Process$sleep = _Process_sleep;
var $author$project$AB$directionToMover = F3(
	function (rowBounds, columnBounds, direction) {
		switch (direction.$) {
			case 'Up':
				return _Utils_Tuple2(
					_Utils_Tuple2(0, -1),
					function (_v1) {
						var x = _v1.a;
						var _v2 = A2($elm$core$Dict$get, x, columnBounds);
						if (_v2.$ === 'Just') {
							var _v3 = _v2.a;
							var yMax = _v3.b;
							return _Utils_Tuple2(x, yMax);
						} else {
							return _Debug_todo(
								'AB',
								{
									start: {line: 1073, column: 25},
									end: {line: 1073, column: 35}
								})(
								'Up: x not found in columnBounds: ' + $elm$core$String$fromInt(x));
						}
					});
			case 'Down':
				return _Utils_Tuple2(
					_Utils_Tuple2(0, 1),
					function (_v4) {
						var x = _v4.a;
						var _v5 = A2($elm$core$Dict$get, x, columnBounds);
						if (_v5.$ === 'Just') {
							var _v6 = _v5.a;
							var yMin = _v6.a;
							return _Utils_Tuple2(x, yMin);
						} else {
							return _Debug_todo(
								'AB',
								{
									start: {line: 1084, column: 25},
									end: {line: 1084, column: 35}
								})(
								'Down: x not found in columnBounds: ' + $elm$core$String$fromInt(x));
						}
					});
			case 'Left':
				return _Utils_Tuple2(
					_Utils_Tuple2(-1, 0),
					function (_v7) {
						var y = _v7.b;
						var _v8 = A2($elm$core$Dict$get, y, rowBounds);
						if (_v8.$ === 'Just') {
							var _v9 = _v8.a;
							var xMax = _v9.b;
							return _Utils_Tuple2(xMax, y);
						} else {
							return _Debug_todo(
								'AB',
								{
									start: {line: 1095, column: 25},
									end: {line: 1095, column: 35}
								})(
								'Left: y not found in columnBounds: ' + $elm$core$String$fromInt(y));
						}
					});
			default:
				return _Utils_Tuple2(
					_Utils_Tuple2(1, 0),
					function (_v10) {
						var y = _v10.b;
						var _v11 = A2($elm$core$Dict$get, y, rowBounds);
						if (_v11.$ === 'Just') {
							var _v12 = _v11.a;
							var xMin = _v12.a;
							return _Utils_Tuple2(xMin, y);
						} else {
							return _Debug_todo(
								'AB',
								{
									start: {line: 1106, column: 25},
									end: {line: 1106, column: 35}
								})(
								'Right: y not found in columnBounds: ' + $elm$core$String$fromInt(y));
						}
					});
		}
	});
var $author$project$AB$doMoveA = F5(
	function (warp, _v0, _v1, n, map) {
		var xStart = _v0.a;
		var yStart = _v0.b;
		var dx = _v1.a;
		var dy = _v1.b;
		if (n <= 0) {
			return _Utils_Tuple2(
				_Utils_Tuple2(xStart, yStart),
				0);
		} else {
			var y = yStart + dy;
			var x = xStart + dx;
			var _v2 = A2(
				$elm$core$Dict$get,
				_Utils_Tuple2(x, y),
				map);
			if (_v2.$ === 'Nothing') {
				var _v3 = warp(
					_Utils_Tuple2(x, y));
				var xWarp = _v3.a;
				var yWarp = _v3.b;
				var _v4 = A2(
					$elm$core$Dict$get,
					_Utils_Tuple2(xWarp, yWarp),
					map);
				if (_v4.$ === 'Nothing') {
					return _Debug_todo(
						'AB',
						{
							start: {line: 1131, column: 25},
							end: {line: 1131, column: 35}
						})(
						'warp failed: ' + ($elm$core$Debug$toString(
							_Utils_Tuple2(x, y)) + (' -> ' + $elm$core$Debug$toString(
							_Utils_Tuple2(xWarp, yWarp)))));
				} else {
					if (_v4.a.$ === 'Floor') {
						var _v5 = _v4.a;
						return _Utils_Tuple2(
							_Utils_Tuple2(xWarp, yWarp),
							n - 1);
					} else {
						var _v6 = _v4.a;
						return _Utils_Tuple2(
							_Utils_Tuple2(xStart, yStart),
							0);
					}
				}
			} else {
				if (_v2.a.$ === 'Floor') {
					var _v7 = _v2.a;
					return _Utils_Tuple2(
						_Utils_Tuple2(x, y),
						n - 1);
				} else {
					var _v8 = _v2.a;
					return _Utils_Tuple2(
						_Utils_Tuple2(xStart, yStart),
						0);
				}
			}
		}
	});
var $author$project$AB$turnLeftA = function (direction) {
	switch (direction.$) {
		case 'Up':
			return $author$project$AB$Left;
		case 'Down':
			return $author$project$AB$Right;
		case 'Left':
			return $author$project$AB$Down;
		default:
			return $author$project$AB$Up;
	}
};
var $author$project$AB$turnRightA = function (direction) {
	switch (direction.$) {
		case 'Up':
			return $author$project$AB$Right;
		case 'Down':
			return $author$project$AB$Left;
		case 'Left':
			return $author$project$AB$Up;
		default:
			return $author$project$AB$Down;
	}
};
var $author$project$AB$stepA = function (model) {
	var _v0 = model.moves;
	if (!_v0.b) {
		return _Utils_update(
			model,
			{playing: false});
	} else {
		var move = _v0.a;
		var rest = _v0.b;
		switch (move.$) {
			case 'GoForward':
				var n = move.a;
				var _v2 = A3($author$project$AB$directionToMover, model.rowBounds, model.columnBounds, model.directionA);
				var directionChange = _v2.a;
				var warp = _v2.b;
				var _v3 = A5($author$project$AB$doMoveA, warp, model.positionA, directionChange, n, model.map);
				var newPosition = _v3.a;
				var newN = _v3.b;
				return _Utils_update(
					model,
					{
						historyA: _Utils_eq(newPosition, model.positionA) ? model.historyA : _Utils_ap(
							model.historyA,
							_List_fromArray(
								[
									_Utils_Tuple2(model.positionA, model.directionA)
								])),
						moves: (newN > 0) ? A2(
							$elm$core$List$cons,
							$author$project$AB$GoForward(newN),
							rest) : rest,
						positionA: newPosition
					});
			case 'TurnLeft':
				return _Utils_update(
					model,
					{
						directionA: $author$project$AB$turnLeftA(model.directionA),
						moves: rest
					});
			default:
				return _Utils_update(
					model,
					{
						directionA: $author$project$AB$turnRightA(model.directionA),
						moves: rest
					});
		}
	}
};
var $author$project$AB$move3d = F2(
	function (_v0, _v1) {
		var x = _v0.a;
		var y = _v0.b;
		var z = _v0.c;
		var dx = _v1.a;
		var dy = _v1.b;
		var dz = _v1.c;
		return _Utils_Tuple3(x + dx, y + dy, z + dz);
	});
var $elm$core$Basics$neq = _Utils_notEqual;
var $author$project$AB$warpB = F3(
	function (cube, startPosition, newPosition) {
		var candidates = A2(
			$elm$core$List$filterMap,
			function (direction) {
				var position = A2($author$project$AB$move3d, newPosition, direction);
				return (A2($elm$core$Dict$member, position, cube) && (!_Utils_eq(position, startPosition))) ? $elm$core$Maybe$Just(
					_Utils_Tuple2(position, direction)) : $elm$core$Maybe$Nothing;
			},
			_List_fromArray(
				[
					_Utils_Tuple3(0, 0, -1),
					_Utils_Tuple3(0, 0, 1),
					_Utils_Tuple3(0, -1, 0),
					_Utils_Tuple3(0, 1, 0),
					_Utils_Tuple3(-1, 0, 0),
					_Utils_Tuple3(1, 0, 0)
				]));
		if (candidates.b && (!candidates.b.b)) {
			var candidate = candidates.a;
			return candidate;
		} else {
			return _Debug_todo(
				'AB',
				{
					start: {line: 1213, column: 13},
					end: {line: 1213, column: 23}
				})(
				'warpB: Found too many candidates: ' + $elm$core$Debug$toString(candidates));
		}
	});
var $author$project$AB$doMoveB = F2(
	function (n, model) {
		if (n <= 0) {
			return _Utils_Tuple2(model, 0);
		} else {
			var newPosition = A2($author$project$AB$move3d, model.positionB, model.directionB);
			var _v0 = A2(
				$elm$core$Maybe$map,
				function ($) {
					return $.item;
				},
				A2($elm$core$Dict$get, newPosition, model.cube));
			if (_v0.$ === 'Nothing') {
				var _v1 = A3($author$project$AB$warpB, model.cube, model.positionB, newPosition);
				var warpedPosition = _v1.a;
				var warpedDirection = _v1.b;
				var _v2 = A2(
					$elm$core$Maybe$map,
					function ($) {
						return $.item;
					},
					A2($elm$core$Dict$get, warpedPosition, model.cube));
				if (_v2.$ === 'Nothing') {
					return _Debug_todo(
						'AB',
						{
							start: {line: 1164, column: 25},
							end: {line: 1164, column: 35}
						})(
						'warpB failed: ' + ($elm$core$Debug$toString(model.positionB) + (' -> ' + ($elm$core$Debug$toString(newPosition) + (' -> ' + $elm$core$Debug$toString(warpedPosition))))));
				} else {
					if (_v2.a.$ === 'Floor') {
						var _v3 = _v2.a;
						return _Utils_Tuple2(
							_Utils_update(
								model,
								{directionB: warpedDirection, positionB: warpedPosition}),
							n - 1);
					} else {
						var _v4 = _v2.a;
						return _Utils_Tuple2(model, 0);
					}
				}
			} else {
				if (_v0.a.$ === 'Floor') {
					var _v5 = _v0.a;
					return _Utils_Tuple2(
						_Utils_update(
							model,
							{positionB: newPosition}),
						n - 1);
				} else {
					var _v6 = _v0.a;
					return _Utils_Tuple2(model, 0);
				}
			}
		}
	});
var $author$project$AB$intToOrder = function (n) {
	return (n < 0) ? $elm$core$Basics$LT : ((n > 0) ? $elm$core$Basics$GT : $elm$core$Basics$EQ);
};
var $author$project$AB$directionToOrder = function (_v0) {
	var x = _v0.a;
	var y = _v0.b;
	var z = _v0.c;
	return _Utils_Tuple3(
		$author$project$AB$intToOrder(x),
		$author$project$AB$intToOrder(y),
		$author$project$AB$intToOrder(z));
};
var $author$project$AB$sign = function (x) {
	return (x < 0) ? (-1) : ((x > 0) ? 1 : _Debug_todo(
		'AB',
		{
			start: {line: 1010, column: 9},
			end: {line: 1010, column: 19}
		})('sign: Got 0'));
};
var $author$project$AB$turnLeftB = F2(
	function (directionKey, direction) {
		_v0$3:
		while (true) {
			if (!directionKey.a) {
				if (!directionKey.b) {
					var z = directionKey.c;
					var _v1 = $author$project$AB$directionToOrder(direction);
					_v1$4:
					while (true) {
						switch (_v1.a.$) {
							case 'LT':
								if (_v1.b.$ === 'EQ') {
									var _v2 = _v1.a;
									var _v3 = _v1.b;
									return _Utils_Tuple3(
										0,
										-$author$project$AB$sign(z),
										0);
								} else {
									break _v1$4;
								}
							case 'GT':
								if (_v1.b.$ === 'EQ') {
									var _v4 = _v1.a;
									var _v5 = _v1.b;
									return _Utils_Tuple3(
										0,
										$author$project$AB$sign(z),
										0);
								} else {
									break _v1$4;
								}
							default:
								switch (_v1.b.$) {
									case 'LT':
										var _v6 = _v1.a;
										var _v7 = _v1.b;
										return _Utils_Tuple3(
											$author$project$AB$sign(z),
											0,
											0);
									case 'GT':
										var _v8 = _v1.a;
										var _v9 = _v1.b;
										return _Utils_Tuple3(
											-$author$project$AB$sign(z),
											0,
											0);
									default:
										break _v1$4;
								}
						}
					}
					return _Debug_todo(
						'AB',
						{
							start: {line: 954, column: 21},
							end: {line: 954, column: 31}
						})(
						'turnLeftB: Unsupported direction: ' + $elm$core$Debug$toString(direction));
				} else {
					if (!directionKey.c) {
						var y = directionKey.b;
						var _v10 = $author$project$AB$directionToOrder(direction);
						_v10$4:
						while (true) {
							switch (_v10.a.$) {
								case 'LT':
									if (_v10.c.$ === 'EQ') {
										var _v11 = _v10.a;
										var _v12 = _v10.c;
										return _Utils_Tuple3(
											0,
											0,
											$author$project$AB$sign(y));
									} else {
										break _v10$4;
									}
								case 'GT':
									if (_v10.c.$ === 'EQ') {
										var _v13 = _v10.a;
										var _v14 = _v10.c;
										return _Utils_Tuple3(
											0,
											0,
											-$author$project$AB$sign(y));
									} else {
										break _v10$4;
									}
								default:
									switch (_v10.c.$) {
										case 'LT':
											var _v15 = _v10.a;
											var _v16 = _v10.c;
											return _Utils_Tuple3(
												-$author$project$AB$sign(y),
												0,
												0);
										case 'GT':
											var _v17 = _v10.a;
											var _v18 = _v10.c;
											return _Utils_Tuple3(
												$author$project$AB$sign(y),
												0,
												0);
										default:
											break _v10$4;
									}
							}
						}
						return _Debug_todo(
							'AB',
							{
								start: {line: 971, column: 21},
								end: {line: 971, column: 31}
							})(
							'turnLeftB: Unsupported direction: ' + $elm$core$Debug$toString(direction));
					} else {
						break _v0$3;
					}
				}
			} else {
				if ((!directionKey.b) && (!directionKey.c)) {
					var x = directionKey.a;
					var _v19 = $author$project$AB$directionToOrder(direction);
					_v19$4:
					while (true) {
						switch (_v19.b.$) {
							case 'LT':
								if (_v19.c.$ === 'EQ') {
									var _v20 = _v19.b;
									var _v21 = _v19.c;
									return _Utils_Tuple3(
										0,
										0,
										-$author$project$AB$sign(x));
								} else {
									break _v19$4;
								}
							case 'GT':
								if (_v19.c.$ === 'EQ') {
									var _v22 = _v19.b;
									var _v23 = _v19.c;
									return _Utils_Tuple3(
										0,
										0,
										$author$project$AB$sign(x));
								} else {
									break _v19$4;
								}
							default:
								switch (_v19.c.$) {
									case 'LT':
										var _v24 = _v19.b;
										var _v25 = _v19.c;
										return _Utils_Tuple3(
											0,
											$author$project$AB$sign(x),
											0);
									case 'GT':
										var _v26 = _v19.b;
										var _v27 = _v19.c;
										return _Utils_Tuple3(
											0,
											-$author$project$AB$sign(x),
											0);
									default:
										break _v19$4;
								}
						}
					}
					return _Debug_todo(
						'AB',
						{
							start: {line: 988, column: 21},
							end: {line: 988, column: 31}
						})(
						'turnLeftB: Unsupported direction: ' + $elm$core$Debug$toString(direction));
				} else {
					break _v0$3;
				}
			}
		}
		return _Debug_todo(
			'AB',
			{
				start: {line: 991, column: 13},
				end: {line: 991, column: 23}
			})(
			'turnLeftB: Unsupported directionKey: ' + $elm$core$Debug$toString(directionKey));
	});
var $author$project$AB$turnRightB = function (directionKey) {
	return A2(
		$elm$core$Basics$composeR,
		$author$project$AB$turnLeftB(directionKey),
		A2(
			$elm$core$Basics$composeR,
			$author$project$AB$turnLeftB(directionKey),
			$author$project$AB$turnLeftB(directionKey)));
};
var $author$project$AB$stepB = function (model) {
	var _v0 = model.moves;
	if (!_v0.b) {
		return _Utils_update(
			model,
			{playing: false});
	} else {
		var move = _v0.a;
		var rest = _v0.b;
		switch (move.$) {
			case 'GoForward':
				var n = move.a;
				var _v2 = A2($author$project$AB$doMoveB, n, model);
				var moved = _v2.a;
				var newN = _v2.b;
				return _Utils_update(
					moved,
					{
						historyB: _Utils_eq(moved.positionB, model.positionB) ? model.historyB : _Utils_ap(
							model.historyB,
							_List_fromArray(
								[
									_Utils_Tuple2(model.positionB, model.directionB)
								])),
						moves: (newN > 0) ? A2(
							$elm$core$List$cons,
							$author$project$AB$GoForward(newN),
							rest) : rest
					});
			case 'TurnLeft':
				return _Utils_update(
					model,
					{
						directionB: A2(
							$author$project$AB$turnLeftB,
							A2($author$project$AB$getDirectionKey, model.sideLength, model.positionB),
							model.directionB),
						moves: rest
					});
			default:
				return _Utils_update(
					model,
					{
						directionB: A2(
							$author$project$AB$turnRightB,
							A2($author$project$AB$getDirectionKey, model.sideLength, model.positionB),
							model.directionB),
						moves: rest
					});
		}
	}
};
var $author$project$AB$stepToEndA = function (model) {
	stepToEndA:
	while (true) {
		var nextModel = $author$project$AB$stepA(model);
		if (nextModel.playing) {
			var $temp$model = nextModel;
			model = $temp$model;
			continue stepToEndA;
		} else {
			return nextModel;
		}
	}
};
var $author$project$AB$stepToEndB = function (model) {
	stepToEndB:
	while (true) {
		var nextModel = $author$project$AB$stepB(model);
		if (nextModel.playing) {
			var $temp$model = nextModel;
			model = $temp$model;
			continue stepToEndB;
		} else {
			return nextModel;
		}
	}
};
var $author$project$AB$update = F2(
	function (msg, model) {
		switch (msg.$) {
			case 'Step':
				return _Utils_Tuple2(
					function () {
						var _v1 = model.part;
						if (_v1.$ === 'A') {
							return $author$project$AB$stepA;
						} else {
							return $author$project$AB$stepB;
						}
					}()(model),
					$elm$core$Platform$Cmd$none);
			case 'PlayPauseToggled':
				return _Utils_Tuple2(
					_Utils_update(
						model,
						{playing: !model.playing}),
					$elm$core$Platform$Cmd$none);
			case 'StepToEndClicked':
				return _Utils_Tuple2(
					_Utils_update(
						model,
						{playing: false, steppingToEnd: true}),
					A2(
						$elm$core$Task$perform,
						$elm$core$Basics$always($author$project$AB$StepToEndStarted),
						$elm$core$Process$sleep(50)));
			case 'StepToEndStarted':
				var nextModel = function () {
					var _v2 = model.part;
					if (_v2.$ === 'A') {
						return $author$project$AB$stepToEndA;
					} else {
						return $author$project$AB$stepToEndB;
					}
				}()(
					_Utils_update(
						model,
						{playing: true}));
				return _Utils_Tuple2(
					_Utils_update(
						nextModel,
						{steppingToEnd: false}),
					$elm$core$Platform$Cmd$none);
			case 'SwitchPartClicked':
				var part = msg.a;
				return _Utils_Tuple2(
					$author$project$AB$initPart(
						_Utils_update(
							model,
							{part: part})),
					$elm$core$Platform$Cmd$none);
			case 'SwitchInputClicked':
				var input = msg.a;
				return _Utils_Tuple2(
					$author$project$AB$initPart(
						_Utils_update(
							model,
							{input: input})),
					$elm$core$Platform$Cmd$none);
			default:
				var input = msg.a;
				return _Utils_Tuple2(
					_Utils_update(
						model,
						{
							fps: function () {
								var _v3 = $elm$core$String$toInt(input);
								if (_v3.$ === 'Just') {
									var fps = _v3.a;
									return A2($elm$core$Basics$max, $author$project$AB$fpsMin, fps);
								} else {
									return model.fps;
								}
							}(),
							fpsInput: input
						}),
					$elm$core$Platform$Cmd$none);
		}
	});
var $elm$html$Html$div = _VirtualDom_node('div');
var $author$project$AB$getPositionAndDirectionBtoA = F3(
	function (model, positionB, directionB) {
		var positionA = function () {
			var _v2 = A2($elm$core$Dict$get, positionB, model.cube);
			if (_v2.$ === 'Just') {
				var item = _v2.a;
				return item.originalCoordinate;
			} else {
				return _Debug_todo(
					'AB',
					{
						start: {line: 1230, column: 21},
						end: {line: 1230, column: 31}
					})(
					'positionB not found: ' + $elm$core$Debug$toString(positionB));
			}
		}();
		var directionKey = A2($author$project$AB$getDirectionKey, model.sideLength, positionB);
		var directionA = function () {
			var _v0 = A2($elm$core$Dict$get, directionKey, model.directionsMap);
			if (_v0.$ === 'Just') {
				var directions = _v0.a;
				var _v1 = A2($elm$core$Dict$get, directionB, directions);
				if (_v1.$ === 'Just') {
					var direction = _v1.a;
					return direction;
				} else {
					return _Debug_todo(
						'AB',
						{
							start: {line: 1243, column: 29},
							end: {line: 1243, column: 39}
						})(
						'directionB not found: ' + $elm$core$Debug$toString(model.directionB));
				}
			} else {
				return _Debug_todo(
					'AB',
					{
						start: {line: 1246, column: 21},
						end: {line: 1246, column: 31}
					})(
					'directionKey not found: ' + $elm$core$Debug$toString(directionKey));
			}
		}();
		return _Utils_Tuple2(positionA, directionA);
	});
var $author$project$AB$B = {$: 'B'};
var $author$project$AB$FpsInputChanged = function (a) {
	return {$: 'FpsInputChanged', a: a};
};
var $author$project$AB$Full = {$: 'Full'};
var $author$project$AB$PlayPauseToggled = {$: 'PlayPauseToggled'};
var $author$project$AB$StepToEndClicked = {$: 'StepToEndClicked'};
var $author$project$AB$SwitchInputClicked = function (a) {
	return {$: 'SwitchInputClicked', a: a};
};
var $author$project$AB$SwitchPartClicked = function (a) {
	return {$: 'SwitchPartClicked', a: a};
};
var $elm$html$Html$button = _VirtualDom_node('button');
var $elm$json$Json$Encode$bool = _Json_wrap;
var $elm$html$Html$Attributes$boolProperty = F2(
	function (key, bool) {
		return A2(
			_VirtualDom_property,
			key,
			$elm$json$Json$Encode$bool(bool));
	});
var $elm$html$Html$Attributes$checked = $elm$html$Html$Attributes$boolProperty('checked');
var $author$project$AB$directionToFacing = function (direction) {
	switch (direction.$) {
		case 'Up':
			return 3;
		case 'Down':
			return 1;
		case 'Left':
			return 2;
		default:
			return 0;
	}
};
var $author$project$AB$directionToString = function (direction) {
	switch (direction.$) {
		case 'Up':
			return '⬆️';
		case 'Down':
			return '⬇️';
		case 'Left':
			return '⬅️';
		default:
			return '➡️';
	}
};
var $elm$html$Html$Attributes$disabled = $elm$html$Html$Attributes$boolProperty('disabled');
var $elm$json$Json$Encode$string = _Json_wrap;
var $elm$html$Html$Attributes$stringProperty = F2(
	function (key, string) {
		return A2(
			_VirtualDom_property,
			key,
			$elm$json$Json$Encode$string(string));
	});
var $elm$html$Html$Attributes$id = $elm$html$Html$Attributes$stringProperty('id');
var $elm$html$Html$input = _VirtualDom_node('input');
var $elm$html$Html$label = _VirtualDom_node('label');
var $elm$html$Html$Attributes$min = $elm$html$Html$Attributes$stringProperty('min');
var $author$project$AB$moveToString = function (move) {
	switch (move.$) {
		case 'GoForward':
			var n = move.a;
			return '🚶\u200D♂️' + $elm$core$String$fromInt(n);
		case 'TurnLeft':
			return '👈';
		default:
			return '👉';
	}
};
var $elm$html$Html$Attributes$name = $elm$html$Html$Attributes$stringProperty('name');
var $elm$virtual_dom$VirtualDom$Normal = function (a) {
	return {$: 'Normal', a: a};
};
var $elm$virtual_dom$VirtualDom$on = _VirtualDom_on;
var $elm$html$Html$Events$on = F2(
	function (event, decoder) {
		return A2(
			$elm$virtual_dom$VirtualDom$on,
			event,
			$elm$virtual_dom$VirtualDom$Normal(decoder));
	});
var $elm$json$Json$Decode$field = _Json_decodeField;
var $elm$json$Json$Decode$at = F2(
	function (fields, decoder) {
		return A3($elm$core$List$foldr, $elm$json$Json$Decode$field, decoder, fields);
	});
var $elm$json$Json$Decode$bool = _Json_decodeBool;
var $elm$html$Html$Events$targetChecked = A2(
	$elm$json$Json$Decode$at,
	_List_fromArray(
		['target', 'checked']),
	$elm$json$Json$Decode$bool);
var $elm$html$Html$Events$onCheck = function (tagger) {
	return A2(
		$elm$html$Html$Events$on,
		'change',
		A2($elm$json$Json$Decode$map, tagger, $elm$html$Html$Events$targetChecked));
};
var $elm$html$Html$Events$onClick = function (msg) {
	return A2(
		$elm$html$Html$Events$on,
		'click',
		$elm$json$Json$Decode$succeed(msg));
};
var $elm$html$Html$Events$alwaysStop = function (x) {
	return _Utils_Tuple2(x, true);
};
var $elm$virtual_dom$VirtualDom$MayStopPropagation = function (a) {
	return {$: 'MayStopPropagation', a: a};
};
var $elm$html$Html$Events$stopPropagationOn = F2(
	function (event, decoder) {
		return A2(
			$elm$virtual_dom$VirtualDom$on,
			event,
			$elm$virtual_dom$VirtualDom$MayStopPropagation(decoder));
	});
var $elm$json$Json$Decode$string = _Json_decodeString;
var $elm$html$Html$Events$targetValue = A2(
	$elm$json$Json$Decode$at,
	_List_fromArray(
		['target', 'value']),
	$elm$json$Json$Decode$string);
var $elm$html$Html$Events$onInput = function (tagger) {
	return A2(
		$elm$html$Html$Events$stopPropagationOn,
		'input',
		A2(
			$elm$json$Json$Decode$map,
			$elm$html$Html$Events$alwaysStop,
			A2($elm$json$Json$Decode$map, tagger, $elm$html$Html$Events$targetValue)));
};
var $elm$html$Html$pre = _VirtualDom_node('pre');
var $elm$virtual_dom$VirtualDom$style = _VirtualDom_style;
var $elm$html$Html$Attributes$style = $elm$virtual_dom$VirtualDom$style;
var $elm$virtual_dom$VirtualDom$text = _VirtualDom_text;
var $elm$html$Html$text = $elm$virtual_dom$VirtualDom$text;
var $elm$html$Html$Attributes$type_ = $elm$html$Html$Attributes$stringProperty('type');
var $elm$html$Html$Attributes$value = $elm$html$Html$Attributes$stringProperty('value');
var $author$project$AB$viewControls = F3(
	function (_v0, direction, model) {
		var x = _v0.a;
		var y = _v0.b;
		var row = y + 1;
		var nextMoveString = function () {
			var _v3 = model.moves;
			if (!_v3.b) {
				return '(none)';
			} else {
				var move = _v3.a;
				return $author$project$AB$moveToString(move);
			}
		}();
		var facing = $author$project$AB$directionToFacing(direction);
		var column = x + 1;
		return A2(
			$elm$html$Html$div,
			_List_fromArray(
				[
					$elm$html$Html$Attributes$id('controls-wrapper')
				]),
			_Utils_ap(
				_List_fromArray(
					[
						A2(
						$elm$html$Html$div,
						_List_fromArray(
							[
								$elm$html$Html$Attributes$id('controls')
							]),
						_List_fromArray(
							[
								A2(
								$elm$html$Html$button,
								_List_fromArray(
									[
										$elm$html$Html$Events$onClick($author$project$AB$PlayPauseToggled),
										$elm$html$Html$Attributes$disabled(
										$elm$core$List$isEmpty(model.moves))
									]),
								_List_fromArray(
									[
										$elm$html$Html$text(
										model.playing ? '⏸' : '▶️')
									])),
								A2(
								$elm$html$Html$button,
								_List_fromArray(
									[
										$elm$html$Html$Events$onClick($author$project$AB$Step),
										$elm$html$Html$Attributes$disabled(
										$elm$core$List$isEmpty(model.moves))
									]),
								_List_fromArray(
									[
										$elm$html$Html$text('⏩')
									])),
								model.steppingToEnd ? A2(
								$elm$html$Html$button,
								_List_Nil,
								_List_fromArray(
									[
										$elm$html$Html$text('⏳')
									])) : A2(
								$elm$html$Html$button,
								_List_fromArray(
									[
										$elm$html$Html$Events$onClick($author$project$AB$StepToEndClicked),
										$elm$html$Html$Attributes$disabled(
										$elm$core$List$isEmpty(model.moves))
									]),
								_List_fromArray(
									[
										$elm$html$Html$text('⏭')
									])),
								A2(
								$elm$html$Html$button,
								_List_fromArray(
									[
										$elm$html$Html$Events$onClick(
										$author$project$AB$SwitchPartClicked(model.part))
									]),
								_List_fromArray(
									[
										$elm$html$Html$text('↩️')
									])),
								A2(
								$elm$html$Html$label,
								_List_Nil,
								_List_fromArray(
									[
										A2(
										$elm$html$Html$input,
										_List_fromArray(
											[
												$elm$html$Html$Attributes$type_('radio'),
												$elm$html$Html$Attributes$name('part'),
												$elm$html$Html$Events$onCheck(
												$elm$core$Basics$always(
													$author$project$AB$SwitchPartClicked($author$project$AB$A))),
												$elm$html$Html$Attributes$checked(
												_Utils_eq(model.part, $author$project$AB$A))
											]),
										_List_Nil),
										$elm$html$Html$text('Part 1')
									])),
								A2(
								$elm$html$Html$label,
								_List_Nil,
								_List_fromArray(
									[
										A2(
										$elm$html$Html$input,
										_List_fromArray(
											[
												$elm$html$Html$Attributes$type_('radio'),
												$elm$html$Html$Attributes$name('part'),
												$elm$html$Html$Events$onCheck(
												$elm$core$Basics$always(
													$author$project$AB$SwitchPartClicked($author$project$AB$B))),
												$elm$html$Html$Attributes$checked(
												_Utils_eq(model.part, $author$project$AB$B))
											]),
										_List_Nil),
										$elm$html$Html$text('Part 2')
									])),
								A2(
								$elm$html$Html$label,
								_List_Nil,
								_List_fromArray(
									[
										A2(
										$elm$html$Html$input,
										_List_fromArray(
											[
												$elm$html$Html$Attributes$type_('radio'),
												$elm$html$Html$Attributes$name('input'),
												$elm$html$Html$Events$onCheck(
												$elm$core$Basics$always(
													$author$project$AB$SwitchInputClicked($author$project$AB$Example))),
												$elm$html$Html$Attributes$checked(
												_Utils_eq(model.input, $author$project$AB$Example))
											]),
										_List_Nil),
										$elm$html$Html$text('Example')
									])),
								A2(
								$elm$html$Html$label,
								_List_Nil,
								_List_fromArray(
									[
										A2(
										$elm$html$Html$input,
										_List_fromArray(
											[
												$elm$html$Html$Attributes$type_('radio'),
												$elm$html$Html$Attributes$name('input'),
												$elm$html$Html$Events$onCheck(
												$elm$core$Basics$always(
													$author$project$AB$SwitchInputClicked($author$project$AB$Full))),
												$elm$html$Html$Attributes$checked(
												_Utils_eq(model.input, $author$project$AB$Full))
											]),
										_List_Nil),
										$elm$html$Html$text('Full input')
									])),
								A2(
								$elm$html$Html$label,
								_List_Nil,
								_List_fromArray(
									[
										$elm$html$Html$text('FPS: '),
										A2(
										$elm$html$Html$input,
										_List_fromArray(
											[
												$elm$html$Html$Attributes$type_('number'),
												$elm$html$Html$Attributes$min(
												$elm$core$String$fromInt($author$project$AB$fpsMin)),
												$elm$html$Html$Attributes$value(model.fpsInput),
												$elm$html$Html$Events$onInput($author$project$AB$FpsInputChanged),
												A2($elm$html$Html$Attributes$style, 'width', '4em')
											]),
										_List_Nil)
									]))
							])),
						A2(
						$elm$html$Html$div,
						_List_Nil,
						_List_fromArray(
							[
								$elm$html$Html$text(
								'Row: ' + $elm$core$String$fromInt(row))
							])),
						A2(
						$elm$html$Html$div,
						_List_Nil,
						_List_fromArray(
							[
								$elm$html$Html$text(
								'Column: ' + $elm$core$String$fromInt(column))
							])),
						A2(
						$elm$html$Html$div,
						_List_Nil,
						_List_fromArray(
							[
								$elm$html$Html$text(
								'Direction: ' + ($author$project$AB$directionToString(direction) + (' (' + ($elm$core$String$fromInt(facing) + ')'))))
							])),
						A2(
						$elm$html$Html$div,
						_List_Nil,
						_List_fromArray(
							[
								$elm$html$Html$text('Next move: ' + nextMoveString)
							])),
						A2(
						$elm$html$Html$div,
						_List_Nil,
						_List_fromArray(
							[
								$elm$html$Html$text(
								'Solution: ' + $elm$core$String$fromInt(((1000 * row) + (4 * column)) + facing))
							])),
						function () {
						var _v1 = model.inputError;
						if (_v1.$ === 'Just') {
							var error = _v1.a;
							return A2(
								$elm$html$Html$pre,
								_List_Nil,
								_List_fromArray(
									[
										$elm$html$Html$text(error)
									]));
						} else {
							return $elm$html$Html$text('');
						}
					}()
					]),
				function () {
					var _v2 = model.part;
					if (_v2.$ === 'A') {
						return _List_Nil;
					} else {
						return _List_fromArray(
							[
								A2(
								$elm$html$Html$div,
								_List_Nil,
								_List_fromArray(
									[
										$elm$html$Html$text(
										'3D Position: ' + $elm$core$Debug$toString(model.positionB))
									])),
								A2(
								$elm$html$Html$div,
								_List_Nil,
								_List_fromArray(
									[
										$elm$html$Html$text(
										'3D Direction: ' + $elm$core$Debug$toString(model.directionB))
									])),
								A2(
								$elm$html$Html$div,
								_List_Nil,
								_List_fromArray(
									[
										$elm$html$Html$text(
										'3D Direction key: ' + $elm$core$Debug$toString(
											A2($author$project$AB$getDirectionKey, model.sideLength, model.positionB)))
									]))
							]);
					}
				}()));
	});
var $elm$virtual_dom$VirtualDom$keyedNodeNS = F2(
	function (namespace, tag) {
		return A2(
			_VirtualDom_keyedNodeNS,
			namespace,
			_VirtualDom_noScript(tag));
	});
var $elm$svg$Svg$Keyed$node = $elm$virtual_dom$VirtualDom$keyedNodeNS('http://www.w3.org/2000/svg');
var $elm$svg$Svg$Attributes$viewBox = _VirtualDom_attribute('viewBox');
var $elm$svg$Svg$Attributes$fill = _VirtualDom_attribute('fill');
var $elm$core$String$fromFloat = _String_fromNumber;
var $elm$svg$Svg$trustedNode = _VirtualDom_nodeNS('http://www.w3.org/2000/svg');
var $elm$svg$Svg$g = $elm$svg$Svg$trustedNode('g');
var $elm$svg$Svg$Attributes$height = _VirtualDom_attribute('height');
var $author$project$AB$itemToColor = function (item) {
	if (item.$ === 'Floor') {
		return 'rgba(0, 0, 255, 0.5)';
	} else {
		return 'white';
	}
};
var $elm$svg$Svg$rect = $elm$svg$Svg$trustedNode('rect');
var $elm$svg$Svg$Attributes$width = _VirtualDom_attribute('width');
var $elm$svg$Svg$Attributes$x = _VirtualDom_attribute('x');
var $elm$svg$Svg$Attributes$y = _VirtualDom_attribute('y');
var $author$project$AB$viewMap = function (map) {
	return A2(
		$elm$svg$Svg$g,
		_List_Nil,
		A2(
			$elm$core$List$map,
			function (_v0) {
				var _v1 = _v0.a;
				var x = _v1.a;
				var y = _v1.b;
				var item = _v0.b;
				return A2(
					$elm$svg$Svg$rect,
					_List_fromArray(
						[
							$elm$svg$Svg$Attributes$x(
							$elm$core$String$fromFloat(x - 0.5)),
							$elm$svg$Svg$Attributes$y(
							$elm$core$String$fromFloat(y - 0.5)),
							$elm$svg$Svg$Attributes$width('1'),
							$elm$svg$Svg$Attributes$height('1'),
							$elm$svg$Svg$Attributes$fill(
							$author$project$AB$itemToColor(item))
						]),
					_List_Nil);
			},
			$elm$core$Dict$toList(map)));
};
var $elm$svg$Svg$Attributes$d = _VirtualDom_attribute('d');
var $elm$svg$Svg$path = $elm$svg$Svg$trustedNode('path');
var $elm$svg$Svg$Attributes$style = _VirtualDom_attribute('style');
var $elm$svg$Svg$Attributes$transform = _VirtualDom_attribute('transform');
var $author$project$AB$viewPosition = F4(
	function (fps, color, _v0, direction) {
		var x = _v0.a;
		var y = _v0.b;
		var rotation = function () {
			switch (direction.$) {
				case 'Up':
					return 90;
				case 'Down':
					return 270;
				case 'Left':
					return 0;
				default:
					return 180;
			}
		}();
		return A2(
			$elm$svg$Svg$path,
			_List_fromArray(
				[
					$elm$svg$Svg$Attributes$d('m-0.5,0 l1,-0.5 l0,1 z'),
					$elm$svg$Svg$Attributes$fill(color),
					$elm$svg$Svg$Attributes$transform(
					'translate(' + ($elm$core$String$fromInt(x) + (' ' + ($elm$core$String$fromInt(y) + (') rotate(' + ($elm$core$String$fromInt(rotation) + ')')))))),
					$elm$svg$Svg$Attributes$style(
					'transition: transform ' + ($elm$core$String$fromFloat(1000 / fps) + 'ms ease'))
				]),
			_List_Nil);
	});
var $author$project$AB$viewSvg = F3(
	function (position, direction, model) {
		var padding = 2;
		var history = function () {
			var _v2 = model.part;
			if (_v2.$ === 'A') {
				return model.historyA;
			} else {
				return A2(
					$elm$core$List$map,
					function (_v3) {
						var positionB = _v3.a;
						var directionB = _v3.b;
						return A3($author$project$AB$getPositionAndDirectionBtoA, model, positionB, directionB);
					},
					model.historyB);
			}
		}();
		var _v0 = model;
		var bounds = _v0.bounds;
		var viewBox = $elm$svg$Svg$Attributes$viewBox(
			A2(
				$elm$core$String$join,
				' ',
				A2(
					$elm$core$List$map,
					$elm$core$String$fromInt,
					_List_fromArray(
						[bounds.xMin - padding, bounds.yMin - padding, (bounds.xMax - bounds.xMin) + (2 * padding), (bounds.yMax - bounds.yMin) + (2 * padding)]))));
		return A3(
			$elm$svg$Svg$Keyed$node,
			'svg',
			_List_fromArray(
				[viewBox]),
			A2(
				$elm$core$List$cons,
				_Utils_Tuple2(
					'viewMap',
					$author$project$AB$viewMap(model.map)),
				A2(
					$elm$core$List$cons,
					_Utils_Tuple2(
						'viewPosition',
						A4($author$project$AB$viewPosition, model.fps, 'magenta', position, direction)),
					A2(
						$elm$core$List$indexedMap,
						F2(
							function (index, _v1) {
								var position_ = _v1.a;
								var direction_ = _v1.b;
								return _Utils_Tuple2(
									'historyPosition' + $elm$core$String$fromInt(index),
									A4($author$project$AB$viewPosition, model.fps, 'cyan', position_, direction_));
							}),
						history))));
	});
var $author$project$AB$view = function (model) {
	var _v0 = function () {
		var _v1 = model.part;
		if (_v1.$ === 'A') {
			return _Utils_Tuple2(model.positionA, model.directionA);
		} else {
			return A3($author$project$AB$getPositionAndDirectionBtoA, model, model.positionB, model.directionB);
		}
	}();
	var position = _v0.a;
	var direction = _v0.b;
	return A2(
		$elm$html$Html$div,
		_List_Nil,
		_List_fromArray(
			[
				A3($author$project$AB$viewSvg, position, direction, model),
				A3($author$project$AB$viewControls, position, direction, model)
			]));
};
var $author$project$AB$main = $elm$browser$Browser$element(
	{init: $author$project$AB$init, subscriptions: $author$project$AB$subscriptions, update: $author$project$AB$update, view: $author$project$AB$view});
_Platform_export({'AB':{'init':$author$project$AB$main(
	$elm$json$Json$Decode$succeed(_Utils_Tuple0))(0)}});}(this));