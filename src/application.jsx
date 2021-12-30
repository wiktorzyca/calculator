import React from 'react';
import { Grid } from 'semantic-ui-react'
import DisplayHexadecimal from './display_hex'
import DisplayDecimal from './display_dec'
import DisplayOctal from './display_oct'
import DisplayBinary from './display_bin'
import DisplayResult from './display_result'
import Keypad from './keypad'
import Information from './information'
import { DATA_TYPE } from './constants'

class Application extends React.Component
{
  constructor(params) {
    super(params);

    this.state = {
      value: 0,
      data: [
        // { type: DATA_TYPE.VALUE, value: '1234', },
        // { type: DATA_TYPE.OPERATION, value: '+', },
        // { type: DATA_TYPE.VALUE, value: '4321', },
      ],
      rpn: []

    }
  }

  change_value = (v) => {
    this.setState({
      value: v,
    });
  }

  handle_data = (d) => {
    const newState = Object.assign({}, this.state);

    if (newState.data.length === 0) {
      if (d.type === DATA_TYPE.VALUE || d.value==='(') {
        newState.data.push(d);
        this.setState(newState);
      }
      return;
    }

    const lastIndex = newState.data.length - 1;
    const lastItem = newState.data[lastIndex];
    const isOperation = (element) => {
      return (DATA_TYPE.OPERATION === element.type);
    };

    let opera = ['+', '-', '*', '/', '%']
    let naw = ['(', ')']

    if (isOperation(lastItem) && isOperation(d)) {
      // console.log('2 operatowy', typeof lastItem, (opera.includes(lastItem.value) && naw.includes(d.value)), (opera.includes(d.value) && naw.includes(lastItem.value)))
      if((opera.includes(d.value) && lastItem.value===')')){
         console.log('2 ')
        newState.data.push(d);
        this.setState(newState);
      }
      return;
    }

    if (!isOperation(lastItem) && !isOperation(d)) {
      lastItem.value += d.value;
      this.setState(newState);
      return;
    }

    newState.data.push(d);
    this.setState(newState);

  }

  getRPN = () => {
    let operators= []
    let output=  []
    let data = this.state.data
    let operator;


    for(let i = 0; i<data.length; i++){
      console.log( output, operators)

      let value = data[i].value
      console.log(value)

      if(value === '+' || value === '-'){
        console.log("operacja + lub -")
        if (operators.length) {
          operator = operators.pop();
          while (operator && operator !== '(') {
            output.push(operator);
            operator = operators.pop();
          }
          if (operator) {
            operators.push(operator);
          }
        }
        operators.push(value);
        continue

      }
       if(value === '*' || value === '/'){
        console.log("operacja * lub /")
        if (operators.length) {
          operator = operators.pop();
          while (operator && operator !== '(' && operator !== '+' && operator !== '-') {
            output.push(operator);
            operator = operators.pop();
          }
          if (operator) {
            operators.push(operator);
          }
        }
        operators.push(value);

      }
      if(value === '('){
        console.log(" ( do operatorow")
        operators.push(value);

      }
       if(value === ')'){
        console.log(' ) ')
        operator = operators.pop();
        while (operator !== '(') {
          output.push(operator);
          operator = operators.pop();
        }

      }
      if(value!= '/' && value!= '*' && value!= '(' && value!= ')' && value!= '+' && value!= '-' ){
        console.log("liczba do output")
        output.push(value);

      }


    }
    while (operators.length) {
      output.push(operators.pop());
    }

     console.log(output)
    this.state.rpn = output
    console.log(this.state)
    this.calculate()
  }

  calculate  = () => {
    let a, b
    let r = []

    for(let i=0; i<this.state.rpn.length; i++){
      let s = Object.assign([], this.state.rpn)
      if(Number.isInteger(parseInt(s[i]))){
        r.push(this.state.rpn[i])
      }
      else{
        a = r.pop()
        b = r.pop()
        switch (this.state.rpn[i]){
          case '+':
            r.push(parseInt(a)+parseInt(b))
            break
          case '-':
            r.push(parseInt(b)-parseInt(a))
            break
          case '/':
            r.push(parseInt(a)/parseInt(b))
            break
          case '*':
            r.push(parseInt(a)*parseInt(b))
            break
          case '%':
            r.push(parseInt(b)%parseInt(a))
            break
        }
      }
      console.log(r)
    }
    let newState = Object.assign({}, this.state)
    newState.value = r.pop()
    this.setState(newState)
    console.log(this.state)


  }

  render = () => {
    return (
      <Grid columns={2} textAlign='center' style={{ height: '100vh' }} verticalAlign='middle'>
        <Grid.Column style={{ maxWidth: 350 }}>
          <DisplayResult value={this.state.value} />
          <DisplayHexadecimal value={this.state.value} />
          <DisplayDecimal value={this.state.value} />
          <DisplayOctal value={this.state.value} />
          <DisplayBinary value={this.state.value} />
          <Keypad changeValueCallback={this.change_value} handleDataCallback={this.handle_data} calculate={()=>{this.getRPN()}}/>
        </Grid.Column>
        <Grid.Column style={{ maxWidth: 200 }}>
          <Information data={this.state.data} />
        </Grid.Column>
      </Grid>
    )
  }
}

export default Application;
