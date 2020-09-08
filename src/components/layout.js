import React from "react"
import "../static/styles/fonts.css"
import styled from "styled-components"

const LayoutContainer = styled.div`
  max-width: 768px;
  padding-left: 4em;
  padding-right: 4em;
  margin: 0 auto;

  @media (max-width: 768px) {
    padding-left: 2em;
    padding-right: 2em;
  }

  @media (max-width: 600px) {
    padding-left: 1em;
    padding-right: 1em;
  }

  .Layout__content {
    padding-bottom: 5em;
    max-width: 512px;
  }
`

const Layout = ({ children }) => (
    <LayoutContainer className="div">
    <div className="Layout">
        <main className="Layout__content">{children}</main>
    </div>
    </LayoutContainer>
)

export default Layout