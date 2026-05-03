import { Injectable, NotFoundException } from '@nestjs/common';
import { Product } from './interfaces/product.interface';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { randomUUID } from 'node:crypto';

@Injectable()
export class ProductsService {
  private readonly products = new Map<string, Product>();

  findAll(): Product[] {
    return Array.from(this.products.values());
  }

  findById(id: string): Product {
    const product = this.products.get(id);
    if (!product) {
      throw new NotFoundException(`Product with id ${id} not found`);
    }
    return product;
  }

  create(dto: CreateProductDto): Product {
    const id = randomUUID();
    const now = new Date();
    const product: Product = { id, ...dto, createdAt: now, updatedAt: now };
    this.products.set(id, product);
    return product;
  }

  update(id: string, dto: UpdateProductDto): Product {
    const product = this.findById(id);
    const updatedProduct = { ...product, ...dto, updatedAt: new Date() };
    this.products.set(id, updatedProduct);
    return updatedProduct;
  }

  remove(id: string): void {
    this.findById(id);
    this.products.delete(id);
  }
}
