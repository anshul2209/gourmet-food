import React from 'react';
import { Transition } from 'react-transition-group';

const defaultStyle = {
  transition: `transform 500ms, opacity 500ms ease`,
  opacity: 1
};
const transitionStyles = {
  entering: { transform: 'scale(0.5)', opacity: 0 },
  entered: { transform: 'scale(1)', opacity: 1 },
  exiting: { opacity: 0 },
  exited: { opacity: 0 }
};

const Animate = (props) => (
  <Transition
    in={props.in}
    timeout={{
      appear: 100,
      enter: 300,
      exit: 300
    }}
    appear
    unmountOnExit
  >
    {state => {
      return (<div style={{
        ...defaultStyle,
        ...transitionStyles[state]
      }}>
        {props.children}
      </div>)
    }}
  </Transition>
)

export default Animate;