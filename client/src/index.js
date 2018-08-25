import React, { Component } from 'react'
import ReactDOM from 'react-dom';
import 'semantic-ui-css/semantic.css'
import { Menu, Button } from 'semantic-ui-react'

export default class MenuExampleMenus extends Component {
  state = { activeItem: 'browse' }

  handleItemClick = (e, { name }) => this.setState({ activeItem: name })

  render() {
    const { activeItem } = this.state

    return (
      <Menu color='teal' inverted borderless stackable>
        <Menu.Item name='browse' active={activeItem === 'browse'} onClick={this.handleItemClick}>
          Browse
        </Menu.Item>

        <Menu.Item name='submit' active={activeItem === 'submit'} onClick={this.handleItemClick}>
          Submit
        </Menu.Item>

        <Menu.Menu position='right'>
          <Menu.Item>
            <Button primary inverted>Se connecter</Button>
          </Menu.Item>
        </Menu.Menu>
      </Menu>
    )
  }
}

ReactDOM.render(
  <MenuExampleMenus />, 
  document.querySelector('#root')
  )
