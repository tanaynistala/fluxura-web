import React from "react"
import styled from "styled-components"

import "../static/styles/fonts.css"
import "../static/styles/form.scss"
import Layout from "../components/layout"
import Button from "../components/button"

export default class Home extends React.Component {
  state = {
    order: 1,
    precision: 2,
    timeInit: 0,
    timeFinal: 1,
    timeInt: 0.01,
    a: 0,
    b: 0,
    c: 0,
    d: 0,
    f0: 0,
    f1: 0,
    f2: 0,
    answer: []
  }

  onSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    let model = this.state.order == 1 ? this.ODEModel1 : (this.state.order == 2 ? this.ODEModel2 : this.ODEModel3);
    let x0 = [this.state.f0, this.state.f1, this.state.f2];
    let t = [this.state.timeInit, this.state.timeFinal, this.state.timeInt];
    let params = [this.state.a, this.state.b, this.state.c, this.state.d];
    let output = this.RungeKutta(model, x0, t, params);

    this.setState({
      answer: output[1][output[1].length - 1].map(x => x.toFixed(this.state.precision))
    });
  }

  handleInputChange = event => {
    const target = event.target
    const value = target.value
    const name = target.name

    this.setState({
      [name]: value as number,
    })
  }

  getParams() {
    switch (this.state.order) {
      case 1:
        return ["a", "b"];
      case 2:
        return ["a", "b", "c"];
      case 3:
        return ["a", "b", "c", "d"];
    
      default:
        break;
    }
  }

  ODEModel1(t: number, x: Array<number>, params: Array<number>) {
    let xDot: Array<number> = [Number(params[0]*x[0]) + Number(params[1])];
    return xDot
  }

  ODEModel2(t: number, x: Array<number>, params: Array<number>) {
    let xDot: Array<number> = [x[1], (Number(params[0] * x[1]) + Number(params[1] * x[0]) + Number(params[2]))];
    return xDot
  }

  ODEModel3(t: number, x: Array<number>, params: Array<number>) {
    let xDot: Array<number> = [x[1], x[2], (Number(params[0] * x[2]) + Number(params[1] * x[1]) + Number(params[2] * x[0]) + Number(params[3]))];
    return xDot
  }

  RungeKutta(model: (t: number, x: Array<number>, params: Array<number>) => Array<number>, x0: Array<number>, t: Array<number>, params: Array<number>) {
    // Create timestamps array
    let timestamps: Array<number> = [];
    let currentT: number = t[0];
    while (currentT < t[1]) {
      timestamps.push(currentT);
      currentT = currentT + t[2];
    }

    // Get number of intervals and variables, initialize main array
    const intervals = timestamps.length
    const varCount = x0.length
    let x = Array(intervals).fill(Array<number>(varCount).fill(0.0));
    x[0] = x0

    // Iterate over every interval
    for (let k = 0; k < intervals-1; k++) {
      const k1: Array<number> = model(timestamps[k], x[k], params).map(x => x * t[2]);

      let k15: Array<number> = [];
      for (let index in x[k]) {
        k15.push(Number(x[k][index]) + Number(k1[index] / 2));
      }
      const k2: Array<number> = model(Number(timestamps[k]) + Number(t[2]) / 2, k15, params).map(x => x * t[2]);

      let k25: Array<number> = [];
      for (let index in x[k]) {
        k25.push(Number(x[k][index]) + Number(k2[index]) / 2);
      }
      const k3: Array<number> = model(Number(timestamps[k]) + Number(t[2]), k25, params).map(x => x * t[2]);

      let k35: Array<number> = [];
      for (let index in x[k]) {
        k35.push(Number(x[k][index]) + Number(k1[index]));
      }
      const k4: Array<number> = model(Number(timestamps[k]) + Number(t[2]) / 2, k35, params).map(x => x * t[2]);

      // calculate dx for each index within k1...4 and use it to create x[k+1]
      for (let index in k1) {
        let dx = (Number(k1[index]) + Number(2 * k2[index]) + Number(2 * k3[index]) + Number(k4[index])) / 6
        x[k + 1][index] = Number(x[k][index]) + Number(dx);
      }
    }

    return [timestamps, x];
  }

  render() {
    return (
      <Layout>
        <Heading>Fluxura<span style={{fontSize: `24px`}}>web</span></Heading>
        <Subheading>Hey! 👋</Subheading>
        <Subheading>
          Welcome to the web version of <a href="https://apps.apple.com/in/app/fluxura/id1525196129" target="_blank">Fluxura</a>, an app we developed to solve differential equations.
        </Subheading>
        <Subheading>Learn more about it <a href="https://tanaynistala.github.io/fluxura-landing-page" target="_blank">here</a>.</Subheading>
        <Form onSubmit={this.onSubmit}>
          <Container>
            <Subheading style={{margin: `0 auto 0.5em auto`}}>Configuration</Subheading>
            <div className="config-grid">
              <Label htmlFor="order">Order</Label>
              <Input
                name="order"
                type="number"
                min={1}
                max={3}
                id="order"
                placeholder="1"
                onChange={this.handleInputChange}
                style={{width: `96px`, marginLeft: `auto`}}
              />
              <Label htmlFor="precision">Decimal Places</Label>
              <Input
                name="precision"
                type="number"
                min={0}
                max={10}
                id="precision"
                placeholder="2"
                onChange={this.handleInputChange}
                style={{ width: `96px`, marginLeft: `auto` }}
              />
            </div>
          </Container>
          <Container>
            <Subheading style={{margin: `0 auto 0.5em auto`}}>Time Span</Subheading>
            <div className="form-grid">
              <Label htmlFor="timeInit">Initial&nbsp;Time</Label>
              <Input
                name="timeInit"
                type="number"
                step={0.01}
                id="timeInit"
                placeholder="0"
                onChange={this.handleInputChange}
              />
              <Label htmlFor="timeFinal">Final&nbsp;Time</Label>
              <Input
                name="timeFinal"
                type="number"
                step={0.01}
                id="timeFinal"
                placeholder="1"
                onChange={this.handleInputChange}
              />
              <Label htmlFor="timeInt">Time&nbsp;Interval</Label>
              <Input
                name="timeInt"
                type="number"
                step={0.01}
                id="timeInt"
                placeholder="0.01"
                onChange={this.handleInputChange}
              />
            </div>
          </Container>
          <Container>
            <Subheading style={{margin: `0 auto 0.5em auto`}}>Parameters</Subheading>
            <div className="form-grid">
              <Label htmlFor="a">a</Label>
              <Input name="a" type="number" step={0.01} id="a" placeholder="0" onChange={this.handleInputChange}/>
              <Label htmlFor="b">b</Label>
              <Input name="b" type="number" step={0.01} id="b" placeholder="0" onChange={this.handleInputChange}/>
              {this.state.order > 1 ? (
                <>
                <Label htmlFor="c">c</Label>
                <Input name="c" type="number" step={0.01} id="c" placeholder="0" onChange={this.handleInputChange} />
                </>
              ) : (<></>)}
              {this.state.order > 2 ? (
                <>
                  <Label htmlFor="d">d</Label>
                  <Input name="d" type="number" step={0.01} id="d" placeholder="0" onChange={this.handleInputChange} />
                </>
              ) : (<></>)}
            </div>
          </Container>
          <Container>
            <Subheading style={{margin: `0 auto 0.5em auto`}}>Initial Condition{this.state.order == 1 ? "" : "s"}</Subheading>
            <div className="form-grid">
              <Label htmlFor="f-0">f(x)</Label>
              <Input
                name="f0"
                type="number"
                step={0.01}
                id="f0"
                placeholder="0"
                onChange={this.handleInputChange}
              />
              {this.state.order > 1 ? (
                <>
                  <Label htmlFor="">f'(x)</Label>
                  <Input name="f1" type="number" step={0.01} id="f1" placeholder="0" onChange={this.handleInputChange} />
                </>
              ) : (<></>)}
              {this.state.order > 2 ? (
                <>
                  <Label htmlFor="f2">f''(x)</Label>
                  <Input name="f2" type="number" step={0.01} id="f2" placeholder="0" onChange={this.handleInputChange} />
                </>
              ) : (<></>)}
            </div>
          </Container>
          <CustomButton type="submit">
            Evaluate<span>&#8594;</span>
          </CustomButton>
        </Form>

        {this.state.answer.length == 0 ? (<></>) : (
          <Container>
            <Subheading style={{margin: `0 auto 0.5em auto`}}>Answer{this.state.order == 1 ? "" : "s"}</Subheading>
            <div className="form-grid">
              <Label>f(0)</Label>
              <AnswerContainer>{this.state.answer[0]}</AnswerContainer>
              {this.state.order > 1 ? (
                <>
                  <Label>f(1)</Label>
                  <AnswerContainer>{this.state.answer[1]}</AnswerContainer>
                </>
              ) : (<></>)}
              {this.state.order > 2 ? (
                <>
                  <Label>f(2)</Label>
                  <AnswerContainer>{this.state.answer[2]}</AnswerContainer>
                </>
              ) : (<></>)}
            </div>
          </Container>
        )}
      </Layout>
    )
  }
}

