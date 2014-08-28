/**
 * @module rulus.class
 * @copyright Copyright (C) 2009-2014 Rulus GmbH. All rights reserved.
 * @license Released under the MIT license
 * 
 * @author @devhd
 * @maintainer @andrejev
 * @opensource
 * @public
 */

(function() {
    var UNDEFINED, global = this,
        r = {},
        RULUS = "rulus",
        globalRulus = global.rulus,
        rulusClass = {},
        merge, indexOf, slice = Array.prototype.slice,
        isArray, isObject, toString = Object.prototype.toString,
        isPlainObject, TRUE = !0,
        FALSE = !1,
        NUMBER = "number",
        STRING = "string",
        FUNCTION = "function",
        registryDefine = {},
        registryConfig = {},
        invoke, define = global.define;

    /**
     * check if it's an array
     *
     * @function isArray
     * @param {object} obj object to check
     * @return {boolean}
     */
    isArray = function(obj) {
        return toString.call(obj) == "[object Array]";
    };

    /** 
     * check if it's an Object
     *
     * @function isObject
     * @param {object} obj object to check
     * @return {boolean}
     */
    isObject = function(obj) {
        return toString.call(obj) == "[object Object]";
    };

    /**
     * run a function if it exists
     *
     * @function invoke
     * @param {Function} func
     * @return {} return of func or undefined
     */
    invoke = function(func) {
        if (typeof func == FUNCTION) {
            // ignore first argument (a function)
            return func.apply(this, slice.call(arguments, 1, arguments.length));
        }
    };

    /**
     * check if it's a plain object
     *
     * @function isPlainObject
     * @param {object} obj object to check
     * @return {boolean}
     */
    isPlainObject = function(obj) {
        return (!!obj && isObject(obj) && obj != global && !obj.nodeType);
    };

    /**
     * merge two or more objects
     * deep copy can be activated using first parameter
     *
     * @function merge
     */
    merge = function() {
        var deep = typeof arguments[0] === "boolean" | 0,
            args = slice.call(arguments, deep),
            destination, source, len = args.length,
            i, key, value, destinationDeep;
        if (len && (destination = args[0])) {
            for (i = 0; ++i < len;) {
                if ((source = args[i]) && source != destination) {
                    for (key in source) {
                        if ((value = source[key]) !== UNDEFINED) {
                            if (deep) {
                                destinationDeep = destination[key];
                                if (isArray(value)) {
                                    destination[key] = merge(TRUE, isArray(destinationDeep) ? destinationDeep : [], value);
                                } else if (isPlainObject(value)) {
                                    destination[key] = merge(TRUE, isPlainObject(destinationDeep) ? destinationDeep : {}, value);
                                } else {
                                    destination[key] = value;
                                }
                            } else {
                                destination[key] = value;
                            }
                        }
                    }
                }
            }
            return destination;
        }
        return {};
    };

    /**
     * Return the position of the value
     *
     * @function indexOf
     *
     * @param {Object} arr
     * @param {Object} searchElement
     * @param {Object} fromIndex
     * @return {number} position of the value
     */
    indexOf = function(arr, searchElement, fromIndex) {
        var t, len, typeofArr = typeof arr;
        if (typeofArr === NUMBER || arr === null || arr === UNDEFINED) {
            throw new TypeError("r.indexOf: bad type");
        }
        // string has its own indexOf method
        if (typeofArr === STRING) {
            return arr.indexOf(searchElement, fromIndex);
        }
        t = Object(arr);
        len = t.length | 0;
        if (len) {
            for (fromIndex = Math.min(Math.abs(fromIndex | 0), len); fromIndex < len; fromIndex++) {
                if (fromIndex in t && t[fromIndex] === searchElement) {
                    return fromIndex;
                }
            }
        }
        return -1;
    };

    /**
     * Check if one object type is a descendant of all specified ancestor types.
     *
     *   r.isDescendant(descendantType, ancestorType1, [ancestorType2, ...])
     *   r.isDescendant(descendantObj, ancestorObj1, [ancestorObj2, ...])
     *
     * @function isDescendant
     *
     * @example
     *   r.isDescendant("kid.object", "parent.object") === true
     *   r.isDescendant("kid.object", "other.object") === false
     *   r.isDescendant("kid.object", "parent1.object", "parent2.object") === true
     * @return {boolean}
     */
    r.isDescendant = function() {
        var i, inheritAll, ancestorType, ret = TRUE,
            args = arguments,
            len = args.length;
        // object type or an object comes as a first argument
        var objType = args[0];
        if (objType.rulus) {
            // if this is a Rulus object
            objType = objType.type;
        }
        inheritAll = r.config(objType).inheritList;
        // start from the second argument (from ancestor type)
        for (i = 0; ++i < len;) {
            ancestorType = args[i];
            if (ancestorType.rulus) {
                // if this is a Rulus object
                ancestorType = ancestorType.type;
            }
            if (indexOf(inheritAll, ancestorType) == -1) {
                ret = FALSE;
                break;
            }
        }
        return ret;
    };

    /**
     * Check if the object is child from an given type or object is from the same type as the given type
     *
     * @function isInstanceOf
     *
     * @example
     *  r.isInstanceOf("object", "parent.object") === true
     *  r.isInstanceOf("object", "same.object") === true
     *  r.isInstanceOf("object", "kid.object") === false
     * @return {boolean}
     */
    r.isInstanceOf = function(obj1, obj2) {
        return obj1 && obj2 && ((obj1 === obj2) || (obj1.type && obj1.type == obj2) || (obj1.type && obj2.type && obj1.type == obj2.type) || r.isDescendant(obj1, obj2));
    };

    /**
     * Define a shortcut method for object creation
     *
     * @function  shortCreate
     *
     * @example
     * //standard:
     *     var r1 = r.create("robot");
     *     var r2 = r.create("robot");
     *
     * //with a shortcut method:
     *     r.robot = r.shortCreate("robot");
     *     var r1 = r.robot();
     *     var r2 = r.robot();
     *
     * @param {string} type
     * @return {object} created object
     */
    r.shortCreate = function(type) {
        return function() {
            // append arguments to the object type name
            var args = slice.call(arguments, 0);
            args.unshift(type);
            return r.create.apply(this, args);
        };
    };

    /**
     * Method to define new object types
     *
     * @function define
     *
     * @param {string} type
     * @param {object} options
     * @return {boolean}
     */
    rulusClass.define = r.define = function(type, options) {
        // check if the object was already processed
        if (registryDefine[type] !== UNDEFINED) {
            // r.log.error(RULUS + ': redifinition of the object type "%s".', type);
            return FALSE;
        }
        // store new object type in the Rulus configuration registry
        registryDefine[type] = options;
        return TRUE;
    };

    r.define.get = function(type) {
        return registryDefine[type];
    };

    // processed object configurations registry
    /**
     * Check if object type is a descendant of all specified ancestor types.
     *
     *   obj.isDescendant(ancestorType1, [ancestorType2, ...])
     *   obj.isDescendant(ancestorObj1, [ancestorObj2, ...])
     *
     * @function isDescendant
     *
     * @example
     *   kidObject.isDescendant("parent.object") === true
     *   kidObject.isDescendant("parent.object", "other.object") === false
     * @return r.isDescendant.apply(r, args);
     */
    rulusClass.isDescendant = function() {
        var args = slice.call(arguments, 0);
        // add object as a first argument
        args.unshift(this);
        // call Rulus method
        return r.isDescendant.apply(r, args);
    };

    /**
     * Check if the object is child from an given type or object is from the same type as the given type
     *
     * @function isInstanceOf
     *
     * @example
     *  object.isInstanceOf("parent.object") === true
     *  object.isInstanceOf(other.object") === true
     *  object.isInstanceOf("kid.object") === false
     * @return r.IsInstanceOf.apply(r, args);
     */
    rulusClass.isInstanceOf = function() {
        var args = slice.call(arguments, 0);
        // add object as a first argument
        args.unshift(this);
        // call Rulus method
        return r.isInstanceOf.apply(r, args);
    };

    /**
     * Call parent method
     *
     * @function superCall
     *
     * @example
     *   this.superCall("main.parent", "myMethod", args1, args2, args3)
     * @param {Object} parentName
     * @param {Object} methodName
     *
     */
    rulusClass.superCall = function(parentName, methodName) {
        var that = this,
            parentConfig, method;
        if (indexOf(r.config(that.type).inheritList, parentName) != -1) {
            if ((parentConfig = r.config(parentName)) && typeof(method = parentConfig[methodName]) === FUNCTION) {
                method = parentConfig[methodName];
                return method.apply(that, slice.call(arguments, 2));
            }
        } else {
            r.log.error("'" + parentName + "' is not superclass from '" + that.type + "'");
        }
    };

    /**
     * Method to process the definition of the new object types
     *
     * @function defineProcess
     *
     * @param {String} type
     * @param {Object} options
     */
    rulusClass.defineProcess = function(type, options) {
        // check if the object was already processed
        if (registryConfig[type] !== UNDEFINED) {
            // r.log.error(RULUS + ': bad try to redefine the object type "%s"', type);
            return FALSE;
        }
        // store new object type in the Rulus configuration registry
        registryConfig[type] = {
            rulus: TRUE,
            // object structure isn't yet defined
            defined: FALSE,
            // method to call a function if it's defined
            invoke: invoke,
            superCall: rulusClass.superCall,
            isDescendant: rulusClass.isDescendant,
            isInstanceOf: rulusClass.isInstanceOf
        };
        // extend object definition
        return r.config(type, options);
    };

    /*
     * Find all parent (inherit) objects recursively
     *
     * @function getInheritAllInternal
     *
     * @param {Object} Rulus object
     * @return {Object} Rulus inherit (parents) dictionary: {"parent1": true, "parent2": true}
     */
    rulusClass.getInheritAllInternal = function(obj, inheritList) {
        var inherit = obj.inherit,
            i, singleInherit, len;
        inheritList = inheritList || {};
        if (inherit !== UNDEFINED) {
            if (isArray(inherit)) {
                // array value
                for (i = -1, len = inherit.length; ++i < len;) {
                    singleInherit = inherit[i];
                    rulusClass.getInheritAllInternal(r.config(singleInherit), inheritList);
                    inheritList[singleInherit] = TRUE;
                }
            } else {
                // string value
                rulusClass.getInheritAllInternal(r.config(inherit), inheritList);
                inheritList[inherit] = TRUE;
            }
        }
        return inheritList;
    };

    /*
     * Find all parent (inherit) objects as an array
     *
     * @function getInheritAll
     *
     * @param {Object} Rulus object
     * @return {Object} Rulus parents (inherit) array [parent1, parent2]
     */
    rulusClass.getInheritAll = function(obj) {
        var parents = [],
            parents_list = rulusClass.getInheritAllInternal(obj),
            i;
        for (i in parents_list) {
            parents.push(i);
        }
        return parents;
    };

    /*
     * Extend object configuration with inherit configuration
     *
     * @function extentObjConfig
     * @param {Object} objConfig
     * @param {String} inheritName (parent)
     */
    rulusClass.extentObjConfig = function(objConfig, inheritName) {
        var inheritConfigClone = merge({}, r.config(inheritName));
        // Remove base methods before inherit from a parent to not to call these many times in a child
        delete inheritConfigClone.initClass;
        delete inheritConfigClone.init;
        merge(TRUE, objConfig, inheritConfigClone);
    };
    /**
     * Get Object prototype
     * 
     * @function config
     * @param {String} type
     * @return {Object} objs prototype
     */
    r.config = rulusClass.config = function(type, options) {
        var objConfig = registryConfig[type],
            objectPrototype, inherit, objDef;
        // return object definition if no options defined
        if (options === UNDEFINED) {
            if (objConfig !== UNDEFINED) {
                return objConfig;
            }

            // use object definition to configure it
            objDef = r.define.get(type);
            // check if the object was already defined
            if (objDef === UNDEFINED) {
                return FALSE;
            }
            // loadIntern can start the definition of the object
            // for the second time if this object will be created
            // in loaded module
            if (registryConfig[type] === UNDEFINED) {
                // process object definition
                rulusClass.defineProcess(type, objDef);
            }

            return registryConfig[type];
        }

        // check if the object was already defined
        if (objConfig === UNDEFINED) {
            return rulusClass.defineProcess(type, options);
        }

        // extend object definition
        inherit = options.inherit;
        if (inherit !== UNDEFINED) {
            if (isArray(inherit)) {
                // array value
                for (var i = -1, inheritLen = inherit.length; ++i < inheritLen;) {
                    rulusClass.extentObjConfig(objConfig, inherit[i]);
                }
            } else {
                // string value
                rulusClass.extentObjConfig(objConfig, inherit);
            }
        }

        // extend object prototype from options
        merge(TRUE, objConfig, options, {
            type: type
        });


        // check and run initClass function
        if (typeof options.initClass == FUNCTION) {
            options.initClass.call(objConfig);
        }

        // create object prototype
        objectPrototype = merge(TRUE, {}, objConfig);

        // create object constructor
        objConfig.rulusConstructor = function() {};
        objConfig.rulusConstructor.prototype = objectPrototype;

        delete objectPrototype.defined;
        delete objectPrototype.inheritList;
        delete objectPrototype.rulusConstructor;

        // object structure is defined yet
        objConfig.defined = TRUE;

        // get all ancestor names
        objConfig.inheritList = rulusClass.getInheritAll(objConfig);

        return TRUE;
    };

    /**
     *  Extend the objects prototype
     *
     * @function config.extend
     * @param {String} objType
     * @param {Object} objConfigUpdate
     *
     * @return {Boolean}
     */
    rulusClass.config.extend = function(objType, objConfigUpdate) {
        var objConfigDefined;
        if (typeof objType == STRING && typeof isObject(objConfigUpdate) && (objConfigDefined = r.config(objType))) {
            //r.log.info("Update config of '" + objType + "'");
            merge(TRUE, objConfigDefined, objConfigUpdate);
            registryConfig[objType].rulusConstructor.prototype = objConfigDefined;
            return TRUE;
        }
        return FALSE;
    };

    /**
     * Get list with all defined Objects
     *
     * @example
     *   r.config.find();
     *   r.config.find(function(objType){return objType != "example.type"});
     *   r.config.find(function(objType){return r.isDescendant (objType,"example.type")});
     *
     * @function config.find
     * @param {Function} func - filter function
     *
     * @return {Array}
     */
    rulusClass.config.find = function(func) {
        var objs = [],
            objType, isFunc = (typeof func == FUNCTION);
        for (objType in registryConfig) {
            if (registryConfig[objType].defined) {
                if (isFunc) {
                    func.call(this, objType) && objs.push(objType);
                } else {
                    objs.push(objType);
                }
            }
        }
        return objs;
    };

    // methods called in r.create()
    rulusClass.objConstructor = function(obj, createdBy, args, objConfig) {
        var iInherit = -1,
            inheritList = objConfig.inheritList,
            inheritLen = inheritList.length,
            func, configInh;
        // set create context in
        obj.createdBy = createdBy;

        while ((++iInherit < inheritLen) && (configInh = r.config(inheritList[iInherit]))) {
            func = configInh.init;
            if (typeof func == FUNCTION) {
                func.apply(obj, args);
            }
        }
        if (typeof obj.init == FUNCTION) {
            obj.init.apply(obj, args);
        }
        return obj;
    };

    /**
     * Create new Rulus object.
     *
     * @function create
     *
     * @example
     *     var obj = r.create("robot");
     *     var obj = r.create("robot", {test: true});
     *     var obj = r.create({type: "robot", test: true});
     *
     * @param {object} type  object to create
     */
    rulusClass.create = r.create = function(type) {
        // store called this in object settings
        var createdBy = this,
            firstArg, loadType, objConfig, args, argsIn = arguments;
        // begin to process object arguments (starting from 0)
        firstArg = 1;
        // type of the object to create
        loadType = type;

        // check if it's not a string
        if (typeof loadType != STRING) {
            if (!loadType) {
                //r.log.error("Object type is unknown");
                return UNDEFINED;
            }

            // try to get object type from dictionary
            loadType = loadType.type;
            if (!loadType) {
                //r.log.error("Object type is unknown");
                return UNDEFINED;
            }
            // zero argument is already an object argument
            firstArg = 0;
        }

        objConfig = r.config(loadType);
        if (objConfig === UNDEFINED || !objConfig.defined) {
            return UNDEFINED;
        }

        // ignore first argument (object type name) if exist
        args = slice.call(argsIn, firstArg, argsIn.length);

        return rulusClass.objConstructor(new objConfig.rulusConstructor, createdBy, args, objConfig);
    };

    // export some methods
    r.isArray = isArray;
    r.isObject = isObject;
    r.invoke = invoke;
    r.isPlainObject = isPlainObject;
    r.merge = merge;
    r.indexOf = indexOf;
    r.rulusClass = rulusClass;

    if (globalRulus == UNDEFINED) {
        global[RULUS] = global.r = r;
        // if AMD logic is available
        if (typeof define == FUNCTION && define.amd) {
            // define as an AMD module
            define(RULUS, [], function() {
                return r;
            });
        }
    } else {
        merge(globalRulus, r);
        globalRulus.require && globalRulus.require.set("rulus/rulus.class");
    }
})();
