import { NextFunction, Response } from "express";
import { Request } from "express-jwt";
import { validationResult } from "express-validator";
import createHttpError from "http-errors";
import { ProductService } from "./product-service";
import { CreateProductBody, Product } from "./product-types";
import { FileStorage } from "../common/types/storage";
import { v4 as uuidv4 } from "uuid";
import { UploadedFile } from "express-fileupload";

export class ProductController {
    constructor(
        private productService: ProductService,
        private storage: FileStorage,
    ) {}

    create = async (req: Request, res: Response, next: NextFunction) => {
        const result = validationResult(req);
        if (!result.isEmpty()) {
            return next(createHttpError(400, result.array()[0].msg as string));
        }

        const uploadedImage = req.files!.image as UploadedFile;
        const imageName = uuidv4();
        await this.storage.upload({
            filename: imageName,
            fileData: new Uint8Array(uploadedImage.data).buffer,
        });

        const {
            name,
            description,
            priceConfiguration,
            attributes,
            tenantId,
            categoryId,
        } = req.body as CreateProductBody;

        const product: Product = {
            name,
            description,
            priceConfiguration: JSON.parse(
                priceConfiguration,
            ) as Product["priceConfiguration"],
            attributes: JSON.parse(attributes) as Product["attributes"],
            tenantId,
            categoryId,
            image: imageName,
        };

        const newProduct = await this.productService.createProduct(product);

        res.status(201).json({ id: newProduct._id });
    };
}
