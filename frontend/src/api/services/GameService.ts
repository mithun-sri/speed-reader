/* generated using openapi-typescript-codegen -- do no edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { QuizAnswers } from '../models/QuizAnswers';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class GameService {
    /**
     * Get Texts
     * @returns any Successful Response
     * @throws ApiError
     */
    public static getTextsGameTextsGet(): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/game/texts',
        });
    }
    /**
     * Get Text
     * @param id
     * @returns any Successful Response
     * @throws ApiError
     */
    public static getTextGameTextsIdGet(
        id: number,
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/game/texts/{id}',
            path: {
                'id': id,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Get Question
     * @param id
     * @returns any Successful Response
     * @throws ApiError
     */
    public static getQuestionGameTextsQuestionsIdGet(
        id: number,
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/game/texts/questions/{id}',
            path: {
                'id': id,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Post Results
     * @param requestBody
     * @returns any Successful Response
     * @throws ApiError
     */
    public static postResultsGameResultsPost(
        requestBody: QuizAnswers,
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/game/results',
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                422: `Validation Error`,
            },
        });
    }
}
