import { NextFunction, Request, RequestHandler, Response } from "express";

export const asyncWrapper = (
    requestHandler: RequestHandler,
): RequestHandler => {
    return (req: Request, res: Response, next: NextFunction): void => {
        Promise.resolve(requestHandler(req, res, next)).catch(next);
    };
};
