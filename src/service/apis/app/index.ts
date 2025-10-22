import { createApis, withConfigType } from './createApis'
import alovaInstance from '@/api/core/instance'

// Export the alova instance for direct use if needed
export { alovaInstance }

export const $$userConfigMap = withConfigType({})

const Webapi_App = createApis(alovaInstance, $$userConfigMap)

export default Webapi_App
export { Webapi_App }
