window._ = {};

/**
 * 工具方法命名空间
 */
_.utils = {};

/**
 * Utils
 * 随机字符串 
 * @param {Object} n
 * @param {Object} u
 */
_.utils.randStr = function(n, u){
    var tmStr = "abcdefghijklmnopqrstuvwxyz0123456789";
    var Len = tmStr.length;
    var Str = "";
    for (i = 1; i < n + 1; i++) {
        Str += tmStr.charAt(Math.random() * Len);
    }
    return (u ? Str.toUpperCase() : Str);
};

/*!
 * klass: a classical JS OOP façade
 * https://github.com/ded/klass
 * License MIT (c) Dustin Diaz & Jacob Thornton 2012
 */
!function(name, definition){
    _[name] = definition();
}('Klass', function(){
    var context = this, old = context.klass, f = 'function', fnTest = /xyz/.test(function(){
        xyz
    }) ? /\bsupr\b/ : /.*/, proto = 'prototype'
    
    function klass(o){
        return extend.call(isFn(o) ? o : function(){
        }, o, 1)
    }
    
    function isFn(o){
        return typeof o === f
    }
    
    function wrap(k, fn, supr){
        return function(){
            var tmp = this.supr
            this.supr = supr[proto][k]
            var ret = fn.apply(this, arguments)
            this.supr = tmp
            return ret
        }
    }
    
    function process(what, o, supr){
        for (var k in o) {
            if (o.hasOwnProperty(k)) {
                what[k] = isFn(o[k]) &&
                isFn(supr[proto][k]) &&
                fnTest.test(o[k]) ? wrap(k, o[k], supr) : o[k]
            }
        }
    }
    
    function extend(o, fromSub){
        // must redefine noop each time so it doesn't inherit from previous arbitrary classes
        function noop(){
        }
        noop[proto] = this[proto]
        var supr = this, prototype = new noop(), isFunction = isFn(o), _constructor = isFunction ? o : this, _methods = isFunction ? {} : o
        function fn(){
            if (this.initialize) 
                this.initialize.apply(this, arguments)
            else {
                fromSub || isFunction && supr.apply(this, arguments)
                _constructor.apply(this, arguments)
            }
        }
        
        fn.methods = function(o){
            process(prototype, o, supr)
            fn[proto] = prototype
            return this
        }
        
        fn.methods.call(fn, _methods).prototype.constructor = fn
        
        fn.extend = arguments.callee
        fn[proto].implement = fn.statics = function(o, optFn){
            o = typeof o == 'string' ? (function(){
                var obj = {}
                obj[o] = optFn
                return obj
            }()) : o
            process(this, o, supr)
            return this
        }
        
        return fn
    }
    
    klass.noConflict = function(){
        context.klass = old
        return this
    }
    context.klass = klass
    
    return klass
});

/*!
 * event: Backbone.event
 * Todo: 针对特定对象trigger
 */
