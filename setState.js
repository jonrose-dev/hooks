var cursor = {};
var state = {};
var ReactCurrentDispatcher = { current: null };
function useState(initialValue) {
    var _a, _b, _c, _d, _e;
    var caller = ReactCurrentDispatcher.current;
    var key = caller.key;
    cursor[key] = ((_a = cursor[key]) !== null && _a !== void 0 ? _a : -1) + 1;
    var index = cursor[key];
    var isInitial = ((_c = (_b = state === null || state === void 0 ? void 0 : state[key]) === null || _b === void 0 ? void 0 : _b.state.length) !== null && _c !== void 0 ? _c : 0) - 1 < index;
    if (isInitial) {
        var newState = (_e = (_d = state[key]) === null || _d === void 0 ? void 0 : _d.state) !== null && _e !== void 0 ? _e : [];
        newState[index] = initialValue;
        state[key] = {
            state: newState,
            setters: [
                function (value) {
                    state[key].state[index] = value;
                    caller.reRenderRequired = true;
                }
            ]
        };
    }
    return [state[key].state[index], state[key].setters[index]];
}
var Foo = function (props) {
    var _a = useState('foo'), foo = _a[0], setFoo = _a[1];
    if (foo == 'foo') {
        var bar = useState(props.bar)[0];
    }
    var baz = useState('baz')[0];
    console.log({ foo: foo });
    console.log({ bar: bar });
    console.log({ baz: baz });
    if (foo === 'foo') {
        setFoo('foo 2');
    }
    console.log({ foo: foo });
    return 'Some Return';
};
// Unique key for each instance of component
Foo.key = '$$SomeUniqueKey';
// Flag indicating if re-rendering is required
// Naive approach
Foo.reRenderRequired = false;
// Some render process
// For this example, we only care about
// resetting the current cursor position
// and resetting reRenderRequired
Foo.render = function () {
    // Some Render Process
    // Prep for next render
    cursor[Foo.key] = -1;
    Foo.reRenderRequired = false;
};
// ReactDOM
// First render
// Set dispatcher
ReactCurrentDispatcher.current = Foo;
var component = Foo({ bar: 'bar' });
// Simplification of re-render logic.
// This is a naive approach to demonstrate the core concept
if (Foo.reRenderRequired) {
    console.log('RE Rendering');
    Foo.render();
}
// Second Render
ReactCurrentDispatcher.current = Foo;
component = Foo({ bar: 'bar2' });
if (Foo.reRenderRequired) {
    console.log('RE Rendering');
    Foo.render();
}
