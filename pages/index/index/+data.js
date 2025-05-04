// https://vike.dev/data
export { data }

import axios from 'axios'
// The node-fetch package (which only works on the server-side) can be used since
// this file always runs on the server-side, see https://vike.dev/data#server-side
import fetch from 'node-fetch'
import { CacheUtils } from '../../../core/network/CacheUtils'
// import { networkUtils } from '../../../core/network/index.server'

// import NodeCache from 'node-cache';
// const myCache = new NodeCache({ stdTTL: 60 });

const data = async (pageContext) => {
  const meData = CacheUtils.get('me');
  let { orgViewData } = meData || {}


  return {
    orgViewData
  }
}


function sleep(milliseconds) {
  return new Promise((r) => setTimeout(r, milliseconds))
}
