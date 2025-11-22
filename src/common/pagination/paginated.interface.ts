export interface Paginated<T>{

    data:(T | (Omit<T, "user"> & {user: Omit<T, 'password'>}))[],
    meta : {
        itemPerPage: number,
        totalItem: number,
        currentPage: number,
        totalPages: number
    },
    links: {
        first: string,
        last: string,
        current: string,
        next: string,
        previous: string
    }

}