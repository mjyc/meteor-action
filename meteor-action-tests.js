// Import Tinytest from the tinytest Meteor package.
import { Tinytest } from "meteor/tinytest";

// Import and rename a variable exported by meteor-action.js.
import { name as packageName } from "meteor/meteor-action";

// Write your tests here!
// Here is an example.
Tinytest.add('meteor-action - example', function (test) {
  test.equal(packageName, "meteor-action");
});
