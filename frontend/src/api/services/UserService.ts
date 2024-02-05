/* generated using openapi-typescript-codegen -- do no edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class UserService {
    /**
     * Get User Summary
     * @returns any Successful Response
     * @throws ApiError
     */
    public static getUserSummaryUserSummaryGet(): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/user/summary',
        });
    }
    /**
     * Get Available Texts
     * @param userId
     * @param page
     * @param pageSize
     * @param difficulty
     * @param gameMode
     * @param sort
     * @returns any Successful Response
     * @throws ApiError
     */
    public static getAvailableTextsUserAvailableTextsGet(
        userId: string,
        page: number = 1,
        pageSize: number = 10,
        difficulty?: (string | null),
        gameMode?: (number | null),
        sort?: (string | null),
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/user/available_texts',
            query: {
                'user_id': userId,
                'page': page,
                'page_size': pageSize,
                'difficulty': difficulty,
                'game_mode': gameMode,
                'sort': sort,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }
}
