import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import { PaginationDto } from './dto/pagination-query.dto';
import { FindManyOptions, FindOptionsWhere, ObjectLiteral, Repository } from 'typeorm';
import { Request } from 'express';
import { REQUEST } from '@nestjs/core';
import { Paginated } from './paginated.interface';

@Injectable()
export class PaginationProvider {
    constructor(
        @Inject(REQUEST) private readonly request: Request
    ) { }
    public async paginateQuery<T extends ObjectLiteral>(
        paginationQueryDto: PaginationDto,
        repository: Repository<T>,
        where?: FindOptionsWhere<T>,
        relation?: string[]
    ):Promise<Paginated<T>> {
        try {
            const findOptions: FindManyOptions<T> = {
                skip: ((paginationQueryDto.page ?? 1) - 1) * (paginationQueryDto.limit ?? 10),
                take: paginationQueryDto.limit
            }
            // const relation: string[] = findOptions.where
            if (where) {
                findOptions.where = where;
            }
            if (relation) {
                findOptions.relations = relation;
            }

            let result = await repository.find(findOptions);
            let finalResult = result.map((item) => {
                if (item && item.user) {
                    const { user, ...rest } = item;
                    const { password, ...therest } = user;
                    return {
                        ...rest,
                        user: therest
                    };
                }
                return item
            });

            const totalItems = await repository.count();
            const totalPages = Math.ceil(totalItems / (paginationQueryDto.limit ?? 10));
            const currentPage = paginationQueryDto.page ?? 1;
            const nextPage = currentPage === totalPages ? currentPage : currentPage + 1;
            const prevPage = currentPage === 1 ? currentPage : currentPage - 1;
            const baseUrl = this.request.protocol + '://' + this.request.headers.host + '/';
            const newUrl = new URL(this.request.url, baseUrl);

            const response: Paginated<T> = {
                data: finalResult,
                meta: {
                    itemPerPage: paginationQueryDto.limit ?? 1,
                    totalItem: totalItems,
                    currentPage: currentPage,
                    totalPages: totalPages
                },
                links: {
                    first: `${newUrl.origin}${newUrl.pathname}?limit=${paginationQueryDto.limit}&page=1`,
                    last: `${newUrl.origin}${newUrl.pathname}?limit=${paginationQueryDto.limit}&page=${totalPages}`,
                    current: `${newUrl.origin}${newUrl.pathname}?limit=${paginationQueryDto.limit}&page=${paginationQueryDto.page}`,
                    next: `${newUrl.origin}${newUrl.pathname}?limit=${paginationQueryDto.limit}&page=${nextPage}`,
                    previous: `${newUrl.origin}${newUrl.pathname}?limit=${paginationQueryDto.limit}&page=${prevPage}`
                }
            }
            return response;
        }
        catch (error) {
            throw new BadRequestException('ERROR IN PAGINATION')
        }
    }
}
