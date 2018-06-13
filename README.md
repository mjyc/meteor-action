# Meteor Action

Meteor package for action, an interface for preemptable tasks, which is modeled after ROS's [actionlib](http://wiki.ros.org/actionlib).

Specifically, `WebActionServer` and `WebActionClient` are modeled after [SimpleActionServer](http://docs.ros.org/jade/api/actionlib/html/classactionlib_1_1simple__action__server_1_1SimpleActionServer.html) and [SimpleActionClinet](http://docs.ros.org/jade/api/actionlib/html/classactionlib_1_1simple__action__client_1_1SimpleActionClient.html) respectively.

## Example

```js
import { Meteor } from 'meteor/meteor';
import { Promise } from 'meteor/promise';

import { defaultAction, getActionServer, getActionClient } from 'meteor/mjyc:action';

const Actions = new Mongo.Collection('actions');


Meteor.startup(() => {

  // Both action server and client are dependent on a meteor collection
  const id = Actions.insert(defaultAction);
  // A class containing an action server instance
  class FibonacciAction {
    constructor() {
      this._as = getActionServer(Actions, id);
      this._as.registerGoalCallback(this.goalCB.bind(this));
      this._as.registerPreemptCallback(this.preemptCB.bind(this));

      this._intervalId = null;
      this._result = [];
    }

    goalCB(actionGoal) {
      this._result = [];
      this._result.push(0),
      this._result.push(1),
      this._intervalId = Meteor.setInterval(() => {
        const i = this._result.length - 1;
        if (i >= actionGoal.goal.order) {
          clearInterval(this._intervalId);
          this._as.setSucceeded({sequence: this._result});
        } else {
          this._result.push(this._result[i] + this._result[i - 1]);
          console.log('sequence:', this._result);
        }
      }, 1000);
    }

    preemptCB() {
      clearInterval(this._intervalId);
      this._as.setPreempted();
    }
  }
  // Instantiate the class defined above
  const server = new FibonacciAction();

  // Create an action client
  const ac = getActionClient(Actions, id);
  // Demonstrate preempting a running action
  Promise.await(ac.sendGoal({order: 5}));
  Meteor._sleepForMs(1000);
  ac.cancelGoal();
  Promise.await(ac.waitForResult());
  console.log('(preempted) result:', ac.getResult());
  // Or waiting until completion
  const run = async () => {
    await ac.sendGoal({order: 10});
    await ac.waitForResult();
    console.log('(succeeded) result:', ac.getResult());
  }
  run();

});
```
