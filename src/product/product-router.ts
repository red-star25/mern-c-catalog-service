import express from "express";
import { ProductController } from "./product-controller";
import authenticate from "../common/middlewares/authenticate";
import { canAccess } from "../common/middlewares/canAccess";
import { asyncWrapper } from "../common/utils/wrapper";
import { Roles } from "../common/constants";
import createProductValidator from "./create-product-validator";
import { ProductService } from "./product-service";
import fileUpload from "express-fileupload";

const router = express.Router();

const productService = new ProductService();
const productController = new ProductController(productService);

router.post(
    "/",
    authenticate,
    canAccess([Roles.ADMIN, Roles.MANAGER]),
    fileUpload(),
    createProductValidator,
    asyncWrapper(productController.create),
);

export default router;
