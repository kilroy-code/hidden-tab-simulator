# Hidden-tab Simulator

Provides a function, `simulateVisibility(state)`, that can be used in unit tests to simulate a browser tab being hidden or being revealed.

It also abstracts out the API by which an implementation can respond to the tab being hidden or revealed. The reason for providing the pair together is so that the entire mechanism can be simulated in NodeJS, so that implementations AND their unit tests can be written to work in browsers and NodeJS.

## Exports

### async simulateVisibility(state, delayInMilliseconds) => promise resolving to whether state is 'visible'.

Makes the browser's `document` (or this package's `hidableDocument` object) behave as if the tab had been hidden or visible, depending on state (which must be either the string 'hidden' or 'visible').

The function does not resolve until `delayInMilliseconds` has passed. The default value is the amount of time that [Croquet](https://croquet.io/) might take before it responds to a revealed tab (currently 2 seconds).


### hidableDocument

An object that has `addEventListener()` and `removeEventListener()` methods, and a visibilityState property, that all behave appropriately for uses of `simulateVisibility()`.

In a browser, `hidableDocument` is simply the `window.document` object.

In NodeJS, `hidableDocument` is a very minimal object with the three necessary properties. E.g., it might not be a true EventTarget (as NodeJS doesn't currently expose this class to application code), and the add/removeEventListener properties are not general. All they are guaranteed to do is to arrange for the specified handler to fire (or not) when `simulateVisibility()` is called.