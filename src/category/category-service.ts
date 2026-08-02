import createHttpError from "http-errors";
import CategoryModel from "./category-model";
import { Category } from "./category-types";

export class CategoryService {
    async create(category: Category) {
        const newCategory = new CategoryModel(category);
        return newCategory.save();
    }

    async getAll() {
        const categories = await CategoryModel.find();
        return categories;
    }

    async getById(id: string) {
        const category = await CategoryModel.findById(id);
        if (!category) {
            throw createHttpError(404, "Category not found");
        } else {
            return category;
        }
    }

    async update(
        id: string,
        category: Partial<Category>,
    ): Promise<({ _id: string } & Category) | null> {
        return await CategoryModel.findByIdAndUpdate(
            id,
            { $set: category },
            { new: true },
        );
    }

    async delete(id: string) {
        const category = await CategoryModel.findByIdAndDelete(id);
        if (!category) {
            throw createHttpError(404, "Category not found");
        } else {
            return category;
        }
    }
}
