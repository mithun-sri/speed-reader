/* generated using openapi-typescript-codegen -- do no edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { Body_authenticate_user_auth_token_post } from '../models/Body_authenticate_user_auth_token_post';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class AuthService {
    /**
     * Authenticate User
     * @param formData
     * @returns any Successful Response
     * @throws ApiError
     */
    public static authenticateUserAuthTokenPost(
        formData: Body_authenticate_user_auth_token_post,
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/auth/token',
            formData: formData,
            mediaType: 'application/x-www-form-urlencoded',
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Refresh Access Token
     * @param refreshToken
     * @returns any Successful Response
     * @throws ApiError
     */
    public static refreshAccessTokenAuthRefreshPost(
        refreshToken: any,
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/auth/refresh',
            headers: {
                'refresh-token': refreshToken,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }
}
