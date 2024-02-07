/* generated using openapi-typescript-codegen -- do no edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { Body_get_user_available_texts_user__user_id__available_texts_get } from '../models/Body_get_user_available_texts_user__user_id__available_texts_get';
import type { UserAvailableTexts } from '../models/UserAvailableTexts';
import type { UserStatistics } from '../models/UserStatistics';
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
     * Get User Statistics
     * Gets the statistics based on the user's game history.
     * @param userId
     * @returns UserStatistics Successful Response
     * @throws ApiError
     */
    public static getUserStatisticsUserUserIdStatisticsGet(
        userId: string,
    ): CancelablePromise<UserStatistics> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/user/{user_id}/statistics',
            path: {
                'user_id': userId,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Get User Available Texts
     * Gets the texts not read by the user.
     * Returns the texts paginated and sorted/filtered by the given parameters.
     * @param userId
     * @param page
     * @param pageSize
     * @param requestBody
     * @returns UserAvailableTexts Successful Response
     * @throws ApiError
     */
    public static getUserAvailableTextsUserUserIdAvailableTextsGet(
        userId: string,
        page: number = 1,
        pageSize: number = 10,
        requestBody?: Body_get_user_available_texts_user__user_id__available_texts_get,
    ): CancelablePromise<UserAvailableTexts> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/user/{user_id}/available_texts',
            path: {
                'user_id': userId,
            },
            query: {
                'page': page,
                'page_size': pageSize,
            },
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                422: `Validation Error`,
            },
        });
    }
}
