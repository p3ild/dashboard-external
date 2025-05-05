export { Layout }

import React from 'react'
import PropTypes from 'prop-types'
import { childrenPropType } from './PropTypeValues'
 import { PageContextProvider } from './usePageContext'
import { Link } from './Link'
import './css/index.css'
import './Layout.css'
import usePrepareApp from '../core/hooks/usePrepareApp'


Layout.propTypes = {
  pageContext: PropTypes.any,
  children: childrenPropType
}
function Layout({ pageContext, children }) {
  usePrepareApp();

  return (
    <React.StrictMode>
      <PageContextProvider pageContext={pageContext}>
        <Frame>
          <Content>{children}</Content>
        </Frame>
      </PageContextProvider>
    </React.StrictMode>
  )
}

Frame.propTypes = {
  children: childrenPropType
}
function Frame({ children }) {
  return (
    <div
      className='w-full h-full'
    >
      {children}
    </div>
  )
}


Content.propTypes = {
  children: childrenPropType
}
function Content({ children }) {
  return (
    <div
      id="page-container"
    >
      <div
        id="page-content"
      >
        {children}
      </div>
    </div>
  )
}
