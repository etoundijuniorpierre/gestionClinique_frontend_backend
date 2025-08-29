// Polyfills pour les modules Node.js utilisés dans le navigateur
// Ce fichier doit être importé en premier dans main.jsx

// Polyfill pour global
if (typeof global === 'undefined') {
  window.global = window;
}

// Polyfill pour process
if (typeof process === 'undefined') {
  window.process = {
    env: {},
    browser: true,
    version: '',
    versions: {},
    platform: 'browser',
    nextTick: (fn) => Promise.resolve().then(fn),
    cwd: () => '/',
    chdir: () => {},
    umask: () => 0,
    hrtime: () => [0, 0],
    exit: () => {},
    kill: () => {},
    on: () => {},
    addListener: () => {},
    removeListener: () => {},
    removeAllListeners: () => {},
    setMaxListeners: () => {},
    getMaxListeners: () => 0,
    listeners: () => [],
    emit: () => false,
    listenerCount: () => 0,
    prependListener: () => {},
    prependOnceListener: () => {},
    eventNames: () => [],
  };
}

// Polyfill pour Buffer
if (typeof Buffer === 'undefined') {
  window.Buffer = {
    isBuffer: () => false,
    alloc: () => new Uint8Array(),
    allocUnsafe: () => new Uint8Array(),
    allocUnsafeSlow: () => new Uint8Array(),
    from: () => new Uint8Array(),
    concat: () => new Uint8Array(),
    byteLength: () => 0,
    compare: () => 0,
    copy: () => 0,
    fill: () => new Uint8Array(),
    includes: () => false,
    indexOf: () => -1,
    lastIndexOf: () => -1,
    read: () => 0,
    readDoubleBE: () => 0,
    readDoubleLE: () => 0,
    readFloatBE: () => 0,
    readFloatLE: () => 0,
    readInt8: () => 0,
    readInt16BE: () => 0,
    readInt16LE: () => 0,
    readInt32BE: () => 0,
    readInt32LE: () => 0,
    readUInt8: () => 0,
    readUInt16BE: () => 0,
    readUInt16LE: () => 0,
    readUInt32BE: () => 0,
    readUInt32LE: () => 0,
    slice: () => new Uint8Array(),
    subarray: () => new Uint8Array(),
    swap16: () => new Uint8Array(),
    swap32: () => new Uint8Array(),
    swap64: () => new Uint8Array(),
    toJSON: () => ({}),
    toString: () => '',
    write: () => 0,
    writeDoubleBE: () => 0,
    writeDoubleLE: () => 0,
    writeFloatBE: () => 0,
    writeFloatLE: () => 0,
    writeInt8: () => 0,
    writeInt16BE: () => 0,
    writeInt16LE: () => 0,
    writeInt32BE: () => 0,
    writeInt32LE: () => 0,
    writeUInt8: () => 0,
    writeUInt16BE: () => 0,
    writeUInt16LE: () => 0,
    writeUInt32BE: () => 0,
    writeUInt32LE: () => 0,
  };
}

// Polyfill pour crypto
if (typeof crypto === 'undefined') {
  window.crypto = {
    getRandomValues: (array) => {
      for (let i = 0; i < array.length; i++) {
        array[i] = Math.floor(Math.random() * 256);
      }
      return array;
    },
    subtle: {},
  };
}

// Polyfill pour util
if (typeof util === 'undefined') {
  window.util = {
    inherits: () => {},
    _extend: (obj, source) => {
      for (let key in source) {
        if (source.hasOwnProperty(key)) {
          obj[key] = source[key];
        }
      }
      return obj;
    },
    isArray: (arr) => Array.isArray(arr),
    isBoolean: (arg) => typeof arg === 'boolean',
    isNull: (arg) => arg === null,
    isNullOrUndefined: (arg) => arg === null || arg === undefined,
    isNumber: (arg) => typeof arg === 'number',
    isString: (arg) => typeof arg === 'string',
    isSymbol: (arg) => typeof arg === 'symbol',
    isUndefined: (arg) => arg === undefined,
    isRegExp: (arg) => Object.prototype.toString.call(arg) === '[object RegExp]',
    isObject: (arg) => typeof arg === 'object' && arg !== null,
    isDate: (arg) => Object.prototype.toString.call(arg) === '[object Date]',
    isError: (arg) => arg instanceof Error,
    isFunction: (arg) => typeof arg === 'function',
    isPrimitive: (arg) => {
      return arg === null ||
             typeof arg === 'boolean' ||
             typeof arg === 'number' ||
             typeof arg === 'string' ||
             typeof arg === 'symbol' ||
             typeof arg === 'undefined';
    },
    isBuffer: () => false,
  };
}

// Polyfill pour events
if (typeof EventEmitter === 'undefined') {
  window.EventEmitter = class EventEmitter {
    constructor() {
      this._events = {};
    }
    
    on(event, listener) {
      if (!this._events[event]) {
        this._events[event] = [];
      }
      this._events[event].push(listener);
      return this;
    }
    
    once(event, listener) {
      const onceWrapper = (...args) => {
        this.removeListener(event, onceWrapper);
        listener.apply(this, args);
      };
      return this.on(event, onceWrapper);
    }
    
    removeListener(event, listener) {
      if (!this._events[event]) return this;
      const index = this._events[event].indexOf(listener);
      if (index > -1) {
        this._events[event].splice(index, 1);
      }
      return this;
    }
    
    removeAllListeners(event) {
      if (event) {
        delete this._events[event];
      } else {
        this._events = {};
      }
      return this;
    }
    
    emit(event, ...args) {
      if (!this._events[event]) return false;
      this._events[event].forEach(listener => {
        listener.apply(this, args);
      });
      return true;
    }
  };
}

console.log('Polyfills chargés avec succès');
