import { NextFunction, Response } from "express";
import { Request } from "express-jwt";
import createHttpError from "http-errors";
import { ProductService } from "./product-service";
import { CreateProductBody, Product } from "./product-types";
import { FileStorage } from "../common/types/storage";
import { v4 as uuidv4 } from "uuid";
import { UploadedFile } from "express-fileupload";
import { validationResult } from "express-validator";
import { Roles } from "../common/constants";
import { AuthRequest } from "../common/types";

export class ProductController {
    constructor(
        private productService: ProductService,
        private storage: FileStorage,
    ) {}

    private assertTenantAccess(auth: AuthRequest["auth"], tenantId: string) {
        if (auth.role === Roles.ADMIN) {
            return;
        }

        if (String(tenantId) !== String(auth.tenant)) {
            throw createHttpError(
                403,
                "You are not allowed to access this product",
            );
        }
    }

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
        } = req.body as CreateProductBody;

        try {
            this.assertTenantAccess((req as AuthRequest).auth, tenantId);
        } catch (error) {
            return next(error);
        }

        const uploadedImage = req.files!.image as UploadedFile;
        const imageName = uuidv4();
        await this.storage.upload({
            filename: imageName,
            fileData: new Uint8Array(uploadedImage.data).buffer,
        });

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

    update = async (req: Request, res: Response, next: NextFunction) => {
        const result = validationResult(req);
        if (!result.isEmpty()) {
            return next(createHttpError(400, result.array()[0].msg as string));
        }

        const productId = req.params.id;

        const product = await this.productService.getProduct(productId);
        if (!product) {
            return next(createHttpError(404, "Product not found"));
        }

        const {
            name,
            description,
            priceConfiguration,
            attributes,
            tenantId,
            categoryId,
        } = req.body as CreateProductBody;

        const auth = (req as AuthRequest).auth;
        try {
            this.assertTenantAccess(auth, product.tenantId);
            this.assertTenantAccess(auth, tenantId);
        } catch (error) {
            return next(error);
        }

        let imageName: string | undefined;
        let oldImage: string | undefined;

        if (req.files?.image) {
            oldImage = product.image;

            const image = req.files.image as UploadedFile;
            imageName = uuidv4();

            await this.storage.upload({
                filename: imageName,
                fileData: new Uint8Array(image.data).buffer,
            });

            await this.storage.delete(oldImage);
        }

        const productToUpdate: Product = {
            name,
            description,
            priceConfiguration: JSON.parse(
                priceConfiguration,
            ) as Product["priceConfiguration"],
            attributes: JSON.parse(attributes) as Product["attributes"],
            tenantId,
            categoryId,
            image: imageName ?? oldImage!,
        };

        await this.productService.updateProduct(productId, productToUpdate);

        res.status(200).json({ id: productId });
    };
}
