import { createApis, withConfigType } from './createApis'
import alovaInstance from '@/api/core/instance'

const Webapi_App = createApis(alovaInstance, withConfigType({}))

export default Webapi_App
export { Webapi_App }
