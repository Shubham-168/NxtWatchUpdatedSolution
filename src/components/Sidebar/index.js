import {Link} from 'react-router-dom'

import NxtContext from '../../context/NxtContext'

import './index.css'

const Sidebar = () => (
  <NxtContext.Consumer>
    {value => {
      const {isDark} = value

      return (
        <div
          className={
            isDark
              ? 'main-sidebar-dark-container'
              : 'main-sidebar-light-container'
          }
        >
          <div>
            <Link to="/" className={isDark ? 'dark-text' : 'light-text'}>
              Home
            </Link>
            <br />
            <Link
              to="/trending"
              className={isDark ? 'dark-text' : 'light-text'}
            >
              Trending
            </Link>
            <br />
            <Link to="/gaming" className={isDark ? 'dark-text' : 'light-text'}>
              Gaming
            </Link>
            <br />
            <Link
              to="/saved-videos"
              className={isDark ? 'dark-text' : 'light-text'}
            >
              Saved Videos
            </Link>
            <br />
          </div>

          <div>
            <p className={isDark ? 'dark-text' : 'light-text'}> CONTACT US </p>
            <div>
              <img
                src="https://assets.ccbp.in/frontend/react-js/nxt-watch-facebook-logo-img.png"
                alt="facebook logo"
                className="contact-img"
              />
              <img
                src="https://assets.ccbp.in/frontend/react-js/nxt-watch-twitter-logo-img.png"
                alt="twitter logo"
                className="contact-img"
              />
              <img
                src="https://assets.ccbp.in/frontend/react-js/nxt-watch-linked-in-logo-img.png"
                alt="linked in logo"
                className="contact-img"
              />
            </div>
            <p className={isDark ? 'dark-text' : 'light-text'}>
              {' '}
              Enjoy! Now to see your channels and recommendations!{' '}
            </p>
          </div>
        </div>
      )
    }}
  </NxtContext.Consumer>
)

export default Sidebar
