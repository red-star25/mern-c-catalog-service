import mongoose from "mongoose";

export interface ProductPriceConfiguration {
    priceType: "base" | "additional";
    availableOptions: Record<string, number>;
}

export interface ProductAttribute {
    name: string;
    value: unknown;
}

export interface Product {
    name: string;
    description: string;
    priceConfiguration: Record<string, ProductPriceConfiguration>;
    attributes: ProductAttribute[];
    tenantId: string;
    categoryId: string;
    image: string;
}

export interface CreateProductBody {
    name: string;
    description: string;
    priceConfiguration: string;
    attributes: string;
    tenantId: string;
    categoryId: string;
    image: string;
}

export interface Filter {
    tenantId?: string;
    categoryId?: mongoose.Types.ObjectId;
    isPublish?: boolean;
}
