import productModel from "./product-model";
import { Filter, Product } from "./product-types";

export class ProductService {
    async createProduct(product: Product) {
        return await productModel.create(product);
    }

    async getProduct(productId: string) {
        return await productModel.findById(productId);
    }

    async getProducts(q: string, filters: Filter) {
        const searchQueryRegex = new RegExp(q, "i");

        const matchQuery = {
            ...filters,
            name: searchQueryRegex,
        };

        const aggregate = productModel.aggregate([
            {
                $match: matchQuery,
            },
            {
                $lookup: {
                    from: "categories",
                    localField: "categoryId",
                    foreignField: "_id",
                    as: "category",
                    pipeline: [
                        {
                            $project: {
                                _id: 1,
                                name: 1,
                                attributes: 1,
                                priceConfiguration: 1,
                            },
                        },
                    ],
                },
            },
            {
                $unwind: "$category",
            },
        ]);

        const result = await aggregate.exec();

        return result as Product[];
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