!function(name, definition){
    _[name] = definition();
}("Events", function(){
    // Events
    // -----------------
    // Thanks to:
    //  - https://github.com/documentcloud/backbone/blob/master/backbone.js
    //  - https://github.com/joyent/node/blob/master/lib/events.js
    
    // Regular expression used to split event strings
    var eventSplitter = /\s+/;
    
    // A module that can be mixed in to *any object* in order to provide it
    // with custom events. You may bind with `on` or remove with `off` callback
    // functions to an event; `trigger`-ing an event fires all callbacks in
    // succession.
    //
    //     var object = new Events();
    //     object.on('expand', function(){ alert('expanded'); });
    //     object.trigger('expand');
    //
    function Events(){
    }
    
    // Bind one or more space separated events, `events`, to a `callback`
    // function. Passing `"all"` will bind the callback to all events fired.
    Events.prototype.on = function(events, callback, context){
        var cache, event, list;
        if (!callback) 
            return this;
        
        cache = this.__events || (this.__events = {});
        events = events.split(eventSplitter);
        
        while (event = events.shift()) {
            list = cache[event] || (cache[event] = []);
            list.push(callback, context);
        }
        
        return this;
    };
    
    // Remove one or many callbacks. If `context` is null, removes all callbacks
    // with that function. If `callback` is null, removes all callbacks for the
    // event. If `events` is null, removes all bound callbacks for all events.
    Events.prototype.off = function(events, callback, context){
        var cache, event, list, i, len;
        
        // No events, or removing *all* events.
        if (!(cache = this.__events)) 
            return this;
        if (!(events || callback || context)) {
            delete this.__events;
            return this;
        }
        
        events = events ? events.split(eventSplitter) : keys(cache);
        
        // Loop through the callback list, splicing where appropriate.
        while (event = events.shift()) {
            list = cache[event];
            if (!list) 
                continue;
            
            if (!(callback || context)) {
                delete cache[event];
                continue;
            }
            
            for (i = 0, len = list.length; i < len; i += 2) {
                if (!(callback && list[i] !== callback ||
                context && list[i + 1] !== context)) {
                    list.splice(i, 2);
                }
            }
        }
        return this;
    };
    
    // Trigger one or many events, firing all bound callbacks. Callbacks are
    // passed the same arguments as `trigger` is, apart from the event name
    // (unless you're listening on `"all"`, which will cause your callback to
    // receive the true name of the event as the first argument).
    Events.prototype.trigger = function(events){
        var cache, event, all, list, i, len, rest = [], args;
        if (!(cache = this.__events)) 
            return this;
        
        events = events.split(eventSplitter);
        
        // Using loop is more efficient than `slice.call(arguments, 1)`
        for (i = 1, len = arguments.length; i < len; i++) {
            rest[i - 1] = arguments[i];
        }
        
        // For each event, walk through the list of callbacks twice, first to
        // trigger the event, then to trigger any `"all"` callbacks.
        while (event = events.shift()) {
            // Copy callback lists to prevent modification.
            if (all = cache.all) 
                all = all.slice();
            if (list = cache[event]) 
                list = list.slice();
            
            // Execute event callbacks.
            if (list) {
                for (i = 0, len = list.length; i < len; i += 2) {
                    list[i].apply(list[i + 1] || this, rest);
                }
            }
            
            // Execute "all" callbacks.
            if (all) {
                args = [event].concat(rest);
                for (i = 0, len = all.length; i < len; i += 2) {
                    all[i].apply(all[i + 1] || this, args);
                }
            }
        }
        
        return this;
    };
    
    // Mix `Events` to object instance or Class function.
    Events.mixTo = function(receiver){
        receiver = receiver.prototype || receiver;
        var proto = Events.prototype;
        
        for (var p in proto) {
            if (proto.hasOwnProperty(p)) {
                receiver[p] = proto[p];
            }
        }
    };
    
    // Helpers
    // -------
    
    var keys = Object.keys;
    
    if (!keys) {
        keys = function(o){
            var result = [];
            
            for (var name in o) {
                if (o.hasOwnProperty(name)) {
                    result.push(name);
                }
            }
            return result;
        }
    }
    return Events;
});

/*!
 * log: console.log
 */
!function(name, definition){
    _[name] = definition();
}("log", function(){
    function log(){
        window.console && console.log && console.log.apply(console, arguments);
    }
    return log;
});

/*!
 * Simple View.
 * Version: .1
 *
 * Dependency: {klass} {backbone.event}
 * View其实是复用程度很低的一块, 随交互设计的变化而变化, 实现难度也与交互设计稿的难易程度相关.
 * 选择适当的Dom操作类库, 在此基础上实现Dom元素的事件绑定.
 * 根据模板的复杂程度选择适当的模板引擎.
 */
!function(name, definition){
    _[name] = definition();
}("View", function(){
    var SimpleView = _.Klass({
        /** 
         * 初始化, 可由子类扩展
         */
        initialize: function(){
            this._id = 'V' + _.utils.randStr(8);
        },
        /** 
         * 订阅接口, 自己实现
         */
        subscribe: function(){
        
        },
        /** 
         * 事件绑定, 自己实现
         */
        bind: function(){
        
        }
    });
    _.Events.mixTo(SimpleView);
    return SimpleView;
});

