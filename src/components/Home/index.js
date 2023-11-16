import {Component} from 'react'
import Cookies from 'js-cookie'
import Loader from 'react-loader-spinner'

import Header from '../Header'
import Sidebar from '../Sidebar'
import VideoCard from '../VideoCard'
import NxtContext from '../../context/NxtContext'

import {BannerContainer} from './styledComponents'

import './index.css'

const apiStatusConstants = {
  initial: 'INITIAL',
  success: 'SUCCESS',
  failure: 'FAILURE',
  in_progress: 'IN_PROGRESS',
  no_result: 'NO_RESULT',
}

class Home extends Component {
  state = {
    homeDataList: [],
    searchInput: '',
    apiStatus: apiStatusConstants.initial,
    showBanner: true,
  }

  componentDidMount() {
    this.getHomeVideos()
  }

  getHomeVideos = async () => {
    this.setState({apiStatus: apiStatusConstants.in_progress})
    const {searchInput} = this.state
    const jwtToken = Cookies.get('jwt_token')
    const apiUrl = `https://apis.ccbp.in/videos/all?search=${searchInput}`
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
        channelName: eachVideo.channel.name,
        channelProfileUrl: eachVideo.channel.profile_image_url,
        viewCount: eachVideo.view_count,
        publishedAt: eachVideo.published_at,
      }))

      if (updatedData.length < 1) {
        this.setState({apiStatus: apiStatusConstants.no_result})
      }

      this.setState({
        homeDataList: updatedData,
        apiStatus: apiStatusConstants.success,
      })
    } else {
      this.setState({apiStatus: apiStatusConstants.failure})
    }
  }

  closeBanner = () => {
    this.setState({
      showBanner: false,
    })
  }

  onRetry = () => {
    this.getHomeVideos()
  }

  onChangeSearchInput = event => {
    this.setState({searchInput: event.target.value})
  }

  onClickedSearch = () => {
    this.getHomeVideos()
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
    const {homeDataList} = this.state

    return (
      <ul>
        {homeDataList.map(eachVideo => (
          <VideoCard
            key={eachVideo.id}
            videoDetails={eachVideo}
            isDark={isDark}
          />
        ))}
      </ul>
    )
  }

  renderNoResultView = isDark => (
    <div>
      <img
        src="https://assets.ccbp.in/frontend/react-js/nxt-watch-no-search-results-img.png"
        alt="no videos"
      />
      <h1 className={isDark ? 'dark-text' : 'light-text'}>
        {' '}
        No Search results found{' '}
      </h1>
      <p className={isDark ? 'dark-text' : 'light-text'}>
        {' '}
        Try different key words or remove search filter{' '}
      </p>
      <button type="button" onClick={this.onRetry}>
        Retry
      </button>
    </div>
  )

  renderResult = isDark => {
    const {apiStatus} = this.state

    switch (apiStatus) {
      case apiStatusConstants.in_progress:
        return this.renderLoaderView()
      case apiStatusConstants.success:
        return this.renderSuccessView(isDark)
      case apiStatusConstants.failure:
        return this.renderFailureView(isDark)
      case apiStatusConstants.no_result:
        return this.renderNoResultView(isDark)
      default:
        return null
    }
  }

  render() {
    const {showBanner, searchInput} = this.state
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
                <div
                  data-testid="home"
                  className={
                    isDark
                      ? 'home-dark-main-container'
                      : 'home-light-main-container'
                  }
                >
                  <Sidebar />
                  <div className="video-container">
                    <div>
                      {showBanner ? (
                        <BannerContainer data-testid="banner">
                          <div>
                            <img
                              src="https://assets.ccbp.in/frontend/react-js/nxt-watch-logo-light-theme-img.png"
                              alt="nxt watch logo"
                            />
                            <p> Buy Nxt Watch Premium </p>
                            <button> GET IT NOW </button>
                          </div>
                          <button
                            data-testid="close"
                            type="button"
                            onClick={this.closeBanner}
                          >
                            Close
                          </button>
                        </BannerContainer>
                      ) : null}
                    </div>

                    <div className="lower-container">
                      <div className="search-container">
                        <input
                          type="search"
                          id="searchId"
                          value={searchInput}
                          placeholder="Search"
                          onChange={this.onChangeSearchInput}
                        />
                        <label htmlFor="searchId">
                          <button
                            data-testid="searchButton"
                            type="button"
                            onClick={this.onClickedSearch}
                          >
                            Search
                          </button>
                        </label>
                      </div>
                      {this.renderResult(isDark)}
                    </div>
                  </div>
                </div>
              </div>
            )
          }}
        </NxtContext.Consumer>
      </>
    )
  }
}

export default Home
