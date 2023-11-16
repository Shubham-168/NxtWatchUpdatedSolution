import {Component} from 'react'
import Cookies from 'js-cookie'
import Loader from 'react-loader-spinner'

import Header from '../Header'
import Sidebar from '../Sidebar'
import VideoCard from '../VideoCard'
import NxtContext from '../../context/NxtContext'

import {StyledContainer} from './styledComponents'

import './index.css'

const apiStatusConstants = {
  initial: 'INITIAL',
  success: 'SUCCESS',
  failure: 'FAILURE',
  in_progress: 'IN_PROGRESS',
}

class Gaming extends Component {
  state = {
    gameList: [],
    apiStatus: apiStatusConstants.initial,
  }

  componentDidMount() {
    this.getGamingVideos()
  }

  getGamingVideos = async () => {
    this.setState({apiStatus: apiStatusConstants.in_progress})
    const jwtToken = Cookies.get('jwt_token')
    const apiUrl = `https://apis.ccbp.in/videos/gaming`
    const options = {
      headers: {
        Authorization: `Bearer ${jwtToken}`,
      },
      method: 'GET',
    }
    const response = await fetch(apiUrl, options)
    if (response.ok === true) {
      const fetchedData = await response.json()
      const updatedData = fetchedData.videos.map(eachVideo => ({
        id: eachVideo.id,
        title: eachVideo.title,
        thumbnailUrl: eachVideo.thumbnail_url,
        viewCount: eachVideo.view_count,
      }))

      this.setState({
        gameList: updatedData,
        apiStatus: apiStatusConstants.success,
      })
    } else {
      this.setState({apiStatus: apiStatusConstants.failure})
    }
  }

  onRetry = () => {
    this.getGamingVideos()
  }

  renderLoaderView = () => (
    <div className="loader-container" data-testid="loader">
      <Loader type="ThreeDots" color="#ffffff" height="50" width="50" />
    </div>
  )

  renderFailureView = isDark => {
    const failureUrl = isDark
      ? 'https://assets.ccbp.in/frontend/react-js/nxt-watch-failure-view-dark-theme-img.png'
      : 'https://assets.ccbp.in/frontend/react-js/nxt-watch-failure-view-light-theme-img.png'
    return (
      <div>
        <img src={failureUrl} alt="failure view" />
        <h1 className={isDark ? 'dark-text' : 'light-text'}>
          {' '}
          Oops! Something Went Wrong{' '}
        </h1>
        <p className={isDark ? 'dark-text' : 'light-text'}>
          {' '}
          We are having some trouble to complete your request. Please try again.{' '}
        </p>
        <button type="button" onClick={this.onRetry}>
          Retry
        </button>
      </div>
    )
  }

  renderSuccessView = isDark => {
    const {gameList} = this.state

    return (
      <ul>
        {gameList.map(eachVideo => (
          <VideoCard
            key={eachVideo.id}
            videoDetails={eachVideo}
            isDark={isDark}
          />
        ))}
      </ul>
    )
  }

  renderResult = isDark => {
    const {apiStatus} = this.state

    switch (apiStatus) {
      case apiStatusConstants.in_progress:
        return this.renderLoaderView()
      case apiStatusConstants.success:
        return this.renderSuccessView(isDark)
      case apiStatusConstants.failure:
        return this.renderFailureView(isDark)
      default:
        return null
    }
  }

  render() {
    return (
      <>
        <NxtContext.Consumer>
          {value => {
            const {isDark} = value

            return (
              <div>
                <ul>
                  <Header />
                </ul>
                <StyledContainer data-testid="gaming" isDark={isDark} >
                  <Sidebar />
                  <div className="video-container">
                    <div className="lower-container">
                      <div className="heading-container">
                        <h1 className={isDark ? 'dark-text' : 'light-text'}>
                          {' '}
                          Gaming{' '}
                        </h1>
                      </div>
                      {this.renderResult(isDark)}
                    </div>
                  </div>
                </StyledContainer>
              </div>
            )
          }}
        </NxtContext.Consumer>
      </>
    )
  }
}

export default Gaming
