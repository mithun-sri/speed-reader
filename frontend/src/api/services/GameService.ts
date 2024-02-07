/* generated using openapi-typescript-codegen -- do no edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { Question } from '../models/Question';
import type { QuestionAnswer } from '../models/QuestionAnswer';
import type { QuestionResult } from '../models/QuestionResult';
import type { Text } from '../models/Text';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class GameService {
    /**
     * Get Next Text
     * Gets the next text that the user has not attempted before.
     * NOTE:
     * The current implementation returns a random text,
     * regardless of which texts the user has seen.
     * @returns Text Successful Response
     * @throws ApiError
     */
    public static getNextTextGameTextsNextGet(): CancelablePromise<Text> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/game/texts/next',
        });
    }
    /**
     * Get Text
     * Gets a text by the given id.
     * @param textId
     * @returns Text Successful Response
     * @throws ApiError
     */
    public static getTextGameTextsTextIdGet(
        textId: string,
    ): CancelablePromise<Text> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/game/texts/{text_id}',
            path: {
                'text_id': textId,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Get Next Questions
     * Gets next 3 questions that the user has not attempted before.
     * NOTE:
     * The current implementation returns 3 random questions for the given text,
     * regardless of which questions the user has seen.
     * @param textId
     * @returns Question Successful Response
     * @throws ApiError
     */
    public static getNextQuestionsGameTextsTextIdQuestionsNextGet(
        textId: string,
    ): CancelablePromise<Array<Question>> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/game/texts/{text_id}/questions/next',
            path: {
                'text_id': textId,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Submit Answers
     * Accepts question answers and returns the results.
     * @param textId
     * @param requestBody
     * @returns QuestionResult Successful Response
     * @throws ApiError
     */
    public static submitAnswersGameTextsTextIdAnswersPost(
        textId: string,
        requestBody: Array<QuestionAnswer>,
    ): CancelablePromise<Array<QuestionResult>> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/game/texts/{text_id}/answers',
            path: {
                'text_id': textId,
            },
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                422: `Validation Error`,
            },
        });
    }
}
