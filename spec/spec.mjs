import {hidableDocument, simulateVisibility} from '../index.mjs';

function noop() {};

describe("Hidden-tab Simulator", function () {

  describe("asserts", function () { // Just to prevent typos.
    const caughtIndicator = 'something';
    it("if simulateVisibility is not passed 'visible' or 'hidden'.", async function () {
      expect(await (simulateVisibility('not visible or hidden').catch(_ => caughtIndicator))).toBe(caughtIndicator);
    });
  });

  describe("simulateVisibility", function () {
    describe("calls handler immediately", function () {
      let isVisible;
      function captureState() {
	isVisible = hidableDocument.visibilityState;
      };
      beforeAll(function () {
	hidableDocument.addEventListener('visibilitychange', captureState);
      });
      afterAll(async function () {
	hidableDocument.removeEventListener('visibilitychange', captureState);
	isVisible = 'garbage';
	await simulateVisibility('hidden');
	expect(isVisible).toBe('garbage'); // Handler not called after removal.
      });
      it("when hidden.", async function () {
	await simulateVisibility('visible');
	isVisible = 'garbage'
	const promise = simulateVisibility('hidden');
	expect(isVisible).toBe('hidden');
	expect(await promise).toBeFalsy();
      });
      it("when visible.", async function () {
	await simulateVisibility('hidden');
	isVisible = 'garbage'
	const promise = simulateVisibility('visible');
	expect(isVisible).toBe('visible');
	expect(await promise).toBeTruthy();
      });
    });
  });
});