// Function bind
// from UnderscoreJs

// Create a function bound to a given object (assigning `this`, and arguments,
// optionally). Binding with arguments is also known as `curry`.
// Delegates to **ECMAScript 5**'s native `Function.bind` if available.
// We check for `func.bind` first, to fail fast when `func` is undefined.
!function(name, definition){
    _[name] = definition();
}("bind", function(){
    return function(func, context) {
        var nativeBind = Function.prototype.bind,
            nativeSlice = Array.prototype.slice,
            ctor = function(){},
            bound, args;
        if (func.bind === nativeBind && nativeBind) return nativeBind.apply(func, nativeSlice.call(arguments, 1));
        //if (!_.isFunction(func)) throw new TypeError;
        args = nativeSlice.call(arguments, 2);
        return bound = function() {
            if (!(this instanceof bound)) return func.apply(context, args.concat(nativeSlice.call(arguments)));
            ctor.prototype = func.prototype;
            var self = new ctor;
            var result = func.apply(self, args.concat(nativeSlice.call(arguments)));
            if (Object(result) === result) return result;
            return self;
        };
    };
});


/**
 * Underscore Template
 */
// By default, Underscore uses ERB-style template delimiters, change the
// following template settings to use alternative delimiters.
_.templateSettings = {
    evaluate: /<%([\s\S]+?)%>/g,
    interpolate: /<%=([\s\S]+?)%>/g,
    escape: /<%-([\s\S]+?)%>/g
};

// JavaScript micro-templating, similar to John Resig's implementation.
// Underscore templating handles arbitrary delimiters, preserves whitespace,
// and correctly escapes quotes within interpolated code.
!function(name, definition){
    _[name] = definition();
}("template", function(){
    return function(text, data){
        // When customizing `templateSettings`, if you don't want to define an
        // interpolation, evaluation or escaping regex, we need one that is
        // guaranteed not to match.
        var noMatch = /.^/;
        
        // Certain characters need to be escaped so that they can be put into a
        // string literal.
        var escapes = {
            '\\': '\\',
            "'": "'",
            r: '\r',
            n: '\n',
            t: '\t',
            u2028: '\u2028',
            u2029: '\u2029'
        };
        
        for (var key in escapes) 
            escapes[escapes[key]] = key;
        var escaper = /\\|'|\r|\n|\t|\u2028|\u2029/g;
        var unescaper = /\\(\\|'|r|n|t|u2028|u2029)/g;
        
        // Within an interpolation, evaluation, or escaping, remove HTML escaping
        // that had been previously added.
        var unescape = function(code){
            return code.replace(unescaper, function(match, escape){
                return escapes[escape];
            });
        };
        
        var settings = _.templateSettings;
        
        // Compile the template source, taking care to escape characters that
        // cannot be included in a string literal and then unescape them in code
        // blocks.
        var source = "__p+='" +
        text.replace(escaper, function(match){
            return '\\' + escapes[match];
        }).replace(settings.escape || noMatch, function(match, code){
            return "'+\n((__t=(" + unescape(code) + "))==null?'':_.escape(__t))+\n'";
        }).replace(settings.interpolate || noMatch, function(match, code){
            return "'+\n((__t=(" + unescape(code) + "))==null?'':__t)+\n'";
        }).replace(settings.evaluate || noMatch, function(match, code){
            return "';\n" + unescape(code) + "\n__p+='";
        }) +
        "';\n";
        
        // If a variable is not specified, place data values in local scope.
        if (!settings.variable) 
            source = 'with(obj||{}){\n' + source + '}\n';
        
        source = "var __t,__p='',__j=Array.prototype.join," +
        "print=function(){__p+=__j.call(arguments,'')};\n" +
        source +
        "return __p;\n";
        
        var render = new Function(settings.variable || 'obj', '_', source);
        if (data) 
            return render(data, _);
        var template = function(data){
            return render.call(this, data, _);
        };
        
        // Provide the compiled function source as a convenience for precompilation.
        template.source = 'function(' + (settings.variable || 'obj') + '){\n' + source + '}';
        
        return template;
    }
});

