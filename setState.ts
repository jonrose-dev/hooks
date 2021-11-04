type Setter<S> = (value: S) => void;

type State<S> = Record<string, { state: S[]; setters: Setter<S>[] }>;

let cursor = {} as Record<string, number>;
let state: State<any> = {};
type Component = Function & { key: string; reRenderRequired: boolean };
const ReactCurrentDispatcher: { current: Component | null } = { current: null }

function useState<T>(initialValue: T) {
  const caller = ReactCurrentDispatcher.current as Component;
  const { key } = caller;
  cursor[key] = (cursor[key] ?? -1) + 1
  const index = cursor[key];
  const isInitial = (state?.[key]?.state.length ?? 0) - 1 < index;

  if (isInitial) {
    const newState = state[key]?.state ?? [];
    newState[index] = initialValue;
    state[key] = {
      state: newState,
      setters: [
        (value: T) => {
          state[key].state[index] = value;
          caller.reRenderRequired = true;
        }
      ]
    }
  }
  return [state[key].state[index], state[key].setters[index]]
}

// Your component
interface IProps {
    bar: string;
}
const Foo = (props: IProps) => {
  const [foo, setFoo] = useState('foo');
  if (foo == 'foo') {
    const [bar] = useState(props.bar);
  }
  const [baz] = useState('baz');

  console.log({foo});
  console.log({bar});
  console.log({baz});
  if (foo === 'foo') {
    setFoo('foo 2');
  }
  console.log({foo});

  return 'Some Return';
}

// Unique key for each instance of component
Foo.key = '$$SomeUniqueKey';

// Flag indicating if re-rendering is required
// Naive approach
Foo.reRenderRequired = false;


// Some render process
// For this example, we only care about
// resetting the current cursor position
// and resetting reRenderRequired
Foo.render = () => {
  // Some Render Process

  // Prep for next render
  cursor[Foo.key] = -1;
  Foo.reRenderRequired = false;
}



// ReactDOM
// First render
// Set dispatcher
ReactCurrentDispatcher.current = Foo;

let component = Foo({ bar: 'bar' });
// Simplification of re-render logic.
// This is a naive approach to demonstrate the core concept
if (Foo.reRenderRequired) {
  console.log('RE Rendering')
  Foo.render();
}

// Second Render
ReactCurrentDispatcher.current = Foo;
component = Foo({ bar: 'bar2' });
if (Foo.reRenderRequired) {
  console.log('RE Rendering')
  Foo.render();
}