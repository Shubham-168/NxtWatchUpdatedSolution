import {Component} from 'react'

import Cookies from 'js-cookie'
import NxtContext from '../../context/NxtContext'
import {
  LoginMainContainer,
  MainContainer,
  LogoImage,
  FormContainer,
  Label,
  Button,
} from './styledComponents'

import './index.css'

class Login extends Component {
  state = {
    username: '',
    password: '',
    errorMsg: '',
    showErrorMsg: false,
    showPassword: false,
  }

  onSuccess = jwtToken => {
    const {history} = this.props
    Cookies.set('jwt_token', jwtToken, {expires: 30})
    history.replace('/')
  }

  onFailure = errorMsg => {
    this.setState({
      showErrorMsg: true,
      errorMsg,
    })
  }

  onSubmitForm = async () => {
    const {username, password} = this.state
    const userDetails = {username, password}
    const options = {
      method: 'POST',
      body: JSON.stringify(userDetails),
    }
    const apiLoginUrl = 'https://apis.ccbp.in/login'
    const response = await fetch(apiLoginUrl, options)
    const data = await response.json()
    if (response.ok === true) {
      this.onSuccess(data.jwt_token)
    } else {
      this.onFailure(data.error_msg)
    }
  }

  onChangeUsername = event => {
    this.setState({username: event.target.value})
  }

  onChangePassword = event => {
    this.setState({password: event.target.value})
  }

  onClickCheckbox = () => {
    this.setState(prevState => ({showPassword: !prevState.showPassword}))
  }

  render() {
    const {username, password, errorMsg, showErrorMsg, showPassword} =
      this.state

    const {history} = this.props
    const jwtToken = Cookies.get('jwt_token')
    if (jwtToken !== undefined) {
      history.replace('/')
    }

    return (
      <NxtContext.Consumer>
        {value => {
          const {isDark} = value
          const logoUrl = isDark
            ? 'https://assets.ccbp.in/frontend/react-js/nxt-watch-logo-dark-theme-img.png'
            : 'https://assets.ccbp.in/frontend/react-js/nxt-watch-logo-light-theme-img.png'
          return (
            <LoginMainContainer isDark={isDark}>
              <MainContainer isDark={isDark}>
                <LogoImage src={logoUrl} alt="website logo" />
                <FormContainer onSubmit={this.onSubmitForm}>
                  <Label
                    htmlFor="usernameId"
                    className={isDark ? 'dark-text' : 'light-text'}
                  >
                    USERNAME
                  </Label>
                  <input
                    type="text"
                    id="usernameId"
                    placeholder="Username"
                    value={username}
                    onChange={this.onChangeUsername}
                  />

                  <Label
                    htmlFor="passwordId"
                    className={isDark ? 'dark-text' : 'light-text'}
                  >
                    {' '}
                    PASSWORD{' '}
                  </Label>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    id="passwordId"
                    placeholder="Password"
                    value={password}
                    onChange={this.onChangePassword}
                  />

                  <input
                    type="checkbox"
                    id="checkboxId"
                    onClick={this.onClickCheckbox}
                  />
                  <Label
                    htmlFor="checkboxId"
                    className={isDark ? 'dark-text' : 'light-text'}
                  >
                    {' '}
                    Show Password{' '}
                  </Label>
                  <br />
                  <Button type="submit">Login</Button>
                </FormContainer>
                {showErrorMsg ? <p> {errorMsg} </p> : null}
              </MainContainer>
            </LoginMainContainer>
          )
        }}
      </NxtContext.Consumer>
    )
  }
}

export default Login
