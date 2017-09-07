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
r.define("Human", {
    init: function() {
        this._gender = null
        this._power = null;
    },
    setGender: function(gender) {
        this._gender = gender;
    },
    getGender: function() {
        return this._gender;
    },
    setPower: function(power) {
        this._power = power;
    },
    getPower: function() {
        return this._power;
    }
});

r.define("Mother", {
    inherit: "Human",
    init: function() {
        this.setGender("female");
    }
});

r.define("Father", {
    inherit: "Human",
    init: function() {
        this.setGender("male");
    }
});

r.define("Child", {
    inherit: ["Mother", "Father"],
    init: function(gender) {
        this.setGender(gender);
    },
    setPower: function(power) {
        // set the double of power using a parent method
        this.superCall("Father", "setPower", 2 * power);
    }
});

var mother = r.create("Mother");
mother.setPower(80);

var father = r.create("Father");
father.setPower(100);

var child = r.create("Child", "male");
child.setPower(90);  // will be set to the double value (180)
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

[Legal notice](https://rulus.com/#!/impressum)
