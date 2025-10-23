import { createApis, withConfigType } from './createApis'
import alovaInstance from '@/api/core/instance'

const Webapi_Business = createApis(alovaInstance, withConfigType({}))

export default Webapi_Business
export { Webapi_Business }