const Container = styled.div`
  border: 1px solid #f2f2f2;
  padding: 1.5em;
  margin: 0.5em;
  border-radius: 8px;
  text-decoration: none;
  display: flex;
  flex-direction: column;
  box-shadow: 0px 9px 24px rgba(0, 0, 0, 0.06);
  transition: all 150ms ease-in-out;

  &:hover {
    box-shadow: 0px 9px 24px rgba(0, 0, 0, 0.1);
    transition: all 150ms ease-in-out;
  }

  .form-grid {
    display: grid;
    grid-template-columns: auto 1fr;
  }

  .config-grid {
    display: grid;
    grid-template-columns: auto 1fr;
  }
`

const Heading = styled.h3`
  font-size: 40px;

  span {
    vertical-align: 0.25em;
    color: #fff;
    padding: 4px 8px;
    background: #73abff;
    border-radius: 8px;
    margin: 0.25em 0.5em;
  }
`

const Subheading = styled.h5`
  font-size: 24px;
  margin: 0.75em 0;
  margin-top: 0.25em;
`

const Form = styled.form<{ hasError: string }>`
  position: relative;
  display: flex;
  flex-direction: column;
`

const Label = styled.label`
  position: relative;
  padding: 13px 21px;
`

const AnswerContainer = styled.div`
  position: relative;
  background: #f2f2f2;
  padding: 13px 21px;
  border: none;
  border-radius: 4px;
  color: #071435;
  margin-bottom: 4px;
`

const Input = styled.input<{ hasError: string }>`
  position: relative;
  background: #f2f2f2;
  padding: 13px 21px;
  border: none;
  border-radius: 4px;
  color: #071435;
  font-size: 16px;
  margin-left: auto;

  @media (max-width: 600px) {
    max-width: 144px;
  }

  ::placeholder {
    color: #a9aaab;
    opacity: 1;
  }

  :-ms-input-placeholder {
    color: #a9aaab;
  }

  ::-ms-input-placeholder {
    color: #a9aaab;
  }
`

const CustomButton = styled(Button)`
  font-weight: 600;
  font-size: 16px;
  line-height: 1.9;
  text-decoration: none;
  padding: 4px 16px;
  margin: 2em auto;

  @media (max-width: 767) {
    position: relative;
    height: 60px;
    width: 100%;
    top: 0;
    left: 0;
    border: none;
    border-radius: 0;
    border-top: 1px solid #a9aaab;
  }

  span {
    margin-left: 1em;
    transform: translateX(-4px);
    display: inline-block;
    transition: all 400ms ease-in-out;
  }

  &:hover {
    span {
      transform: translateX(4px);
      transition: all 150ms ease-in-out;
    }
  }
`