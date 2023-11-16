import {Component} from 'react'
import Cookies from 'js-cookie'
import Loader from 'react-loader-spinner'
import ReactPlayer from 'react-player'
import Header from '../Header'
import Sidebar from '../Sidebar'
import NxtContext from '../../context/NxtContext'

import {StyledContainer} from './styledComponents'

import './index.css'

const apiStatusConstants = {
  initial: 'INITIAL',
  success: 'SUCCESS',
  failure: 'FAILURE',
  in_progress: 'IN_PROGRESS',
}

class VideoItemDetails extends Component {
  state = {
    videoDetailObject: {},
    isLike: false,
    isDisLike: false,
    isSaved: false,
    apiStatus: apiStatusConstants.initial,
  }

  componentDidMount() {
    this.getVideoDetails()
  }

  getVideoDetails = async () => {
    const {match} = this.props
    const {params} = match
    const {id} = params
    this.setState({apiStatus: apiStatusConstants.in_progress})
    const jwtToken = Cookies.get('jwt_token')
    const apiUrl = `https://apis.ccbp.in/videos/${id}`
    const options = {
      headers: {
        Authorization: `Bearer ${jwtToken}`,
      },
      method: 'GET',
    }
    const response = await fetch(apiUrl, options)
    if (response.ok === true) {
      const fetchedData = await response.json()
      const updatedData = {
        id: fetchedData.video_details.id,
        title: fetchedData.video_details.title,
        videoUrl: fetchedData.video_details.video_url,
        thumbnailUrl: fetchedData.video_details.thumbnail_url,
        channelName: fetchedData.video_details.channel.name,
        channelProfileUrl: fetchedData.video_details.channel.profile_image_url,
        channelSubscriber: fetchedData.video_details.subscriber_count,
        viewCount: fetchedData.video_details.view_count,
        publishedAt: fetchedData.video_details.published_at,
        description: fetchedData.video_details.description,
      }

      this.setState({
        videoDetailObject: updatedData,
        apiStatus: apiStatusConstants.success,
      })
    } else {
      this.setState({apiStatus: apiStatusConstants.failure})
    }
  }

  onClickedLike = () => {
    this.setState({isLike: true, isDisLike: false})
  }

  onClickedDislike = () => {
    this.setState({isDisLike: true, isLike: false})
  }

  onClickedSave = (id, onSavingVideo, onUnSavingVideo) => {
    this.setState({isSaved: true})
    const {isSaved, videoDetailObject} = this.state
    if (isSaved === true) {
      onSavingVideo(videoDetailObject)
    } else {
      onUnSavingVideo(id)
    }
  }

  onRetry = () => {
    this.getVideoDetails()
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

  renderSuccessView = (isDark, onSavingVideo, onUnSavingVideo) => {
    const {videoDetailObject, isSaved, isLike, isDisLike} = this.state
    const {
      id,
      title,
      videoUrl,
      channelName,
      channelProfileUrl,
      channelSubscriber,
      viewCount,
      publishedAt,
      description,
    } = videoDetailObject

    const savedText = isSaved ? 'Saved' : 'Save'

    return (
      <div className="main-container">
        <ReactPlayer url={videoUrl} />
        <h1 className={isDark ? 'dark-text' : 'light-text'}> {title} </h1>
        <div>
          <p className={isDark ? 'dark-text' : 'light-text'}>
            {' '}
            {viewCount} views .{publishedAt}{' '}
          </p>
          <div className="like-or-dislike-container">
            <button
              type="button"
              className={isLike ? 'active-button' : 'inactive-button'}
              onClick={this.onClickedLike}
            >
              Like
            </button>
            <button
              type="button"
              className={isDisLike ? 'active-button' : 'inactive-button'}
              onClick={this.onClickedDislike}
            >
              Dislike
            </button>
            <button
              type="button"
              onClick={this.onClickedSave(id, onSavingVideo, onUnSavingVideo)}
            >
              {savedText}
            </button>
          </div>
        </div>
        <hr />
        <div className="channel-container">
          <img src={channelProfileUrl} alt="channel logo" />
          <div className="channel-detail-container">
            <p className={isDark ? 'dark-text' : 'light-text'}>
              {' '}
              {channelName}{' '}
            </p>
            <p className={isDark ? 'dark-text' : 'light-text'}>
              {' '}
              {channelSubscriber} subscribers{' '}
            </p>
            <p className={isDark ? 'dark-text' : 'light-text'}>
              {' '}
              {description}{' '}
            </p>
          </div>
        </div>
      </div>
    )
  }

  renderResult = (isDark, onSavingVideo, onUnSavingVideo) => {
    const {apiStatus} = this.state

    switch (apiStatus) {
      case apiStatusConstants.in_progress:
        return this.renderLoaderView()
      case apiStatusConstants.success:
        return this.renderSuccessView(isDark, onSavingVideo, onUnSavingVideo)
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
            const {isDark, onSavingVideo, onUnSavingVideo} = value

            return (
              <div>
                <ul>
                  <Header />
                </ul>
                <StyledContainer data-testid="videoItemDetails" isDark={isDark}>
                  <Sidebar />
                  <div className="video-container">
                    <div className="lower-container">
                      {this.renderResult(
                        isDark,
                        onSavingVideo,
                        onUnSavingVideo,
                      )}
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

export default VideoItemDetails
