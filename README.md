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
r.define("Grandmother", {
    init: function(v0) {
        this.v0 = v0;
    },
    set: function(v1, v2, v3) {
        this.v1 = v1;
        this.v2 = v2;
        this.v3 = v3;
    }
});

r.define("Parent", {
    inherit: "Grandmother",
    set: function(v1, v2) {
        this.superCall("Grandmother", "set", v1, v2, "v3");
    }
});

r.define("Child", {
    inherit: "Parent",
    set: function(v1) {
        this.superCall("Grandmother", "set", v1, "v2", "v3");
    }
});

var grandmother = r.create("Grandmother", "v0");
grandmother.set("a", "b", "c");

var parent = r.create("Parent", "v0");
parent.set("a", "b");

var child = r.create("Child", "v0");
child.set("a");

var child2 = r.create("Child", "v0");
child2.set("a");
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
