import React from 'react'
import { getauthUser } from '../utils/apiPaths'
import { useQuery } from '@tanstack/react-query'
const useAuthUser = () => {
    const authUser = useQuery({
        //queryKey must be unique for a route ,does all of  caching,refetching,validation
      queryKey: ["authUser"]
      ,
      queryFn : getauthUser,
      retry :false // not multiple  auth checks
    })
  return {isLoading :authUser.isLoading , authUser: authUser.data?.user  }
}

export default useAuthUser