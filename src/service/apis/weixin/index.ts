import { createApis, withConfigType } from './createApis'
import alovaInstance from '@/api/core/instance'

const Webapi_Weixin = createApis(alovaInstance, withConfigType({}))

export default Webapi_Weixin
export { Webapi_Weixin }
