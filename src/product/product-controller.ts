import { NextFunction, Response } from "express";
import { Request } from "express-jwt";
import { validationResult } from "express-validator";
import createHttpError from "http-errors";
import { ProductService } from "./product-service";
import { CreateProductBody, Product } from "./product-types";

export class ProductController {
    constructor(private productService: ProductService) {}

    create = async (req: Request, res: Response, next: NextFunction) => {
        const result = validationResult(req);
        if (!result.isEmpty()) {
            return next(createHttpError(400, result.array()[0].msg as string));
        }

        const {
            name,
            description,
            priceConfiguration,
            attributes,
            tenantId,
            categoryId,
            image,
        } = req.body as CreateProductBody;

        const product = {
            name,
            description,
            priceConfiguration: JSON.parse(
                priceConfiguration,
            ) as Product["priceConfiguration"],
            attributes: JSON.parse(attributes) as Product["attributes"],
            tenantId,
            categoryId,
            image,
        } as Product;

        const newProduct = await this.productService.createProduct(product);

        res.status(201).json({ id: newProduct._id });
    };
}
