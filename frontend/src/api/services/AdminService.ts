/* generated using openapi-typescript-codegen -- do no edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class AdminService {
    /**
     * Create Quiz
     * @returns any Successful Response
     * @throws ApiError
     */
    public static createQuizAdminQuizPost(): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/admin/quiz',
        });
    }
    /**
     * Get Admin Dashboard
     * @returns any Successful Response
     * @throws ApiError
     */
    public static getAdminDashboardAdminDashboardGet(): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/admin/dashboard',
        });
    }
}
