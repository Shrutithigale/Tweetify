import { graphQLClient } from "@/Clients/api"
import { getCurrentUserQuery } from "@/graphql/Queries/user"
import { useQuery } from "@tanstack/react-query"

export const useCurrentUser = () => {
    const query = useQuery({
        queryKey: ["current-user"],
        queryFn: () => graphQLClient.request(getCurrentUserQuery)
    })

    return{...query, user: query.data?.getCurrentUser}
}