import Header from '../Header'
import Sidebar from '../Sidebar'
import VideoCard from '../VideoCard'
import NxtContext from '../../context/NxtContext'

import {StyledContainer} from './styledComponents'

import './index.css'

const SavedVideos = () => (
  <NxtContext.Consumer>
    {value => {
      const {isDark, savedVideoList} = value

      const noSavedVideoView = () => (
        <div>
          <img
            src="https://assets.ccbp.in/frontend/react-js/nxt-watch-no-saved-videos-img.png"
            alt="no saved videos"
          />
          <h1 className={isDark ? 'dark-text' : 'light-text'}>
            {' '}
            No saved videos found{' '}
          </h1>
          <p className={isDark ? 'dark-text' : 'light-text'}>
            {' '}
            You can save your videos while watching them{' '}
          </p>
        </div>
      )

      const videoListView = () => (
        <div>
          <div>
            <h1 className={isDark ? 'dark-text' : 'light-text'}>
              {' '}
              Saved Videos{' '}
            </h1>
          </div>
          <div>
            <ul>
              {savedVideoList.map(eachVideo => (
                <VideoCard key={eachVideo.id} videoDetails={eachVideo} />
              ))}
            </ul>
          </div>
        </div>
      )

      const renderResult = () => {
        if (savedVideoList.length < 1) {
          return noSavedVideoView()
        }
        return videoListView()
      }

      return (
        <>
          <ul>
            <Header />
          </ul>
          <StyledContainer data-testid="savedVideos" isDark={isDark}>
            <Sidebar />
            {renderResult()}
          </StyledContainer>
        </>
      )
    }}
  </NxtContext.Consumer>
)

export default SavedVideos
