###rulus.class — object-oriented layer for JavaScript
***

Object-oriented layer (OOP) as an independent JavaScript library

- 1.6 KB (minified & gzipped), 3.9 KB (minified)
- usage in many business projects
- open-sourced base module of Rulus Framework

###Examples

####Integrate rulus.class into your HTML page

```html
<script src="rulus.class.js"></script>
```

####Define and manage your objects in JavaScript

```js
r.define("c1", {
    init: function(v0) {
        this.v0 = v0;
    },
    set: function(v1, v2, v3) {
        this.v1 = v1;
        this.v2 = v2;
        this.v3 = v3;
    }
});

r.define("c2", {
    inherit: "c1",
    set: function(v1, v2) {
        this.superCall("c1", "set", v1, v2, "v3");
    }
});

r.define("c3", {
    inherit: "c2",
    set: function(v1) {
        this.superCall("c1", "set", v1, "v2", "v3");
    }
});

var c1 = r.create("c1", "v0");
c1.set("a", "b", "c");

var c2 = r.create("c2", "v0");
c2.set("a", "b");

var c3 = r.create("c3", "v0");
c3.set("a");

var c3i2 = r.create("c3", "v0");
c3i2.set("a");
```

###License
***

Released under the MIT license

Copyright (C) 2009-2015 Rulus GmbH, rulus.com

You are free to use the rulus.class as long as the copyright header is left intact.

###Backed by business
***

rulus.class was originally developed and is actually supported by Rulus GmbH

[Homepage](https://rulus.com)

[Subscribe to newsletter](https://rulus.com/#!/newsletter)

[Legal notice](https://rulus.com/#!/impressum)
