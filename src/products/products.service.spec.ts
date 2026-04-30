import { Test, TestingModule } from '@nestjs/testing';
import { ProductsService } from './products.service';
import { CreateProductDto } from './dto/create-product.dto';
import { NotFoundException } from '@nestjs/common';

describe('ProductsService', () => {
  let service: ProductsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ProductsService],
    }).compile();

    service = module.get<ProductsService>(ProductsService);
  });

  it('should create a new product', () => {
    const createProductDto: CreateProductDto = {
      name: 'Coffee',
      description: 'Dark Roast',
      price: 9.99,
      stock: 100,
      category: 'Beverages',
    };
    const product = service.create(createProductDto);
    expect(product).toBeDefined();
    expect(product.id).toBeDefined();
    expect(product).toMatchObject(createProductDto);
    expect(product.createdAt.getTime()).toBeLessThanOrEqual(Date.now());
    expect(product.updatedAt).toEqual(product.createdAt);
    expect(service.findById(product.id)).toEqual(product);
  });

  it('should return all products', () => {
    const dto1: CreateProductDto = {
      name: 'Coffee',
      description: 'Dark Roast',
      price: 9.99,
      stock: 100,
      category: 'Beverages',
    };
    const dto2: CreateProductDto = {
      name: 'Tea',
      description: 'Green Tea',
      price: 4.99,
      stock: 50,
      category: 'Beverages',
    };
    const product1 = service.create(dto1);
    const product2 = service.create(dto2);
    const products = service.findAll();
    expect(products).toContainEqual(product1);
    expect(products).toContainEqual(product2);
    expect(products).toHaveLength(2);
  });

  it('should return an empty array when there are no products', () => {
    const products = service.findAll();
    expect(products).toEqual([]);
  });

  it('should return the product when id exists', () => {
    const dto: CreateProductDto = {
      name: 'Coffee',
      description: 'Dark Roast',
      price: 9.99,
      stock: 100,
      category: 'Beverages',
    };
    const product = service.create(dto);
    const found = service.findById(product.id);
    expect(found).toEqual(product);
  });

  it('should throw NotFoundException when id does not exist', () => {
    expect(() => service.findById('invalid-id')).toThrow(
      new NotFoundException('Product with id invalid-id not found'),
    );
  });
});
