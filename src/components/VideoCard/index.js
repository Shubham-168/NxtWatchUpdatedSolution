import {Link} from 'react-router-dom'

import './index.css'

const VideoCard = props => {
  const {videoDetails, isDark} = props
  const {
    id,
    title,
    thumbnailUrl,
    channelName,
    channelProfileUrl,
    viewCount,
    publishedAt,
  } = videoDetails

  return (
    <li>
      <Link to={`/videos/${id}`}>
        <div className="video-card">
          <img src={thumbnailUrl} alt="video thumbnail" />
          <div className="profile-container">
            <img src={channelProfileUrl} alt="channel logo" />
            <p className={isDark ? 'dark-text' : 'light-text'}> {title} </p>
          </div>
          <p> {channelName} </p>
          <p>
            {' '}
            {viewCount} views .{publishedAt}{' '}
          </p>
        </div>
      </Link>
    </li>
  )
}

export default VideoCard
