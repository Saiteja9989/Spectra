import React from 'react'
import ContentLoader from 'react-content-loader'

const InstaChatlist = props => {
  return (
    <ContentLoader
      viewBox="0 0 380 200"
      backgroundColor="#f3f3f3"
      foregroundColor="#ecebeb"
      {...props}
    >
      <circle cx="25" cy="25" r="25" />
      <rect x="60" y="7" rx="5" ry="5" width="230" height="12" />
      <rect x="60" y="28" rx="5" ry="5" width="150" height="11" />

      <circle cx="25" cy="100" r="25" />
      <rect x="60" y="82" rx="5" ry="5" width="230" height="12" />
      <rect x="60" y="103" rx="5" ry="5" width="150" height="11" />

      <circle cx="25" cy="175" r="25" />
      <rect x="60" y="157" rx="5" ry="5" width="230" height="12" />
      <rect x="60" y="178" rx="5" ry="5" width="150" height="11" />
    </ContentLoader>
  )
}

InstaChatlist.metadata = {
  name: 'Ritik Dixit',
  github: 'ritikdixit1',
  description: 'Instagram chat list',
  filename: 'InstaChatlist',
}

export default InstaChatlist;