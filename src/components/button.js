import React, { Component } from "react"
import styled from "styled-components"

const ButtonContainer = styled("button")`
  padding: 0.5em 0.5em;
  background: #73abff;
  font-weight: 600;
  color: white;
  outline: none;
  border: none;
  border-radius: 4px;
  font-size: 1rem;
  position: relative;
  transition: background 100ms ease-in-out;
  margin: 0.5em;
  margin-top: 0;

  @media (max-width: 600px) {
    padding: 0.8em 1.8em;
    font-size: 1em;
  }

  p {
    margin: 0;
  }

  &:before {
    content: "";
    position: absolute;
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;
    background: linear-gradient(
      135deg,
      #ffa7ff 0%,
      #c495ff 100%
    );
    border-radius: 4px;
    z-index: -1;
  }

  &:hover {
    cursor: pointer;
    background: transparent;
    transition: background 100ms ease-in-out;
  }

  &.Button-secondary {
    background: #e3efff;
    color: #5393fe;
    font-weight: 600;
    text-decoration: none;
    margin-left: auto;

    &:hover {
      background: #cbdfff;
      transition: background 100ms ease-in-out;
    }
  }
`

class Button extends Component {
  render() {
    const { children, ...props } = this.props
    return (
      <ButtonContainer onClick={this.props.onClick} {...props}>
        {this.props.children}
      </ButtonContainer>
    )
  }
}

export default Button
