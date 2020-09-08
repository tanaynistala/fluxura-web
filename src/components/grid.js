import React from "react"

import styled from "styled-components"

const GridLayout = styled("div")`
  display: grid;
  grid-template-columns: 1fr 3fr;

  @media (max-width: 600px) {
    grid-template-columns: 1fr;
  }
`

export default function Grid({ children }) {
  return <GridLayout>{children}</GridLayout>
}