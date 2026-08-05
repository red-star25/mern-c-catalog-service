import productModel from "./product-model";
import { Product } from "./product-types";

export class ProductService {
    async createProduct(product: Product) {
        return await productModel.create(product);
    }

    async getProduct(productId: string) {
        return await productModel.findById(productId);
    }

    async updateProduct(productId: string, product: Product) {
        return await productModel.findOneAndUpdate(
            { _id: productId },
            { $set: product },
            {
                new: true,
            },
        );
    }
}
