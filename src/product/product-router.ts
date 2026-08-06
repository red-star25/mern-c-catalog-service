import express from "express";
import { ProductController } from "./product-controller";
import authenticate from "../common/middlewares/authenticate";
import { canAccess } from "../common/middlewares/canAccess";
import { asyncWrapper } from "../common/utils/wrapper";
import { Roles } from "../common/constants";
import createProductValidator from "./create-product-validator";
import { ProductService } from "./product-service";
import fileUpload from "express-fileupload";
import { S3Storage } from "../common/services/S3Storage";
import createHttpError from "http-errors";
import updateProductValidator from "./update-product-validator";

const router = express.Router();

const productService = new ProductService();
const fileStorage = new S3Storage();
const productController = new ProductController(productService, fileStorage);

router.post(
    "/",
    authenticate,
    canAccess([Roles.ADMIN, Roles.MANAGER]),
    fileUpload({
        limits: { fileSize: 500 * 1024 },
        abortOnLimit: true,
        limitHandler: (req, res, next) => {
            const error = createHttpError(400, "File size exceeded the limit");
            next(error);
        },
    }),
    createProductValidator,
    asyncWrapper(productController.create),
);

router.put(
    "/:id",
    authenticate,
    canAccess([Roles.ADMIN, Roles.MANAGER]),
    fileUpload({
        limits: { fileSize: 500 * 1024 },
        abortOnLimit: true,
        limitHandler: (req, res, next) => {
            const error = createHttpError(400, "File size exceeded the limit");
            next(error);
        },
    }),
    updateProductValidator,
    asyncWrapper(productController.update),
);

router.get("/", asyncWrapper(productController.getProducts));

export default router;
