import { createApis, withConfigType } from './createApis'
import alovaInstance from '@/api/core/instance'

const Webapi_Base = createApis(alovaInstance, withConfigType({}))

export default Webapi_Base
export { Webapi_Base }
