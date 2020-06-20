import React from "react";
import PropTypes from "prop-types";
import { Transition } from "react-transition-group";

const defaultStyle = {
  transition: `transform 500ms, opacity 500ms ease`,
  opacity: 1,
};

const Animate = (props) => (
  <Transition
    in={props.in}
    
    timeout={props.timeout || {
      appear: 100,
      enter: 300,
      exit: 300,
    }}
    appear
    unmountOnExit
  >
    {(state) => {
      let animationStyle = defaultStyle;

      if (props.transitionStyles) {
        animationStyle = {
          ...animationStyle,
          ...props.transitionStyles[state],
        };
      }

      return <div style={animationStyle}>{props.children}</div>;
    }}
  </Transition>
);

Animate.propTypes = {
  in: PropTypes.bool.isRequired,
  transitionStyles: PropTypes.object,
};

export default Animate;
