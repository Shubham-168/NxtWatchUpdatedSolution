import {Link, withRouter} from 'react-router-dom'

import React from 'react'
import Popup from 'reactjs-popup'

import Cookies from 'js-cookie'
import NxtContext from '../../context/NxtContext'
import {MainHeaderContainer, LogoImage, LogoutButton} from './styledComponents'

const Header = props => (
  <NxtContext.Consumer>
    {value => {
      const {isDark, toggleDarkMode} = value

      const onToggleTheme = () => {
        toggleDarkMode()
      }

      const onLogout = () => {
        const {history} = props
        Cookies.remove('jwt_token')
        history.replace('/login')
      }

      const logoUrl = isDark
        ? 'https://assets.ccbp.in/frontend/react-js/nxt-watch-logo-dark-theme-img.png'
        : 'https://assets.ccbp.in/frontend/react-js/nxt-watch-logo-light-theme-img.png'

      return (
        <li>
          <MainHeaderContainer isDark={isDark}>
            <Link to="/">
              <LogoImage src={logoUrl} alt="website logo" />
            </Link>
            <div>
              <button type="button" data-testid="theme" onClick={onToggleTheme}>
                {' '}
                Theme{' '}
              </button>
              <img
                src="https://assets.ccbp.in/frontend/react-js/nxt-watch-profile-img.png"
                alt="profile"
              />
              <Popup
                trigger={<LogoutButton isDark={isDark}> Logout </LogoutButton>}
                modal
                nested
              >
                {close => (
                  <div>
                    <p> Are you sure, you want to logout </p>

                    <button
                      onClick={() => {
                        close()
                      }}
                    >
                      Cancel
                    </button>
                    <button type="button" onClick={onLogout}>
                      Confirm
                    </button>
                  </div>
                )}
              </Popup>
            </div>
          </MainHeaderContainer>
        </li>
      )
    }}
  </NxtContext.Consumer>
)

export default withRouter(Header)
