// http://jsfiddle.net/antisanity/jcf5c/
function ObservableArray(items) {
    var _self = this,
        _array = [];

    _self.onItemAdded = null;
    _self.onItemSet = null;
    _self.onItemRemoved = null;

    function defineIndexProperty(index) {
        if (!(index in _self)) {
            Object.defineProperty(_self, index, {
                configurable: true,
                enumerable: true,
                get: function () {
                    return _array[index];
                },
                set: function (v) {
                    _array[index] = v;
                    if (typeof _self.onItemSet === "function") {
                        _self.onItemSet(index, v);
                    }
                }
            });
        }
    }

    _self.push = function () {
        var index;
        for (var i = 0, ln = arguments.length; i < ln; i++) {
            index = _array.length;
            _array.push(arguments[i]);
            defineIndexProperty(index);
            if (typeof _self.onItemAdded === "function") {
                _self.onItemAdded(index, arguments[i]);
            }
        }
        return _array.length;
    };

    _self.pop = function () {
        if (~_array.length) {
            var index = _array.length - 1,
                item = _array.pop();
            delete _self[index];
            if (typeof _self.onItemRemoved === "function") {
                _self.onItemRemoved(index, item);
            }
            return item;
        }
    };

    _self.unshift = function () {
        for (var i = 0, ln = arguments.length; i < ln; i++) {
            _array.splice(i, 0, arguments[i]);
            defineIndexProperty(_array.length - 1);
            if (typeof _self.onItemAdded === "function") {
                _self.onItemAdded(i, arguments[i]);
            }
        }
        return _array.length;
    };

    _self.shift = function () {
        if (~_array.length) {
            var item = _array.shift();
            _array.length === 0 && delete _self[index];
            if (typeof _self.onItemRemoved === "function") {
                _self.onItemRemoved(0, item);
            }
            return item;
        }
    };

    _self.splice = function (index, howMany /*, element1, element2, ... */ ) {
        var removed = [],
            item,
            pos;

        index = !~index ? _array.length - index : index;

        howMany = (howMany == null ? _array.length - index : howMany) || 0;

        while (howMany--) {
            item = _array.splice(index, 1)[0];
            removed.push(item);
            delete _self[_array.length];
            if (typeof _self.onItemRemoved === "function") {
                _self.onItemRemoved(index + removed.length - 1, item);
            }
        }

        for (var i = 2, ln = arguments.length; i < ln; i++) {
            _array.splice(index, 0, arguments[i]);
            defineIndexProperty(_array.length - 1);
            if (typeof _self.onItemAdded === "function") {
                _self.onItemAdded(index, arguments[i]);
            }
            index++;
        }

        return removed;
    };

    Object.defineProperty(_self, "length", {
        configurable: false,
        enumerable: true,
        get: function () {
            return _array.length;
        },
        set: function (value) {
            var n = Number(value);
            if (n % 1 === 0 && n >= 0) {
                if (n < _array.length) {
                    _self.splice(n);
                } else if (n > _array.length) {
                    _self.push.apply(_self, new Array(n - _array.length));
                }
            } else {
                throw new RangeError("Invalid array length");
            }
            return value;
        }
    });

    Object.getOwnPropertyNames(Array.prototype).forEach(function (name) {
        if (!(name in _self)) {
            Object.defineProperty(_self, name, {
                configurable: false,
                enumerable: true,
                writeable: false,
                value: Array.prototype[name]
            });
        }
    });

    if (items instanceof Array) {
        _self.push.apply(_self, items);
    }
}
/*

(function testing() {

    var x = new ObservableArray(["a", "b", "c"]);

    console.log(x.slice());

    x.onItemAdded = function (index, item) {
        console.log("Added "+item+" at index "+index+".");
    };
    x.onItemSet = function (index, item) {
        console.log("Set index "+index+" to "+item+".");
    };
    x.onItemRemoved = function (index, item) {
        console.log("Removed "+item+" at index "+index+".");
    };
    
    console.log(x.reverse().slice());
    
    
    x.splice(1, 2, "x");
    x[2] = "foo";

    x.length = 10;    
    console.log(x.slice());
    
    x.length = 2;
    
    
    x.push('g');
    console.log(x.slice());
    
    
    
    console.dir(x);

})();
*/

var bound;
$(function() {
	bound = ObservableArray([{ p: 37, name: 'Thom', set: [{letter: 'a', date:'1/1'}, {letter: 'b', date:'1/2'}, {letter: 'c', date:'1/3'}] }]);
	
    bound.onItemAdded = function (index, item) {
        console.log("Added "+item+" at index "+index+".");
    };
    bound.onItemSet = function (index, item) {
        console.log("Set index "+index+" to "+item+".");
    };
    bound.onItemRemoved = function (index, item) {
        console.log("Removed "+item+" at index "+index+".");
    };
	
});